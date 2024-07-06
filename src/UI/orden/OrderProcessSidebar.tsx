import { ExtendedOrdenData } from "@utils/Examples/ExtendedOrdenData";
import { clienteRole, prestadorDeServiciosRole } from "@utils/roles/SiteRoles";
import { useSession } from "next-auth/react";
import SelectableOrderProcessItem from "./SelectableOrderProcessItem";
import { ProcesoDesarrollo, Servicio } from "@prisma/client";

type Props = {
  orderData: ExtendedOrdenData;
  selectedProcess: string;
  role: string;
  onSelect: (processID: string) => void;
  serviciosConProcesos: (Servicio & {
    procesos: ProcesoDesarrollo[];
  })[];
};

const OrderProcessSidebar = ({
  orderData,
  role,
  selectedProcess,
  onSelect,
  serviciosConProcesos,
}: Props) => {
  const { data } = useSession();

  function validarHabilitacionCambioEstado(idProceso: number): boolean {
    if (idProceso === 1) {
      return true;
    }

    const procesosPedidosYOrdenados = orderData?.procesos
      .filter((procesoDesarrollo) => procesoDesarrollo.idEstado !== 3)
      .sort(
        (procesoAnterior, procesoPosterior) =>
          procesoAnterior.idProceso - procesoPosterior.idProceso
      );
    const posicionEnProcesosPedidosYOrdenados =
      procesosPedidosYOrdenados.findIndex(
        (procesoDesarrollo) => procesoDesarrollo.idProceso === idProceso
      );

    return posicionEnProcesosPedidosYOrdenados !== -1
      ? procesosPedidosYOrdenados[posicionEnProcesosPedidosYOrdenados - 1]
          .idEstado === 6
      : true;
  }

  function obtenerServiciosDeProceso(idProceso: number) {
    return serviciosConProcesos.filter((servicioConProceso) =>
      servicioConProceso.procesos
        .map((proceso) => proceso.id)
        .includes(idProceso)
    );
  }

  return (
    <div className="flex flex-col mt-4">
      <div className="flex flex-col max-h-screen overflow-y-auto">
        <SelectableOrderProcessItem
          proceso={{
            idOrden: orderData?.id,
            estado: "N/A",
            id: "general",
            icon: "https://cdn-icons-png.flaticon.com/512/839/839599.png",
            lastUpdated: null,
            proceso: "General",
            idProceso: -1,
            precioActualizado: 0,
            ficha: {
              archivos: [],
              contenido: null,
              contenidoId: null,
              estimatedAt: null,
              id: null,
              procesoId: null,
              updatedAt: null,
            },
            recursos: [],
          }}
          role={role || "Cliente"}
          onSelect={onSelect}
          selected={selectedProcess === "general"}
          habilitarCambioEstado={true}
          servicios={serviciosConProcesos}
          prenda={orderData?.prenda}
        />
      </div>
      <div className="m-2 font-bold text-lg">Procesos de Diseño/Desarrollo</div>
      <div className="flex flex-col max-h-screen overflow-y-auto">
        {orderData?.procesos
          .filter((proceso) => {
            if (role === clienteRole) return proceso.estado !== "No Pedido";
            if (role === prestadorDeServiciosRole)
              return proceso.recursos.some((el) => el.key === data.user.email);
            return true;
          })
          .map((proceso, index) => (
            <SelectableOrderProcessItem
              key={proceso.id}
              proceso={{ ...proceso, idOrden: orderData?.id }}
              role={role || "Cliente"}
              onSelect={onSelect}
              selected={selectedProcess === proceso.id}
              habilitarCambioEstado={
                index > 0
                  ? validarHabilitacionCambioEstado(proceso.idProceso)
                  : true || false
              }
              servicios={obtenerServiciosDeProceso(proceso.idProceso)}
              prenda={orderData?.prenda}
            />
          ))}
      </div>
    </div>
  );
};

export default OrderProcessSidebar;

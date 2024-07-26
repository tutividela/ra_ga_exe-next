import { ExtendedOrdenData } from "@utils/Examples/ExtendedOrdenData";
import { clienteRole, prestadorDeServiciosRole } from "@utils/roles/SiteRoles";
import { useSession } from "next-auth/react";
import SelectableOrderProcessItem from "./SelectableOrderProcessItem";
import { useMemo } from "react";

type Props = {
  orderData: ExtendedOrdenData;
  selectedProcess: string;
  role: string;
  onSelect: (processID: string) => void;
};

const OrderProcessSidebar = ({
  orderData,
  role,
  selectedProcess,
  onSelect,
}: Props) => {
  const { data } = useSession();
  const precioTotal = useMemo(() => {
    const procesoAUtilizar =
      orderData?.idEstado === 3
        ? orderData.procesosProductivos
        : orderData.procesos;

    return procesoAUtilizar
      .filter((proceso) => proceso.idEstado === 6)
      .map((proceso) => proceso.precioActualizado)
      .reduce((acumulador, precio) => acumulador + precio, 0);
  }, [orderData]);

  const laOrdenEstaEnProduccion = useMemo(
    () => orderData.idEstado === 3,
    [orderData]
  );

  function validarHabilitacionCambioEstado(idProceso: number): boolean {
    if (idProceso === 1) {
      return true;
    }
    const procesosPedidosYOrdenados =
      orderData.idEstado === 3
        ? orderData.procesosProductivos
            .filter((procesoProductivo) => procesoProductivo.idEstado !== 3)
            .sort(
              (procesoAnterior, procesoPosterior) =>
                procesoAnterior.idProceso - procesoPosterior.idProceso
            )
        : orderData.procesos
            .filter((procesoDesarrollo) => procesoDesarrollo.idEstado !== 3)
            .sort(
              (procesoAnterior, procesoPosterior) =>
                procesoAnterior.idProceso - procesoPosterior.idProceso
            );

    const posicionEnProcesosPedidosYOrdenados =
      procesosPedidosYOrdenados.findIndex(
        (procesoDesarrollo) => procesoDesarrollo.idProceso === idProceso
      );

    if (posicionEnProcesosPedidosYOrdenados === 0) {
      return true;
    } else {
      return posicionEnProcesosPedidosYOrdenados !== -1
        ? procesosPedidosYOrdenados[posicionEnProcesosPedidosYOrdenados - 1]
            .idEstado === 6
        : true;
    }
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
            precioActualizado: precioTotal,
            ficha: {
              archivos: [],
              contenido: null,
              contenidoId: null,
              estimatedAt: null,
              id: null,
              procesoId: null,
              procesoProductivoId: null,
              updatedAt: null,
            },
            recursos: [],
          }}
          role={role || "Cliente"}
          onSelect={onSelect}
          selected={selectedProcess === "general"}
          habilitarCambioEstado={true}
          prenda={orderData.prenda}
          esProductiva={laOrdenEstaEnProduccion}
        />
      </div>
      <div className="m-2 font-bold text-lg">
        Procesos de{" "}
        {orderData?.estado.id === 3 ? "Produccion" : "Diseño/Desarrollo"}
      </div>
      <div className="flex flex-col max-h-screen overflow-y-auto">
        {!laOrdenEstaEnProduccion &&
          orderData.procesos
            .filter((proceso) => {
              if (role === clienteRole) return proceso.estado !== "No Pedido";
              if (role === prestadorDeServiciosRole)
                return proceso.recursos.some(
                  (el) => el.key === data.user.email
                );
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
                prenda={orderData?.prenda}
                esProductiva={laOrdenEstaEnProduccion}
              />
            ))}
        {laOrdenEstaEnProduccion &&
          orderData.procesosProductivos
            .filter((proceso) => {
              if (role === clienteRole) return proceso.estado !== "No Pedido";
              if (role === prestadorDeServiciosRole)
                return proceso.recursos.some(
                  (el) => el.key === data.user.email
                );
              return true;
            })
            .map((proceso, index) => (
              <SelectableOrderProcessItem
                key={proceso.id}
                proceso={{ ...proceso, idOrden: orderData.id }}
                role={role || "Cliente"}
                onSelect={onSelect}
                selected={selectedProcess === proceso.id}
                habilitarCambioEstado={
                  index > 0
                    ? validarHabilitacionCambioEstado(proceso.idProceso)
                    : true || false
                }
                prenda={orderData.prenda}
                esProductiva={laOrdenEstaEnProduccion}
              />
            ))}
      </div>
    </div>
  );
};

export default OrderProcessSidebar;

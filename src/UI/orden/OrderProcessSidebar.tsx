import { ExtendedOrdenData } from "@utils/Examples/ExtendedOrdenData";
import { clienteRole, prestadorDeServiciosRole } from "@utils/roles/SiteRoles";
import { useSession } from "next-auth/react";
import SelectableOrderProcessItem from "./SelectableOrderProcessItem";
import { useMemo } from "react";

type Props = {
  orderData: ExtendedOrdenData;
  idEstadoOrdenAPrevisualizar?: number;
  ordenFrenada: boolean;
  selectedProcess: string;
  role: string;
  onSelect: (processID: string) => void;
};

const OrderProcessSidebar = ({
  orderData,
  idEstadoOrdenAPrevisualizar,
  ordenFrenada,
  role,
  selectedProcess,
  onSelect,
}: Props) => {
  const { data } = useSession();
  const precioTotal = useMemo(() => {
    if (idEstadoOrdenAPrevisualizar !== 0) {
      const procesoAUtilizar =
        idEstadoOrdenAPrevisualizar === 3
          ? orderData.procesosProductivos
          : orderData.procesos;

      return procesoAUtilizar
        .filter((proceso) => proceso.idEstado === 6)
        .map((proceso) => proceso.precioActualizado)
        .reduce((acumulador, precio) => acumulador + precio, 0);
    }
    const procesoAUtilizar =
      orderData?.idEstado === 3
        ? orderData.procesosProductivos
        : orderData.procesos;

    return procesoAUtilizar
      .filter((proceso) => proceso.idEstado === 6)
      .map((proceso) => proceso.precioActualizado)
      .reduce((acumulador, precio) => acumulador + precio, 0);
  }, [orderData, idEstadoOrdenAPrevisualizar]);

  const laOrdenEstaEnProduccion = useMemo(
    () =>
      orderData?.idEstado === 3 && [0, 3].includes(idEstadoOrdenAPrevisualizar),
    [orderData, idEstadoOrdenAPrevisualizar]
  );
  const seQuierePrevisualizarLosProcesos = idEstadoOrdenAPrevisualizar !== 0;

  function renderizarTituloDeProcesos(): string {
    if (seQuierePrevisualizarLosProcesos) {
      return idEstadoOrdenAPrevisualizar === 3
        ? "Producción"
        : "Diseño/Desarrollo";
    }
    return laOrdenEstaEnProduccion ? "Producción" : "Diseño/Desarrollo";
  }

  function validarHabilitacionCambioEstado(idProceso: number): boolean {
    let procesosPedidosYOrdenados;
    if (idProceso === 1) {
      return true;
    }

    if (idEstadoOrdenAPrevisualizar !== 0) {
      procesosPedidosYOrdenados =
        idEstadoOrdenAPrevisualizar === 3
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
    } else {
      procesosPedidosYOrdenados =
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
    }

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
            esDeDesarollo: false,
            esDeProduccion: false,
            esExterno: false,
            idProceso: -1,
            precioActualizado: precioTotal || 0,
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
          esProductiva={orderData?.idEstado === 3}
        />
      </div>
      {!ordenFrenada && (
        <>
          <div className="m-2 font-bold text-lg">
            Procesos de {renderizarTituloDeProcesos()}
          </div>
          <div className="flex flex-col max-h-screen overflow-y-auto">
            {!laOrdenEstaEnProduccion &&
              !seQuierePrevisualizarLosProcesos &&
              orderData.procesos
                .sort(
                  (procesoAnterior, procesoPosterior) =>
                    procesoAnterior.idProceso - procesoPosterior.idProceso
                )
                .filter((proceso) => {
                  if (role === clienteRole)
                    return proceso.estado !== "No Pedido";
                  if (role === prestadorDeServiciosRole)
                    return proceso.recursos.some(
                      (el) => el.key === data.user.email
                    );
                  return true;
                })
                .map((proceso, index) => (
                  <SelectableOrderProcessItem
                    key={proceso.id}
                    proceso={{
                      ...proceso,
                      idOrden: orderData?.id,
                      esDeDesarollo: proceso.esDeDesarrollo,
                      esDeProduccion: proceso.esDeProduccion,
                      esExterno: proceso.esExterno,
                    }}
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
              !seQuierePrevisualizarLosProcesos &&
              orderData.procesosProductivos
                .sort(
                  (procesoAnterior, procesoPosterior) =>
                    procesoAnterior.idProceso - procesoPosterior.idProceso
                )
                .filter((proceso) => {
                  if (role === clienteRole)
                    return proceso.estado !== "No Pedido";
                  if (role === prestadorDeServiciosRole)
                    return proceso.recursos.some(
                      (el) => el.key === data.user.email
                    );
                  return true;
                })
                .map((proceso, index) => (
                  <SelectableOrderProcessItem
                    key={proceso.id}
                    proceso={{
                      ...proceso,
                      idOrden: orderData.id,
                      esDeDesarollo: proceso.esDeDesarrollo,
                      esDeProduccion: proceso.esDeProduccion,
                      esExterno: proceso.esExterno,
                    }}
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
                    cantidad={orderData.ordenProductiva.cantidad}
                  />
                ))}
            {seQuierePrevisualizarLosProcesos &&
              (idEstadoOrdenAPrevisualizar === 3
                ? orderData.procesosProductivos
                    .sort(
                      (procesoAnterior, procesoPosterior) =>
                        procesoAnterior.idProceso - procesoPosterior.idProceso
                    )
                    .filter((proceso) => {
                      if (role === clienteRole)
                        return proceso.estado !== "No Pedido";
                      if (role === prestadorDeServiciosRole)
                        return proceso.recursos.some(
                          (el) => el.key === data.user.email
                        );
                      return true;
                    })
                    .map((proceso, index) => (
                      <SelectableOrderProcessItem
                        key={proceso.id}
                        proceso={{
                          ...proceso,
                          idOrden: orderData?.id,
                          esDeDesarollo: proceso.esDeDesarrollo,
                          esDeProduccion: proceso.esDeProduccion,
                          esExterno: proceso.esExterno,
                        }}
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
                    ))
                : orderData.procesos
                    .sort(
                      (procesoAnterior, procesoPosterior) =>
                        procesoAnterior.idProceso - procesoPosterior.idProceso
                    )
                    .filter((proceso) => {
                      if (role === clienteRole)
                        return proceso.estado !== "No Pedido";
                      if (role === prestadorDeServiciosRole)
                        return proceso.recursos.some(
                          (el) => el.key === data.user.email
                        );
                      return true;
                    })
                    .map((proceso, index) => (
                      <SelectableOrderProcessItem
                        key={proceso.id}
                        proceso={{
                          ...proceso,
                          idOrden: orderData?.id,
                          esDeDesarollo: proceso.esDeDesarrollo,
                          esDeProduccion: proceso.esDeProduccion,
                          esExterno: proceso.esExterno,
                        }}
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
                    )))}
          </div>
        </>
      )}
    </div>
  );
};

export default OrderProcessSidebar;

import EditIcon from "@mui/icons-material/Edit";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { IconButton } from "@mui/material";
import {
  ArchivoFichaTecnica,
  ComplejidadConfeccion,
  ContenidoFichaTencica,
  FichaTecnica,
  PrecioPrenda,
  ProcesoDesarrollo,
  Servicio,
  TipoPrenda,
} from "@prisma/client";
import {
  adminRole,
  ayudanteRole,
  prestadorDeServiciosRole,
} from "@utils/roles/SiteRoles";
import Image from "next/image";
import { useContext, useState } from "react";
import OrderGeneralChangeDialog from "./Process/OrderGeneralChangeDialog";
import OrderProcessItemChangeDialog from "./Process/OrderProcessItemChangeDialog";
import OrderProcessItemResourcesDialog from "./Process/OrderProcessItemResourcesDialog";
import React from "react";
import { getServicePrice } from "@utils/queries/cotizador";
import { useQuery } from "react-query";
import { ErrorHandlerContext } from "@utils/ErrorHandler/error";
import { obtenerDatosDeReportePorIdProceso } from "@utils/queries/reportes/procesos/todos";

export type ProcesoFicha = {
  idOrden: string;
  estado: string;
  proceso: string;
  icon: string;
  id: string;
  lastUpdated: Date;
  idProceso: number;
  ficha: FichaTecnica & {
    archivos: ArchivoFichaTecnica[];
    contenido: ContenidoFichaTencica;
  };
  recursos: { key: string; text: string }[];
};

type Props = {
  proceso: ProcesoFicha;
  role: string;
  selected?: boolean;
  onSelect?: (processID: string) => void;
  habilitarCambioEstado: boolean;
  servicios: (Servicio & {
    procesos: ProcesoDesarrollo[];
  })[];
  prenda: PrecioPrenda & {
    complejidad: ComplejidadConfeccion;
    tipo: TipoPrenda;
  };
};

export const ProcessStateTextColors = (estado: string) => {
  switch (estado?.toLowerCase()) {
    case "pedido":
      return "text-cyan-500";
    case "traido por cliente":
      return "text-violet-500";
    case "no pedido":
      return "text-gray-500";
    case "iniciado":
      return "text-orange-500";
    case "en proceso":
      return "text-yellow-500";
    case "terminado":
      return "text-green-500";
    case "en pausa":
      return "text-teal-500";
    case "cancelado":
      return "text-red-500";
    default:
      return "text-gray-500";
  }
};

const SelectableOrderProcessItem = ({
  proceso,
  role,
  selected,
  onSelect,
  habilitarCambioEstado,
  servicios,
  prenda,
}: Props) => {
  const {
    estado,
    proceso: nombreProceso,
    lastUpdated,
    icon,
    id,
    ficha,
  } = proceso;
  const { addError } = useContext(ErrorHandlerContext);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [resourceDialogOpen, setResourceDialogOpen] = useState(false);
  const [generalDialogOpen, setGeneralDialogOpen] = useState(false);

  const handleGeneralDialogClose = () => setGeneralDialogOpen(false);
  const handleGeneralDialogOpen = () => setGeneralDialogOpen(true);

  const handleStatusDialogClose = () => setStatusDialogOpen(false);
  const handleStatusDialogOpen = () => setStatusDialogOpen(true);

  const handleResourceDialogClose = () => setResourceDialogOpen(false);
  const handleResourceDialogOpen = () => setResourceDialogOpen(true);

  const color = ProcessStateTextColors(estado);

  const selectable =
    estado !== "No Pedido" || ["Modlería", "Geometral"].includes(nombreProceso);

  const backgroundColor = selected
    ? "bg-blue-100 border-blue-100"
    : !selectable
    ? "bg-gray-300"
    : "hover:bg-gray-100 cursor-pointer";

  const handleSelectProcess = () => {
    if (selected || !selectable) return;
    onSelect(id);
  };

  const { data: servicioPrecioDelDolar } = useQuery(
    ["precio-del-dolar"],
    () => getServicePrice("cl9609m9b00454cvhlvv7vd0e"),
    {
      onError: () => addError("Error al traer los precios de los servicios"),
      refetchOnWindowFocus: false,
    }
  );
  const { data: reportesConDatosNumericos } = useQuery(
    ["reportes-datos-numericos"],
    () => obtenerDatosDeReportePorIdProceso(proceso.idOrden),
    {
      onError: () =>
        addError("Error al traer los reportes con datos numericos"),
      refetchOnWindowFocus: false,
    }
  );

  function calcularPrecioMolderiaBase(): number {
    const precioDelDolar = servicioPrecioDelDolar?.precioBase;
    const servicioMolderia = servicios?.find(
      (servicio) => servicio.name === "Moldería Base"
    );

    return (
      prenda.precioBase * precioDelDolar * servicioMolderia?.factorMultiplicador
    );
  }

  function calcularPrecioDiseño(): number {
    return calcularPrecioMolderiaBase() / 2;
  }

  function calcularPrecioDigitalizacion(): number {
    const idDigitalizacionPorAvio = "clxxoh44a0002wd7855vzxyhc";
    const idDigitliazacionPorMolde = "cl90d1q8t000h356tylhao6tc";
    const precioDelDolar = servicioPrecioDelDolar?.precioBase;
    const factoresMultiplicadoresYIds = servicios.map((servicio) => ({
      precioFijo: servicio.precioFijo,
      id: servicio.id,
    }));
    const reporteDeDigitalizacion = reportesConDatosNumericos?.find(
      (reporte) => reporte.ReportesDeDigitalizacion !== null
    );

    const precioFijoDigitalizacionPorAvio = factoresMultiplicadoresYIds.find(
      (factor) => factor.id === idDigitalizacionPorAvio
    ).precioFijo;
    const precioFijoDigitalizacionPorMolde = factoresMultiplicadoresYIds.find(
      (factor) => factor.id === idDigitliazacionPorMolde
    ).precioFijo;

    return reportesConDatosNumericos
      ? precioDelDolar *
          (reporteDeDigitalizacion?.ReportesDeDigitalizacion
            ?.cantidadDeAviosConMedida *
            precioFijoDigitalizacionPorAvio +
            reporteDeDigitalizacion?.ReportesDeDigitalizacion
              ?.cantidadDeMoldes *
              precioFijoDigitalizacionPorMolde)
      : 0.0;
  }

  function calcularPrecioGeometral(): number {
    const precioDelDolar = servicioPrecioDelDolar?.precioBase;
    const factoresMultiplicadores = servicios
      .filter((servicio) => servicio.esDeDesarrollo)
      .map((servicio) => servicio.precioFijo);

    return factoresMultiplicadores
      .map((factorMultiplicador) => factorMultiplicador * precioDelDolar)
      .reduce((total, subtotal) => total + subtotal, 0);
  }

  function calcularPrecioImpresion(): number {
    return 0.0;
  }

  function calcularPrecioTizado(): number {
    const precioDelDolar = servicioPrecioDelDolar?.precioBase;
    const factoresMultiplicadores = servicios
      .filter((servicio) => servicio.esDeDesarrollo)
      .map((servicio) => servicio.precioFijo);

    return precioDelDolar
      ? factoresMultiplicadores.reduce(
          (total, factorMultiplicador) =>
            total + factorMultiplicador * precioDelDolar,
          0
        )
      : 0.0;
  }

  function calcularPrecioCorteMuestra(): number {
    const precioDelDolar = servicioPrecioDelDolar?.precioBase;
    const factoresMultiplicadores = servicios
      .filter((servicio) => servicio.esDeDesarrollo)
      .map((servicio) => servicio.factorMultiplicador);

    return precioDelDolar
      ? factoresMultiplicadores.reduce(
          (total, factorMultiplicador) =>
            total + factorMultiplicador * precioDelDolar,
          0
        )
      : 0.0;
  }

  function calcularPrecioPreConfeccion(): number {
    const precioDelDolar = servicioPrecioDelDolar?.precioBase;
    const factoresMultiplicadores = servicios
      .filter((servicio) => servicio.esDeDesarrollo)
      .map((servicio) => servicio.precioFijo);

    return precioDelDolar
      ? factoresMultiplicadores.reduce(
          (total, factorMultiplicador) =>
            total + factorMultiplicador * precioDelDolar,
          0
        )
      : 0.0;
  }

  function calcularPrecioConfeccionMuestra(): number {
    const precioDelDolar = servicioPrecioDelDolar?.precioBase;
    const factoresMultiplicadores = servicios
      .filter((servicio) => servicio.esDeDesarrollo)
      .map((servicio) => servicio.precioFijo);

    return precioDelDolar
      ? factoresMultiplicadores.reduce(
          (total, factorMultiplicador) =>
            total + factorMultiplicador * precioDelDolar,
          0
        )
      : 0.0;
  }

  function calcularPrecioTerminado(): number {
    const precioDelDolar = servicioPrecioDelDolar?.precioBase;
    const factoresMultiplicadores = servicios
      .filter((servicio) => servicio.esDeDesarrollo)
      .map((servicio) => servicio.factorMultiplicador);

    return precioDelDolar
      ? factoresMultiplicadores.reduce(
          (total, factorMultiplicador) =>
            total + factorMultiplicador * precioDelDolar,
          0
        )
      : 0.0;
  }

  function calcularPrecioActualizadoDeProceso(idProceso: number): number {
    switch (idProceso) {
      case 1:
        return calcularPrecioDiseño();
      case 2:
        return calcularPrecioMolderiaBase();
      case 3:
        return calcularPrecioDigitalizacion();
      case 5:
        return calcularPrecioGeometral();
      case 6:
        return calcularPrecioImpresion();
      case 8:
        return calcularPrecioTizado();
      case 9:
        return calcularPrecioCorteMuestra();
      case 10:
        return calcularPrecioPreConfeccion();
      case 11:
        return calcularPrecioConfeccionMuestra();
      case 12:
        return calcularPrecioTerminado();
      default:
        return 0.0;
    }
  }

  if (id === "general")
    return (
      <>
        <OrderGeneralChangeDialog
          open={generalDialogOpen}
          onClose={handleGeneralDialogClose}
        />
        <div
          className={`py-2 px-4 flex flex-row justify-between items-center space-x-4 text-2 m-2 border-2 transition-all ${backgroundColor}`}
          onClick={handleSelectProcess}
        >
          <div className="flex flex-row items-center space-x-4">
            <div>
              <Image src={icon} alt="hola" width={30} height={30} />
            </div>
            <div>
              <li className="flex flex-col">
                <div className="font-bold text-lg">{nombreProceso}</div>
                <div className="text-gray-400 text-xs">
                  Detalles generales de la orden
                </div>
              </li>
            </div>
          </div>

          {role === adminRole && (
            <div className="flex flex-row">
              <div>
                <IconButton type="button" onClick={handleGeneralDialogOpen}>
                  <EditIcon />
                </IconButton>
              </div>
            </div>
          )}
        </div>
      </>
    );
  if ([adminRole, prestadorDeServiciosRole, ayudanteRole].includes(role))
    return (
      <>
        <OrderProcessItemChangeDialog
          process={proceso}
          open={statusDialogOpen}
          onClose={handleStatusDialogClose}
        />
        <OrderProcessItemResourcesDialog
          process={proceso}
          open={resourceDialogOpen}
          onClose={handleResourceDialogClose}
        />
        <div
          className={`py-2 px-4 flex flex-row items-center justify-between text-2 m-2 border-2 ${backgroundColor}`}
          onClick={handleSelectProcess}
        >
          <div className="flex flex-row items-center space-x-4">
            <div>
              <Image src={icon} alt="hola" width={30} height={30} />
            </div>
            <div>
              <li className="flex flex-col">
                <div className="font-bold text-lg">{nombreProceso}</div>
                <div className="text-gray-400 text-xs">
                  Estado: <span className={`${color}`}>{estado}</span>
                </div>
                {lastUpdated ? (
                  <div className="text-gray-400 text-xs">
                    Actualizado el:{" "}
                    <span>
                      {new Date(lastUpdated).toLocaleDateString("es-AR")}
                    </span>
                  </div>
                ) : null}
                {estado.toLowerCase() === "terminado" && (
                  <div className="text-gray-400 text-xs">
                    Precio Actualizado:{" "}
                    <span>
                      {calcularPrecioActualizadoDeProceso(
                        proceso.idProceso
                      ).toFixed(2)}{" "}
                      $
                    </span>
                  </div>
                )}
              </li>
            </div>
          </div>
          <div className="flex flex-row">
            {role === adminRole && (
              <div>
                <IconButton type="button" onClick={handleResourceDialogOpen}>
                  <PersonAddIcon />
                </IconButton>
              </div>
            )}
            <div>
              <IconButton
                type="button"
                onClick={handleStatusDialogOpen}
                disabled={!habilitarCambioEstado}
              >
                <EditIcon />
              </IconButton>
            </div>
          </div>
        </div>
      </>
    );

  return (
    <div
      className={`py-2 px-4 flex flex-row items-center space-x-4 text-2 m-2 border-2 transition-all ${backgroundColor}`}
      onClick={handleSelectProcess}
    >
      <div>
        <Image src={icon} alt="hola" width={30} height={30} />
      </div>
      <div>
        <li className="flex flex-col">
          <div className="font-bold text-lg">{nombreProceso}</div>
          <div className="text-gray-400 text-xs">
            Estado: <span className={`${color}`}>{estado}</span>
          </div>
        </li>
      </div>
    </div>
  );
};

export default SelectableOrderProcessItem;

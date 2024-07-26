import EditIcon from "@mui/icons-material/Edit";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { IconButton } from "@mui/material";
import {
  ArchivoFichaTecnica,
  ComplejidadConfeccion,
  ContenidoFichaTencica,
  FichaTecnica,
  PrecioPrenda,
  TipoPrenda,
} from "@prisma/client";
import {
  adminRole,
  ayudanteRole,
  prestadorDeServiciosRole,
} from "@utils/roles/SiteRoles";
import Image from "next/image";
import { useState } from "react";
import OrderGeneralChangeDialog from "./Process/OrderGeneralChangeDialog";
import OrderProcessItemChangeDialog from "./Process/OrderProcessItemChangeDialog";
import OrderProcessItemResourcesDialog from "./Process/OrderProcessItemResourcesDialog";
import React from "react";
import { actualizarPrecio } from "@utils/queries/procesos/procesos";

export type ProcesoFicha = {
  idOrden: string;
  estado: string;
  proceso: string;
  icon: string;
  id: string;
  lastUpdated: Date;
  idProceso: number;
  precioActualizado: number;
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
  prenda: PrecioPrenda & {
    complejidad: ComplejidadConfeccion;
    tipo: TipoPrenda;
  };
  esProductiva: boolean;
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
  prenda,
  esProductiva,
}: Props) => {
  const { estado, proceso: nombreProceso, lastUpdated, icon, id } = proceso;
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

  async function handleTerminarProceso(
    emailRecursoNuevo: string
  ): Promise<void> {
    await actualizarPrecio({
      emailDePrestador: emailRecursoNuevo,
      idProceso: proceso.idProceso,
      idProcesoDesarrollo: proceso.id,
      precioPrendaBase: prenda.precioBase,
      esDeProduccion: esProductiva,
    });
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
                <div className="text-gray-400 text-xs">
                  Precio Total:{" "}
                  <span>
                    {proceso.precioActualizado}
                    {" $"}
                  </span>
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
          esDeProduccion={esProductiva}
          process={proceso}
          open={statusDialogOpen}
          onClose={handleStatusDialogClose}
          onHandleTerminarProceso={handleTerminarProceso}
        />
        <OrderProcessItemResourcesDialog
          esDeProduccion={esProductiva}
          process={proceso}
          open={resourceDialogOpen}
          onClose={handleResourceDialogClose}
          onHandleTerminarProceso={handleTerminarProceso}
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
                      {proceso.precioActualizado}
                      {" $"}
                    </span>
                  </div>
                )}
              </li>
            </div>
          </div>
          <div className="flex flex-row">
            {role === adminRole && (
              <div>
                <IconButton
                  type="button"
                  onClick={handleResourceDialogOpen}
                  disabled={!habilitarCambioEstado}
                >
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
          <div className="text-gray-400 text-xs">
            Actualizado el:{" "}
            <span>{new Date(lastUpdated).toLocaleDateString("es-AR")}</span>
          </div>
          <div className="text-gray-400 text-xs">
            Precio actualizado:{" "}
            <span>{proceso.precioActualizado.toFixed(2)} $</span>
          </div>
        </li>
      </div>
    </div>
  );
};

export default SelectableOrderProcessItem;

import { Button } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import AddIcon from '@mui/icons-material/Add';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import { ExtendedOrdenData } from "@utils/Examples/ExtendedOrdenData"
import LoadingIndicator from "@utils/LoadingIndicator/LoadingIndicator";
import { eliminarCargaDeTiempoPorId, obtenerCargasDeTiempoPorIdProcesoDesarrolloOrden } from "@utils/queries/registros";
import { useContext, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { RegistroCargaTiempo, TipoDeAccioModal } from "types/types";
import ServiceUploadCargaTiempo from "./ServiceUploadCargaTiempo";
import DialogEliminarCargaTiempo from "./DialogEliminarCargaTiempo";
import { ErrorHandlerContext } from "@utils/ErrorHandler/error";

type Props = {
    orderData: ExtendedOrdenData
    selectedProcess: string
}

export function ServiceReportesTiempoTab({orderData, selectedProcess}: Props) {
    const [showCargarTiempo, setShowCargarTiempo] = useState(false);
    const [showAlertEliminarTiempo, setShowAlertEliminarTiempo] = useState(false);
    const [tipoDeAccion, setTipoDeAccion] = useState(TipoDeAccioModal.CARGA);
    const [cargaDeTiempo, setCargaDeTiempo] = useState<RegistroCargaTiempo>(null);
    const [idCargaTiempo, setIdCargaTiempo] = useState<string>('');
    const {id, proceso} = orderData.procesos.find((procesoDesarrolloOrden) => procesoDesarrolloOrden.id === selectedProcess);
    const {addError} = useContext(ErrorHandlerContext);
    const queryClient = useQueryClient();
    
    const {data: cargasDeTiempo, isLoading: seEstaBuscandoCagasDeTiempo} = useQuery(['cargasDeTiempo', id], () => obtenerCargasDeTiempoPorIdProcesoDesarrolloOrden(id), {initialData: []});
    
    const columnas: GridColDef[] = [
        { field: 'name', headerName: 'Usuario',  description: 'El nombre del usuario', sortable: true, width: 160 },
        { field: 'comentario', headerName: 'Comentario',  description: 'Un comentario sobre lo que se realizo', sortable: true, width: 160 },
        { field: 'horas', headerName: 'Horas', description: 'La cantidad de horas de la carga', width: 80 },
        { field: 'minutos', headerName: 'Minutos', description: 'La cantidad de minutos de la carga', width: 80 },
        {
          field: 'fechaDeCarga',
          headerName: 'Fecha de Carga',
          description: 'La fecha de la carga',
          sortable: true,
          width: 200
        },
        {
          field: 'fechaDeActualizacion',
          headerName: 'Fecha de Actualizacion',
          description: 'La fecha de la actualizacion',
          sortable: false,
          width: 200
        },
        {
            field: 'editar', headerName: 'Editar', maxWidth: 75, align: "center", disableColumnMenu: true, headerAlign: "center", filterable: false, sortable: false, renderCell: (params) =>
                <div onClick={() => handleEditarModalCargaTiempo(params.row.id)}>
                    <ModeEditIcon />
                </div>
        },
        {
            field: 'eliminar', headerName: 'Eliminar', maxWidth: 75, align: "center", disableColumnMenu: true, headerAlign: "center", filterable: false, sortable: false, renderCell: (params) =>
                <div onClick={() => handleAbrirModalEliminarCargaTiempo(params.row.id)}>
                    <DeleteIcon />
                </div>
        }
      ];
    
    const filas = cargasDeTiempo.map((registro: RegistroCargaTiempo, index: number) => {
    const fechaDeCargaParseada = new Date(registro.fechaDeCarga).toLocaleString('es-AR');
    const fechaDeActualizacionParseada = new Date(registro.fechaDeActualizacion).toLocaleString('es-AR');
        return {
            id: registro.id,
            name: registro.usuarioDeCreacion.name,
            comentario: registro.comentario,
            horas: registro.horas,
            minutos: registro.minutos,
            fechaDeCarga: fechaDeCargaParseada,
            fechaDeActualizacion: fechaDeActualizacionParseada
        }
    });

    function handleEditarModalCargaTiempo(id: string): void {
        const cargaDeTiempo = cargasDeTiempo.find((carga: RegistroCargaTiempo) => carga.id === id);
        setCargaDeTiempo(cargaDeTiempo);
        setTipoDeAccion(TipoDeAccioModal.EDITAR);
        setShowCargarTiempo(true);
    }
    function handleCargarModalCargaTiempo(): void {
        setTipoDeAccion(TipoDeAccioModal.CARGA);
        setShowCargarTiempo(true);
    }

    function handleAbrirModalEliminarCargaTiempo(id: string): void {
        setIdCargaTiempo(id);
        setShowAlertEliminarTiempo(true);
    }
    function handleCerrarModalEliminarCargaTiempo(): void {
        setShowAlertEliminarTiempo(false);
    }

    function handleCerrarModalCargaTiempo(): void {
        setShowCargarTiempo(false);
    }
    

    return(
        <LoadingIndicator show={seEstaBuscandoCagasDeTiempo} variant="blocking">
            <div style={{ height: 400, display: 'flex', flexDirection: 'column', width: '100%'}}>
                {
                    cargasDeTiempo.length > 0? (
                        <>
                            <DataGrid
                                rows={filas}
                                columns={columnas}
                                initialState={{
                                    pagination: {
                                        page: 0,
                                        pageSize: 4,
                                    },
                                }}
                            />
                        </>
                    ): (
                        <div className="flex align-middle m-3 justify-center h-auto">
                            <p className="font-semibold text-lg">No hay tiempo cargado</p>
                        </div>
                    )
                }
                {showCargarTiempo && <ServiceUploadCargaTiempo open={showCargarTiempo} onClose={handleCerrarModalCargaTiempo} nombreProceso={proceso} idProcesoDesarrolloOrden={id} accion={tipoDeAccion} cargaDeTiempo={cargaDeTiempo}/>}
                {showAlertEliminarTiempo && <DialogEliminarCargaTiempo onClose={handleCerrarModalEliminarCargaTiempo} open={showAlertEliminarTiempo} idCargaTiempo={idCargaTiempo} />}
                <div className="flex justify-center m-2">
                    <Button variant="outlined" startIcon={<AddIcon />} onClick={handleCargarModalCargaTiempo}>Cargar tiempo</Button>
                </div>
            </div>
        </LoadingIndicator>
    )
}
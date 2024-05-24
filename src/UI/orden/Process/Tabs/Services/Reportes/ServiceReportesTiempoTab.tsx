import { Button } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import AddIcon from '@mui/icons-material/Add';
import { ExtendedOrdenData } from "@utils/Examples/ExtendedOrdenData"
import LoadingIndicator from "@utils/LoadingIndicator/LoadingIndicator";
import { obtenerCargasDeTiempoPorIdProcesoDesarrolloOrden } from "@utils/queries/reportes";
import { useState } from "react";
import { useQuery } from "react-query";
import { RegistroCargaTiempo } from "types/types";
import ServiceUploadCargaTiempo from "./ServiceUploadCargaTiempo";

type Props = {
    orderData: ExtendedOrdenData
    selectedProcess: string
}

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
  ];

export function ServiceReportesTiempoTab({orderData, selectedProcess}: Props) {
    const [showCargarTiempo, setShowCargarTiempo] = useState(false);
    const {id} = orderData.procesos.find((procesoDesarrolloOrden) => procesoDesarrolloOrden.id === selectedProcess);
    const {data: cargasDeTiempo, isLoading: seEstaBuscandoCagasDeTiempo} = useQuery(['cargasDeTiempo', id], () => obtenerCargasDeTiempoPorIdProcesoDesarrolloOrden(id), {initialData: []});

    const filas = cargasDeTiempo.map((registro: RegistroCargaTiempo, index: number) => {
        const fechaDeCargaParseada = new Date(registro.fechaDeCarga).toLocaleString('es-AR');
        const fechaDeActualizacionParseada = new Date(registro.fechaDeActualizacion).toLocaleString('es-AR');
        return {
            id: index,
            name: registro.usuarioDeCreacion.name,
            comentario: registro.comentario,
            horas: registro.horas,
            minutos: registro.minutos,
            fechaDeCarga: fechaDeCargaParseada,
            fechaDeActualizacion: fechaDeActualizacionParseada
        }
    });

    function handleAbrirModalCargaTiempo(): void {
        setShowCargarTiempo(true);
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
                                checkboxSelection

                            />
                            <div className="flex justify-center m-2">
                                <Button variant="outlined" startIcon={<AddIcon />} onClick={handleAbrirModalCargaTiempo}>Cargar tiempo</Button>
                            </div>
                            {
                                showCargarTiempo? (
                                    <ServiceUploadCargaTiempo open={showCargarTiempo} onClose={handleCerrarModalCargaTiempo}/>
                                ): null
                            }
                        </>
                        
                    ): (
                        <div className="flex align-middle m-3 justify-center h-auto">
                            <p className="font-semibold text-lg">No hay tiempo cargado</p>
                        </div>
                    )
                }
            </div>
        </LoadingIndicator>
    )
}
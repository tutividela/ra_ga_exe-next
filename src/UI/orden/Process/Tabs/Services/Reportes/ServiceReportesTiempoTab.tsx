import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { CargaDeTiempo } from "@prisma/client";
import { ExtendedOrdenData } from "@utils/Examples/ExtendedOrdenData"
import LoadingIndicator from "@utils/LoadingIndicator/LoadingIndicator";
import { obtenerCargasDeTiempoPorIdProcesoDesarrolloOrden } from "@utils/queries/reportes";
import { useMemo } from "react";
import { useQuery } from "react-query";
import { RegistroCargaTiempo } from "types/types";

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


    return(
        <LoadingIndicator show={seEstaBuscandoCagasDeTiempo} variant="blocking">
            <div style={{ height: 400, width: '100%' }}>
                {
                    cargasDeTiempo.length > 0? (
                        <DataGrid
                            rows={filas}
                            columns={columnas}
                            initialState={{
                                pagination: {
                                    page: 0,
                                    pageSize: 5 ,
                                },
                            }}
                            checkboxSelection
                        />
                    ): (
                        <div>
                            <p>No hay tiempo cargado</p>
                        </div>
                    )
                }
            </div>
        </LoadingIndicator>
    )
}
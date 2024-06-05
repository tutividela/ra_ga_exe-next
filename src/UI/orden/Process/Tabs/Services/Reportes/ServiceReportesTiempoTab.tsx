import { Button } from "@mui/material";
import { DataGrid, GridColDef, GridToolbar, GridToolbarContainer, GridToolbarExport } from "@mui/x-data-grid";
import { ExtendedOrdenData } from "@utils/Examples/ExtendedOrdenData"
import LoadingIndicator from "@utils/LoadingIndicator/LoadingIndicator";
import { useEffect, useMemo, useState } from "react";
import FileDownloadIcon from '@mui/icons-material/FileDownload';

type Props = {
    orderData: ExtendedOrdenData
}

export function ServiceReportesTiempoTab({orderData}: Props) {
    const [showReporteTiempo, setShowReporteTiempo] = useState(false);

    useEffect(() => {
        const ordenDesarrolloFinalizada = orderData?.procesos?.filter((procesoDesarrollo) => procesoDesarrollo.idEstado !== 3).every((procesoDesarrollo) => procesoDesarrollo.idEstado === 6);
        setShowReporteTiempo(ordenDesarrolloFinalizada);
    }, [orderData]);
    
    function calcularDiasHorasMinutos(duracion: number) {
        const dias = Math.floor(duracion / (1000 * 60 * 60 * 24));
        const horas = Math.floor((duracion % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutos = Math.floor((duracion % (1000 * 60 * 60)) / (1000 * 60));

        return {
            dias: `${dias} Dias`,
            horas: `${horas} Horas`,
            minutos: `${minutos} Minutos`
        };
    }

    function generarDatoReporteDeTiempo() {
        const procesosTerminados = obtenerProcesosTerminados();
        const fechaDeCreacionOrden = new Date(orderData?.createdAt);
        const datosReporteDeTiempo = calcularDuracionesPorProcesoDesarrollo(procesosTerminados, fechaDeCreacionOrden);
        
        return datosReporteDeTiempo.map((datoReporteTiempo) => ({
            id: datoReporteTiempo.idProceso,
            proceso: datoReporteTiempo.proceso,
            ...calcularDiasHorasMinutos(datoReporteTiempo.duracion)
        }));
    }

    function obtenerProcesosTerminados() {
        return orderData?.procesos
        .filter((procesoTerminado) => procesoTerminado.idEstado === 6)
        .sort((procesoAnterior, procesoPosterior) => procesoAnterior.idProceso - procesoPosterior.idProceso) || [];
    }

    function calcularDuracionesPorProcesoDesarrollo(procesosTerminados, fechaDeCreacionOrden: Date): any[] {
        return procesosTerminados.map((procesoTerminado, index) => {
            if(procesoTerminado.idProceso === 1) {
                const fechaUltimaActualizacion = new Date(procesoTerminado?.lastUpdated);
                return {
                    idProceso: procesoTerminado.idProceso,
                    proceso: procesoTerminado.proceso,
                    duracion: fechaUltimaActualizacion.getTime() - fechaDeCreacionOrden.getTime()
                }
            }else {
                const fechaActualizacionProcesoAnterior = new Date(procesosTerminados[index -1].lastUpdated);
                const fechaActualizacionProcesoActual = new Date(procesoTerminado.lastUpdated);
                return {
                    idProceso: procesoTerminado.idProceso,
                    proceso: procesoTerminado.proceso,
                    duracion: fechaActualizacionProcesoActual.getTime() - fechaActualizacionProcesoAnterior.getTime()
                }
            }
        });
    }

    function calcularTiempoTotal(): {dias: string, horas: string, minutos: string} {
        const procesosTerminados = obtenerProcesosTerminados();
        const fechaDeCreacionOrden = new Date(orderData?.createdAt);
        const duracionTotal: number = calcularDuracionesPorProcesoDesarrollo(procesosTerminados, fechaDeCreacionOrden).
            map((duracionDeProceso) => duracionDeProceso.duracion).
            reduce((total, duracion) => total + duracion, 0);
        return calcularDiasHorasMinutos(duracionTotal);
    }

    const columnas: GridColDef[] = useMemo(() => (
        [
            { field: 'proceso', headerName: 'Proceso',  description: 'Proceso de desarrollo', width: 160 },
            { field: 'dias', headerName: 'Dias',  description: 'La cantidad de dias demorados', width: 100 },
            { field: 'horas', headerName: 'Horas', description: 'La cantidad de horas demorados', width: 100 },
            { field: 'minutos', headerName: 'Minutos', description: 'La cantidad de minutos demorados', width: 100 },
        ]
    ), [showReporteTiempo]);

    const filas = useMemo(() => generarDatoReporteDeTiempo(), [showReporteTiempo]);
    const duracionTotal = useMemo(() => calcularTiempoTotal(), [showReporteTiempo]);

    return(
        <LoadingIndicator show={false} variant="blocking">
            <div style={{ height: 400, display: 'flex', flexDirection: 'column', width: '100%'}}>
                {
                    showReporteTiempo? (
                        <>
                            <DataGrid
                                rows={filas}
                                columns={columnas}
                                initialState={{
                                    pagination: {
                                        page: 0,
                                        pageSize: 5,
                                    },
                                }}
                                components={{Toolbar: () => (
                                    <GridToolbarContainer>
                                        <GridToolbarExport  />
                                    </GridToolbarContainer>
                                )}}
                            />
                            <div className="m-3">
                                <p className="text-l"><label className="font-bold">Tiempo total:</label> {duracionTotal.dias} {duracionTotal.horas} {duracionTotal.minutos}</p>
                            </div>
                        </>
                    ): (
                        <div className="flex align-middle m-3 justify-center h-auto">
                            <p className="font-semibold text-lg">La orden no esta actualmente finalizada</p>
                        </div>
                    )
                }
            </div>
        </LoadingIndicator>
    )
}
import { Slide, Tab, Tabs } from "@mui/material";
import { ExtendedOrdenData } from "@utils/Examples/ExtendedOrdenData";
import { useEffect, useMemo, useState } from "react";
import OrderMessagesTab from "./Tabs/General/Message/OrderMessagesTab";
import ServiceDetailsTab from "./Tabs/Services/Details/ServiceDetailsTab";
import ServiceFilesTab from "./Tabs/Services/Files/ServiceFilesTab";
import {
  adminRole,
  ayudanteRole,
  prestadorDeServiciosRole,
} from "@utils/roles/SiteRoles";
import ReporteDeDisenio from "./Tabs/Services/Reportes/Procesos/ReporteDeDisenio";
import ReporteDeArchivo from "./Tabs/Services/Reportes/Procesos/ReporteTipoCargaArchivo";
import { ReporteDeDigitalizacion } from "./Tabs/Services/Reportes/Procesos/ReporteDeDigitalizacion";
import { ReporteDeImpresion } from "./Tabs/Services/Reportes/Procesos/ReporteDeImpresion";
import { ReporteDeCorteMuestra } from "./Tabs/Services/Reportes/Procesos/ReporteDeCorteMuestra";

type Props = {
  orderData: ExtendedOrdenData;
  idEstadoOrdenAPrevisualizar?: number;
  selectedProcess: string;
  rol: string;
};

const OrderProcessContentService = ({
  orderData,
  idEstadoOrdenAPrevisualizar,
  selectedProcess,
  rol,
}: Props) => {
  const [value, setValue] = useState(0);
  const [slide, setSlide] = useState(true);

  const { idProceso } = useMemo(() => {
    if (idEstadoOrdenAPrevisualizar !== 0) {
      const procesosABuscar =
        idEstadoOrdenAPrevisualizar === 3
          ? orderData.procesosProductivos
          : orderData.procesos;

      return (
        procesosABuscar.find(
          (procesoDesarrollo) => procesoDesarrollo.id === selectedProcess
        ) || { idProceso: undefined }
      );
    }
    const procesosABuscar =
      orderData?.idEstado === 3
        ? orderData.procesosProductivos
        : orderData.procesos;

    return (
      procesosABuscar.find(
        (procesoDesarrollo) => procesoDesarrollo.id === selectedProcess
      ) || { idProceso: undefined }
    );
  }, [selectedProcess, idEstadoOrdenAPrevisualizar]);
  const tieneReportes = useMemo(() => {
    if (idEstadoOrdenAPrevisualizar !== 0) {
      const procesosABuscar =
        idEstadoOrdenAPrevisualizar === 3
          ? orderData.procesosProductivos
          : orderData.procesos;
      const proceso = procesosABuscar.find(
        (procesoDesarrollo) => procesoDesarrollo.id === selectedProcess
      );
      return ![4, 7].includes(proceso?.idProceso) || false;
    }
    const procesosABuscar =
      orderData?.idEstado === 3
        ? orderData.procesosProductivos
        : orderData.procesos;
    const proceso = procesosABuscar.find(
      (procesoDesarrollo) => procesoDesarrollo.id === selectedProcess
    );
    return ![4, 7].includes(proceso?.idProceso) || false;
  }, [selectedProcess, idEstadoOrdenAPrevisualizar]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const elUsuarioNoEsCliente = [
    adminRole,
    ayudanteRole,
    prestadorDeServiciosRole,
  ].includes(rol);
  const laOrdenEstaEnProduccion = orderData?.idEstado === 3 || false;
  const seQuierePrevisualizarElDesarrollo = idEstadoOrdenAPrevisualizar === 9;

  useEffect(() => {
    setSlide(false);
    setValue(0);
    setTimeout(() => setSlide(true), 200);
  }, [selectedProcess, idEstadoOrdenAPrevisualizar]);

  return (
    <Slide direction="up" in={slide}>
      <div className="flex flex-col items-center space-y-4 w-full">
        <div className="flex justify-center items-center w-full">
          <div className="w-full flex flex-col items-start border-2 p-4 shadow-lg max-h-[75vh] overflow-y-auto">
            <div className="border-b-2 w-full">
              <Tabs value={value} onChange={handleChange} variant="scrollable">
                <Tab label="Detalles" value={0} />
                <Tab label="Archivos" value={1} />
                <Tab label="Mensajes" value={2} />
                {[adminRole, ayudanteRole, prestadorDeServiciosRole].includes(
                  rol
                ) &&
                  tieneReportes && <Tab label="Reporte" value={3} />}
              </Tabs>
            </div>
            <div hidden={value !== 0} className="w-full">
              <ServiceDetailsTab
                orderData={orderData}
                idEstadoOrdenAPrevisualizar={idEstadoOrdenAPrevisualizar}
                selectedProcess={selectedProcess}
              />
            </div>
            <div hidden={value !== 1} className="w-full">
              <ServiceFilesTab
                orderData={orderData}
                idEstadoOrdenAPrevisualizar={idEstadoOrdenAPrevisualizar}
                selectedProcess={selectedProcess}
              />
            </div>
            <div hidden={value !== 2} className="w-full">
              <OrderMessagesTab
                orderData={orderData}
                selectedProcess={selectedProcess}
              />
            </div>
            {laOrdenEstaEnProduccion &&
              !seQuierePrevisualizarElDesarrollo &&
              elUsuarioNoEsCliente &&
              idProceso && (
                <div hidden={value !== 3} className="w-full">
                  <ReporteDeArchivo
                    idProcesoDesarrollo={selectedProcess}
                    idEstadoOrdenAPrevisualizar={idEstadoOrdenAPrevisualizar}
                    orderData={orderData}
                  />
                </div>
              )}
            {elUsuarioNoEsCliente &&
              (!laOrdenEstaEnProduccion || seQuierePrevisualizarElDesarrollo) &&
              idProceso &&
              tieneReportes && (
                <div hidden={value !== 3} className="w-full">
                  {[1].includes(idProceso) && (
                    <ReporteDeDisenio idProcesoDesarrollo={selectedProcess} />
                  )}
                  {[2, 5, 8, 10, 11, 12, 13, 14, 15].includes(idProceso) && (
                    <ReporteDeArchivo
                      idProcesoDesarrollo={selectedProcess}
                      orderData={orderData}
                      idEstadoOrdenAPrevisualizar={idEstadoOrdenAPrevisualizar}
                    />
                  )}
                  {[3].includes(idProceso) && (
                    <ReporteDeDigitalizacion
                      idProcesoDesarrollo={selectedProcess}
                      orderData={orderData}
                    />
                  )}
                  {[6].includes(idProceso) && (
                    <ReporteDeImpresion
                      idProcesoDesarrollo={selectedProcess}
                      orderData={orderData}
                    />
                  )}
                  {[9].includes(idProceso) && (
                    <ReporteDeCorteMuestra
                      idProcesoDesarrollo={selectedProcess}
                    />
                  )}
                </div>
              )}
          </div>
        </div>
      </div>
    </Slide>
  );
};

export default OrderProcessContentService;

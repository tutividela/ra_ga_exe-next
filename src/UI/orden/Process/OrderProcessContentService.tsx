import { Slide, Tab, Tabs } from "@mui/material";
import { ExtendedOrdenData } from "@utils/Examples/ExtendedOrdenData";
import { useEffect, useMemo, useState } from "react";
import OrderMessagesTab from "./Tabs/General/Message/OrderMessagesTab";
import ServiceDetailsTab from "./Tabs/Services/Details/ServiceDetailsTab";
import ServiceFilesTab from "./Tabs/Services/Files/ServiceFilesTab";
import { adminRole, ayudanteRole } from "@utils/roles/SiteRoles";
import ReporteDeDisenio from "./Tabs/Services/Reportes/Procesos/ReporteDeDisenio";
import ReporteDeArchivo from "./Tabs/Services/Reportes/Procesos/ReporteTipoCargaArchivo";
import { ReporteDeDigitalizacion } from "./Tabs/Services/Reportes/Procesos/ReporteDeDigitalizacion";
import { ReporteDeImpresion } from "./Tabs/Services/Reportes/Procesos/ReporteDeImpresion";
import { ReporteDeCorteMuestra } from "./Tabs/Services/Reportes/Procesos/ReporteDeCorteMuestra";

type Props = {
  orderData: ExtendedOrdenData;
  selectedProcess: string;
  rol: string;
};

const OrderProcessContentService = ({
  orderData,
  selectedProcess,
  rol,
}: Props) => {
  const [value, setValue] = useState(0);
  const [slide, setSlide] = useState(true);
  const { idProceso } = useMemo(
    () =>
      orderData?.procesos.find(
        (procesoDesarrollo) => procesoDesarrollo.id === selectedProcess
      ),
    [selectedProcess]
  );
  const tieneReportes = useMemo(() => {
    const proceso = orderData?.procesos.find(
      (procesoDesarrollo) => procesoDesarrollo.id === selectedProcess
    );
    return ![4, 7, 13, 14, 15].includes(proceso.idProceso);
  }, [selectedProcess]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    setSlide(false);
    setValue(0);
    setTimeout(() => setSlide(true), 200);
  }, [selectedProcess]);

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
                {(rol === adminRole || rol === ayudanteRole) &&
                  tieneReportes && <Tab label="Reporte" value={3} />}
              </Tabs>
            </div>
            <div hidden={value !== 0} className="w-full">
              <ServiceDetailsTab
                orderData={orderData}
                selectedProcess={selectedProcess}
              />
            </div>
            <div hidden={value !== 1} className="w-full">
              <ServiceFilesTab
                orderData={orderData}
                selectedProcess={selectedProcess}
              />
            </div>
            <div hidden={value !== 2} className="w-full">
              <OrderMessagesTab
                orderData={orderData}
                selectedProcess={selectedProcess}
              />
            </div>
            {(rol === adminRole || rol === ayudanteRole) && tieneReportes && (
              <div hidden={value !== 3} className="w-full">
                {[1].includes(idProceso) && (
                  <ReporteDeDisenio idProcesoDesarrollo={selectedProcess} />
                )}
                {[2, 5, 8].includes(idProceso) && (
                  <ReporteDeArchivo
                    idProcesoDesarrollo={selectedProcess}
                    orderData={orderData}
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
                    orderData={orderData}
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

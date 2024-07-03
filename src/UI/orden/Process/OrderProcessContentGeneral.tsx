import { Slide, Tab, Tabs } from "@mui/material";
import { ExtendedOrdenData } from "@utils/Examples/ExtendedOrdenData";
import { useContext, useEffect, useMemo, useState } from "react";
import OrderDetailsTab from "./Tabs/General/Details/OrderDetailsTab";
import OrderFilesTab from "./Tabs/General/Files/OrderFilesTab";
import OrderMessagesTab from "./Tabs/General/Message/OrderMessagesTab";
import { adminRole, ayudanteRole } from "@utils/roles/SiteRoles";
import { ServiceReportesTiempoTab } from "./Tabs/Services/Reportes/Tiempo/ServiceReportesTiempoTab";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useQuery } from "react-query";
import { getServicePrice } from "@utils/queries/cotizador";
import { obtenerDatosDeReportePorIdProceso } from "@utils/queries/reportes/procesos/todos";
import { ErrorHandlerContext } from "@utils/ErrorHandler/error";
import { obtenerServiciosConProcesos } from "@utils/queries/servicios";
import { calcularPrecioDeDesarrolloTotal } from "@utils/procesos/desarrollo/precios";

ChartJS.register(ArcElement, Tooltip, Legend);

type Props = {
  orderData: ExtendedOrdenData;
  selectedProcess: string;
  rol: string;
};

const OrderProcessContentGeneral = ({
  orderData,
  selectedProcess,
  rol,
}: Props) => {
  const [value, setValue] = useState(0);
  const [slide, setSlide] = useState(true);
  const { addError } = useContext(ErrorHandlerContext);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    setSlide(false);
    setValue(0);
    setTimeout(() => setSlide(true), 200);
  }, [selectedProcess]);

  function validarOrdenDesarrolloFinalizada(): boolean {
    return orderData?.procesos
      ?.filter((procesoDesarrollo) => procesoDesarrollo.idEstado !== 3)
      .every((procesoDesarrollo) => procesoDesarrollo.idEstado === 6);
  }

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
    () => obtenerDatosDeReportePorIdProceso(orderData?.id),
    {
      onError: () =>
        addError("Error al traer los reportes con datos numericos"),
      refetchOnWindowFocus: false,
    }
  );

  const { data: serviciosConProcesos } = useQuery(
    ["servicios-con-procesos"],
    obtenerServiciosConProcesos,
    {
      onError: () => addError("Error al traer servicios con procesos"),
      refetchOnWindowFocus: false,
    }
  );

  const ordenDesarrolloFinalizada = useMemo(
    () => validarOrdenDesarrolloFinalizada(),
    [orderData?.procesos]
  );

  const precioDesarrolloTotal = useMemo(
    () =>
      calcularPrecioDeDesarrolloTotal(
        orderData?.prenda.precioBase,
        serviciosConProcesos,
        servicioPrecioDelDolar,
        reportesConDatosNumericos
      ),
    [orderData]
  );

  return (
    <Slide direction="up" in={slide}>
      <div className="flex flex-col items-center space-y-4 w-full">
        <div className="flex justify-center items-center w-full">
          <div className="w-full flex flex-col items-start border-2 p-4 shadow-lg max-h-[75vh] overflow-y-auto">
            <div className="border-b-2 w-full">
              <Tabs value={value} onChange={handleChange} variant="scrollable">
                <Tab label="Detalles" value={0} />
                {orderData?.archivos?.length > 0 && (
                  <Tab label="Archivos" value={1} />
                )}
                <Tab label="Mensajes" value={2} />
                {[adminRole, ayudanteRole].includes(rol) &&
                  ordenDesarrolloFinalizada && (
                    <Tab label="Tiempos por Proceso" value={3} />
                  )}
              </Tabs>
            </div>
            <div hidden={value !== 0} className="w-full">
              <OrderDetailsTab
                orderData={orderData}
                ordenFinalizada={ordenDesarrolloFinalizada}
                precioDesarrolloTotal={precioDesarrolloTotal}
              />
            </div>
            <div hidden={value !== 1} className="w-full">
              <OrderFilesTab orderData={orderData} />
            </div>
            <div hidden={value !== 2} className="w-full">
              <OrderMessagesTab
                orderData={orderData}
                selectedProcess={selectedProcess}
              />
            </div>
            {
              <div hidden={value !== 3} className="w-full">
                <ServiceReportesTiempoTab orderData={orderData} />
              </div>
            }
          </div>
        </div>
      </div>
    </Slide>
  );
};

export default OrderProcessContentGeneral;

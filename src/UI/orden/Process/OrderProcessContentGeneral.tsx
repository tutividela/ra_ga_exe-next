import { Slide, Tab, Tabs } from "@mui/material";
import { ExtendedOrdenData } from "@utils/Examples/ExtendedOrdenData";
import { useEffect, useState } from "react";
import OrderDetailsTab from "./Tabs/General/Details/OrderDetailsTab";
import OrderFilesTab from "./Tabs/General/Files/OrderFilesTab";
import OrderMessagesTab from "./Tabs/General/Message/OrderMessagesTab";
import { adminRole, ayudanteRole } from "@utils/roles/SiteRoles";
import { ServiceReportesTiempoTab } from "./Tabs/Services/Reportes/ServiceReportesTiempoTab";

type Props = {
    orderData: ExtendedOrdenData;
    selectedProcess: string;
    rol: string;
}

const OrderProcessContentGeneral = ({ orderData, selectedProcess, rol }: Props) => {
    const [value, setValue] = useState(0);
    const [slide, setSlide] = useState(true)
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    useEffect(() => {
        setSlide(false)
        setValue(0)
        setTimeout(() => setSlide(true), 200)
    }, [selectedProcess]);

    function validarOrdenDesarrolloFinalizada(): boolean {
        return orderData?.procesos?.
            filter((procesoDesarrollo) => procesoDesarrollo.idEstado !== 3).
            every((procesoDesarrollo) => procesoDesarrollo.idEstado === 6);
    }

    return (
        <Slide direction="up" in={slide} >
            <div className='flex flex-col items-center space-y-4 w-full'>
                <div className='flex justify-center items-center w-full'>
                    <div className='w-full flex flex-col items-start border-2 p-4 shadow-lg max-h-[75vh] overflow-y-auto'>
                        <div className='border-b-2 w-full'>
                            <Tabs value={value} onChange={handleChange} variant='scrollable'>
                                {<Tab label="Detalles" value={0} />}
                                {orderData?.archivos?.length > 0 && <Tab label="Archivos" value={1} />}
                                {true && <Tab label="Mensajes" value={2} />}
                                {([adminRole, ayudanteRole].includes(rol) && validarOrdenDesarrolloFinalizada()) && <Tab label="Tiempos" value={3} />}
                            </Tabs>
                        </div>
                        <div hidden={value !== 0} className='w-full'>
                            <OrderDetailsTab orderData={orderData} />
                        </div>
                        <div hidden={value !== 1} className='w-full'>
                            <OrderFilesTab orderData={orderData} />
                        </div>
                        <div hidden={value !== 2} className='w-full'>
                            <OrderMessagesTab orderData={orderData} selectedProcess={selectedProcess} />
                        </div>
                        {
                            <div hidden={value !== 3} className='w-full'>
                                <ServiceReportesTiempoTab orderData={orderData} />
                            </div>
                        }
                    </div>
                </div>
            </div>
        </Slide>
    )
}

export default OrderProcessContentGeneral
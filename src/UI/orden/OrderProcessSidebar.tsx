import { ExtendedOrdenData } from '@utils/Examples/ExtendedOrdenData'
import { clienteRole, prestadorDeServiciosRole } from '@utils/roles/SiteRoles'
import { useSession } from 'next-auth/react'
import SelectableOrderProcessItem from './SelectableOrderProcessItem'

type Props = {
    orderData: ExtendedOrdenData
    selectedProcess: string
    role: string
    onSelect: (processID: string) => void;
}

const OrderProcessSidebar = ({ orderData, role, selectedProcess, onSelect }: Props) => {
    const { data } = useSession();

    function validarHabilitacionCambioEstado(idProceso: number): boolean {
        if(idProceso === 1) {
            return true;
        }

        const procesosPedidosYOrdenados = orderData?.procesos
            .filter((procesoDesarrollo) => procesoDesarrollo.idEstado !== 3)
            .sort((procesoAnterior, procesoPosterior) => procesoAnterior.idProceso - procesoPosterior.idProceso);
        const posicionEnProcesosPedidosYOrdenados = procesosPedidosYOrdenados.findIndex((procesoDesarrollo) => procesoDesarrollo.idProceso === idProceso);
        console.log(posicionEnProcesosPedidosYOrdenados);

        return posicionEnProcesosPedidosYOrdenados !== -1? procesosPedidosYOrdenados[posicionEnProcesosPedidosYOrdenados - 1].idEstado === 6: true;
    }
    
    return (
        <div className='flex flex-col mt-4'>
            <div className='flex flex-col max-h-screen overflow-y-auto'>
                <SelectableOrderProcessItem
                    proceso={{
                        estado: 'N/A',
                        id: 'general',
                        icon: 'https://cdn-icons-png.flaticon.com/512/839/839599.png',
                        lastUpdated: null,
                        proceso: 'General',
                        ficha: { archivos: [], contenido: null, contenidoId: null, estimatedAt: null, id: null, procesoId: null, updatedAt: null },
                        recursos: []
                    }}
                    role={role || 'Cliente'}
                    onSelect={onSelect}
                    selected={selectedProcess === 'general'}
                    habilitarCambioEstado={true}
                />
            </div>
            <div className='m-2 font-bold text-lg'>Procesos</div>
            <div className='flex flex-col max-h-screen overflow-y-auto'>
                {orderData?.procesos.filter((proceso) => {
                    if (role === clienteRole) return proceso.estado !== 'No Pedido';
                    if (role === prestadorDeServiciosRole) return proceso.recursos.some(el => el.key === data.user.email);
                    return true;
                })
                    .map((proceso, index) => <SelectableOrderProcessItem
                        key={proceso.id}
                        proceso={proceso}
                        role={role || 'Cliente'}
                        onSelect={onSelect}
                        selected={selectedProcess === proceso.id}
                        habilitarCambioEstado={index > 0 ? validarHabilitacionCambioEstado(proceso.idProceso)/* (orderData?.procesos[index-1].idEstado === 6 || orderData?.procesos[index-1].idEstado === 3) */ :true || false}
                    />)}
            </div>
        </div>
    )
}

export default OrderProcessSidebar;
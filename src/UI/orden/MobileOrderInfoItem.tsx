import { ExtendedOrdenData } from '@utils/Examples/BasicOrderTable'
import Image from 'next/image'
import React from 'react'

interface MobileOrderInfoItemProps {
    orden: ExtendedOrdenData
}

const MobileOrderInfoItem = ({ orden }: MobileOrderInfoItemProps) => {
    const date = new Date(orden.updatedAt)

    return (
        <div className="mx-4 my-2 flex flex-row">
            <div id="picture" className='flex '>
                <Image src={orden.categoria?.Prenda?.picture || ''} width="80px" height="80px"  alt="Seleccione prenda.." />
            </div>
            <div className="flex flex-col text-sm justify-evenly ml-4">
                <div>
                    Producto: {orden.nombre}
                </div>
                <div>
                    Estado:  {orden.estado.nombre}
                </div>
                <div>
                    Ultima Modificacion: {date.toLocaleDateString('es-AR')}
                </div>
            </div>
        </div>
    )
}

export default MobileOrderInfoItem

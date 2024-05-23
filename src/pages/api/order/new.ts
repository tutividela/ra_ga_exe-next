import { calculateOrderTotal, findPrendaPrecioByTypeAndComplexity, getAtributosPrenda, updateExpiredOrders } from '@backend/dbcalls/order';
import { checkIfUserExists, fromToday } from '@backend/dbcalls/user';
import { OrderCreationDataSchema } from '@backend/schemas/OrderCreationSchema';
import { ProcesoDesarrollo, Servicio } from '@prisma/client';
import { prisma } from '@server/db/client';
import { generateEmailer } from '@utils/email/generateEmailer';
import { newOrderNotificationHTML } from '@utils/email/newOrderNotification';
import { generateOrderID } from '@utils/generateOrderID';
import type { NextApiRequest, NextApiResponse } from "next";
import { ZodError } from 'zod';

const handleOrderCreation = async (req: NextApiRequest, res: NextApiResponse) => {

    try {
        const data = OrderCreationDataSchema.parse(req.body);
        const idsPlanchadoEntregadoAprobadoPedidos = [
            {
                idProceso: 4,
                idEstadoProceso: 3
            },
            {
                idProceso: 13,
                idEstadoProceso: 1
            },
            {
                idProceso: 14,
                idEstadoProceso: 1
            },
            {
                idProceso: 15,
                idEstadoProceso: 1
            }
        ];
        const {procesosDesarrolloSeleccionados} = data;
        const { id: idComplejidadDeOrdenACrear } = await prisma.complejidadConfeccion.findFirst({ where: { name: data.complejidad } })
        const todosProcesosDesarrolloConServicio = await prisma.procesoDesarrollo.findMany({
            include: {
                servicio: true
            }
        });

        let serviciosSeleccionados = [];
        Object.entries(procesosDesarrolloSeleccionados).forEach((procesoDesarrollo) => {
            const [nombre, {selected: seleccionado}] = procesoDesarrollo;
            if(seleccionado) {
                const servicios = todosProcesosDesarrolloConServicio.find(
                    (procesoDesarrolloConServicio) => procesoDesarrolloConServicio.nombre === nombre
                ).servicio;
                serviciosSeleccionados = [...serviciosSeleccionados, ...servicios];
            }
        });
        
        const idsProcesoDesarrolloYEstadoProcesoDesarrollo = Object.entries(procesosDesarrolloSeleccionados).map((procesoDesarrollo) => {     
            const {id} = todosProcesosDesarrolloConServicio.find((proceso) => proceso.nombre === procesoDesarrollo[0]);
            
            if(id === 7) {
                return {
                    idProceso: id,
                    idEstadoProceso: procesoDesarrollo[1].selected? 2: 3
                }
            }

            return {
                idProceso: id,
                idEstadoProceso: procesoDesarrollo[1].selected? 1: 3
            }
        });
        console.log(idsProcesoDesarrolloYEstadoProcesoDesarrollo)

        const idOrden = generateOrderID(data.user?.name, data.tipoPrenda?.name);

        /* const { sendEmail } = generateEmailer({
            password: process.env.MAILGUN_SMTP_PASS,
            user: 'postmaster@gasppo.lol',
            from: 'soporte@gasppo.lol',
            fromTitle: 'Soporte HS-Taller'
        }) */

        await updateExpiredOrders();

        const prendaPrecio = await findPrendaPrecioByTypeAndComplexity(data.tipoPrenda.id, idComplejidadDeOrdenACrear);
        const preciosDolarTotalEIndividuales = await calculateOrderTotal(data, idComplejidadDeOrdenACrear);
        
        const atributosDeProducto = await getAtributosPrenda(data);
        const { id: idEstadoAguardandoConfirmacion } = await prisma.estadoOrden.findFirst({ where: { id: 1 } });
        const usuarioActual = await checkIfUserExists({ email: data.user.email });

        const ordenCreada = await prisma.orden.create({
            include: { user: true, estado: true, archivos: true, servicios: true, cotizacionOrden: true, procesos: true },
            data: {
                id: idOrden,
                nombre: data.nombreProducto,
                cantidad: 100,
                expiresAt: fromToday(60 * 60 * 24 * 15),
                estado: {
                    connect: { id: idEstadoAguardandoConfirmacion }
                },
                prenda: {
                    connect: { id: prendaPrecio.id }
                },
                user: {
                    connect: { id: usuarioActual.id }
                },
                archivos: {
                    createMany: {
                        data: [
                            ...data.orderFiles.files.map(file => ({ name: file.name || '', urlID: file.urlID || '', type: file.type })),
                        ]
                    }
                },
                cotizacionOrden: {
                    create: {
                        precio: preciosDolarTotalEIndividuales.precioTotal,
                    }
                },
                detallesPrenda: {
                    create: {
                        atributos: {
                            createMany: {
                                data: atributosDeProducto.map(atr => ({ name: atr.name, observacion: atr.observaciones, cantidad: atr.cantidad }))
                            }
                        }
                    }
                },
                servicios: {
                    connect: serviciosSeleccionados.map(service => ({ name: service.name }))
                },
                procesos: {
                    createMany: {
                        data: [
                            ...idsProcesoDesarrolloYEstadoProcesoDesarrollo, 
                            ...idsPlanchadoEntregadoAprobadoPedidos
                        ]
                    }
                }
            }
        });

        const procesosDesarrolloOrdenDeOrden = ordenCreada.procesos;

        await prisma.fichaTecnica.createMany({
            data: procesosDesarrolloOrdenDeOrden.map(proc => ({ procesoId: proc.id }))
        });

        /* await sendEmail({
            html: newOrderNotificationHTML({ name: user.name, orderId: orden.id }),
            to: user.email,
            subject: 'Orden creada'
        }) */

        res.status(200).json({ message: 'Orden creada con éxito',  /* data: ordenCreada */ });

    } catch (e) {
        console.log(e)
        if (e instanceof ZodError) {
            e.format
            res.status(400).json({ error: e.flatten() })
        }
        else {
            res.status(400).json({ error: e })
        }
    }


}

export default handleOrderCreation;
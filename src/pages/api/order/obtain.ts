import { prisma } from "@server/db/client";
import type { NextApiRequest, NextApiResponse } from "next";

const post = async (req: NextApiRequest, res: NextApiResponse) => {
  const id = req.body.orderId;
  try {
    const orders = await prisma.orden.findUnique({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        estado: true,
        // bring image inside category inside prenda
        prenda: {
          include: {
            tipo: true,
            complejidad: true,
          },
        },
        archivos: true,
        cotizacionOrden: {
          orderBy: {
            createdAt: "desc",
          },
        },
        detallesPrenda: {
          include: { atributos: true },
        },
        servicios: true,
        procesos: {
          include: {
            estado: true,
            proceso: true,
            FichaTecnica: { include: { archivos: true, contenido: true } },
            usuarioDeServicio: true,
          },
        },
        ordenProductiva: {
          include: {
            procesos: {
              include: {
                estado: true,
                proceso: true,
                ReporteArchivo: true,
                FichaTecnica: { include: { archivos: true, contenido: true } },
                usuarioDeServicio: true,
              },
            },
          },
        },
        mensajes: { include: { user: true } },
      },
      where: { id: id },
    });

    const mapearProcesosProductivos =
      orders.ordenProductiva?.procesos.map((proceso) => ({
        idEstado: proceso.idEstadoProceso,
        estado: proceso.estado.descripcion,
        proceso: proceso.proceso.nombre,
        esDeDesarrollo: proceso.proceso.esDeDesarrollo,
        esDeProduccion: proceso.proceso.esDeProduccion,
        esExterno: proceso.proceso.esExterno,
        idProceso: proceso.idProceso,
        icon: proceso.proceso.icono,
        id: proceso.id,
        lastUpdated: proceso.lastUpdated,
        precioActualizado: proceso.precioActualizado,
        ficha: proceso.FichaTecnica,
        recursos: proceso.usuarioDeServicio.map((usuario) => ({
          key: usuario.email,
          text: usuario.name,
        })),
      })) || [];

    const formattedProcesses = orders.procesos.map((proc) => ({
      estado: proc.estado.descripcion,
      idEstado: proc.estado.id,
      proceso: proc.proceso.nombre,
      esDeDesarrollo: proc.proceso.esDeDesarrollo,
      esDeProduccion: proc.proceso.esDeProduccion,
      esExterno: proc.proceso.esExterno,
      icon: proc.proceso.icono,
      id: proc.id,
      idProceso: proc.idProceso,
      lastUpdated: proc.lastUpdated,
      precioActualizado: proc.precioActualizado,
      ficha: proc.FichaTecnica,
      recursos: proc.usuarioDeServicio.map((el) => ({
        key: el.email,
        text: el.name,
      })),
    }));

    const formattedMessages = orders.mensajes.map((msg) => ({
      message: msg.mensaje,
      user: {
        email: msg.user.email,
        name: msg.user.name,
      },
      timestamp: msg.createdAt,
      id: msg.id,
    }));

    res.status(200).json({
      ...orders,
      cantidad: orders.cantidad,
      procesos: formattedProcesses,
      procesosProductivos: mapearProcesosProductivos,
      mensajes: formattedMessages,
    });
  } catch (error) {
    res.status(500).json({ error: error });
    throw error;
  }
};

export default post;

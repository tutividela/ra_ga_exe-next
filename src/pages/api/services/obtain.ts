import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@server/db/client";
import { EmailCheckSchema } from "@backend/schemas/EmailCheckSchema";

const post = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email } = EmailCheckSchema.parse(req.body);

  try {
    const servicesFromUser = await prisma.procesoDesarrolloOrden.findMany({
      where: {
        // usuarioDeServicio has to include the email
        usuarioDeServicio: {
          some: {
            email: email,
          },
        },
      },
      include: {
        estado: true,
        proceso: true,
        orden: true,
      },
    });

    const serviciosProductivos = await prisma.procesoProductivoOrden.findMany({
      where: {
        usuarioDeServicio: {
          some: {
            email: email,
          },
        },
      },
      include: {
        estado: true,
        proceso: true,
        orden: {
          include: {
            orden: true,
          },
        },
      },
    });

    const serviciosProductivosMapeados = serviciosProductivos.map(
      (servicio) => ({
        ...servicio,
        idOrden: servicio.orden.orden.id,
        orden: { ...servicio.orden.orden },
      })
    );

    res
      .status(200)
      .json([...servicesFromUser, ...serviciosProductivosMapeados]);
  } catch (error) {
    res.status(500).json({ error: error });
    throw error;
  }
};

export default post;

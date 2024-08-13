import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@server/db/client";

export default async function buscar(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const email = req.query.email as string;

    const servicios = await prisma.serviciosPorUsuario.findMany({
      where: {
        usuario: {
          email: email,
        },
      },
      select: {
        id: true,
        idUsuario: true,
        idServicio: true,
        servicio: {
          select: {
            name: true,
            description: true,
            procesos: {
              select: {
                nombre: true,
              },
            },
          },
        },
        factorMultiplicador: true,
      },
    });

    res.status(200).json(servicios);
  } catch (error: any) {
    res.status(500).json(error);
  }
}

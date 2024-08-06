import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@server/db/client";

export default async function buscar(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const id = req.query.id as string;

    const servicios = await prisma.serviciosPorUsuario.findMany({
      where: {
        id: id,
      },
      select: {
        id: true,
        idUsuario: true,
        idServicio: true,
        servicio: {
          select: {
            name: true,
            description: true,
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

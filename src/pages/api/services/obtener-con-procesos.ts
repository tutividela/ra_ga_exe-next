import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@server/db/client";

export default async function obtener(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const serviciosPorProcesos = await prisma.servicio.findMany({
      include: {
        procesos: true,
      },
    });

    res.status(200).json(serviciosPorProcesos);
  } catch (error: any) {
    res.status(500).json({ error: error });
    throw error;
  }
}

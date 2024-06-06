import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@server/db/client";

const get = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = req.query;
    const idCargaDeTiempo = Array.isArray(id) ? id[0] : id;

    const cargas = await prisma.cargaDeTiempo.findUnique({
      where: {
        id: idCargaDeTiempo,
      },
      select: {
        id: true,
        comentario: true,
        horas: true,
        minutos: true,
        fechaDeCarga: true,
        fechaDeActualizacion: true,
        usuarioDeCreacion: {
          select: {
            name: true,
          },
        },
      },
    });

    res.status(200).json(cargas);
  } catch (error: any) {
    res.status(500).json({ error: error });
    throw error;
  }
};

export default get;

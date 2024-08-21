import { prisma } from "@server/db/client";
import type { NextApiRequest, NextApiResponse } from "next";

const post = async (req: NextApiRequest, res: NextApiResponse) => {
  const id = req.body.idOrden;
  try {
    const orders = await prisma.orden.findUnique({
      include: {
        procesos: {
          include: {
            estado: true,
            proceso: true,
          },
        },
        ordenProductiva: {
          include: {
            procesos: {
              include: {
                estado: true,
                proceso: true,
              },
            },
          },
        },
      },
      where: { id: id },
    });

    res.status(200).json({
      ...orders,
    });
  } catch (error) {
    res.status(500).json({ error: error });
    throw error;
  }
};

export default post;

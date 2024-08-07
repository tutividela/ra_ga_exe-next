// src/pages/api/examples.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@server/db/client";

const obtainPrices = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const clothes = await prisma.precioPrenda.findMany({
      /* break objects */
      select: {
        id: true,
        precioBase: true,
        complejidad: {
          select: {
            name: true,
          },
        },
        tipo: {
          select: {
            name: true,
          },
        },
      },
    });
    res.status(200).json(clothes);
  } catch (error) {
    res.status(500).json({ error: error });
    throw error;
  }
};

export default obtainPrices;

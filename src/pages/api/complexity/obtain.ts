// src/pages/api/examples.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@server/db/client";

const get = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const complexities = await prisma.complejidadConfeccion.findMany();
    res.status(200).json(complexities);
  } catch (error) {
    res.status(500).json({ error: error });
    throw error;
  }
};

export default get;

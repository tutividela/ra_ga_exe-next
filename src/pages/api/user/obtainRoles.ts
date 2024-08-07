import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@server/db/client";

const post = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    /* find all unique users and only show role name */
    const users = await prisma.role.findMany({
      distinct: ["name"],
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error });
    throw error;
  }
};

export default post;

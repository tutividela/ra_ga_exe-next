import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@server/db/client";

const post = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: {
          select: {
            id: true,
            name: true,
          },
        },
        available: true,
      },
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error });
    throw error;
  }
};

export default post;

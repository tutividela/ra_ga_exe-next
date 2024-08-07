import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@server/db/client";

const getMessages = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const orderID = req.query.orderID as string;
    if (!orderID) {
      throw new Error("No orderID provided");
    }

    const messages = await prisma.mensaje.findMany({
      where: { idOrden: orderID },
      include: { user: true },
    });

    res.status(200).json(
      messages.map((msg) => ({
        message: msg.mensaje,
        user: { email: msg.user.email, name: msg.user.name },
        timestamp: msg.createdAt,
        id: msg.id,
        section: msg.seccion,
      }))
    );
  } catch (error) {
    res.status(500).json({ error: error });
    throw error;
  }
};

export default getMessages;

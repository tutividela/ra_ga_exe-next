import { calculateOrderTotal } from "@backend/dbcalls/order";
import { OrderCreationDataSchema } from "@backend/schemas/OrderCreationSchema";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@server/db/client";

const post = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const data = OrderCreationDataSchema.parse(req.body);
    const nombreComplejidad = data?.complejidad || "Básico";
    const { id: debugComplejidadID } =
      await prisma.complejidadConfeccion.findFirst({
        where: { name: nombreComplejidad },
      });
    const precio = await calculateOrderTotal(data, debugComplejidadID);

    res.status(200).json({
      price: precio.precioTotal,
      preciosIndividuales: precio.preciosIndividuales,
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export default post;

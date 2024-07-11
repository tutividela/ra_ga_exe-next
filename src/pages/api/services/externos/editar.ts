import { ModificarPrecioServicioExternoSchema } from "@backend/schemas/ModificarPrecioServicioExterno";
import { NextApiRequest, NextApiResponse } from "next";
import { ZodError } from "zod";
import { prisma } from "@server/db/client";

export default async function editar(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { id, factorMultiplicador } =
      ModificarPrecioServicioExternoSchema.parse(req.body);

    const servicioActualizado = await prisma.serviciosPorUsuario.update({
      where: {
        id: id,
      },
      data: {
        factorMultiplicador: factorMultiplicador,
      },
    });

    res.status(200).json(servicioActualizado);
  } catch (error: any) {
    console.log("Error en la edicion del servicio externo: ", error);

    if (error instanceof ZodError) {
      res.status(400).json(error.flatten());
    }

    res.status(500).json(error);
  }
}

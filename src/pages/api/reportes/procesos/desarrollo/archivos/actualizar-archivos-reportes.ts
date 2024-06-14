import { FichaTecnicaFileUploadSchema } from "@backend/schemas/FichaTecnicaFileUploadSchema";
import { NextApiRequest, NextApiResponse } from "next";
import { ZodError } from "zod";

export default async function post(req: NextApiRequest, res: NextApiResponse) {
  try {
    const idProcesoDesarrolloOrden = req.query
      .idProcesoDesarrolloOrden as string;
    const { fichaFiles } = FichaTecnicaFileUploadSchema.parse(req.body);

    const archivos = fichaFiles.files.map((file) => ({
      idProcesoDesarrolloOrden: idProcesoDesarrolloOrden,
      name: file.name,
      urlID: file.urlID,
      type: file.type,
    }));

    const reportesCreados = await prisma.reporteArchivo.createMany({
      data: archivos,
    });

    res.status(201).json(reportesCreados);
  } catch (error: any) {
    console.log("Error en la obtencion de los reportes de archivos: ", error);

    if (error instanceof ZodError) {
      res.status(400).json(error.flatten());
    }

    res.status(500).json(error);
  }
}

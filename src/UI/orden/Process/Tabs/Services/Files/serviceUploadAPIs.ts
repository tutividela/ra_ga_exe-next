import {
  FichaTecnicaUploadFormData,
  ValidatedFichaTecnicaFileUploadSchema,
} from "@backend/schemas/FichaTecnicaFileUploadSchema";
import { FileUploadResponse } from "@pages/api/drive/uploadToFicha";
import { FichaTecnica } from "@prisma/client";
import { DriveUploadResponse, errorHandle } from "@utils/queries/cotizador";

type FileUploadData = {
  clientName: string;
  orderID: string;
  formData: FormData;
  fichaType: string;
  esDeProduccion: boolean;
};

export const updateFileURL = (
  data: FichaTecnicaUploadFormData,
  file: FileUploadResponse
) => {
  data.fichaFiles.files = data.fichaFiles.files.map((el) =>
    el.name === file.fileName ? { ...el, urlID: file.file.data.id } : el
  );
};

export const uploadFile = (
  data: FileUploadData
): Promise<DriveUploadResponse> =>
  fetch(
    `/api/drive/uploadToFicha?client=${data.clientName}&order=${data.orderID}&fichaType=${data.fichaType}`,
    { method: "POST", body: data.formData }
  )
    .then((res) => (res.ok ? res.json() : errorHandle(res)))
    .catch((error) => {
      throw error;
    });

export const updateFichaFiles = ({
  data,
  fichaID,
}: {
  data: ValidatedFichaTecnicaFileUploadSchema;
  fichaID: string;
}): Promise<FichaTecnica> =>
  fetch(`/api/order/update-ficha-files?fichaID=${fichaID}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", accept: "application/json" },
    body: JSON.stringify(data),
  })
    .then((res) => (res.ok ? res.json() : errorHandle(res)))
    .catch((error) => {
      throw error;
    });

export async function cargarReporteDeArchivoPorProcesoDesarrollo({
  idProcesoDesarrollo,
  esDeProduccion,
  data,
}: {
  idProcesoDesarrollo: string;
  esDeProduccion: boolean;
  data: ValidatedFichaTecnicaFileUploadSchema;
}): Promise<any> {
  fetch(
    `/api/reportes/procesos/desarrollo/archivos/actualizar-archivos-reportes?idProcesoDesarrolloOrden=${idProcesoDesarrollo}&esDeProduccion=${esDeProduccion}`,
    {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then((response) => (response.ok ? response.json() : errorHandle(response)))
    .catch((error: any) => {
      throw error;
    });
}

export async function subirArchivoDeReporte(
  data: FileUploadData
): Promise<DriveUploadResponse> {
  return fetch(
    `/api/drive/subir-a-reporte?nombreDeUsuario=${data.clientName}&idOrden=${data.orderID}&procesoDesarrollo=${data.fichaType}&esDeProduccion=${data.esDeProduccion}`,
    { method: "POST", body: data.formData }
  )
    .then((res) => (res.ok ? res.json() : errorHandle(res)))
    .catch((error) => {
      throw error;
    });
}

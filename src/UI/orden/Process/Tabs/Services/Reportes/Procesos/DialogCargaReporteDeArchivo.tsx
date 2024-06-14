import FormItem from "@UI/Forms/FormItem";
import HookForm from "@UI/Forms/HookForm";
import {
  FichaTecnicaUploadFormData,
  ValidatedFichaTecnicaFileUploadSchema,
} from "@backend/schemas/FichaTecnicaFileUploadSchema";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { ErrorHandlerContext } from "@utils/ErrorHandler/error";
import LoadingIndicator from "@utils/LoadingIndicator/LoadingIndicator";
import { useContext, useMemo } from "react";
import { useMutation, useQueryClient } from "react-query";
import {
  cargarReporteDeArchivoPorProcesoDesarrollo,
  subirArchivoDeReporte,
  updateFileURL,
} from "../../Files/serviceUploadAPIs";
import { ExtendedOrdenData } from "@utils/Examples/ExtendedOrdenData";
import { FileUploadResponse } from "@pages/api/drive/uploadToFicha";

type Props = {
  idProcesoDesarrolloOrden?: string;
  orderData?: ExtendedOrdenData;
  open: boolean;
  onClose: () => void;
};

type FileUploadData = {
  clientName: string;
  orderID: string;
  formData: FormData;
  fichaType: string;
};

export default function DialogCargaReporteDeArchivo({
  idProcesoDesarrolloOrden,
  open,
  orderData,
  onClose,
}: Props) {
  const queryClient = useQueryClient();
  const { addError } = useContext(ErrorHandlerContext);
  const currProcess = useMemo(
    () => orderData?.procesos.find((el) => el.id === idProcesoDesarrolloOrden),
    [idProcesoDesarrolloOrden, orderData?.procesos]
  );
  const folderName = orderData?.user?.name || "Sin Asignar";

  const {
    mutateAsync: subirArchivoReporteAsync,
    isLoading: seEstaSubiendoArchivoReporte,
  } = useMutation(subirArchivoDeReporte, {
    onError: () => {
      addError("Error en la carga del reporte", "error");
    },
  });

  const {
    mutateAsync: cargarReporteDeArchivoAsync,
    isLoading: seEstaCargandoReporteDeArchivo,
  } = useMutation(cargarReporteDeArchivoPorProcesoDesarrollo, {
    onError: () => addError("Error en la carga del reporte", "error"),
  });

  async function handleCargaDeReporteDeArchivo(
    data: FichaTecnicaUploadFormData
  ) {
    if (data?.files?.length > 0) {
      const formData = new FormData();
      for (const f of data.files) {
        formData.append("file", f.file);
      }
      const { data: archivosSubidos } = await subirArchivoReporteAsync({
        clientName: folderName,
        fichaType: currProcess?.proceso,
        orderID: orderData?.id,
        formData: formData,
      });
      Array.isArray(archivosSubidos)
        ? archivosSubidos.map((archivosSubido: FileUploadResponse) =>
            updateFileURL(data, archivosSubido)
          )
        : updateFileURL(data, archivosSubidos);
      await cargarReporteDeArchivoAsync({
        idProcesoDesarrollo: idProcesoDesarrolloOrden,
        data,
      });
    } else {
      console.log("No se cargaron archivos");
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth={true}>
      <div className="p-4">
        <DialogTitle>Subir archivo</DialogTitle>
        <LoadingIndicator
          show={seEstaSubiendoArchivoReporte || seEstaCargandoReporteDeArchivo}
        >
          <HookForm
            defaultValues={{
              files: [],
              fichaFiles: {
                observaciones: "",
                files: [],
              },
            }}
            onSubmit={handleCargaDeReporteDeArchivo}
          >
            <DialogContent className="space-y-5">
              <FormItem
                layout={{
                  type: "Uploader",
                  scope: "files",
                  options: {
                    fileSection: "fichaFiles.files",
                    multifile: true,
                    helperText:
                      "Inserte archivos correspondientes a imágenes, diseños, dibujos o bocetos de la prenda",
                  },
                }}
              />
            </DialogContent>
            <DialogActions>
              <Button type="button" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">Confirmar</Button>
            </DialogActions>
          </HookForm>
        </LoadingIndicator>
      </div>
    </Dialog>
  );
}

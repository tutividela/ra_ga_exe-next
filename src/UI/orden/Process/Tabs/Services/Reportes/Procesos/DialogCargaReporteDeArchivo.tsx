import FormItem from "@UI/Forms/FormItem";
import HookForm from "@UI/Forms/HookForm";
import { FichaTecnicaUploadFormData } from "@backend/schemas/FichaTecnicaFileUploadSchema";
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

export default function DialogCargaReporteDeArchivo({
  idProcesoDesarrolloOrden,
  open,
  orderData,
  onClose,
}: Props) {
  const { addError } = useContext(ErrorHandlerContext);
  const queryClient = useQueryClient();
  const currProcess = useMemo(() => {
    const procesosABuscar =
      orderData?.idEstado === 3
        ? orderData.procesosProductivos
        : orderData.procesos;

    return procesosABuscar.find((el) => el.id === idProcesoDesarrolloOrden);
  }, [
    idProcesoDesarrolloOrden,
    orderData?.procesos,
    orderData?.procesosProductivos,
  ]);
  const folderName = orderData?.user?.name || "Sin Asignar";

  const laOrdenEstaEnProduccion = useMemo(
    () => orderData?.idEstado === 3,
    [orderData]
  );

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
    onSuccess: () => {
      addError("Se ha subido el reporte con exito!", "success");
      onClose();
    },
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
        esDeProduccion: laOrdenEstaEnProduccion,
      });
      Array.isArray(archivosSubidos)
        ? archivosSubidos.map((archivosSubido: FileUploadResponse) =>
          updateFileURL(data, archivosSubido)
        )
        : updateFileURL(data, archivosSubidos);
      await cargarReporteDeArchivoAsync({
        idProcesoDesarrolloOProductivo: idProcesoDesarrolloOrden,
        esDeProduccion: laOrdenEstaEnProduccion,
        data,
      });
    } else {
      console.log("No se cargaron archivos");
    }
    await queryClient.invalidateQueries(["reportesArchivo", idProcesoDesarrolloOrden]);
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

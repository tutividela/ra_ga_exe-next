import { useMutation, useQuery, useQueryClient } from "react-query";
import { ErrorHandlerContext } from "@utils/ErrorHandler/error";
import { useContext, useState } from "react";
import {
  obtenerReporteCorteMuestraPorProcesoDesarrollo,
  borrarReporteCorteMuestraPorProcesoDesarrollo,
  cargarReporteCorteMuestraPorProcesoDesarrollo,
} from "@utils/queries/reportes/procesos/corteMuestra";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import LoadingIndicator from "@utils/LoadingIndicator/LoadingIndicator";
import { Button, Dialog } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { DialogCargaReporteCorteMuestra } from "./DialogCargaReporteCorteMuestra";
import { DialogBorrarReporteCorteMuestra } from "./DialogBorrarReporteCorteMuestra";
import { ProcesoCorteMuestraSchemaType } from "@backend/schemas/reportes/ProcesoCorteMuestraSchema";
import { corteMuestraLayout } from "@UI/Reportes/forms/corteMuestra.layout";
import HookForm from "@UI/Forms/HookForm";

type Props = {
  idProcesoDesarrollo: string;
};
export function ReporteDeCorteMuestra({ idProcesoDesarrollo }: Props) {
  const { addError } = useContext(ErrorHandlerContext);
  const queryClient = useQueryClient();
  const [showCargaDeConsumos, setShowCargaDeConsumos] =
    useState<boolean>(false);
  const [showBorrarCargaDeConsumos, setShowBorrarCargaDeConsumos] =
    useState<boolean>(false);
  const [idRegistroABorrar, setIdRegistroABorrar] = useState<string>("");

  const {
    data: reportesDeCorteMuestra,
    isLoading: seEstanBuscandoReportesDeCorteMuestra,
  } = useQuery(
    ["reportes-corte-muestra", idProcesoDesarrollo],
    () => obtenerReporteCorteMuestraPorProcesoDesarrollo(idProcesoDesarrollo),
    {
      onError: () => addError("Error al traer los reportes de corte muestra"),
    }
  );

  const {
    mutateAsync: borrarReporteCorteMuestraAsync,
    isLoading: seEstaBorrandoReporteDigitalizacion,
  } = useMutation(borrarReporteCorteMuestraPorProcesoDesarrollo, {
    onError: () => addError("Error en la eliminacion del consumo", "error"),
    onSuccess: () => {
      queryClient.invalidateQueries(["reportes-corte-muestra"]);
      addError("Se ha eliminado el reporte con exito!", "success");
    },
  });

  const {
    mutateAsync: cargaReporteCorteMuestraAsync,
    isLoading: seEstaCargandoReporteCorteMuestra,
  } = useMutation(cargarReporteCorteMuestraPorProcesoDesarrollo, {
    onError: () => addError("Error en la carga de las cantidades", "error"),
    onSuccess: () => {
      setShowCargaDeConsumos(false);
      queryClient.invalidateQueries(["reportes-corte-muestra"]);
      addError("Se ha cargado el reporte con exito!", "success");
    },
  });

  async function onHandleBorrarReporteCorteMuestra(): Promise<void> {
    setShowBorrarCargaDeConsumos(false);
    await borrarReporteCorteMuestraAsync(idRegistroABorrar);
  }

  const columns: GridColDef[] = [
    {
      headerName: "Nombre del Material",
      field: "nombre",
      width: 150,
      align: "center",
    },
    {
      field: "cantidad",
      headerName: "Consumo",
      width: 220,
      align: "center",
    },
    {
      field: "esAvio",
      headerName: "¿Es Avio?",
      width: 150,
      align: "center",
    },
    {
      field: "tipoDeAvio",
      headerName: "Tipo de avio",
      width: 180,
      align: "center",
    },
    {
      field: "acciones",
      headerName: "Acciones",
      width: 100,
      align: "center",
      renderCell: (params) => (
        <DeleteIcon
          onClick={() => {
            setShowBorrarCargaDeConsumos(true);
            setIdRegistroABorrar(params.row.id);
          }}
        />
      ),
    },
  ];

  const defaultCorteMuestraLayout: ProcesoCorteMuestraSchemaType = {
    id: "",
    idProcesoDesarrolloOrden: idProcesoDesarrollo,
    nombre: "",
    cantidad: 0,
    esAvio: false,
    tipoDeAvio: "",
  };

  return (
    <div className="mt-4">
      <LoadingIndicator
        show={
          seEstanBuscandoReportesDeCorteMuestra ||
          seEstaBorrandoReporteDigitalizacion
        }
      >
        <div
          style={{
            height: 400,
            width: "100%",
            borderWidth: 2,
            marginTop: 10,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {reportesDeCorteMuestra && (
            <DataGrid
              columns={columns}
              rows={reportesDeCorteMuestra.map((reporte) => ({
                ...reporte,
                cantidad: reporte.esAvio
                  ? `${reporte.cantidad} unidad(es)`
                  : `${reporte.cantidad} metro(s)`,
                esAvio: reporte.esAvio ? "Si" : "No",
                tipoDeAvio: reporte.esAvio ? reporte.tipoDeAvio : "N/A",
              }))}
              pageSize={7}
              className="m-2"
            />
          )}
          {!reportesDeCorteMuestra && (
            <div className="flex flex-col">
              <p className="font-semibold text-base self-center">
                No se ha cargado los consumos
              </p>
            </div>
          )}
          <div className="self-center m-3">
            <Button
              variant="outlined"
              onClick={() => setShowCargaDeConsumos(true)}
            >
              Cargar consumos
            </Button>
          </div>
          {showCargaDeConsumos && (
            <Dialog open={showCargaDeConsumos}>
              <HookForm
                defaultValues={defaultCorteMuestraLayout}
                onSubmit={cargaReporteCorteMuestraAsync}
              >
                <DialogCargaReporteCorteMuestra
                  titulo="Carga de consumo"
                  layoutFormulario={corteMuestraLayout}
                  onClose={() => setShowCargaDeConsumos(false)}
                  open={seEstaCargandoReporteCorteMuestra}
                />
              </HookForm>
            </Dialog>
          )}
          {showBorrarCargaDeConsumos && (
            <DialogBorrarReporteCorteMuestra
              open={showBorrarCargaDeConsumos}
              onClose={() => setShowBorrarCargaDeConsumos(false)}
              handleBorrarCantidad={async () => {
                await onHandleBorrarReporteCorteMuestra();
              }}
              titulo="¿Estas seguro de borrar el consumo?"
            />
          )}
        </div>
      </LoadingIndicator>
    </div>
  );
}

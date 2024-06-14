import { Button } from "@mui/material";
import { ExtendedOrdenData } from "@utils/Examples/ExtendedOrdenData";
import { useMemo, useState } from "react";
import DialogCargaReporteDeArchivo from "./DialogCargaReporteDeArchivo";
type Props = {
  idProcesoDesarrollo: string;
  orderData: ExtendedOrdenData;
};
export default function ReporteDeMolderia({
  idProcesoDesarrollo,
  orderData,
}: Props) {
  const [showCargaReporte, setShowCargaReprote] = useState<boolean>(false);
  const { proceso } = useMemo(
    () => orderData?.procesos.find((el) => el.id === idProcesoDesarrollo),
    [idProcesoDesarrollo, orderData?.procesos]
  );

  return (
    <div hidden={false}>
      <div className="h-full border-2 flex justify-center items-center p-4">
        <div className="flex flex-col space-y-4 items-center">
          <div className="text-2xl">
            No hay reportes correspondientes a {proceso}
          </div>
          <div>
            <Button
              variant="outlined"
              onClick={() => setShowCargaReprote(true)}
            >
              Subir nuevo reporte
            </Button>
          </div>
          {showCargaReporte && (
            <DialogCargaReporteDeArchivo
              onClose={() => setShowCargaReprote(false)}
              open={showCargaReporte}
              idProcesoDesarrolloOrden={idProcesoDesarrollo}
              orderData={orderData}
            />
          )}
        </div>
      </div>
    </div>
  );
}

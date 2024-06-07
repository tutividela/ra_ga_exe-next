import HookForm from "@UI/Forms/HookForm";
import ReporteDeDisenio from "./Procesos/ReporteDeDisenio";
import { disenioLayout } from "../../../../../Reportes/forms/disenio.layout";

type Props = {
  idProceso: number;
  idProcesoDesarrollo: string;
};

export default function Reporte({ idProceso, idProcesoDesarrollo }: Props) {
  function setearLayout(): any {
    switch (idProceso) {
      case 1:
        return disenioLayout;
      default:
        return;
    }
  }

  return (
    <HookForm
      defaultValues={setearLayout()}
      onSubmit={function (data: unknown): void {
        throw new Error("Function not implemented.");
      }}
    >
      {idProceso === 1 && (
        <ReporteDeDisenio idProcesoDesarrollo={idProcesoDesarrollo} />
      )}
    </HookForm>
  );
}

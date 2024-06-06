import { Alert } from "@mui/material";
import FormItem from "@UI/Forms/FormItem";
import { clothingProcessesLayout } from "./forms/clothingProcessesForm.layout";
import { useFormContext } from "react-hook-form";
import { OrderCreationData } from "@backend/schemas/OrderCreationSchema";
import { useEffect } from "react";

const ClothingProcessesForm = () => {
  const { watch, setValue } = useFormContext<OrderCreationData>();
  const valorDeProcesoDesarrolloMateriales = watch(
    "procesosDesarrolloSeleccionados.Materiales.selected"
  );
  const valorDeProcesoDesarrolloImpresion = watch(
    "procesosDesarrolloSeleccionados.Impresion.selected"
  );
  const valorDeProcesoDesarrolloCorte = watch(
    "procesosDesarrolloSeleccionados.Corte.selected"
  );
  const valorDeProcesoDesarrolloFichaTecnica = watch(
    "procesosDesarrolloSeleccionados.Geometral.selected"
  );

  function corregirSwitchesPorProcesoFichaTecnica(): void {
    if (valorDeProcesoDesarrolloImpresion) {
      setValue("procesosDesarrolloSeleccionados.Impresion.selected", false);
    }
  }
  function corregirSwitchesPorProcesoImpresion(): void {
    if (valorDeProcesoDesarrolloMateriales) {
      setValue("procesosDesarrolloSeleccionados.Materiales.selected", false);
    }
  }
  function corregirSwitchesPorProcesoMateriales(): void {
    if (valorDeProcesoDesarrolloCorte) {
      setValue("procesosDesarrolloSeleccionados.Corte.selected", false);
    }
  }

  useEffect(() => {
    setValue("procesosDesarrolloSeleccionados.Diseño.selected", true);
    setValue("procesosDesarrolloSeleccionados.Molderia.selected", true);
    setValue("procesosDesarrolloSeleccionados.Digitalización.selected", true);
  }, []);
  useEffect(() => {
    corregirSwitchesPorProcesoImpresion();
  }, [valorDeProcesoDesarrolloImpresion]);
  useEffect(() => {
    corregirSwitchesPorProcesoMateriales();
  }, [valorDeProcesoDesarrolloMateriales]);
  useEffect(() => {
    corregirSwitchesPorProcesoFichaTecnica();
  }, [valorDeProcesoDesarrolloFichaTecnica]);
  useEffect(() => {
    if (!valorDeProcesoDesarrolloCorte) {
      setValue(
        "procesosDesarrolloSeleccionados.Pre-confección.selected",
        false
      );
      setValue("procesosDesarrolloSeleccionados.Tizado.selected", false);
      setValue("procesosDesarrolloSeleccionados.Confección.selected", false);
      setValue("procesosDesarrolloSeleccionados.Terminado.selected", false);
    }
  }, [valorDeProcesoDesarrolloCorte]);

  return (
    <div className="flex md:w-6/12 flex-col justify-center items-baseline mt-10 md:mt-0">
      <Alert severity="info">
        Seleccione los procesos que desea agregar al desarollo
      </Alert>
      <div className="form-input-section">
        <FormItem layout={clothingProcessesLayout} />
      </div>
    </div>
  );
};

export default ClothingProcessesForm;

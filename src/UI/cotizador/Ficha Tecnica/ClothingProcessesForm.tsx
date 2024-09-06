import { Alert } from "@mui/material";
import FormItem from "@UI/Forms/FormItem";
import {
  clothingProcessesLayout,
  procesosDeDesarrolloLayout,
} from "./forms/clothingProcessesForm.layout";
import { useFormContext } from "react-hook-form";
import { OrderCreationData } from "@backend/schemas/OrderCreationSchema";
import { useEffect } from "react";

const ClothingProcessesForm = () => {
  const { watch, setValue } = useFormContext<OrderCreationData>();
  const cantidadAProducir = watch("cantidad");
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
  const valorDeProcesoDesarrolloTizado = watch(
    "procesosDesarrolloSeleccionados.Tizado.selected"
  );

  function corregirSwitchesPorProcesoFichaTecnica(): void {
    if (valorDeProcesoDesarrolloImpresion) {
      setValue("procesosDesarrolloSeleccionados.Impresion.selected", false);
    }
  }
  function corregirSwitchesPorProcesoImpresion(): void {
    if (valorDeProcesoDesarrolloMateriales || valorDeProcesoDesarrolloTizado) {
      setValue("procesosDesarrolloSeleccionados.Materiales.selected", false);
      setValue("procesosDesarrolloSeleccionados.Tizado.selected", false);
    }
  }
  function corregirSwitchesPorProcesoMateriales(): void {
    if (valorDeProcesoDesarrolloCorte) {
      setValue("procesosDesarrolloSeleccionados.Tizado.selected", false);
      setValue("procesosDesarrolloSeleccionados.Corte.selected", false);
    }
  }
  function corregirSwitchesPorProcesoCorte(): void {
    if ((!valorDeProcesoDesarrolloTizado) && valorDeProcesoDesarrolloCorte) {
      setValue("procesosDesarrolloSeleccionados.Corte.selected", false);
    }
  }

  useEffect(() => {
    setValue("procesosDesarrolloSeleccionados.Diseño.selected", true);
    setValue("procesosDesarrolloSeleccionados.Molderia.selected", true);
    setValue("procesosDesarrolloSeleccionados.Digitalización.selected", true);
  }, []);
  useEffect(() => {
    if (cantidadAProducir === "muestra") {
      corregirSwitchesPorProcesoImpresion();
    }
  }, [valorDeProcesoDesarrolloImpresion]);
  useEffect(() => {
    corregirSwitchesPorProcesoMateriales();
  }, [valorDeProcesoDesarrolloMateriales]);
  useEffect(() => {
    corregirSwitchesPorProcesoFichaTecnica();
  }, [valorDeProcesoDesarrolloFichaTecnica]);
  useEffect(() => {
    corregirSwitchesPorProcesoCorte();
  }, [valorDeProcesoDesarrolloTizado])
  useEffect(() => {
    setValue("procesosDesarrolloSeleccionados.Pre-confección.selected", false);
    setValue("procesosDesarrolloSeleccionados.Confección.selected", false);
    setValue("procesosDesarrolloSeleccionados.Terminado.selected", false);
  }, [valorDeProcesoDesarrolloCorte]);

  return (
    <div className="flex md:w-6/12 flex-col justify-center items-baseline mt-10 md:mt-0">
      <Alert severity="info">
        Seleccione los procesos que desea agregar al desarollo
      </Alert>
      <div className="form-input-section">
        <FormItem
          layout={
            cantidadAProducir === "desarrollo"
              ? procesosDeDesarrolloLayout
              : clothingProcessesLayout
          }
        />
      </div>
    </div>
  );
};

export default ClothingProcessesForm;

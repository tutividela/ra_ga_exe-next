import { Alert } from "@mui/material";
import FormItem from '@UI/Forms/FormItem';
import { clothingProcessesLayout } from './forms/clothingProcessesForm.layout';
import { useFormContext } from "react-hook-form";
import { OrderCreationData } from "@backend/schemas/OrderCreationSchema";
import { useEffect } from "react";

const ClothingProcessesForm = () => {
    const {watch, setValue} = useFormContext<OrderCreationData>();
    const valorDeProcesoDesarrolloMateriales = watch('procesosDesarrolloSeleccionados.Materiales.selected');
    const valorDeProcesoDesarrolloImpresion = watch('procesosDesarrolloSeleccionados.Impresion.selected');
    const valorDeProcesoDesarrolloCorte = watch('procesosDesarrolloSeleccionados.Corte.selected');

    useEffect(() => {
        if(valorDeProcesoDesarrolloMateriales) {
            setValue('procesosDesarrolloSeleccionados.Materiales.selected', false);
        }
    },[valorDeProcesoDesarrolloImpresion]);

    useEffect(() => {
        if(valorDeProcesoDesarrolloCorte) {
            setValue('procesosDesarrolloSeleccionados.Corte.selected', false);
        }
    },[valorDeProcesoDesarrolloMateriales]);

    return (
        <div className="flex md:w-6/12 flex-col justify-center items-baseline mt-10 md:mt-0">
            <Alert severity='info'>Seleccione los procesos que desea agregar al desarollo</Alert>
            <div className="form-input-section">
                <FormItem layout={clothingProcessesLayout} />
            </div>

        </div>
    )
}

export default ClothingProcessesForm
import FormItem from "@UI/Forms/FormItem";
import { procesosPorEtapaLayout } from "./forms/procesosPorEtapa.layout";
import { useFormContext } from "react-hook-form";
import { useEffect } from "react";

type Props = {
    onHandleCambioEtapa: (etapa: string) => void;
    etapas: { key: string, text: string }[];
};


export function ProcesosPorEtapaDropdown({ onHandleCambioEtapa, etapas }: Props) {
    const { watch } = useFormContext<{ etapa: string }>();
    const etapaSeleccionada = watch("etapa");

    useEffect(() => onHandleCambioEtapa(etapaSeleccionada), [etapaSeleccionada]);

    return (
        <div className="w-full h-full">
            <FormItem layout={procesosPorEtapaLayout} selectOptions={{ etapas }} />
        </div>
    );
}
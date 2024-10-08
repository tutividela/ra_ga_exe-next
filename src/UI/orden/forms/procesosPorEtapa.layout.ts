import { LayoutElement } from "@UI/Forms/types";

export const procesosPorEtapaLayout: LayoutElement<{
    etapa: string
}> = {
    type: "Vertical",
    elements: [
        {
            type: "Select",
            scope: "etapa",
            label: "Ver procesos de",
            options: {
                optionsName: "etapas",
            },
        }
    ],
};

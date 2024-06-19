import { LayoutElement } from "@UI/Forms/types";
import { ProcesoDigitalizacionType } from "@backend/schemas/reportes/ProcesoDigitalizacionSchema";

export const digitalizacionLayout: LayoutElement<ProcesoDigitalizacionType> = {
  type: "Vertical",
  elements: [
    {
      type: "Horizontal",
      elements: [
        {
          type: "Input",
          scope: "cantidadDeMoldes",
          label: "Moldes",
          title: "Cantidad de Moldes",
          className: "m-3 w-1/4",
        },
        {
          type: "Input",
          scope: "cantidadDeAviosConMedida",
          label: "Avios con Medida",
          className: "m-3 w-1/4",
        },
        {
          type: "Input",
          scope: "cantidadDeTalles",
          label: "Talles",
          className: "m-3 w-1/4",
        },
        {
          type: "Input",
          scope: "cantidadDeMateriales",
          label: "Materiales",
          className: "m-3 w-1/4",
        },
      ],
    },
  ],
};

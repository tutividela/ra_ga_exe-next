import { OrdenProductivaSchemaDTOType } from "@backend/schemas/OrdenProductivaDTOSchema";
import { LayoutElement } from "@UI/Forms/types";

export const generarOrdenProductivaLayout: LayoutElement<OrdenProductivaSchemaDTOType> =
  {
    type: "Vertical",
    spacing: 4,
    elements: [
      {
        type: "Input",
        label: "Cantidad a producir",
        scope: "cantidad",
        options: {
          numeric: true,
        },
      },
    ],
  };

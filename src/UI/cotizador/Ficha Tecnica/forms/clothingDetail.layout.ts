import { OrderCreationData } from "@backend/schemas/OrderCreationSchema";
import { LayoutElement } from "../../../Forms/types";

export const clothingDetailLayout: LayoutElement<OrderCreationData> = {
  type: "Horizontal",
  elements: [
    {
      type: "Vertical",
      justifyContent: "center",
      width: 12,
      spacing: 2,
      elements: [
        {
          type: "Autocomplete",
          scope: "atributosPrenda.genero.values",
          label: "Género",
          options: {
            labelPlacement: "end",
            optionsName: "generos",
          },
          width: 6,
        },
        {
          type: "Select",
          label: "Tipo de Desarrollo",
          scope: "cantidad",
          width: 6,
          options: {
            shrinkLabel: true,
            optionsName: "cantidades",
          },
        },
        {
          type: "Input",
          label: "Talles",
          scope: "talles",
          width: 6,
          options: {
            shrinkLabel: true,
            helperText:
              "Detalle la nomenclatura de los talles (ej: S, M, L, XL, XXL)",
            optionsName: "cantidades",
          },
        },
      ],
    },
  ],
};

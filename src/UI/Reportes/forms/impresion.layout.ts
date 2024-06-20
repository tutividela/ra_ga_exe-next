import { LayoutElement } from "@UI/Forms/types";
import { ProcesoImpresionSchemaType } from "@backend/schemas/reportes/ProcesoImpresionSchema";

export const impresionLayout: LayoutElement<ProcesoImpresionSchemaType> = {
  type: "Vertical",
  alignItems: "center",
  spacing: 2,
  elements: [
    {
      type: "Input",
      scope: "cantidadDeMetros",
      label: "Moldes",
      title: "Cantidad de Moldes",
      className: "mt-2",
      options: {
        numeric: true,
      },
    },
  ],
};

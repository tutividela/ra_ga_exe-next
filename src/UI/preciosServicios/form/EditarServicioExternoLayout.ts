import { ModificarPrecioServicioExternoSchemaType } from "@backend/schemas/ModificarPrecioServicioExterno";
import { LayoutElement } from "@UI/Forms/types";

export const editarServicioExternoLayout: LayoutElement<ModificarPrecioServicioExternoSchemaType> =
  {
    type: "Vertical",
    elements: [
      {
        type: "Input",
        scope: "factorMultiplicador",
        label: "Factor",
        className: "mt-1",
        options: {
          numeric: true,
        },
      },
    ],
  };

import { LayoutElement } from "@UI/Forms/types";
import { ProcesoDigitalizacionType } from "@backend/schemas/reportes/ProcesoDigitalizacionSchema";

export const digitalizacionLayout: LayoutElement<ProcesoDigitalizacionType> = {
  type: "Vertical",
  alignItems: "center",
  spacing: 2,
  elements: [
    {
      type: "Input",
      scope: "cantidadDeMoldes",
      label: "Moldes",
      title: "Cantidad de Moldes",
      className: "mt-2",
      options: {
        numeric: true,
      },
    },
    {
      type: "Input",
      scope: "cantidadDeAviosConMedida",
      label: "Avios con Medida",
      options: {
        numeric: true,
      },
    },
    {
      type: "Input",
      scope: "cantidadDeTalles",
      label: "Talles",
      options: {
        numeric: true,
      },
    },
    {
      type: "Input",
      scope: "cantidadDeMateriales",
      label: "Materiales",
      options: {
        numeric: true,
      },
    },
  ],
};

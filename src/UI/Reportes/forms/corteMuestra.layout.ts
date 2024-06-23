import { LayoutElement } from "@UI/Forms/types";
import { ProcesoCorteMuestraSchemaType } from "@backend/schemas/reportes/ProcesoCorteMuestraSchema";

export const corteMuestraLayout: LayoutElement<ProcesoCorteMuestraSchemaType> =
  {
    type: "Horizontal",
    alignItems: "center",
    spacing: 2,
    elements: [
      {
        type: "Input",
        scope: "nombre",
        label: "Nombre del Material",
        options: {
          placeholderText: "Por ejemplo: Tela Base",
        },
        className: "mt-2 w-full",
      },
      {
        type: "Input",
        scope: "cantidad",
        label: "Consumo",
        options: {
          numeric: true,
        },
        className: "w-full",
      },
      {
        type: "Switch",
        scope: "esAvio",
        label: "¿Es un Avio?",
      },
      {
        type: "Select",
        scope: "tipoDeAvio",
        label: "Tipo de Avio",
        className: "w-full",
        options: {
          optionsName: "tiposDeAvios",
        },
      },
    ],
  };

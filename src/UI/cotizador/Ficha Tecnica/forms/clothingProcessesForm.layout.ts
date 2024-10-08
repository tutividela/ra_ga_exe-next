import { OrderCreationData } from "@backend/schemas/OrderCreationSchema";
import { LayoutElement } from "../../../Forms/types";

export const clothingProcessesLayout: LayoutElement<OrderCreationData> = {
  type: "Horizontal",
  elements: [
    {
      type: "Switch",
      scope: "procesosDesarrolloSeleccionados.Diseño.selected",
      className: "mt-2",
      label: "Diseño",
      options: {
        labelPlacement: "end",
      },
      width: 12,
    },
    {
      type: "Switch",
      scope: "procesosDesarrolloSeleccionados.Molderia.selected",
      className: "mt-2",
      label: "Moldería Base",
      options: {
        labelPlacement: "end",
      },
      width: 12,
      rules: [
        {
          scope: "procesosDesarrolloSeleccionados.Diseño.selected",
          type: "validate",
        },
      ],
    },
    {
      type: "Switch",
      scope: "procesosDesarrolloSeleccionados.Digitalización.selected",
      label: "Digitalización y Progresionado / Corrección Moldería",
      className: "mt-2",
      options: {
        labelPlacement: "end",
      },
      width: 12,
      rules: [
        {
          scope: "procesosDesarrolloSeleccionados.Diseño.selected",
          type: "validate",
        },
        {
          scope: "procesosDesarrolloSeleccionados.Molderia.selected",
          type: "validate",
        },
      ],
    },
    {
      type: "Switch",
      scope: "procesosDesarrolloSeleccionados.Geometral.selected",
      className: "mt-2",
      label: "Ficha Técnica (Geometral + Guía de Armado)",
      options: {
        labelPlacement: "end",
      },
      width: 12,
      rules: [
        {
          scope: "procesosDesarrolloSeleccionados.Diseño.selected",
          type: "validate",
        },
        {
          scope: "procesosDesarrolloSeleccionados.Molderia.selected",
          type: "validate",
        },
        {
          scope: "procesosDesarrolloSeleccionados.Digitalización.selected",
          type: "validate",
        },
      ],
    },
    {
      type: "Switch",
      scope: "procesosDesarrolloSeleccionados.Impresion.selected",
      className: "mt-2",
      label: "Impresión Moldería Base",
      options: {
        labelPlacement: "end",
      },
      width: 12,

      rules: [
        {
          scope: "procesosDesarrolloSeleccionados.Diseño.selected",
          type: "validate",
        },
        {
          scope: "procesosDesarrolloSeleccionados.Molderia.selected",
          type: "validate",
        },
        {
          scope: "procesosDesarrolloSeleccionados.Digitalización.selected",
          type: "validate",
        },
        {
          scope: "procesosDesarrolloSeleccionados.Geometral.selected",
          type: "validate",
        },
      ],
    },
    {
      type: "Switch",
      className: "mt-2",
      scope: "procesosDesarrolloSeleccionados.Materiales.selected",
      label: "Materiales",
      options: {
        labelPlacement: "end",
      },
      width: 12,
      rules: [
        {
          scope: "procesosDesarrolloSeleccionados.Diseño.selected",
          type: "validate",
        },
        {
          scope: "procesosDesarrolloSeleccionados.Molderia.selected",
          type: "validate",
        },
        {
          scope: "procesosDesarrolloSeleccionados.Digitalización.selected",
          type: "validate",
        },
        {
          scope: "procesosDesarrolloSeleccionados.Geometral.selected",
          type: "validate",
        },
        {
          scope: "procesosDesarrolloSeleccionados.Impresion.selected",
          type: "validate",
        },
      ],
    },
    {
      type: "Switch",
      className: "mt-2",
      scope: "procesosDesarrolloSeleccionados.Tizado.selected",
      label: "Tizado",
      options: {
        labelPlacement: "end",
      },
      width: 12,
      rules: [
        {
          scope: "procesosDesarrolloSeleccionados.Diseño.selected",
          type: "validate",
        },
        {
          scope: "procesosDesarrolloSeleccionados.Molderia.selected",
          type: "validate",
        },
        {
          scope: "procesosDesarrolloSeleccionados.Digitalización.selected",
          type: "validate",
        },
        {
          scope: "procesosDesarrolloSeleccionados.Geometral.selected",
          type: "validate",
        },
        {
          scope: "procesosDesarrolloSeleccionados.Impresion.selected",
          type: "validate",
        },
        {
          scope: "procesosDesarrolloSeleccionados.Materiales.selected",
          type: "validate",
        },
      ],
    },
    {
      type: "Switch",
      className: "mt-2",
      scope: "procesosDesarrolloSeleccionados.Corte.selected",
      label: "Corte Muestra",
      options: {
        labelPlacement: "end",
      },
      width: 12,
      rules: [
        {
          scope: "procesosDesarrolloSeleccionados.Diseño.selected",
          type: "validate",
        },
        {
          scope: "procesosDesarrolloSeleccionados.Molderia.selected",
          type: "validate",
        },
        {
          scope: "procesosDesarrolloSeleccionados.Digitalización.selected",
          type: "validate",
        },
        {
          scope: "procesosDesarrolloSeleccionados.Geometral.selected",
          type: "validate",
        },
        {
          scope: "procesosDesarrolloSeleccionados.Impresion.selected",
          type: "validate",
        },
        {
          scope: "procesosDesarrolloSeleccionados.Materiales.selected",
          type: "validate",
        },
        {
          scope: "procesosDesarrolloSeleccionados.Tizado.selected",
          type: "validate",
        },
      ],
    },
    {
      type: "Switch",
      className: "mt-2",
      scope: "procesosDesarrolloSeleccionados.Pre-confección.selected",
      label: "Pre-Confección",
      options: {
        labelPlacement: "end",
      },
      width: 12,
      rules: [
        {
          scope: "procesosDesarrolloSeleccionados.Corte.selected",
          type: "validate",
        },
      ],
    },
    {
      type: "Switch",
      className: "mt-2",
      scope: "procesosDesarrolloSeleccionados.Confección.selected",
      label: "Confección Muestra",
      options: {
        labelPlacement: "end",
      },
      width: 12,
      rules: [
        {
          scope: "procesosDesarrolloSeleccionados.Corte.selected",
          type: "validate",
        },
      ],
    },
    {
      type: "Switch",
      scope: "procesosDesarrolloSeleccionados.Terminado.selected",
      className: "mt-2",
      label: "Terminación (Ojal, Botón, Plancha, etc)",
      options: {
        labelPlacement: "end",
      },
      width: 12,
      rules: [
        {
          scope: "procesosDesarrolloSeleccionados.Corte.selected",
          type: "validate",
        },
      ],
    },
  ],
};

export const procesosDeDesarrolloLayout: LayoutElement<OrderCreationData> = {
  type: clothingProcessesLayout.type,
  elements: [
    clothingProcessesLayout.elements[0],
    clothingProcessesLayout.elements[1],
    clothingProcessesLayout.elements[2],
    clothingProcessesLayout.elements[3],
  ],
};

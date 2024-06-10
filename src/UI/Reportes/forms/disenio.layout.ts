import { LayoutElement } from "@UI/Forms/types";
import { ProcesoDisenioType } from "@backend/schemas/ProcesoDisenioSchema";

export const disenioLayout: LayoutElement<ProcesoDisenioType> = {
  type: "Horizontal",
  elements: [
    {
      type: "Horizontal",
      elements: [
        {
          type: "Input",
          scope: "comentario",
          label: "Comentario",
          className: "m-3",
          options: {
            multiline: 8,
          },
        },
      ],
    },
  ],
};

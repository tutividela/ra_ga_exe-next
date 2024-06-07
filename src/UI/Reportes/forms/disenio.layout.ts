import { LayoutElement } from "@UI/Forms/types";
import { ProcesoDisenioType } from "@backend/schemas/ProcesoDisenioSchema";

export const disenioLayout: LayoutElement<ProcesoDisenioType> = {
  type: "Vertical",
  elements: [
    {
      type: "Input",
      scope: "comentario",
      label: "Comentario",
    },
  ],
};

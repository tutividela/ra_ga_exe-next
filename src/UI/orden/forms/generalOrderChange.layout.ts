import { LayoutElement } from "@UI/Forms/types";

export const generalOrderChangelayout: LayoutElement<{
  prendaID: string;
  idEstado: string;
}> = {
  type: "Vertical",
  spacing: 4,
  elements: [
    {
      type: "Select",
      scope: "prendaID",
      label: "Complejidad",
      options: {
        optionsName: "states",
      },
    },
    {
      type: "Select",
      scope: "idEstado",
      label: "Estado",
      options: {
        optionsName: "estadosOrden",
      },
    },
  ],
};

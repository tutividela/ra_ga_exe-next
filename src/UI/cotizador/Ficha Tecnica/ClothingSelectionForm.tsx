import { OrderCreationData } from "@backend/schemas/OrderCreationSchema";
import { TipoPrenda } from "@prisma/client";
import { availableComplexities } from "@utils/queries/cotizador";
import { useEffect, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { useQuery } from "react-query";
import FormItem from "../../Forms/FormItem";
import { clothingSelectionLayout } from "./forms/clothingSelection.layout";
import { Alert } from "@mui/material";

interface ModelFormProps {
  clothesData: TipoPrenda[];
}

const ClothingSelectionForm = (props: ModelFormProps) => {
  const { clothesData } = props;
  const { setValue, watch } = useFormContext<OrderCreationData>();
  const tipoPrendaID = watch("tipoPrenda.id");
  const { data: complexitiesData } = useQuery(
    ["complexities", tipoPrendaID],
    () => (tipoPrendaID ? availableComplexities(tipoPrendaID) : []),
    { initialData: [], refetchOnWindowFocus: false }
  );
  const clothes = useMemo(
    () => clothesData?.map((el) => ({ key: el.name, text: el.name })) || [],
    [clothesData]
  );
  const complexities = useMemo(
    () =>
      complexitiesData?.map((el) => ({ key: el.name, text: el.name })) || [],
    [complexitiesData]
  );

  const currPrendaName = watch("tipoPrenda.name");
  const prendaSelected = useMemo(
    () => clothesData?.find((el) => el.name === currPrendaName),
    [currPrendaName, clothesData]
  );

  useEffect(() => {
    if (prendaSelected) {
      setValue("tipoPrenda.picture", prendaSelected.picture);
      setValue("tipoPrenda.id", prendaSelected.id);
    }
  }, [prendaSelected, setValue]);

  return (
    <div className="flex md:w-6/12 flex-col justify-center items-center mt-10 md:mt-0 ">
      <div className="mt-7 md:w-4/6">
        <div className="flex self-start mb-10">
          <Alert severity="info">
            Estime la complejidad a la hora de seleccionarla
          </Alert>
        </div>
        <FormItem
          layout={clothingSelectionLayout}
          selectOptions={{ clothesData: clothes, complexities }}
        />
      </div>
    </div>
  );
};

export default ClothingSelectionForm;

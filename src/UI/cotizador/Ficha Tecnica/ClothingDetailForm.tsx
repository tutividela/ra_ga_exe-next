import { OrderCreationData } from "@backend/schemas/OrderCreationSchema";
import { clothingDetailLayout } from "@UI/cotizador/Ficha Tecnica/forms/clothingDetail.layout";
import FormItem from "@UI/Forms/FormItem";
import { useEffect, useMemo } from "react";
import { useFormContext } from "react-hook-form";

const ClothingDetailForm = () => {
  const { watch, setValue } = useFormContext<OrderCreationData>();
  const selectedGenders = watch("atributosPrenda.genero.values");
  const observaciones = useMemo(
    () => selectedGenders?.map((el) => el.text)?.join(", ") || "",
    [selectedGenders]
  );

  useEffect(() => {
    setValue("atributosPrenda.genero.observaciones", observaciones);
  }, [observaciones, setValue]);

  return (
    <div className="flex md:w-6/12 flex-col justify-center items-baseline mt-10 md:mt-0">
      <FormItem
        layout={clothingDetailLayout}
        selectOptions={{
          cantidades: [
            { key: "desarrollo", text: "Sólo Desarrollo" },
            { key: "muestra", text: "Con Muestra" },
          ],
          generos: [
            { key: "bebe", text: "Bebés" },
            { key: "kids", text: "Niños y Niñas" },
            { key: "teen", text: "Adolescentes" },
            { key: "woman", text: "Mujer" },
            { key: "man", text: "Hombre" },
            { key: "unisex", text: "Unisex" },
            { key: "special", text: "Talles Especiales" },
            { key: "other", text: "Otro" },
          ],
        }}
      />
    </div>
  );
};

export default ClothingDetailForm;

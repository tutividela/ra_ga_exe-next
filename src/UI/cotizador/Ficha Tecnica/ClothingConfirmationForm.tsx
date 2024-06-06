import { OrderCreationData } from "@backend/schemas/OrderCreationSchema";
import { useFormContext } from "react-hook-form";

const ClothingConfirmationForm = () => {
  const { watch } = useFormContext<OrderCreationData>();
  const cotizadorData = watch();

  return (
    <div className="flex w-full md:w-6/12 flex-col justify-center items-center mt-10 md:mt-0 font-semibold">
      <div className="w-full md:w-2/4">
        <div>
          Cliente:{" "}
          {cotizadorData?.user?.name
            ? cotizadorData?.user?.name
            : "No esta logeado"}
        </div>
      </div>

      <div className="border-gray-300 border-2 w-full md:w-2/4 mt-3"></div>

      <div className="mt-3 w-full md:w-2/4">
        <div>
          Nombre del producto:{" "}
          {cotizadorData.nombreProducto ? cotizadorData.nombreProducto : ""}
        </div>
        <div>
          Tipo prenda:{" "}
          {cotizadorData.tipoPrenda
            ? cotizadorData.tipoPrenda.name
            : "No selecciono tipo prenda"}
        </div>
        <div>
          Complejidad:{" "}
          {cotizadorData.complejidad
            ? cotizadorData.complejidad
            : "No selecciono complejidad"}
        </div>
        <div>
          Material:{" "}
          {cotizadorData.atributosPrenda?.material?.observaciones
            ? cotizadorData.atributosPrenda.material.observaciones
            : "No anotó el material"}
        </div>
      </div>

      <div className="border-gray-300 border-2 w-full md:w-2/4 mt-3"></div>

      <div className="mt-3 w-full md:w-2/4">
        <div>
          {cotizadorData.orderFiles.files?.length > 0 ? "✔️" : "❌"} Archivos{" "}
          {cotizadorData.orderFiles?.files?.length > 0
            ? " - " +
              cotizadorData.orderFiles?.files?.length +
              " archivos seleccionados"
            : ""}
        </div>
        <div>
          Observaciones:{" "}
          {cotizadorData.orderFiles?.observaciones
            ? cotizadorData.orderFiles?.observaciones
            : " - "}
        </div>
      </div>

      <div className="border-gray-300 border-2 w-full md:w-2/4 mt-3"></div>

      <div className="mt-3 w-full md:w-2/4">
        <div>
          Genero:{" "}
          {cotizadorData.atributosPrenda?.genero?.observaciones
            ? cotizadorData.atributosPrenda.genero.observaciones
            : " - "}
        </div>
        <div>
          Cantidad: {cotizadorData.cantidad ? cotizadorData.cantidad : " - "}
        </div>
        <div>Talles: {cotizadorData.talles ? cotizadorData.talles : " - "}</div>
      </div>

      <div className="border-gray-300 border-2 w-full md:w-2/4 mt-3"></div>

      <div className="mt-3 w-full md:w-2/4">
        <div>
          {cotizadorData.procesosDesarrolloSeleccionados.Diseño?.selected
            ? "✔️ "
            : "❌ "}{" "}
          Diseño{" "}
        </div>
        <div>
          {cotizadorData.procesosDesarrolloSeleccionados.Molderia?.selected
            ? "✔️ "
            : "❌ "}{" "}
          Moldería Base{" "}
        </div>
        <div>
          {cotizadorData.procesosDesarrolloSeleccionados.Digitalización
            ?.selected
            ? "✔️ "
            : "❌ "}{" "}
          Digitalización y Progresiones{" "}
        </div>
        <div>
          {cotizadorData.procesosDesarrolloSeleccionados.Geometral?.selected
            ? "✔️ "
            : "❌ "}{" "}
          Ficha Técnica (Geometral + Guía de Armado){" "}
        </div>
        <div>
          {cotizadorData.procesosDesarrolloSeleccionados.Impresion.selected
            ? "✔️ "
            : "❌ "}{" "}
          Impresión Moldería Base{" "}
        </div>
        <div>
          {cotizadorData.procesosDesarrolloSeleccionados.Materiales?.selected
            ? "✔️ "
            : "❌ "}{" "}
          Materiales{" "}
        </div>
        <div>
          {cotizadorData.procesosDesarrolloSeleccionados.Corte.selected
            ? "✔️ "
            : "❌ "}{" "}
          Corte Muestra{" "}
        </div>
        <div>
          {cotizadorData.procesosDesarrolloSeleccionados["Pre-confección"]
            ?.selected
            ? "✔️ "
            : "❌ "}{" "}
          Pre-Confeccion{" "}
        </div>
        <div>
          {cotizadorData.procesosDesarrolloSeleccionados["Confección"]?.selected
            ? "✔️ "
            : "❌ "}{" "}
          Confección Muestra{" "}
        </div>
        <div>
          {cotizadorData.procesosDesarrolloSeleccionados.Tizado?.selected
            ? "✔️ "
            : "❌ "}{" "}
          Tizado{" "}
        </div>
        <div>
          {cotizadorData.procesosDesarrolloSeleccionados.Terminado?.selected
            ? "✔️ "
            : "❌ "}{" "}
          Terminación (Ojal, Botón, Plancha, etc){" "}
        </div>
        <div>
          {cotizadorData.cotización?.selected ? "✔️ " : "❌ "} Cotización{" "}
        </div>
      </div>

      <div className="border-gray-300 border-2 w-full md:w-2/4 mt-3"></div>
    </div>
  );
};

export default ClothingConfirmationForm;

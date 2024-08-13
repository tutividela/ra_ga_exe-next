import { ExtendedOrdenData } from "@utils/Examples/ExtendedOrdenData";
import { useMemo } from "react";
import OrderProcessContentGeneral from "./OrderProcessContentGeneral";
import OrderProcessContentService from "./OrderProcessContentService";

type Props = {
  orderData: ExtendedOrdenData;
  ordenFrenada: boolean;
  selectedProcess: string;
  rol: string;
};

const OrderProcessContent = ({
  orderData,
  selectedProcess,
  rol,
  ordenFrenada,
}: Props) => {
  const currProcess = useMemo(() => {
    const procesosABuscar =
      orderData.idEstado === 3
        ? orderData.procesosProductivos
        : orderData.procesos;

    return procesosABuscar.find((el) => el.id === selectedProcess);
  }, [selectedProcess, orderData]);

  return (
    <>
      <div className="text-4xl mb-20">
        {selectedProcess !== "general"
          ? `Ficha de proceso de ${currProcess?.proceso || "N/A"}`
          : "Detalles de la orden"}
      </div>
      {selectedProcess === "general" && (
        <OrderProcessContentGeneral
          orderData={orderData}
          selectedProcess={selectedProcess}
          rol={rol}
        />
      )}
      {selectedProcess !== "general" && !ordenFrenada && (
        <OrderProcessContentService
          orderData={orderData}
          selectedProcess={selectedProcess}
          rol={rol}
        />
      )}
    </>
  );
};

export default OrderProcessContent;

import { ExtendedOrdenData } from "@utils/Examples/ExtendedOrdenData";
import React from "react";

type Props = {
  orderData: ExtendedOrdenData;
};

const OrderHeader = ({ orderData }: Props) => {
  return (
    <div className="flex flex-col md:flex-row justify-between p-4 text-gray-800">
      <div className="flex flex-col items-start justify-between p-4 w-full md:w-1/3 mx-2 space-y-2">
        <div className="flex flex-col items-start">
          <div className="font-bold text-lg">
            <p>Marca</p>
          </div>
          <div className="text-sm">
            <span>{orderData.user.name}</span>
          </div>
        </div>
        <div className="flex flex-col items-start">
          <div className="font-bold text-lg">
            <p>Contacto</p>
          </div>
          <div className="text-sm">
            <span>{orderData.user.email}</span>
          </div>
        </div>
        <div className="flex flex-col items-start">
          <div className="font-bold text-lg">
            <p>Nombre del producto</p>
          </div>
          <div className="text-sm">
            <span>{orderData.nombre}</span>
          </div>
        </div>
        <div className="flex flex-col items-start">
          <div className="font-bold text-lg">
            <p>Tipo de pedido</p>
          </div>
          <div className="text-sm">
            <span>
              {orderData.cantidad === 0 ? "Solo Desarrollo" : "Con Muestra"}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-start">
          <div className="font-bold text-lg">
            <p>Precio estimado</p>
          </div>
          <div className="text-sm">
            {
              <span>
                {orderData.idEstado === 3
                  ? orderData.ordenProductiva.precioEstimado.toFixed(2)
                  : orderData.cotizacionOrden[0].precio.toFixed(2)}{" "}
                $
              </span>
            }
          </div>
        </div>
        {orderData.idEstado === 3 && (
          <div className="flex flex-col items-start">
            <div className="font-bold text-lg">
              <p>Cantidad pedida</p>
            </div>
            <div className="text-sm">
              {
                <span>
                  {orderData.ordenProductiva.cantidad} {"unidade(s)"}
                </span>
              }
            </div>
          </div>
        )}
      </div>
      <div className="hidden md:flex flex-col items-center p-4  md:w-1/3  mx-2 text-4xl"></div>
      <div className="flex flex-col items-start md:items-end p-4  w-full md:w-1/3  mx-2 space-y-2">
        <div className="flex flex-col items-start md:items-end">
          <div className="font-bold text-lg">
            <p>Código de producto</p>
          </div>
          <div className="text-sm">
            <span>{orderData.id}</span>
          </div>
        </div>
        <div className="flex flex-col items-start md:items-end">
          <div className="font-bold text-lg">
            <p>Categoría</p>
          </div>
          <div className="text-sm">
            <span>{orderData.prenda.tipo.name}</span>
          </div>
        </div>
        <div className="flex flex-col items-start md:items-end">
          <div className="font-bold text-lg">
            <p>Complejidad</p>
          </div>
          <div className="text-sm">
            <span>{orderData.prenda.complejidad.name}</span>
          </div>
        </div>
        <div className="flex flex-col items-start md:items-end">
          <div className="font-bold text-lg">
            <p>Género/s</p>
          </div>
          <div className="text-sm capitalize">
            <span>
              {orderData.detallesPrenda.atributos.find(
                (el) => el.name === "genero"
              ).observacion || ""}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-start md:items-end">
          <div className="font-bold text-lg">
            <p>Estado</p>
          </div>
          <div className="text-sm capitalize">
            <span>{orderData.estado.nombre}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHeader;

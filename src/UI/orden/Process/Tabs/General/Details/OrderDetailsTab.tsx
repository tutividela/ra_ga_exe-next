import { ExtendedOrdenData } from "@utils/Examples/ExtendedOrdenData";

type Props = {
  orderData: ExtendedOrdenData;
  ordenFinalizada: boolean;
  precioDesarrolloTotal: number;
};

const OrderDetailsTab = ({
  orderData,
  ordenFinalizada,
  precioDesarrolloTotal,
}: Props) => {
  return (
    <>
      <div className="flex flex-col mt-4">
        <div className="text-gray-700 text-xl font-semibold">
          Atributos seleccionados
        </div>
        <div className="flex flex-col">
          {orderData?.detallesPrenda?.atributos.map((el) => (
            <div key={el.id} className="p-2 flex flex-col">
              <div className="capitalize text-gray-700">- {el.name}</div>
              {el.observacion && (
                <div className="text-xs  flex flex-row">
                  <div></div>
                  <div className="mx-1">{el.observacion}</div>
                </div>
              )}

              {el.cantidad > 0 && (
                <div className="text-xs  flex flex-row">
                  <div>Cantidad: </div>
                  <div className="mx-1">{el.cantidad}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {ordenFinalizada && (
        <div className="flex flex-col mt-4">
          <div className="text-gray-700 text-xl font-semibold">
            Precio Total de desarrollo
          </div>
          <div className="capitalize text-gray-700">
            {precioDesarrolloTotal.toFixed(2)} $
          </div>
        </div>
      )}
    </>
  );
};

export default OrderDetailsTab;

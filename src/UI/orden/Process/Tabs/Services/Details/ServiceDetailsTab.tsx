import { ProcessStateTextColors } from "@UI/orden/SelectableOrderProcessItem";
import { ExtendedOrdenData } from "@utils/Examples/ExtendedOrdenData";
import { adminRole, ayudanteRole } from "@utils/roles/SiteRoles";
import { useGetRole } from "@utils/roles/useGetRole";
import { useSession } from "next-auth/react";
import { useMemo } from "react";

type Props = {
  orderData: ExtendedOrdenData;
  idEstadoOrdenAPrevisualizar?: number;
  selectedProcess: string;
};

const DetailsListElement = ({
  title,
  value,
}: {
  title: string;
  value: string | number | string[] | number[];
}) => {
  const textColor = ProcessStateTextColors(value?.toString());

  if (Array.isArray(value)) {
    if (value.length === 0)
      return (
        <div className="flex flex-row items-center space-x-2">
          <div className="text-lg">
            - <span className="underline">{title}:</span>{" "}
            <span className={`${textColor} text-sm`}>Sin asignar</span>
          </div>
        </div>
      );
    return (
      <div className="flex flex-row items-center space-x-2">
        <div className="text-lg">
          - <span className="underline">{title}:</span>{" "}
          <span className={`${textColor} text-sm`}>
            {value.sort().join(", ")}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-row items-center space-x-2">
      <div className="text-lg">
        - <span className="underline">{title}:</span>{" "}
        <span className={`${textColor} text-sm`}>{value}</span>
      </div>
    </div>
  );
};
const ServiceDetailsTab = ({
  orderData,
  idEstadoOrdenAPrevisualizar,
  selectedProcess,
}: Props) => {
  const { data } = useSession();
  const { role } = useGetRole(data?.user?.email);

  const currProcess = useMemo(() => {
    if (idEstadoOrdenAPrevisualizar !== 0) {
      const procesosABuscar =
        idEstadoOrdenAPrevisualizar === 3
          ? orderData.procesosProductivos
          : orderData.procesos;
      return procesosABuscar.find((el) => el.id === selectedProcess);
    }
    const procesosABuscar =
      orderData?.idEstado === 3
        ? orderData.procesosProductivos
        : orderData.procesos;
    return procesosABuscar.find((el) => el.id === selectedProcess);
  }, [selectedProcess, orderData, idEstadoOrdenAPrevisualizar]);

  const elProcesoTieneUnCosto = [1, 2, 3, 5, 8, 9, 10, 11, 12].includes(
    currProcess?.idProceso
  );

  const ultimaActualizacion =
    new Date(currProcess?.lastUpdated).toLocaleDateString("es-AR") +
    " " +
    new Date(currProcess?.lastUpdated).toLocaleTimeString();

  const recursos = currProcess?.recursos.map((el) => el.text);

  return (
    <div className="flex flex-col mt-4">
      <div className="text-gray-700 text-xl font-semibold">
        {currProcess?.proceso}
      </div>
      <div className="flex flex-col space-y-2 mt-2">
        <DetailsListElement title="Estado" value={currProcess?.estado} />
        <DetailsListElement
          title="Última modificación"
          value={ultimaActualizacion}
        />
        {currProcess?.idEstado === 6 && elProcesoTieneUnCosto && (
          <DetailsListElement
            title="Precio Actualizado"
            value={`${currProcess.precioActualizado.toFixed(2)} $`}
          />
        )}
        {[adminRole, ayudanteRole].includes(role) && (
          <DetailsListElement title="Recursos Asignados" value={recursos} />
        )}
      </div>
    </div>
  );
};

export default ServiceDetailsTab;

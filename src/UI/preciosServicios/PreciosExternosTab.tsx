import { IconButton } from "@mui/material";
import { DataGrid, GridColumns } from "@mui/x-data-grid";
import { ErrorHandlerContext } from "@utils/ErrorHandler/error";
import { obtenerServiciosExternosPor } from "@utils/queries/procesos/procesos";
import { useSession } from "next-auth/react";
import { useContext, useState } from "react";
import { useIsMutating, useQuery } from "react-query";
import EditIcon from "@mui/icons-material/Edit";
import LoadingIndicator from "@utils/LoadingIndicator/LoadingIndicator";
import { EditarServicioExternoDialog } from "./EditarServicioExternoDialog";

type Props = {
  email: string;
};

export function PreciosExternosTab({ email }: Props) {
  const isMutating = !!useIsMutating();
  const { addError } = useContext(ErrorHandlerContext);
  const [seEditaPrecioExterno, setSeEditaPrecioExterno] =
    useState<boolean>(false);
  const [idServicioExternoAEditar, setIdServicioExternoAEditar] =
    useState<string>("");

  const {
    data: serviciosExternos,
    isLoading: seEstaBuscandoServiciosExternos,
  } = useQuery(
    ["servicios-externos"],
    () => obtenerServiciosExternosPor(email),
    {
      onError: () => addError("Error al traer los servicios externos"),
    }
  );
  const EditButton = (id: string) => (
    <IconButton
      type="button"
      onClick={() => {
        setIdServicioExternoAEditar(id);
        setSeEditaPrecioExterno(true);
      }}
    >
      <EditIcon color="primary" />
    </IconButton>
  );

  const columns: GridColumns = [
    {
      field: "servicio",
      headerName: "Servcicio",
      minWidth: 150,
      headerAlign: "center",
      flex: 2,
    },
    {
      field: "factorMultiplicador",
      headerName: "Factor Multiplicador",
      minWidth: 150,
      headerAlign: "center",
      flex: 2,
    },
    {
      field: " ",
      headerName: "Acciones",
      align: "right",
      headerAlign: "center",
      sortable: false,
      minWidth: 150,
      flex: 1,
      renderCell: (params) => EditButton(params.row.id),
    },
  ];

  const defaultLayout = {
    id: idServicioExternoAEditar,
    factorMultiplicador: 0,
  };
  return (
    <LoadingIndicator
      show={seEstaBuscandoServiciosExternos || isMutating}
      variant="blocking"
    >
      <EditarServicioExternoDialog
        open={seEditaPrecioExterno}
        onClose={() => setSeEditaPrecioExterno(false)}
        defaultLayout={defaultLayout}
      />
      <div style={{ height: 510, width: "100%" }}>
        <DataGrid
          rows={
            serviciosExternos?.map((servicioExterno) => ({
              id: servicioExterno.id,
              servicio: servicioExterno.servicio.name,
              factorMultiplicador: servicioExterno.factorMultiplicador,
            })) || []
          }
          columns={columns || []}
          pageSize={7}
        />
      </div>
    </LoadingIndicator>
  );
}

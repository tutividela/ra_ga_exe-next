import { obtainRole } from "@backend/dbcalls/user";
import { Button, Slide } from "@mui/material";
import { DataGrid, GridColumns } from "@mui/x-data-grid";
import HeaderBar from "@UI/Generic/HeaderBar";
import PageTitle from "@UI/Generic/Utils/PageTitle";
import { DialogReporteDeProcesos } from "@UI/Reportes/DialogReporteDeProcesos";
import { DialogReporteDeTiempos } from "@UI/Reportes/DialogReporteDeTiempos";
import { ErrorHandlerContext } from "@utils/ErrorHandler/error";
import LoadingIndicator from "@utils/LoadingIndicator/LoadingIndicator";
import { buscarTodasLasOrdenes } from "@utils/queries/order";
import { adminRole } from "@utils/roles/SiteRoles";
import { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";
import { useContext, useMemo, useState } from "react";
import { useQuery } from "react-query";

const Home: NextPage = () => {
  const { addError } = useContext(ErrorHandlerContext);
  const [abrirReporteTiempo, setAbrirReporteTiempo] = useState<boolean>(false);
  const [abrirReportesProcesos, setAbrirReportesProcesos] =
    useState<boolean>(false);
  const [idOrden, setIdOrden] = useState<string>("");
  const { data: ordenes, isFetching: seEstanBuscandoLasOrdenes } = useQuery(
    ["ordenes-reportes-estadisticas"],
    () => buscarTodasLasOrdenes(),
    {
      onError: () => addError("Error al traer ordenes"),
      initialData: [],
      refetchOnWindowFocus: false,
    }
  );

  const rows = ordenes.map((orden) => ({
    nombre: orden.nombre,
    id: orden.id,
    createdAt: orden.createdAt,
    user: orden.user,
    estado: orden.estado,
    //acciones: orden.id
  }));

  const columns = useMemo(
    (): GridColumns => [
      {
        field: "nombre",
        headerName: "Nombre",
        flex: 1,
        maxWidth: 250,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "id",
        headerName: "Orden",
        flex: 1,
        maxWidth: 200,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "createdAt",
        headerName: "Fecha",
        flex: 1,
        maxWidth: 95,
        align: "center",
        headerAlign: "center",
        valueFormatter: (params) => params.value.slice(0, 10),
      },
      {
        field: "user",
        headerName: "Creador",
        flex: 1,
        maxWidth: 120,
        align: "center",
        headerAlign: "center",
        valueGetter: (params) => params.row.user.name,
      },
      {
        field: "estado",
        headerName: "Estado",
        flex: 1,
        maxWidth: 150,
        align: "center",
        headerAlign: "center",
        valueGetter: (params) => params.row.estado.nombre,
      },
      {
        field: "",
        headerName: "Reportes",
        headerAlign: "center",
        flex: 1,
        renderCell: (params) => (
          <div className="flex flex-row w-full justify-evenly">
            <Button
              variant="contained"
              className="bg-sky-800 text-white rounded-lg"
              onClick={() => {
                setIdOrden(params.row.id);
                setAbrirReporteTiempo(true);
              }}
            >
              Tiempos
            </Button>
            <Button
              variant="contained"
              className="bg-sky-800 text-white rounded-lg"
              onClick={() => {
                setIdOrden(params.row.id);
                setAbrirReportesProcesos(true);
              }}
            >
              Procesos
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  const mobileColumns = useMemo(
    (): GridColumns => [
      {
        field: "id",
        headerName: "Orden",
        flex: 1,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "",
        flex: 3,
        headerName: "Reportes",
        renderCell: () => (
          <div className="flex flex-row w-full justify-evenly">
            <Button
              variant="contained"
              className="bg-sky-800 text-white rounded-lg"
            >
              Tiempos
            </Button>
            <Button
              variant="contained"
              className="bg-sky-800 text-white rounded-lg"
            >
              Procesos
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="bg-split-white-black">
      <Head>
        <title>HS-Taller</title>
        <meta
          name="description"
          content="Ramiro Onate, Gaspar Garcia, Exequiel videla"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <HeaderBar />
      <main>
        <Slide in={true} timeout={500} direction="up">
          <div className="container mx-auto flex flex-col min-h-[80vh] md:min-h-screen p-4 bg-white mt-20 rounded-none md:rounded-3xl shadow-2xl">
            <PageTitle title="Reportes y Estadistícas" hasBack />
            <LoadingIndicator show={seEstanBuscandoLasOrdenes}>
              <div className="hidden lg:flex flex-col">
                <div style={{ height: 510, width: "100%", paddingTop: 30 }}>
                  <DataGrid
                    rows={rows}
                    columns={columns}
                    autoPageSize
                    disableSelectionOnClick
                    disableColumnSelector
                  />
                </div>
              </div>
              <div className="lg:hidden w-full flex-col">
                <div style={{ height: 510, width: "100%", paddingTop: 30 }}>
                  <DataGrid
                    rows={rows}
                    columns={mobileColumns}
                    autoPageSize
                    disableSelectionOnClick
                    disableColumnSelector
                  />
                </div>
              </div>
            </LoadingIndicator>
            {abrirReporteTiempo && (
              <DialogReporteDeTiempos
                open={abrirReporteTiempo}
                onClose={() => setAbrirReporteTiempo(false)}
                idOrden={idOrden}
              />
            )}
            {abrirReportesProcesos && (
              <DialogReporteDeProcesos
                open={abrirReportesProcesos}
                onClose={() => setAbrirReportesProcesos(false)}
                idOrden={idOrden}
              />
            )}
          </div>
        </Slide>
      </main>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });

  const getUserRole = await obtainRole(session?.user?.email || "");

  if (!session || getUserRole?.role?.name !== adminRole) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return { props: { session } };
};

export default Home;

import { verifyUserOrder } from "@backend/dbcalls/order";
import { obtainRole } from "@backend/dbcalls/user";
import { Button, Slide } from "@mui/material";
import { Session } from "@prisma/client";
import Footer from "@UI/Generic/Footer";
import HeaderBar from "@UI/Generic/HeaderBar";
import PageTitle from "@UI/Generic/Utils/PageTitle";
import { GenerarOrdenProductivaDialog } from "@UI/orden/GenerarOrdenProductivaDialog";
import OrderHeader from "@UI/orden/OrderHeader";
import OrderProcessSidebar from "@UI/orden/OrderProcessSidebar";
import OrderProcessContent from "@UI/orden/Process/OrderProcessContent";
import { ErrorHandlerContext } from "@utils/ErrorHandler/error";
import ErrorAlerter from "@utils/ErrorHandler/ErrorAlerter";
import { ExtendedOrdenData } from "@utils/Examples/ExtendedOrdenData";
import LoadingIndicator from "@utils/LoadingIndicator/LoadingIndicator";
import OrderViewProvider from "@utils/Order/OrderViewContext";
import { errorHandle } from "@utils/queries/cotizador";
import { adminRole, ayudanteRole, clienteRole } from "@utils/roles/SiteRoles";
import type { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import UpgradeIcon from "@mui/icons-material/Upgrade";
import { generarMensajePorEstado } from "@utils/Order/generarMensajePorEstado";
import HookForm from "@UI/Forms/HookForm";
import { ProcesosPorEtapaDropdown } from "@UI/orden/ProcesosPorEtapaDropdown";

const Home: NextPage<{ session: Session; role: string }> = ({ role }) => {
  const { addError } = useContext(ErrorHandlerContext);
  const [seGeneraOrenProductiva, setSeGeneraOrdenProductiva] =
    useState<boolean>(false);
  const { query } = useRouter();
  const { orderId: id } = query;

  const estadosDeOrden = [
    {
      label: "Estado actual",
      id: 0,
    },
    {
      label: "Diseño/Desarrollo",
      id: 9,
    },
    {
      label: "Produccion",
      id: 3,
    },
  ];

  const fetchOrder = (): Promise<ExtendedOrdenData> =>
    fetch(`/api/order/obtain`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({ orderId: id }),
    })
      .then((res) => (res.ok ? res.json() : errorHandle(res)))
      .catch((error) => {
        throw error;
      });

  const {
    data: orderData,
    isFetching: isFetchingOrders,
    isRefetching: seEstaActualizandoLaOrden,
  } = useQuery(["order"], fetchOrder, {
    onError: () => addError("Error al traer orden"),
    refetchOnWindowFocus: false,
  });

  const laOrdenEstaFrenada = useMemo(() => {
    return [1, 2, 6, 7, 8].includes(orderData?.idEstado) || false;
  }, [orderData?.idEstado, orderData?.estado]);

  const laOrdenDeDesarrolloFueFinalizada = useMemo(
    () =>
      orderData?.cantidad === 1 &&
      orderData?.procesos
        .filter((proceso) => proceso.idEstado !== 3)
        .every((proceso) => proceso.idEstado === 6),
    [orderData?.procesos]
  );

  const sePuedePrevisualizarLosProcesosDesarrollo =
    (orderData?.idEstado === 3 && [adminRole].includes(role)) || false;

  const elUsuarioNoEsPrestador = [
    adminRole,
    clienteRole,
    ayudanteRole,
  ].includes(role);

  const [selectedProcess, setSelectedProcess] = useState("general");
  const [valor, setValor] = useState<string>(estadosDeOrden[0].label);
  const idValor = useMemo(
    () => estadosDeOrden.find((estado) => estado.label === valor)?.id,
    [valor]
  );
  const handleSelectProcess = (processID: string) => {
    setSelectedProcess(processID);
  };

  useEffect(() => setSelectedProcess("general"), [valor]);

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
          <div>
            <ErrorAlerter />
            <div className="container mx-auto flex flex-col min-h-[80vh] md:min-h-screen p-4 bg-white mt-20 rounded-none md:rounded-3xl shadow-2xl">
              <PageTitle title={"Detalles de orden"} hasBack size="medium" />
              <LoadingIndicator
                show={isFetchingOrders || seEstaActualizandoLaOrden}
              >
                {orderData?.id && (
                  <OrderViewProvider orderData={orderData}>
                    <OrderHeader orderData={orderData} />
                    <div className="flex md:flex-row flex-col">
                      <div className="ml-4 pl-4 mt-3">
                        {sePuedePrevisualizarLosProcesosDesarrollo && (
                          <HookForm defaultValues={{ etapa: estadosDeOrden[0].label }} onSubmit={() => console.log("submit")}>
                            <ProcesosPorEtapaDropdown
                              onHandleCambioEtapa={(etapa: string) => setValor(etapa)}
                              etapas={estadosDeOrden.map((estado) => ({ key: estado.label, text: estado.label }))}
                            />
                          </HookForm>
                        )}
                      </div>
                      {laOrdenDeDesarrolloFueFinalizada &&
                        !laOrdenEstaFrenada &&
                        elUsuarioNoEsPrestador && (
                          <div className="ml-4 pl-4 mt-3">
                            <Button
                              variant="outlined"
                              onClick={() => setSeGeneraOrdenProductiva(true)}
                              disabled={orderData?.idEstado === 3}
                              endIcon={<UpgradeIcon />}
                            >
                              Pedir una produccion
                            </Button>
                          </div>
                        )}
                    </div>
                    {seGeneraOrenProductiva && (
                      <GenerarOrdenProductivaDialog
                        idOrden={orderData.id}
                        usuarioCreadorOrden={{
                          nombre: orderData.user.name,
                          email: orderData.user.email,
                        }}
                        precioPrendaBase={orderData.prenda.precioBase}
                        onClose={() => setSeGeneraOrdenProductiva(false)}
                        open={seGeneraOrenProductiva}
                      />
                    )}
                    {laOrdenEstaFrenada && (
                      <div className="flex flex-row justify-center text-2xl mb-20">
                        {generarMensajePorEstado(orderData?.idEstado)}
                      </div>
                    )}
                    <div className="m-6 p-4 border-2 min-h-screen flex flex-row">
                      <div className="w-full md:w-1/3">
                        <OrderProcessSidebar
                          orderData={orderData}
                          idEstadoOrdenAPrevisualizar={idValor}
                          ordenFrenada={laOrdenEstaFrenada}
                          onSelect={handleSelectProcess}
                          role={role}
                          selectedProcess={selectedProcess}
                        />
                      </div>
                      <div className="hidden md:w-2/3 m-6 p-4 md:flex flex-col items-center ">
                        <OrderProcessContent
                          orderData={orderData}
                          idEstadoOrdenAPrevisualizar={idValor}
                          ordenFrenada={laOrdenEstaFrenada}
                          selectedProcess={selectedProcess}
                          rol={role}
                        />
                      </div>
                    </div>
                  </OrderViewProvider>
                )}
              </LoadingIndicator>
            </div>
          </div>
        </Slide>
      </main>
      <Footer />
    </div>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  const correctOrder = await verifyUserOrder(
    context.query.orderId,
    session.user.email
  );
  const { role } = await obtainRole(session?.user?.email || "");

  if (!correctOrder) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return { props: { session, role: role.name } };
};

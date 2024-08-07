import { obtainRole } from "@backend/dbcalls/user";
import { Slide, Tab, Tabs } from "@mui/material";
import HeaderBar from "@UI/Generic/HeaderBar";
import BasePricesTab from "@UI/preciosBase/BasePricesTab";
import NewClothesTab from "@UI/preciosBase/NewClothesTab";
import { adminRole, prestadorDeServiciosRole } from "@utils/roles/SiteRoles";
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";
import React from "react";
import Footer from "../UI/Generic/Footer";
import PageTitle from "../UI/Generic/Utils/PageTitle";
import ErrorAlerter from "../utils/ErrorHandler/ErrorAlerter";
import ServicesPricesTab from "@UI/preciosBase/ServicesPrices";
import { PreciosExternosTab } from "@UI/preciosServicios/PreciosExternosTab";

const Home: NextPage = ({
  role,
  session,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [value, setValue] = React.useState(0);
  const a11yProps = (index: number) => ({
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  });

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

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
              <PageTitle title="Precios base" hasBack />

              <div className="flex items-center justify-center">
                <div className="w-full md:w-10/12 mt-8 border-2 shadow-2xl">
                  <div className="border-b-2">
                    {adminRole === role?.name && (
                      <Tabs
                        orientation="horizontal"
                        variant="fullWidth"
                        value={value}
                        onChange={handleChange}
                        aria-label="Vertical tabs example"
                        sx={{ borderRight: 1, borderColor: "divider" }}
                      >
                        <Tab
                          label="Prendas"
                          style={{ fontSize: 12 }}
                          {...a11yProps(0)}
                        />
                        <Tab
                          label="Precios Servicios"
                          style={{ fontSize: 12 }}
                          {...a11yProps(1)}
                        />
                        <Tab
                          label="Precios Base"
                          style={{ fontSize: 12 }}
                          {...a11yProps(2)}
                        />
                      </Tabs>
                    )}
                    {prestadorDeServiciosRole === role?.name && (
                      <Tabs
                        orientation="horizontal"
                        variant="fullWidth"
                        value={value}
                        onChange={handleChange}
                        aria-label="Vertical tabs example"
                        sx={{ borderRight: 1, borderColor: "divider" }}
                      >
                        <Tab
                          label="Precios Base"
                          style={{ fontSize: 12 }}
                          {...a11yProps(0)}
                        />
                      </Tabs>
                    )}
                  </div>
                  <div className="m-auto flex justify-center items-center">
                    {adminRole === role?.name && (
                      <>
                        <div hidden={value !== 0} className="w-full mb-10">
                          <NewClothesTab />
                        </div>
                        <div hidden={value !== 1} className="w-full mb-10">
                          <ServicesPricesTab />
                        </div>
                        <div hidden={value !== 2} className="w-full mb-10">
                          <BasePricesTab />
                        </div>
                      </>
                    )}
                    {prestadorDeServiciosRole === role?.name && (
                      <div hidden={value !== 0} className="w-full mb-10">
                        <PreciosExternosTab email={session?.user?.email} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
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
  const getUserRole = await obtainRole(session?.user?.email || "");
  if (
    !session ||
    ![adminRole, prestadorDeServiciosRole].includes(getUserRole.role.name)
  ) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return { props: { session: session, role: getUserRole.role } };
};

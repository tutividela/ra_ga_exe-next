import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import Signin from "./Signin/Signin";
import Signup from "./Signup/Signup";

const HeaderBar = () => {
  const { data, status } = useSession({ required: false });
  const [openSignUp, setOpenSignUp] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);

  const { pathname } = useRouter();

  const handleCloseSignIn = () => {
    setOpenSignIn(false);
  };

  const handleCloseSignUp = () => {
    setOpenSignUp(false);
  };

  const handleOpenSignIn = () => {
    handleCloseSignUp();
    setOpenSignIn(true);
  };

  const handleOpenSignUp = () => {
    handleCloseSignIn();
    setOpenSignUp(true);
  };

  return (
    <div className="flex justify-center md:justify-between items-center w-full h-14 transition-all duration-200 bg-zinc-800 text-white px-2 md:px-10 py-4">
      <div className="hidden md:flex md:flex-row">
        <Link href={"/"}>
          <div className="text-xl font-sans">HS - Soluciones Textiles</div>
        </Link>
      </div>
      <div className="md:hidden" />
      <div>
        {status !== "authenticated" && (
          <div className="text-xs md:text-base flex flex-row">
            <div className="flex flex-row">
              <button
                onClick={handleOpenSignIn}
                className="text-white underline"
              >
                Iniciar Sesión
              </button>
            </div>
            <div className="border-l-2 border-opacity-50 border-slate-700 pl-2 ml-2">
              <button
                className="text-white underline"
                onClick={handleOpenSignUp}
              >
                Registrarse
              </button>
            </div>
          </div>
        )}
        {status === "authenticated" && (
          <div className="flex flex-row items-center text-xs md:text-base">
            {data.user?.image && (
              <div className="flex">
                <Image
                  src={data.user?.image || ""}
                  width={32}
                  height={32}
                  className="rounded-full"
                  alt=""
                ></Image>
              </div>
            )}
            <div className="ml-2 mr-5">
              <div className="font-bold">
                {pathname !== "/" && <Link href={"/"}>{data.user?.name}</Link>}
                {pathname === "/" && <div>{data.user?.name}</div>}
              </div>
            </div>
            <div className="border-l-2 border-opacity-25 border-slate-400">
              <button
                className="ml-5 px-2 py-1 underline"
                onClick={() => signOut()}
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        )}
      </div>
      {openSignUp && (
        <Signup
          open={openSignUp}
          onClose={handleCloseSignUp}
          onSignin={handleOpenSignIn}
          adminCreation={false}
        />
      )}
      {openSignIn && <Signin open={openSignIn} onClose={handleCloseSignIn} />}
    </div>
  );
};

export default HeaderBar;

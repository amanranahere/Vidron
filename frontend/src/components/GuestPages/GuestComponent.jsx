import React, { useRef } from "react";
import { IoIosLogIn } from "react-icons/io";
import LoginPopup from "../Auth/LoginPopup.jsx";

function GuestComponent({
  icon,
  title = "Sign in to view this page",
  subtitle = "",
  route,
  guest = true,
}) {
  const LoginPopupDialog = useRef();

  return (
    <section className="w-full flex justify-center pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
      <div className="flex relative top-20 justify-center p-4">
        <div className="w-full max-w-fit text-center">
          <p className="mb-3 w-full">
            <span className="inline-flex w-36 h-36 rounded-full bg-[#3a3a3a] p-2">
              {icon}
            </span>
          </p>

          <h5 className="mt-6 mb-2 text-2xl font-semibold">{title}</h5>

          <p className="text-gray-200">{subtitle}</p>

          {guest && (
            <div className="flex justify-center items-center mt-4">
              <LoginPopup ref={LoginPopupDialog} route={route || ""} />

              <button
                onClick={() => LoginPopupDialog.current.open()}
                className="max-w-max cursor-pointer hover:bg-gray-600 active:bg-gray-700 mr-1 md:mr-2 lg:px-4 lg:py-2 rounded-full border border-solid border-[#6a6a6a] text-gray-200 font-bold flex"
              >
                <IoIosLogIn className="w-7 h-7 mr-2" />
                Login
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default GuestComponent;

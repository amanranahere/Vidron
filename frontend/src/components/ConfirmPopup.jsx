import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { IoClose } from "react-icons/io5";
import Button from "./Button.jsx";

function ConfirmPopup(
  {
    title = "Are you sure?",
    subtitle,
    message,
    confirm = "Confirm",
    cancel = "Cancel",
    critical = "false",
    checkbox = false,
    actionFunction,
  },
  ref
) {
  const dialog = useRef();
  const [isChecked, setIsChecked] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useImperativeHandle(ref, () => {
    return {
      open() {
        setShowPopup(true);
      },
      close() {
        dialog.current?.close();
      },
    };
  });

  useEffect(() => {
    if (showPopup) {
      dialog.current.showModal();
    }
  }, [showPopup]);

  const handleClose = () => {
    dialog.current.close();
    setShowPopup(false);
    actionFunction(false);
  };

  const handleConfirm = (event) => {
    event.preventDefault();
    dialog.current.close();
    actionFunction(true);
  };

  // const handleOutsideClick = (e) => {
  //   console.log("Outside click detected:", e.target);
  //   if (dialog.current && !dialog.current.contains(e.target)) {
  //     handleClose();
  //   }
  // };

  // useEffect(() => {
  //   if (showPopup) {
  //     document.addEventListener("click", handleOutsideClick);
  //   } else {
  //     document.removeEventListener("click", handleOutsideClick);
  //   }
  // }, [showPopup]);

  return (
    <div className="absolute flex justify-center items-center">
      {showPopup &&
        createPortal(
          <dialog
            ref={dialog}
            onClose={handleClose}
            className="backdrop:backdrop-blur-sm rounded-[20px]"
          >
            <div className="relative max-h-max">
              <div className=" ">
                <form
                  onSubmit={handleConfirm}
                  className="overflow-auto rounded-[20px] text-white bg-[#1a1a1a] p-4"
                >
                  <div className="flex flex-col items-center text-center justify-center">
                    <h6 className="text-3xl font-semibold mb-6 select-none">
                      {title}
                    </h6>

                    {subtitle && (
                      <span className=" text-xl text-gray-100">{subtitle}</span>
                    )}

                    {message && (
                      <span className="text-gray-300 mt-4">{message}</span>
                    )}
                  </div>

                  {checkbox && (
                    <div className="flex justify-center items-center my-5">
                      <input
                        type="checkbox"
                        id={"confirm-checkbox"}
                        defaultChecked={false}
                        className="size-4 mr-2"
                        onChange={(e) => setIsChecked(e.target.checked)}
                      />

                      <label
                        htmlFor={"confirm-checkbox"}
                        className=" hover:cursor-pointer select-none"
                      >
                        {checkbox}
                      </label>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 mt-10">
                    <button
                      onClick={handleClose}
                      className="bg-[#3a3a3a] hover:bg-[#4a4a4a] active:bg-[#3a3a3a] rounded-[10px] hover:transition duration-800"
                    >
                      {cancel}
                    </button>

                    <button
                      type="submit"
                      disabled={checkbox && !isChecked}
                      textColor=""
                      bgColor=""
                      className={`${
                        critical
                          ? "bg-red-400 text-white"
                          : "bg-pink-600 text-white"
                      } border-none outline-none px-4 py-2 hover:bg-red-400/80 active:bg-red-400/60 hover:text-white rounded-[10px] select-none hover:transition duration-800 disabled:cursor-not-allowed`}
                    >
                      {confirm}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </dialog>,
          document.getElementById("popup-models")
        )}
    </div>
  );
}

export default forwardRef(ConfirmPopup);

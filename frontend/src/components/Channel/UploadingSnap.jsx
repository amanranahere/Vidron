import React, { useImperativeHandle, useRef } from "react";
import { createPortal } from "react-dom";
import { IoClose } from "react-icons/io5";
import { PiVideoFill } from "react-icons/pi";
import { icons } from "../Icons.jsx";

function UploadingSnap({ snap, updating = false }, ref) {
  const dialog = useRef();
  const confirmCancelDialog = useRef();

  useImperativeHandle(
    ref,
    () => {
      return {
        open() {
          dialog.current.showModal();
        },
        close() {
          dialog.current.close();
        },
      };
    },
    []
  );

  return createPortal(
    <dialog
      ref={dialog}
      onClose={() => confirmCancelDialog.current?.close()}
      className="h-full text-white backdrop:backdrop-blur-sm"
    >
      <div className="relative flex min-h-[calc(100vh-66px)] sm:min-h-[calc(100vh-82px)]">
        <div className="fixed inset-0 z-10 flex flex-col bg-black/50 px-4 pt-4 sm:px-14 sm:py-8">
          <div className="absolute inset-x-0 top-0 z-10 flex h-[100vh] items-center justify-center bg-black/50 px-4 pt-4  sm:px-14 sm:py-8">
            <div className="w-full max-w-lg overflow-auto rounded-[20px] bg-[#1a1a1a] p-4">
              <div className="mb-4 flex items-start justify-center">
                <h2 className="text-2xl font-bold text-center pt-2">
                  {updating ? "Updating" : "Uploading"} Snap
                  <span className="block text-sm text-gray-300 pt-1">
                    Track your snap {updating ? "updating" : "uploading"}{" "}
                    progress
                  </span>
                </h2>
              </div>

              <div className="mb-6 flex gap-x-2 bg-[#3a3a3a] hover:bg-[#5a5a5a] transition duration-700 rounded-[20px] p-3">
                <div className="shrink-0">
                  <span className="inline-block w-full rounded-full bg-white p-1 text-black mt-1">
                    <PiVideoFill className="w-7 h-7" />
                  </span>
                </div>

                <div className="flex flex-col">
                  <h6>
                    {updating
                      ? "Updating " + snap.title
                      : snap?.snapFile?.length > 0 && snap?.snapFile[0].name}
                  </h6>

                  {!updating && (
                    <p className="text-sm">
                      {snap?.snapFile?.length > 0 &&
                        (snap?.snapFile[0].size / 1000000).toFixed(2)}{" "}
                      MB
                    </p>
                  )}

                  <div className="mt-2 flex items-center">
                    <p>{icons.loading}</p>
                    {updating ? "Updating" : "Uploading"}
                  </div>
                </div>
              </div>

              {!updating && (
                <div className="flex justify-center items-center mx-auto">
                  <button
                    onClick={() => dialog.current.close()}
                    className="bg-red-400 px-6 py-2 hover:bg-red-400/70 active:scale-95 rounded-full"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </dialog>,
    document.getElementById("popup-models")
  );
}

export default React.forwardRef(UploadingSnap);

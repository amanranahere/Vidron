import React, { useImperativeHandle, useRef } from "react";
import { createPortal } from "react-dom";
import { IoCloudDoneOutline } from "react-icons/io5";
import { PiVideoFill } from "react-icons/pi";

function UploadSuccess({ video, updating = false }, ref) {
  const dialog = useRef();

  useImperativeHandle(
    ref,
    () => {
      return {
        open() {
          dialog.current.showModal();
        },
      };
    },
    []
  );

  return createPortal(
    <dialog
      ref={dialog}
      className="h-full text-white backdrop:backdrop-blur-sm"
    >
      <div className="relative flex ">
        <div className="fixed inset-0 z-10 flex flex-col bg-black/50 ">
          <div className="inset-x-0 top-0 z-10 flex h-full items-center justify-center bg-black/50 ">
            <div className="w-full max-w-lg overflow-auto bg-[#1a1a1a] rounded-[20px] p-4">
              <div className="mb-4 flex items-start justify-center">
                <h2 className="text-xl font-semibold">
                  Video {updating ? "Updated" : "Uploaded"} Successfully
                </h2>

                {/* <button
                  autoFocus
                  type="button"
                  onClick={() => dialog.current.close()}
                  className="h-6 w-6 rounded-full hover:bg-[#5a5a5a]"
                >
                  <IoClose className="w-6 h-6" />
                </button> */}
              </div>

              <div className="mb-4 flex gap-x-2 bg-[#3a3a3a] rounded-[20px] p-3">
                <div className="shrink-0">
                  <span className="inline-block w-full rounded-full bg-[#fff] text-black p-1">
                    <PiVideoFill className="w-7 h-7" />
                  </span>
                </div>

                <div className="flex flex-col">
                  <h6>
                    {updating
                      ? "Updated " + video.title
                      : video?.videoFile?.length > 0 &&
                        video?.videoFile[0].name}
                  </h6>

                  {!updating && (
                    <p className="text-sm">
                      {video?.videoFile?.length > 0 &&
                        (video?.videoFile[0].size / 1000000).toFixed(2)}{" "}
                      MB
                    </p>
                  )}

                  <div className="mt-2 flex items-center gap-x-1">
                    <IoCloudDoneOutline className="w-5 h-5" />
                    Video {updating ? "Updated" : "Uploaded"}
                  </div>
                </div>
              </div>

              <div className="flex justify-center items-center mx-auto">
                <button
                  onClick={() => dialog.current.close()}
                  className="bg-[#fff] text-black hover:bg-white/70 active:scale-95 font-semibold px-6 py-1.5 rounded-full"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </dialog>,
    document.getElementById("popup-models")
  );
}

export default React.forwardRef(UploadSuccess);

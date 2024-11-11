import React, { useState, useEffect, useImperativeHandle, useRef } from "react";
import { useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import { BsUpload } from "react-icons/bs";
import axiosInstance from "../../utils/axios.helper.js";
import { toast } from "react-toastify";
import { createPortal } from "react-dom";
import SnapUploadSuccess from "./SnapUploadSuccess.jsx";
import UploadingSnap from "./UploadingSnap.jsx";
import { addSnapStats } from "../../store/dashboardSlice.js";
import { useDispatch } from "react-redux";
import getChannelSnaps from "../../hooks/getChannelSnaps.js";

function SnapForm({ snap = false }, ref) {
  const dialog = useRef();
  const uploadingDialog = useRef();
  const successDialog = useRef();
  const dispatch = useDispatch();

  const [showPopup, setShowPopup] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: snap?.title || "",
      description: snap?.description || "",
    },
  });

  useImperativeHandle(
    ref,
    () => {
      return {
        open() {
          setShowPopup(true);
          dialog.current?.showModal();
        },
        close() {
          dialog.current.close();
        },
      };
    },
    []
  );

  useEffect(() => {
    if (showPopup) {
      dialog.current.showModal();
    }
  }, [showPopup]);

  const publishSnap = async (data) => {
    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }
    formData.append("snapThumbnail", data.snapThumbnail[0]);
    formData.append("snapFile", data.snapFile[0]);

    try {
      await axiosInstance.post("/snaps", formData).then(() => {
        uploadingDialog.current.close();
        successDialog.current.open();
        reset();
        dispatch(addSnapStats());
        getChannelSnaps(dispatch);
        toast.success("Snap uploaded successfully");
      });
    } catch (error) {
      uploadingDialog.current.close();
      toast.error("Error while uploading snap. Try again!");
      console.error("Error uploading snap", error);
    }
  };

  const updateSnap = async (data) => {
    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }
    if (data.snapTumbnail)
      formData.append("snapThumbnail", data.snapThumbnail[0]);

    try {
      await axiosInstance.patch(`/snaps/${snap._id}`).then(() => {
        uploadingDialog.current.close();
        successDialog.current.open();
        reset();
        getChannelSnaps(dispatch);
      });
    } catch (error) {
      uploadingDialog.current.close();
      toast.error("Error while updating snap. Try again!");
      console.error("Error updating snap", error);
    }
  };

  const handleSnap = async (data) => {
    if (snap) {
      updateSnap(data);
    } else {
      publishSnap(data);
    }
    dialog.current.close();
    uploadingDialog.current.open();
  };

  return (
    <div>
      {showPopup &&
        createPortal(
          <dialog
            ref={dialog}
            className="h-fit backdrop:backdrop-blur-lg lg:w-[40%] md:w-2/3 items-center"
          >
            <UploadingSnap
              ref={uploadingDialog}
              snap={snap || getValues()}
              updating={snap ? true : false}
            />

            <SnapUploadSuccess
              ref={successDialog}
              snap={snap || getValues()}
              updating={snap ? true : false}
            />

            <div className="bg-black/85 p-2 text-white">
              <form
                onSubmit={handleSubmit(handleSnap)}
                className="h-fit border bg-zinc-950"
              >
                <div className="flex items-center justify-between border-b px-2 py-1 md:p-3">
                  <h2 className="text-xl font-semibold">
                    {snap ? "Update" : "Upload"} Snap
                  </h2>

                  <button
                    type="button"
                    title="Close"
                    autoFocus
                    onClick={() => dialog.current.close()}
                    className="h-6 w-6 hover:text-red-600"
                  >
                    <IoClose className="w-6 h-6" />
                  </button>
                </div>

                <div className="mx-auto flex w-full max-w-3xl flex-col gap-y-2 md:gap-y-3 p-4">
                  {!snap && (
                    <>
                      <div className="w-full border-2 border-dotted px-2 py-5 text-center">
                        <span className="mb-2 inline-block rounded-full bg-[#f8c3fa] p-3 text-pink-500">
                          <BsUpload className="h-7 w-7" />
                        </span>

                        <h6 className="mb-1 font-semibold text-sm md:text-lg">
                          Select snap file to upload
                        </h6>

                        <p className="text-gray-400 text-sm">
                          Your snap will be publised by default after upload is
                          complete.
                        </p>

                        <label
                          htmlFor="upload-snap"
                          className="mt-3 inline-flex w-auto cursor-pointer items-center gap-x-2 bg-pink-500 px-3 py-2 text-sm text-center font-semibold text-black transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px]"
                        >
                          <input
                            type="file"
                            id="upload-snap"
                            className="sr-only"
                            {...register("snapFile", {
                              required: "Snap file is required",
                              validate: (file) => {
                                const allowedExtensions = ["video/mp4"];
                                const fileType = file[0].type;
                                return allowedExtensions.includes(fileType)
                                  ? true
                                  : "Invalid file type! Only .mp4 files are accepted";
                              },
                            })}
                          />
                          Select File
                        </label>
                      </div>

                      {errors.snapFile?.type === "validate" && (
                        <div className="text-red-500">
                          {errors.snapFile.message}
                        </div>
                      )}
                    </>
                  )}

                  <div className="w-full">
                    <label
                      htmlFor="snapThumbnail"
                      className="mb-1 inline-block"
                    >
                      Thumbnail
                      {!snap && <span className="text-red-500">*</span>}
                    </label>

                    <input
                      type="file"
                      id="snapThumbnail"
                      className="w-full border p-1 file:mr-4 file:border-none cursor-pointer file:bg-pink-500 file:px-3 file:py-1.5"
                      {...register("snapThumbnail", {
                        required: !snap,
                        validate: (file) => {
                          if (snap) return true;
                          if (!file[0]) return true;
                          const allowedExtensions = [
                            "image/jpeg",
                            "image/png",
                            "image/jpg",
                          ];
                          const fileType = file[0]?.type;
                          return allowedExtensions.includes(fileType)
                            ? true
                            : "Invalid file type! Only .png .jpg and .jpeg files are accepted";
                        },
                      })}
                    />
                  </div>

                  {errors.snapThumbnail?.type === "required" && (
                    <div className="text-red-500">Thumbnail is required</div>
                  )}

                  {errors.snapThumbnail?.type === "validate" && (
                    <div className="text-red-500">
                      {errors.snapThumbnail.message}
                    </div>
                  )}

                  <div className="w-full">
                    <label htmlFor="title" className="mb-1 inline-block">
                      Title
                      <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="text"
                      placeholder="Add snap title"
                      id="title"
                      className="w-full border focus:border-pink-400 bg-transparent px-2 py-1 outline-none"
                      {...register("title", {
                        required: "Title required",
                      })}
                    />
                  </div>

                  <div className="w-full">
                    <label htmlFor="desc" className="mb-1 inline-block">
                      Description
                    </label>

                    <textarea
                      placeholder="Add some description"
                      id="desc"
                      className="h-24 md:h-32 w-full resize-none border focus:border-pink-400 bg-transparent px-2 py-1 outline-none"
                      {...register("description")}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        reset();
                        dialog.current.close();
                      }}
                      className="border px-4 py-2 hover:bg-gray-800"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={
                        errors.title ||
                        errors.snapFile ||
                        (!snap && errors.snapThumbnail)
                      }
                      className="bg-pink-600 px-4 py-2 text-black hover:font-semibold hover:border disabled:bg-pink-700 disabled:cursor-not-allowed"
                    >
                      {snap ? "Update" : "Publish"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </dialog>,
          document.getElementById("popup-models")
        )}
    </div>
  );
}

export default React.forwardRef(SnapForm);

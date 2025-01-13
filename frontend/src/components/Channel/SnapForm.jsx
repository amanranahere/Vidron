import React, { useState, useEffect, useImperativeHandle, useRef } from "react";
import { useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import { BsUpload } from "react-icons/bs";
import axiosInstance from "../../utils/axios.helper.js";
import { toast } from "react-toastify";
import { createPortal } from "react-dom";
import SnapUploadSuccess from "./SnapUploadSuccess.jsx";
import UploadingSnap from "./UploadingSnap.jsx";
import { addSnapStats } from "../../store/metricsSlice.js";
import { useDispatch } from "react-redux";
import getChannelSnaps from "../../hooks/getChannelSnaps.js";
import Input from "../Input.jsx";

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
            className="h-fit backdrop:backdrop-blur-lg md:max-w-max items-center text-white overflow-auto rounded-[20px]"
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

            <div className="h-full w-full bg-[#1a1a1a] items-center justify-center">
              <form onSubmit={handleSubmit(handleSnap)} className="h-fit">
                <div className="flex items-center justify-between px-6 pt-4 md:py-5 lg:mx-2 lg:py-3 lg:pt-6">
                  <h2 className="signup-title">
                    {snap ? "Update" : "Upload"} Snap
                  </h2>
                </div>

                <div className="mx-auto flex w-full max-w-3xl flex-col gap-y-2 md:gap-y-3 px-4 pb-4">
                  <div className="flex flex-col md:flex-row gap-4 py-4">
                    {!snap && (
                      <div className="signup-form ">
                        {/* snap upload */}
                        <div className="avatar w-full">
                          <span className="avatar-title ">
                            Upload your Snap
                          </span>

                          <p className="avatar-paragraph">
                            File should be an .mp4 video file.
                          </p>

                          <label
                            htmlFor="upload-snap"
                            className="avatar-drop-container"
                          >
                            <input
                              type="file"
                              id="upload-snap"
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
                          </label>
                        </div>

                        {errors.snapFile?.type === "validate" && (
                          <div className="text-red-500">
                            {errors.snapFile.message}
                          </div>
                        )}
                      </div>
                    )}

                    {/* thumbnail upload */}
                    <div className="avatar">
                      <span className="avatar-title">
                        {snap ? "Update" : "Upload"} your Thumbnail
                      </span>

                      <p className="avatar-paragraph">
                        File should be an image (JPEG, JPG, or PNG format).
                      </p>

                      <label
                        htmlFor="snapThumbnail"
                        className="avatar-drop-container"
                      >
                        <input
                          type="file"
                          id="snapThumbnail"
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
                      </label>
                    </div>
                  </div>

                  {errors.snapThumbnail?.type === "required" && (
                    <div className="text-red-500">Thumbnail is required</div>
                  )}

                  {errors.snapThumbnail?.type === "validate" && (
                    <div className="text-red-500">
                      {errors.snapThumbnail.message}
                    </div>
                  )}

                  {/* title and description */}

                  <div className="w-full">
                    <Input
                      label="Title"
                      placeholder="Enter snap title"
                      id="title"
                      className="p-3 rounded-lg"
                      {...register("title", {
                        required: "Title required",
                      })}
                    />
                  </div>

                  <div className="w-full">
                    <label htmlFor="desc" className="mb-1 pl-1 inline-block">
                      Description
                    </label>

                    <textarea
                      placeholder="Add some description"
                      id="desc"
                      className="h-24 md:h-32 p-3 rounded-lg w-full resize-none bg-[#2a2a2a] text-white outline-none duration-200 focus:bg-[#3a3a3a] overflow-y-auto scrollbar-thin scrollbar-thumb-[#2a2a2a] scrollbar-track-black"
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
                      className="h-full border-none outline-none p-[10px] rounded-[10px] text-white text-[16px] transition duration-300 bg-red-400 hover:bg-red-400/55 active:bg-red-400/35"
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
                      className="signup-submit select-none disabled:cursor-not-allowed"
                    >
                      {snap ? "Update" : "Upload"}
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

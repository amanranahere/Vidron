import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { icons } from "../Icons.jsx";
import Button from "../Button.jsx";
import Input from "../Input.jsx";
import { IoClose } from "react-icons/io5";
import axiosInstance from "../../utils/axios.helper.js";
import { toast } from "react-toastify";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { updatePlaylist } from "../../store/playlistSlice.js";
import getUserPlaylist from "../../hooks/getUserPlaylist.js";

function PlaylistForm({ playlist, route }, ref) {
  const dialog = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = useSelector((state) => state.user?.user?._id);

  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: playlist?.name || "",
      description: playlist?.description || "",
    },
  });

  useImperativeHandle(
    ref,
    () => {
      return {
        open() {
          setShowPopup(true);
        },
        close() {
          handleClose();
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

  const handleClose = () => {
    dialog.current.close();
    setShowPopup(false);
    reset();
    if (route) navigate(route);
  };

  const handleUpdatePlaylist = async (data) => {
    setLoading(true);

    try {
      if (playlist) {
        const response = await axiosInstance.patch(
          `/playlists/${playlist._id}`,
          data
        );

        if (response?.data?.success) {
          dispatch(
            updatePlaylist({
              name: response.data.data.name,
              description: response.data.data.description,
            })
          );

          toast.success(response.data.message);

          if (route) {
            navigate(route);
          }

          dialog.current.close();
        }
      } else {
        const response = await axiosInstance.post(`playlists/`, data);

        if (response?.data?.success) {
          getUserPlaylist(dispatch, userId);
        }

        toast.success(response.data.message);

        if (route) {
          navigate(route);
        }

        dialog.current.close();
      }
    } catch (error) {
      toast.error("An error occured while creating/updating the playlist");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute">
      {showPopup &&
        createPortal(
          <dialog
            ref={dialog}
            className="h-full backdrop:backdrop-blur-sm items-center"
            onClose={handleClose}
          >
            <div className="relative flex min-h-[calc(100vh-66px)] sm:min-h-[calc(100vh-82px)]">
              <div className="fixed inset-0 top-[calc(66px)] z-10 flex flex-col px-4 pb-[86px] pt-4 sm:top-[calc(82px)] sm:px-14 sm:py-8">
                <form
                  onSubmit={handleSubmit(handleUpdatePlaylist)}
                  className="mx-auto w-full max-w-lg overflow-auto rounded-[20px] text-white bg-[#1a1a1a] p-4"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <h2 className="text-xl font-semibold">
                      {playlist ? "Edit" : "Create"} Playlist
                    </h2>

                    <button
                      autoFocus
                      type="button"
                      onClick={handleClose}
                      className="h-7 w-7 hover:bg-[#4a4a4a] rounded-full"
                    >
                      <IoClose className="w-7 h-7" />
                    </button>
                  </div>

                  <div className="mb-4 flex flex-col gap-y-4">
                    <Input
                      label="Title"
                      className="px-2 rounded-lg"
                      className2="pt-5"
                      placeholder="Enter name of the Playlist"
                      required
                      {...register("name", {
                        required: true,
                      })}
                    />

                    <div className="w-full">
                      <label htmlFor="desc" className="mb-1 pl-1 inline-block">
                        Description
                      </label>

                      <textarea
                        rows={4}
                        id="desc"
                        className="px-2 rounded-lg w-full py-1 bg-[#2a2a2a] text-white outline-none duration-200 focus:bg-[#3a3a3a] "
                        placeholder="Enter some description of the Playlist"
                        {...register("description", {
                          required: false,
                        })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={handleClose}
                      className="w-full border-none outline-none py-2 bg-red-400 hover:bg-red-400/80 active:bg-red-400/60 border rounded-[10px] select-none hover:transition duration-1000 ease-out"
                      bgColor="bg-gray-300"
                      textColor="text-black"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full border-none outline-none border rounded-[10px] bg-[#00bfff] hover:bg-[#00bfff96] active:bg-[#00bfff63] select-none hover:transition duration-1000 ease-out"
                    >
                      {loading && <span>{icons.loading}</span>}
                      {!loading && playlist ? "Update" : "Create"}
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

export default React.forwardRef(PlaylistForm);

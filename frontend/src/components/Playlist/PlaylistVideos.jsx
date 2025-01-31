import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import PlaylistForm from "./PlaylistForm";
import ChannelEmptyPlaylist from "../Channel/ChannelEmptyPlaylist.jsx";
import { icons } from "../Icons.jsx";
import axiosInstance from "../../utils/axios.helper";
import formatDate from "../../utils/formatDate.js";
import ConfirmPopup from "../ConfirmPopup.jsx";
import { toast } from "react-toastify";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdOutlineFeaturedPlayList } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { setPlaylist, removePlaylistVideo } from "../../store/playlistSlice.js";
import VideoListCard from "../Video/VideoListCard.jsx";
import GuestComponent from "../GuestPages/GuestComponent.jsx";

function PlaylistVideos() {
  const { playlistId } = useParams();
  const dispatch = useDispatch();
  const dialog = useRef();
  const deletePlaylistPopup = useRef();
  const ref = useRef();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [menu, setMenu] = useState(false);
  const location = useLocation();
  const playlist_default_img = "/playlist_default.png";

  const { status, userData } = useSelector((state) => state.auth);

  const getPlaylistById = async () => {
    setError("");
    try {
      const response = await axiosInstance.get(
        `/playlists/playlist/${playlistId}`
      );

      if (response?.data?.success) {
        dispatch(setPlaylist(response.data.data));
      }
    } catch (error) {
      setError(
        <GuestComponent
          title="Playlist does not exist"
          subtitle="There is no playlist for given playlistId. It may have been moved or deleted."
          icon={
            <span className="w-full h-full flex items-center p-4">
              <MdOutlineFeaturedPlayList className="w-28 h-28" />
            </span>
          }
          guest={false}
        />
      );
      console.log("Error while fetching playlist", error);
    }
  };

  useEffect(() => {
    getPlaylistById().then(() => setLoading(false));
  }, [playlistId]);

  const playlist = useSelector((state) => state.playlist.playlist);

  useEffect(() => {
    const fetchFullVideos = async () => {
      if (!playlist?.videos || playlist.videos.length === 0) return;

      const fullVideos = await Promise.all(
        playlist.videos.map(async (videoId) => {
          const res = await axiosInstance.get(`/videos/${videoId}`);
          return res.data.data;
        })
      );

      dispatch(setPlaylist({ ...playlist, videos: fullVideos }));
    };

    if (playlist?.videos?.length && typeof playlist.videos[0] === "string") {
      fetchFullVideos();
    }
  }, [playlist]);

  const deletePlaylist = async (isConfirm) => {
    if (isConfirm) {
      try {
        await axiosInstance.delete(`/playlists/playlist/${playlistId}`);

        navigate(`/channel/${playlist.owner.username}/playlist`);
        toast.success("Playlist deleted successfully");
      } catch (error) {
        toast.error("Playlist couldn't be deleted. Try again!");
        console.log("Error while deleting playlist", error);
      }
    }
  };

  const deleteVideo = async (videoId) => {
    try {
      const res = await axiosInstance.delete(
        `/playlists/playlist/${playlistId}/video/${videoId}`
      );

      dispatch(removePlaylistVideo(videoId));
      toast.success(res.data.message);
    } catch (error) {
      toast.error("Error while removing video. Try again!");
      console.log("Error while removing video", error);
    }
  };

  const handleUpdate = () => {
    dialog.current?.open();
    setMenu(false);
  };

  const handleDelete = () => {
    deletePlaylistPopup.current?.open();
    setMenu(false);
  };

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (error) {
    return error;
  }

  if (loading) {
    return (
      <span className="flex justify-center mt-20">{icons.bigLoading}</span>
    );
  }

  return (
    <section className="w-full ">
      <div className="flex flex-wrap gap-x-4 gap-y-10 p-4 xl:flex-nowrap">
        <div
          className="lg:sticky lg:top-4 w-full lg:max-w-[35%] bg-gradient-to-b from-blue-200 to-transparent rounded-[20px]"
          style={{ height: "calc(100vh - 88px)" }}
        >
          <div className="relative w-full pt-[60%]">
            <div className="absolute inset-0">
              <img
                src={
                  playlist?.thumbnail
                    ? playlist?.thumbnail
                    : playlist_default_img
                }
                alt={playlist.name}
                className=" w-[95%] mx-auto mt-3 aspect-video rounded-[20px] object-cover"
              />
            </div>
          </div>

          <h2 className="mt-2 mx-2 text-2xl font-bold">{playlist.name}</h2>

          <div className="mt-4 mx-2 flex items-center gap-x-3">
            <div className="h-10 w-10 shrink-0 mt-1">
              <Link to={`/channel/${playlist.owner.username}`}>
                <img
                  src={playlist.owner.avatar}
                  alt={playlist.owner.fullname}
                  className="h-full w-full rounded-full object-cover"
                />
              </Link>
            </div>

            <div className="w-full">
              <h6 className="font-semibold">{playlist.owner.fullname}</h6>

              <p className="text-sm text-gray-300">
                @{playlist.owner.username}
              </p>
            </div>

            {status && userData.username === playlist.owner.username && (
              <div ref={ref} className="relative">
                <button
                  onClick={() => setMenu((prev) => !prev)}
                  className="p-2 hover:bg-slate-800 hover:rounded-full"
                >
                  <BsThreeDotsVertical />
                </button>

                {menu && (
                  <div className="absolute right-0 w-24 bg-black rounded-lg shadow-lg text-sm">
                    <button
                      onClick={() => handleUpdate()}
                      className="block w-full text-left px-4 py-2 hover:bg-[#3a3a3a] rounded-t-lg"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete()}
                      className="block w-full text-left px-4 py-2 hover:bg-red-400 rounded-b-lg"
                    >
                      Delete
                    </button>
                  </div>
                )}

                <ConfirmPopup
                  ref={deletePlaylistPopup}
                  title={`Confirm to Delete ${playlist.name}`}
                  subtitle="Once playlist is deleted it cannot be recovered."
                  message="Note: The videos within the playlist won't be deleted."
                  confirm="Delete"
                  cancel="Cancel"
                  critical
                  actionFunction={deletePlaylist}
                />

                <PlaylistForm
                  ref={dialog}
                  playlist={playlist}
                  route={location}
                />
              </div>
            )}
          </div>

          <div className="flex gap-1 mx-2 mt-4">
            <p className="flex justify-between">
              <span className="text-sm font-medium text-gray-100">
                {playlist.videos.length > 0 ? playlist.videos.length : 0} video
                {playlist.videos.length > 1 ? "s" : ""} ·{" "}
              </span>
            </p>

            <p className="text-sm font-medium text-gray-100">
              {/* {playlist.totalViews > 0 ? playlist.totalViews : 0} view
              {playlist.totalViews > 1 ? "s" : ""} ·{" "} */}
              {formatDate(playlist.createdAt)}
            </p>
          </div>

          <p className="flex pb-4 mt-2 mx-2 text-sm font-medium text-gray-200">
            {playlist.description}
          </p>
        </div>

        <ul className="flex w-full flex-col gap-y-4 pb-16">
          {playlist.videos.length > 0 || (
            <div className="h-full w-full flex items-center justify-center">
              <ChannelEmptyPlaylist videos={true} />
            </div>
          )}

          {playlist?.videos?.map((video) => (
            <div
              className="flex hover:bg-zinc-900 rounded-lg relative"
              key={video._id}
            >
              <VideoListCard video={video} />

              {status && userData.username === playlist.owner.username && (
                <button
                  title="remove video"
                  className="absolute top-1 right-1 max-h-min flex rounded-full p-2 hover:bg-[#3a3a3a] bg-[#2a2a2a]
                  hover:text-red-400"
                  onClick={() => deleteVideo(video._id)}
                >
                  <MdDelete className="w-6 h-6" />
                </button>
              )}
            </div>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default PlaylistVideos;

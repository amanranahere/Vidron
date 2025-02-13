import React, { useRef, useState, useEffect } from "react";
import ChannelEmptyPlaylist from "./ChannelEmptyPlaylist.jsx";
import { useSelector, useDispatch } from "react-redux";
import getUserPlaylist from "../../hooks/getUserPlaylist.js";
import { Link, useLocation, useParams } from "react-router-dom";
import { icons } from "../Icons.jsx";
import { IoAdd } from "react-icons/io5";
import formatDate from "../../utils/formatDate.js";
import PlaylistForm from "../Playlist/PlaylistForm.jsx";
import { CgPlayList } from "react-icons/cg";

function ChannelPlaylist() {
  const dispatch = useDispatch();
  const { username } = useParams();
  const [loading, setLoading] = useState(true);
  const [playlists, setPlaylists] = useState([]);
  const { status, userData } = useSelector((state) => state.auth);
  const userId = useSelector((state) => state.user.user?._id);
  const dialog = useRef();
  const location = useLocation();
  const playlist_default_img = "/playlist_default.png";

  useEffect(() => {
    if (userId || userData?._id) {
      getUserPlaylist(dispatch, userId || userData._id)
        .then((fetchedPlaylists) => {
          setPlaylists(fetchedPlaylists?.data?.userPlaylist || []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [username, userId, userData?._id, dispatch]);

  if (loading) {
    return (
      <span className="flex justify-center mt-20">{icons.bigLoading}</span>
    );
  }

  function popupPlaylistForm() {
    dialog.current.open();
  }

  let counter = 0;

  return (
    <>
      <PlaylistForm ref={dialog} route={location} />

      {playlists?.length > 0 ? (
        <>
          {status && userData?.username === username && (
            <div className="flex items-center justify-center">
              <button
                onClick={popupPlaylistForm}
                className="fixed bottom-16 right-2 md:bottom-20 md:right-8 lg:bottom-6 lg:right-6 p-4 flex justify-center items-center gap-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] active:scale-95 border-none rounded-xl z-20 hover:transition duration-1000 font-bold text-gray-100"
              >
                <IoAdd className="w-5 h-5" />
                New Playlist
              </button>
            </div>
          )}

          <ul className="flex flex-wrap justify-start">
            {playlists.map((playlist) => {
              if (
                playlist.videosCount > 0 ||
                (status && userData?.username === username)
              ) {
                counter++;
                return (
                  <li
                    key={playlist._id}
                    className="hover:bg-[#3a3a3a] 2xl:w-[18vw] md:w-[25vw] w-[90vw] rounded-lg my-4 text-white mx-2 p-1"
                  >
                    <Link to={`/playlist/${playlist._id}`}>
                      <div className="relative">
                        <div className="relative">
                          <img
                            src={
                              playlist?.thumbnail
                                ? playlist.thumbnail
                                : playlist_default_img
                            }
                            alt="image"
                            className="w-full aspect-video object-cover rounded-lg"
                          />

                          <div className="absolute top-0 right-0 h-full bg-black/70 w-[40%] flex flex-col justify-center items-center rounded-tr-lg rounded-br-lg">
                            <CgPlayList className="w-8 h-8" />

                            <div className="text-center">
                              {playlist.videos.length > 0
                                ? playlist.videos.length
                                : 0}{" "}
                              video
                              {playlist.videos.length > 1 ? "s" : ""}
                            </div>
                          </div>
                        </div>

                        <div className="relative px-2 py-2 text-white ">
                          <div className="relative z-[1]">
                            <p className="flex justify-between">
                              <span className="inline-block">
                                {playlist.name}
                              </span>
                            </p>

                            <p className="text-sm text-gray-400">
                              {/* {playlist.totalViews > 0
                                ? playlist.totalViews
                                : 0}{" "}
                              view
                              {playlist.totalViews > 1 ? "s" : ""} ·{" "} */}
                              {formatDate(playlist.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              }
            })}
          </ul>
          {counter === 0 && <ChannelEmptyPlaylist />}
        </>
      ) : (
        <ChannelEmptyPlaylist />
      )}
    </>
  );
}

export default ChannelPlaylist;

import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../utils/axios.helper.js";
import { useSelector } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
import Input from "./Input.jsx";
import Button from "./Button.jsx";
import { useForm } from "react-hook-form";
import { BiLike, BiSolidLike } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import LoginPopup from "./Auth/LoginPopup.jsx";
import { toast } from "react-toastify";
import InfiniteScroll from "react-infinite-scroll-component";
import getTimeDistanceToNow from "../utils/getTimeDistance.js";
import { icons } from "./Icons.jsx";
import { IoMdSend } from "react-icons/io";

function SnapComments({ snap }) {
  const { status, userData } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { snapId } = useParams();
  const [comments, setComments] = useState([]);
  const [commentsUpdated, setCommentsUpdated] = useState(false);
  const [activeCommentId, setActiveCommentId] = useState(null);
  const [update, setUpdate] = useState(null);
  const { register, handleSubmit, reset } = useForm();
  const {
    register: register2,
    handleSubmit: handleSubmit2,
    setValue,
  } = useForm();

  const LoginPopupDialog = useRef();
  const LoginLikePopupDialog = useRef();
  const menuRefs = useRef([]);
  const location = useLocation();

  const getSnapComments = async () => {
    try {
      const response = await axiosInstance.get(
        `/comments/snap/${snapId}?page=${page}&limit=10`
      );

      const commentsArray = response.data.data;

      if (Array.isArray(commentsArray)) {
        if (commentsArray.length === 10) {
          setComments((prev) => {
            const newComments = commentsArray.filter(
              (comment) =>
                !prev.some(
                  (existingComment) => existingComment._id === comment._id
                )
            );
            return [...prev, ...newComments];
          });
        } else {
          setComments((prev) => {
            const newComments = commentsArray.filter(
              (comment) =>
                !prev.some(
                  (existingComment) => existingComment._id === comment._id
                )
            );
            return [...prev, ...newComments];
          });
          setHasMore(false);
        }
      }
    } catch (error) {
      console.log("Error fetching comments", error);
    }
  };

  const handleCommentSubmit = async (data) => {
    if (!status) {
      LoginPopupDialog.current.open();
    } else {
      try {
        await axiosInstance.post(`/comments/snap/${snapId}`, {
          content: data.content,
        });
        reset();
        setCommentsUpdated((prev) => !prev);
        setPage(1);
      } catch (error) {
        toast.error("Couldn't post the comment. Try again!");
        console.log("Error while adding comment", error);
      }
    }
  };

  const handleCommentDelete = async (commentId) => {
    try {
      await axiosInstance.delete(`/comments/comment/${commentId}`);
      setCommentsUpdated((prev) => !prev);
      setPage(1);
    } catch (error) {
      toast.error("Couldn't delete comment. Try again!");
      console.log("Error while deleting the comment", error);
    }
  };

  const handleCommentUpdate = async (data, commentId) => {
    try {
      await axiosInstance.patch(`/comments/comment/${commentId}`, {
        content: data.newContent,
      });

      setUpdate(null);
      setCommentsUpdated((prev) => !prev);
      setPage(1);
    } catch (error) {
      toast.error("Couldn't update the comment. Try again!");
      console.log("Error while updating the comment", error);
    }
  };

  useEffect(() => {
    if (page === 1) {
      setComments([]);
    }

    getSnapComments().then(() => setLoading(false));
  }, [snapId, commentsUpdated, page]);

  const fetchMoreData = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const toggleCommentLike = async (commentId) => {
    if (!status) {
      LoginLikePopupDialog.current.open();
    } else {
      try {
        const response = await axiosInstance.post(
          `/likes/toggle/comment/${commentId}`
        );

        if (response.data.success) {
          const { isLiked, likesCount } = response.data.data;
          setComments((prevComments) =>
            prevComments.map((comment) =>
              comment._id === commentId
                ? {
                    ...comment,
                    isLiked: isLiked,
                    likesCount: likesCount,
                  }
                : comment
            )
          );
        }
      } catch (error) {
        toast.error("Error while toggling like button on comment");
        console.log("Error while toggling the like button on comment", error);
      }
    }
  };

  const toggleMenu = (commentId) => {
    setActiveCommentId(activeCommentId === commentId ? null : commentId);
  };

  const handleUpdate = (comment) => {
    setUpdate(comment._id);
    setValue("newContent", comment.content);
    setActiveCommentId(null);
  };

  const cancelEditing = () => {
    setUpdate(null);
  };

  const handleDelete = (commentId) => {
    handleCommentDelete(commentId);
    setActiveCommentId(null);
  };

  const handleClickOutside = (event) => {
    if (menuRefs.current.some((ref) => ref && !ref.contains(event.target))) {
      setActiveCommentId(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return loading ? (
    <div className="h-[calc(100vh-380px)] lg:h-[calc(100vh-310px)] bg-[#121212] flex justify-center items-center">
      {icons.bigLoading}
    </div>
  ) : (
    <>
      <div
        className={`bg-[#121212] mt-24 p-4 cursor-pointer py-2 pt-2 select-none transition duration-400 flex justify-center `}
      >
        <div className="w-full text-xl font-semibold flex justify-center items-center">
          {Array.isArray(comments) && comments.length
            ? `Comments`
            : "No Comments"}
          <span className="pl-3 text-sm text-gray-400 font-semibold">
            {Array.isArray(comments) && comments.length
              ? `${comments.length}`
              : ""}
          </span>
        </div>
      </div>

      <div className="h-[calc(100vh-380px)] lg:h-[calc(100vh-310px)] bg-[#121212] rounded-bl-[20px] rounded-br-[20px] overflow-y-scroll scrollbar-thin scrollbar-thumb-[#2a2a2a] scrollbar-track-[#121212]">
        <div className="px-2 pt-2 pb-2 border-b-[1px] border-[#333]">
          <form
            onSubmit={handleSubmit(handleCommentSubmit)}
            className="py-2 flex items-center gap-2 "
          >
            <div className="min-w-9 min-h-9">
              <img
                src={userData?.avatar || snap?.owner?.avatar}
                alt="user"
                className="w-9 h-9 rounded-full object-cover"
              />
            </div>

            <div className="flex items-center w-full">
              <input
                {...register("content", { required: true })}
                placeholder="Add a comment"
                className="w-full px-2 border-b-[1px] py-1 bg-black/0 text-white outline-none duration-200 focus:border-[#6a6a6a]"
              />

              <LoginPopup
                ref={LoginPopupDialog}
                route={location.pathname}
                message="Login to Comment..."
              />

              <button
                type="submit"
                className="hover:rounded-full p-3 cursor-pointer active:scale-90 "
              >
                <IoMdSend />
              </button>
            </div>
          </form>
        </div>

        <div className="w-full pb-36 ">
          {Array.isArray(comments) && comments?.length > 0 && (
            <InfiniteScroll
              dataLength={comments.length}
              next={fetchMoreData}
              hasMore={hasMore}
              loader={
                <div className="flex justify-center h-7 mt-1">
                  {icons.loading}
                </div>
              }
              scrollableTarget="scrollableDiv"
            >
              {comments?.map((comment, index) => (
                <div
                  key={comment._id}
                  className="hover:bg-zinc-900 rounded-xl py-3 px-2"
                >
                  <div className="flex">
                    <div className="min-w-9 min-h-9">
                      <img
                        src={`${comment?.owner?.avatar}`}
                        alt=""
                        className="w-9 h-9 rounded-full object-cover"
                      />
                    </div>

                    <div className="pl-3 justify-start flex-grow">
                      <div className="flex text-gray-300 text-sm">
                        <p>@{comment?.owner?.username}</p>
                        <p className="ml-2">
                          · {getTimeDistanceToNow(comment?.createdAt)}
                        </p>
                      </div>

                      {update === comment._id ? (
                        <form
                          onSubmit={handleSubmit2((data) =>
                            handleCommentUpdate(data, comment._id)
                          )}
                          className="mt-1 flex items-center gap-2"
                        >
                          <input
                            {...register2("newContent", {
                              required: true,
                            })}
                            className="mr-2 border-b-[1px] py-1 bg-black/0 text-white outline-none duration-200 focus:border-blue-800 w-full"
                          />

                          <button
                            type="submit"
                            className="bg-[#2a2a2a] p-1 font-semibold text-sm  flex items-center hover:bg-[#3a3a3a] text-green-500"
                          >
                            {"\u2714"}
                          </button>

                          <button
                            onClick={cancelEditing}
                            className="bg-[#2a2a2a] p-1 font-semibold text-sm flex items-center hover:bg-[#3a3a3a]"
                          >
                            {"\u274C"}
                          </button>
                        </form>
                      ) : (
                        <div className="mt-1 break-words break-all">
                          {comment?.content}
                        </div>
                      )}

                      <LoginPopup
                        ref={LoginLikePopupDialog}
                        route={location.pathname}
                        message="Login to Like Comment..."
                      />

                      <button
                        onClick={() => toggleCommentLike(comment._id)}
                        className={`mt-1 flex items-center text-sm`}
                      >
                        {comment.isLiked ? (
                          <BiSolidLike className="w-4 h-4" />
                        ) : (
                          <BiLike className="w-4 h-4" />
                        )}

                        <p className="ml-1">{comment?.likesCount}</p>
                      </button>
                    </div>

                    {comment?.owner?._id === userData?._id && (
                      <div
                        ref={(el) => (menuRefs.current[index] = el)}
                        className="relative"
                      >
                        <button
                          onClick={() => toggleMenu(comment._id)}
                          className="p-2 hover:bg-slate-800 hover:rounded-full"
                        >
                          <BsThreeDotsVertical />
                        </button>

                        {activeCommentId === comment._id && (
                          <div className="absolute top-0 right-0 z-30 w-24 bg-black rounded-lg shadow-lg text-sm">
                            <button
                              onClick={() => handleUpdate(comment)}
                              className="block w-full px-4 py-2 hover:bg-[#3a3a3a] hover:rounded-lg text-center"
                            >
                              Update
                            </button>

                            <button
                              onClick={() => handleDelete(comment._id)}
                              className="block w-full px-4 py-2 hover:bg-[#f55] hover:rounded-lg text-center"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </InfiniteScroll>
          )}
        </div>
      </div>
    </>
  );
}

export default SnapComments;

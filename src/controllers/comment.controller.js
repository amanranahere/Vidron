import { isValidObjectId } from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video Id");
  }

  page = Number(page);
  limit = Number(limit);

  if (!Number.isFinite(page)) {
    throw new ApiError(400, "Page is required");
  }

  if (!Number.isFinite(limit)) {
    throw new ApiError(400, "Limit is required");
  }

  const pipeline = [
    {
      $match: {
        video: videoId,
      },
    },
  ];

  const comments = await Comment.aggregatePaginate(
    Comment.aggregate(pipeline),
    { page, limit }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        comments,
        "Fetched all the comments on the video successfully"
      )
    );
});

const addComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { content } = req.body;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid Video Id");
  }

  if (!content) {
    throw new ApiError(400, "Content required");
  }

  const user = await User.findOne({
    refreshToken: req.cookies.refreshToken,
  });

  const comment = await Comment.create({
    content,
    video: videoId,
    owner: user._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment created successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid Comment Id");
  }

  if (!content) {
    throw new ApiError(400, "Content required");
  }

  const updatedComment = await Comment.findByIdAndUpdate(
    commentId,
    {
      $set: {
        content,
      },
    },
    { new: true }
  );

  if (!updatedComment) {
    throw new ApiError(400, "Error while updating the comment");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedComment, "Comment updated successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid Comment Id");
  }

  const deletedComment = await Comment.findByIdAndDelete(commentId);

  if (!deletedComment) {
    throw new ApiError(404, "Comment not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Comment deleted successfully"));
});

export { getVideoComments, addComment, updateComment, deleteComment };

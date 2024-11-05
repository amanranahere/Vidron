import { isValidObjectId } from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

// video comments

const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  let { page = 1, limit = 10 } = req.query;

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

const addVideoComment = asyncHandler(async (req, res) => {
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

  if (!user) {
    throw new ApiError(401, "User not authenticated");
  }

  const comment = await Comment.create({
    content,
    video: videoId,
    owner: user._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment created successfully"));
});

// common functions for both video and snap

const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid Comment Id");
  }

  if (!content) {
    throw new ApiError(400, "Content required");
  }

  const user = await User.findOne({ refreshToken: req.cookies.refreshToken });
  if (!user) {
    throw new ApiError(401, "User not authenticated");
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  if (!comment.owner.equals(user._id)) {
    throw new ApiError(
      403,
      "You do not have permission to update this comment"
    );
  }

  comment.content = content;
  await comment.save();

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment updated successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid Comment Id");
  }

  const user = await User.findOne({ refreshToken: req.cookies.refreshToken });

  if (!user) {
    throw new ApiError(401, "User not authenticated");
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  if (!comment.owner.equals(user._id)) {
    throw new ApiError(
      403,
      "You do not have permission to delete this comment"
    );
  }

  await comment.remove();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Comment deleted successfully"));
});

// snap comments

const getSnapComments = asyncHandler(async (req, res) => {
  const { snapId } = req.params;
  let { page = 1, limit = 10 } = req.query;

  if (!isValidObjectId(snapId)) {
    throw new ApiError(400, "Invalid snap Id");
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
        snap: snapId,
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
        "Fetched all the comments on the snap successfully"
      )
    );
});

const addSnapComment = asyncHandler(async (req, res) => {
  const { snapId } = req.params;
  const { content } = req.body;

  if (!isValidObjectId(snapId)) {
    throw new ApiError(400, "Invalid snap Id");
  }

  if (!content) {
    throw new ApiError(400, "Content required");
  }

  const user = await User.findOne({
    refreshToken: req.cookies.refreshToken,
  });

  if (!user) {
    throw new ApiError(401, "User not authenticated");
  }

  const comment = await Comment.create({
    content,
    snap: snapId,
    owner: user._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment created successfully"));
});

export {
  getVideoComments,
  addVideoComment,
  updateComment,
  deleteComment,
  getSnapComments,
  addSnapComment,
};

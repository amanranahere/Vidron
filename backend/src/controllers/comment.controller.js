import mongoose, { isValidObjectId } from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

// video comments

const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(400, "No valid video Id found");
  }

  const getComments = await Comment.aggregate([
    {
      $match: {
        video: new mongoose.Types.ObjectId(videoId),
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $skip: (page - 1) * limit,
    },
    {
      $limit: parseInt(limit),
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              username: 1,
              _id: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        owner: {
          $first: "$owner",
        },
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "comment",
        as: "likes",
      },
    },
    {
      $addFields: {
        likesCount: {
          $size: "$likes",
        },
        isLiked: {
          $cond: {
            if: { $in: [req.user?._id, "$likes.likedBy"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        _id: 1,
        username: 1,
        avatar: 1,
        likesCount: 1,
        isLiked: 1,
        content: 1,
        owner: 1,
        createdAt: 1,
      },
    },
  ]);

  if (!getComments) {
    throw new ApiError(501, "Error while fetching comments");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, getComments, "Comments fetched successfully"));
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
  const { content } = req.body;
  const { commentId } = req.params;

  if (!content?.trim()) {
    throw new ApiError(400, "Comment cannot be empty");
  }

  if (!commentId || !isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid comment Id");
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(500, "Comment not found");
  }

  if (comment.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(
      401,
      "You do not have permission to update this comment"
    );
  }

  const updatedComment = await Comment.findByIdAndUpdate(
    commentId,
    {
      $set: { content },
    },
    {
      new: true,
    }
  );

  if (!updatedComment) {
    throw new ApiError(400, "Error while updating comment");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedComment, "Comment updated successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!commentId || !isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid comment Id");
  }
  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(500, "Comment not found");
  }

  if (comment.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(
      401,
      "You do not have permission to delete this comment"
    );
  }

  const deletedComment = await Comment.findByIdAndDelete(commentId);

  if (!deletedComment) {
    throw new ApiError(400, "Error while deleting comment");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, deletedComment, "Comment deleted successfully"));
});

// snap comments

const getSnapComments = asyncHandler(async (req, res) => {
  const { snapId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!snapId || !isValidObjectId(snapId)) {
    throw new ApiError(400, "No valid snap Id found");
  }

  const getComments = await Comment.aggregate([
    {
      $match: {
        snap: new mongoose.Types.ObjectId(snapId),
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $skip: (page - 1) * limit,
    },
    {
      $limit: parseInt(limit),
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              username: 1,
              _id: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        owner: {
          $first: "$owner",
        },
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "comment",
        as: "likes",
      },
    },
    {
      $addFields: {
        likesCount: {
          $size: "$likes",
        },
        isLiked: {
          $cond: {
            if: { $in: [req.user?._id, "$likes.likedBy"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        _id: 1,
        username: 1,
        avatar: 1,
        likesCount: 1,
        isLiked: 1,
        content: 1,
        owner: 1,
        createdAt: 1,
      },
    },
  ]);

  if (!getComments) {
    throw new ApiError(501, "Error while fetching comments");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, getComments, "Comments fetched successfully"));
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

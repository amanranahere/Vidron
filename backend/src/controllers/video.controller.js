import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { convertToMMSS } from "../utils/convertToMMSS.js";
import { cloudinary } from "../utils/cloudinary.js";
import mongoose, { isValidObjectId } from "mongoose";

const findVideoByIdAndOwner = async (id, owner) => {
  try {
    return await Video.findOne({
      _id: id,
      owner: owner,
    })
      .select("-createdAt -updatedAt")
      .populate("owner", "avatar fullname username");
  } catch (error) {
    throw new ApiError(
      500,
      "Error while checking if the user is owner of the video"
    );
  }
};

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;

  let filter = { isPublished: true };
  let sortObject = {};

  // filter by userId if provided
  if (userId) {
    filter.owner = userId;
  }

  // filter by query if provided
  if (query) {
    filter["$or"] = [
      { title: new RegExp(query, "i") },
      { description: new RegExp(query, "i") },
    ];
  }

  // sortBy field if provided
  if (sortBy) {
    sortObject[sortBy] = sortType === "desc" ? -1 : 1;
  }

  try {
    const videos = await Video.find(filter)
      .sort(sortObject)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate("owner", "avatar fullname username");

    const totalVideos = await Video.countDocuments(filter);

    return res.status(200).json({
      success: true,
      totalVideos,
      videos,
      message: "Videos fetched successfully",
    });
  } catch (error) {
    throw new ApiError(500, "Error occurred while fetching the videos");
  }
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    throw new ApiError(400, "Both title and description are required");
  }

  // get thumbnail and video
  let thumbnailLocalPath;
  let videoFileLocalPath;

  if (
    req.files &&
    Array.isArray(req.files.thumbnail) &&
    req.files.thumbnail.length > 0
  ) {
    thumbnailLocalPath = req.files.thumbnail[0].path;
  }

  if (
    req.files &&
    Array.isArray(req.files.videoFile) &&
    req.files.videoFile.length > 0
  ) {
    videoFileLocalPath = req.files.videoFile[0].path;
  }

  if (!thumbnailLocalPath || !videoFileLocalPath) {
    throw new ApiError(400, "Files required");
  }

  // upload thumbnail and video to cloudinary
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  if (!thumbnail || !thumbnail.url) {
    throw new ApiError(400, "Error while uploading the Thumbnail");
  }

  const videoFile = await uploadOnCloudinary(videoFileLocalPath);
  const videoUrl = videoFile.url;
  const videoDuration = convertToMMSS(videoFile.duration);

  if (!videoFile || !videoUrl) {
    throw new ApiError(400, "Error while uploading the Video");
  }

  // create an entry in db
  const video = await Video.create({
    videoFile: videoUrl,
    thumbnail: thumbnail.url,
    title,
    description,
    duration: videoDuration,
    owner: req.user._id,
    videoFilePublicId: videoFile.public_id,
    videoThumbnailPublicId: thumbnail.public_id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video published successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  try {
    const { videoId } = req.params;

    const video = await Video.findById(videoId)
      .select("-createdAt -updatedAt")
      .populate("owner", "avatar fullname username");

    if (!video) {
      throw new ApiError(404, "Video not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, video, "Video fetched successfully"));
  } catch (error) {
    throw new ApiError(400, error?.message || "Error while fetching the video");
  }
});

const updateVideoDetails = asyncHandler(async (req, res) => {
  try {
    const { videoId } = req.params;
    const { title, description } = req.body;

    if (!title && !description) {
      throw new ApiError(400, "Invalid input(s)");
    }

    // check if user is owner of the video
    const userVideo = await findVideoByIdAndOwner(videoId, req.user._id);
    if (!userVideo) {
      throw new ApiError(404, "Video not found");
    }

    // check if thumbnail is updated or not
    let thumbnailUrl = null;

    if (req.file) {
      const thumbnailLocalPath = req.file.path;
      const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

      if (!thumbnail || !thumbnail.url) {
        throw new ApiError(400, "Error while uploading the Thumbnail");
      }

      thumbnailUrl = thumbnail.url;
    }

    const video = await Video.findByIdAndUpdate(
      videoId,
      {
        $set: {
          title,
          description,
          ...(thumbnailUrl && { thumbnail: thumbnailUrl }),
        },
      },
      { new: true }
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          video,
          "Video details has been updated successfully"
        )
      );
  } catch (error) {
    throw new ApiError(400, "Error while updating the video details");
  }
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  // validate video id
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }

  // find the video by its id
  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  // delete the video and thumbnail files from Cloudinary
  try {
    // Delete video file
    await cloudinary.uploader.destroy(video.videoFilePublicId);

    // delete video thumbnail (image)
    await cloudinary.uploader.destroy(video.videoThumbnailPublicId);
  } catch (error) {
    throw new ApiError(500, "Error deleting video from Cloudinary");
  }

  // delete the video entry from the database
  await Video.findByIdAndDelete(videoId);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Video deleted successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const userVideo = await findVideoByIdAndOwner(videoId, req.user._id);

  if (!userVideo) {
    throw new ApiError(404, "Video not found");
  }

  if (userVideo.isPublished) {
    const updateVideoPublishedStatus = await Video.findByIdAndUpdate(
      videoId,
      {
        $set: {
          isPublished: false,
        },
      },
      { new: true }
    );
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updateVideoPublishedStatus,
          "Video has been unpublished successfully"
        )
      );
  } else {
    const updateVideoPublishedStatus = await Video.findByIdAndUpdate(
      videoId,
      {
        $set: {
          isPublished: true,
        },
      },
      { new: true }
    );
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updateVideoPublishedStatus,
          "Video has been published successfully"
        )
      );
  }
});

const getUserVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, sortType = "desc" } = req.query;
  const { userId } = req.params;

  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user Id");
  }

  const videos = await Video.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $match: { isPublished: true },
    },
    {
      $sort: {
        createdAt: sortType === "asc" ? 1 : -1,
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
              avatar: 1,
              username: 1,
              fullname: 1,
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
      $project: {
        _id: 1,
        owner: 1,
        videoFile: 1,
        thumbnail: 1,
        createdAt: 1,
        description: 1,
        title: 1,
        duration: 1,
        views: 1,
        isPublished: 1,
      },
    },
  ]);

  if (!videos) {
    throw new ApiError(404, "Error while fetching videos");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Videos fetched successfully"));
});

const getSubscribedVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, sortType = "desc" } = req.query;

  const subscriptions = await Subscription.find({
    subscriber: new mongoose.Types.ObjectId(req.user?._id),
  }).select("channel");

  console.log("Subscriptions in video.controller :", subscriptions);

  const channelIds = subscriptions.map((sub) => sub.channel);

  if (channelIds.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "No subscribed channels found"));
  }

  const videos = await Video.aggregate([
    {
      $match: {
        owner: {
          $in: channelIds.map((id) => new mongoose.Types.ObjectId(id)),
        },
      },
    },
    {
      $match: { isPublished: true },
    },
    {
      $sort: {
        createdAt: sortType === "asc" ? 1 : -1,
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
              avatar: 1,
              username: 1,
              fullname: 1,
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
      $project: {
        _id: 1,
        owner: 1,
        videoFile: 1,
        thumbnail: 1,
        createdAt: 1,
        description: 1,
        title: 1,
        duration: 1,
        views: 1,
        isPublished: 1,
      },
    },
  ]);

  if (!videos) {
    throw new ApiError(404, "Error while fetching videos");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, videos, "Subscribed videos fetched successfully")
    );
});

const updateViewCount = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }

  try {
    const video = await Video.findByIdAndUpdate(
      videoId,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!video) {
      throw new ApiError(
        404,
        "Error while fetching video to increase the views"
      );
    }

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Views increased successfully"));
  } catch (error) {}
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideoDetails,
  deleteVideo,
  togglePublishStatus,
  getUserVideos,
  getSubscribedVideos,
  updateViewCount,
};

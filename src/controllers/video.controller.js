import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const findVideoByIdAndOwner = async (id, owner) => {
  try {
    return await Video.findOne({
      _id: id,
      owner: owner,
    }).select("-createdAt -updatedAt");
  } catch (error) {
    throw new ApiError(
      500,
      "Error while checking if the user is owner of the video"
    );
  }
};

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;

  let filter = {};
  let sortObject = {};

  if (userId) {
    filter.owner = userId;
  }

  if (query) {
    filter["$or"] = [
      { title: new RegExp(query, "i") },
      { description: new RegExp(query, "i") },
    ];
  }

  if (sortBy) {
    sortObject[sortBy] = parseInt(sortType);
  }

  const sortAllVideo = async (page, limit, sortObject, filter) => {
    try {
      return await Video.find(filter)
        .sort(sortObject)
        .skip((page - 1) * limit)
        .limit(Number(limit));
    } catch (error) {
      throw new ApiError(500, "Error occurred while fetching the videos");
    }
  };

  const allVideos = await sortAllVideo(page, limit, sortObject, filter);

  if (allVideos?.length > 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, { allVideos }, "Videos fetched successfully"));
  } else {
    throw new ApiError(404, "No Videos found");
  }
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    throw new ApiError(400, "Invalid Input(s)");
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
  });

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video published successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  try {
    const { videoId } = req.params;

    const video = await Video.findById(videoId).select(
      "-createdAt - updatedAt"
    );

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

    if (!title || !description) {
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
  try {
    const { videoId } = req.params;

    const video = await Video.deleteOne({
      _id: videoId,
    });

    if (video.deletedCount === 0) {
      throw new ApiError(404, "Video not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Video deleted successfully"));
  } catch (error) {
    throw new ApiError(500, "An error occured while deleting the Video");
  }
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

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideoDetails,
  deleteVideo,
  togglePublishStatus,
};

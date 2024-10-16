import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  // get user id and check if it exists
  const user = await User.findOne({
    refreshToken: req.cookies.refreshToken,
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // aggregation pipelines
  const subscribersPipeline = [
    {
      $match: { subscriber: user._id },
    },
    { $count: "subscribers" },
  ];

  const videosPipeline = [
    {
      $match: { owner: user._id },
    },
    {
      $count: "videos",
    },
  ];

  const likesPipeline = [
    {
      $match: { likedBy: user._id },
    },
    {
      $count: "likes",
    },
  ];

  const viewsPipeline = [
    {
      $match: { owner: user._id },
    },
    {
      $group: {
        _id: null,
        totalViews: { $sum: "$views" },
      },
    },
    {
      $project: {
        _id: 0,
        totalViews: 1,
      },
    },
  ];

  try {
    // execute all aggregation pipelines
    const [subscribersResult, videosResult, likesResult, viewsResult] =
      await Promise.all([
        Subscription.aggregate(subscribersPipeline),
        Video.aggregate(videosPipeline),
        Like.aggregate(likesPipeline),
        Video.aggregate(viewsPipeline),
      ]);

    // extract counts and defaulting to 0 if no results
    const subscribersCount =
      subscribersResult.length > 0 ? subscribersResult[0].subscribers : 0;

    const videosCount = videosResult.length > 0 ? videosResult[0].videos : 0;

    const likesCount = likesResult.length > 0 ? likesResult[0].likes : 0;

    const viewsCount = viewsResult.length > 0 ? viewsResult[0].totalViews : 0;

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          subscribers: subscribersCount,
          videos: videosCount,
          likes: likesCount,
          views: viewsCount,
        },
        "Successfully fetched channel statistics"
      )
    );
  } catch (error) {
    throw new ApiError(
      500,
      "An error occured while fetching channel statistics"
    );
  }
});

const getChannelVideos = asyncHandler(async (req, res) => {
  // get user and check if it exists
  const user = await User.findOne({
    refreshToken: req.cookies.refreshToken,
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // get videos
  const userVideos = await Video.find({
    owner: user._id,
  });

  // check if videos got fetched or if there are no videos
  if (userVideos.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "No videos found for this user"));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        userVideos,
        "Successfully fetched all of the user's videos"
      )
    );
});

export { getChannelStats, getChannelVideos };

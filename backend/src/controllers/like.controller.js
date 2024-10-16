import { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";
import { Tweet } from "../models/tweet.model.js";
import { Snap } from "../models/snaps.model.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid Video Id");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video does not exist");
  }

  const user = await User.findOne({
    refreshToken: req.cookies.refreshToken,
  });

  if (!user) {
    return res
      .status(401)
      .json(new ApiResponse(401, null, "Unauthorized User"));
  }

  // check if the video is liked or not and toggle the like/unlike based on that
  try {
    const isLiked = await Like.findOne({
      video: videoId,
      likedBy: user._id,
    });

    if (!isLiked) {
      const like = await Like.create({
        video: videoId,
        likedBy: user._id,
      });

      return res
        .status(200)
        .json(new ApiResponse(200, like, "Video liked successfully"));
    } else {
      await Like.deleteOne({
        video: videoId,
        likedBy: user._id,
      });

      return res
        .status(200)
        .json(new ApiResponse(200, null, "Video unliked successfully"));
    }
  } catch (error) {
    throw new ApiError(
      500,
      "An error occured while toggling like/unlike of the video"
    );
  }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid Comment Id");
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "Comment does not exist");
  }

  const user = await User.findOne({
    refreshToken: req.cookies.refreshToken,
  });

  if (!user) {
    return res
      .status(401)
      .json(new ApiResponse(401, null, "Unauthorized User"));
  }

  // check if the comment is liked or not and toggle the like/unlike based on that
  try {
    const isLiked = await Like.findOne({
      comment: commentId,
      likedBy: user._id,
    });

    if (!isLiked) {
      const like = await Like.create({
        comment: commentId,
        likedBy: user._id,
      });

      return res
        .status(200)
        .json(new ApiResponse(200, like, "Comment liked successfully"));
    } else {
      await Like.deleteOne({
        comment: commentId,
        likedBy: user._id,
      });

      return res
        .status(200)
        .json(new ApiResponse(200, null, "Comment unliked successfully"));
    }
  } catch (error) {
    throw new ApiError(
      500,
      "An error occured while toggling like/unlike of the comment"
    );
  }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid Tweet Id");
  }

  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    throw new ApiError(404, "Tweet does not exist");
  }

  const user = await User.findOne({
    refreshToken: req.cookies.refreshToken,
  });

  if (!user) {
    return res
      .status(401)
      .json(new ApiResponse(401, null, "Unauthorized User"));
  }

  // check if the tweet is liked or not and toggle the like/unlike based on that
  try {
    const isLiked = await Like.findOne({
      tweet: tweetId,
      likedBy: user._id,
    });

    if (!isLiked) {
      const like = await Like.create({
        tweet: tweetId,
        likedBy: user._id,
      });

      return res
        .status(200)
        .json(new ApiResponse(200, like, "Tweet liked successfully"));
    } else {
      await Like.deleteOne({
        tweet: tweetId,
        likedBy: user._id,
      });

      return res
        .status(200)
        .json(new ApiResponse(200, null, "Tweet unliked successfully"));
    }
  } catch (error) {
    throw new ApiError(
      500,
      "An error occured while toggling like/unlike of the tweet"
    );
  }
});

const toggleSnapLike = asyncHandler(async (req, res) => {
  const { snapId } = req.params;

  if (!isValidObjectId(snapId)) {
    throw new ApiError(400, "Invalid snap id");
  }

  const snap = await Snap.findById(snapId);

  if (!snap) {
    throw new ApiError(404, "Snap does not exist");
  }

  const user = await User.findOne({
    refreshToken: req.cookies.refreshToken,
  });

  if (!user) {
    return res
      .status(401)
      .json(new ApiResponse(401, null, "Unauthorized User"));
  }

  // check if the snap is liked or not and toggle the like/unlike based on that
  try {
    const isLiked = await Like.findOne({
      snap: snapId,
      likedBy: user._id,
    });

    if (!isLiked) {
      const like = await Like.create({
        snap: snapId,
        likedBy: user._id,
      });

      return res
        .status(200)
        .json(new ApiResponse(200, like, "Snap liked successfully"));
    } else {
      await Like.deleteOne({
        snap: snapId,
        likedBy: user._id,
      });

      return res
        .status(200)
        .json(new ApiResponse(200, null, "Snap unliked successfully"));
    }
  } catch (error) {
    throw new ApiError(
      500,
      "An error occured while toggling like/unlike of the snap"
    );
  }
});

const getLikedVideos = asyncHandler(async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const user = await User.findOne({
      refreshToken: req.cookies.refreshToken,
    });

    if (!user) {
      return res
        .status(401)
        .json(new ApiResponse(401, null, "Unauthorized User"));
    }

    const likedVideos = await Like.find({
      likedBy: user._id,
      video: { $exists: true },
    });

    const videoIds = likedVideos.map((like) => like.video);

    if (videoIds.length === 0) {
      return res
        .status(200)
        .json(new ApiResponse(204, null, "No liked videos"));
    }

    const videoDetails = await Video.aggregate([
      {
        $match: {
          _id: { $in: videoIds },
        },
      },
      {
        $project: {
          title: 1,
          views: 1,
          owner: 1,
          thumbnail: 1,
          createdAt: 1,
        },
      },
      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: parseInt(limit),
      },
    ]);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          numOfVideos: videoDetails.length,
          videoDetails,
        },
        "All the liked videos fetched successfully"
      )
    );
  } catch (error) {
    throw new ApiError(500, "An error occurred while fetching liked videos");
  }
});

const getLikedTweets = asyncHandler(async (req, res) => {
  try {
    const user = await User.findOne({
      refreshToken: req.cookies.refreshToken,
    });

    if (!user) {
      return res
        .status(401)
        .json(new ApiResponse(401, null, "Unauthorized User"));
    }

    const likedTweets = await Like.find({
      likedBy: user._id,
      tweet: { $exists: true },
    });

    // Extract tweet IDs from the liked tweets
    const tweetIds = likedTweets.map((like) => like.tweet);

    if (tweetIds.length === 0) {
      return res
        .status(200)
        .json(new ApiResponse(204, null, "No liked tweets"));
    }

    const tweetDetails = await Tweet.aggregate([
      {
        $match: {
          _id: { $in: tweetIds },
        },
      },
      {
        $project: {
          content: 1,
          owner: 1,
          createdAt: 1,
        },
      },
    ]);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          numOfTweets: tweetDetails.length,
          tweetDetails,
        },
        "All the liked tweets fetched successfully"
      )
    );
  } catch (error) {
    throw new ApiError(500, "An error occured while fetching liked tweets");
  }
});

const getLikedSnaps = asyncHandler(async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const user = await User.findOne({
      refreshToken: req.cookies.refreshToken,
    });

    if (!user) {
      return res
        .status(401)
        .json(new ApiResponse(401, null, "Unauthorized User"));
    }

    const likedSnaps = await Like.find({
      likedBy: user._id,
      snap: { $exists: true },
    });

    // Extract snap IDs from the liked snaps
    const snapIds = likedSnaps.map((like) => like.snap);

    if (snapIds.length === 0) {
      return res.status(200).json(new ApiResponse(204, null, "No liked snaps"));
    }

    const snapDetails = await Snap.aggregate([
      {
        $match: {
          _id: { $in: snapIds },
        },
      },
      {
        $project: {
          title: 1,
          views: 1,
          owner: 1,
          thumbnail: 1,
          createdAt: 1,
        },
      },
      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: parseInt(limit),
      },
    ]);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          numOfSnaps: snapDetails.length,
          snapDetails,
        },
        "All the liked snaps fetched successfully"
      )
    );
  } catch (error) {
    throw new ApiError(500, "An error occured while fetching liked snaps");
  }
});

export {
  toggleVideoLike,
  toggleCommentLike,
  toggleTweetLike,
  getLikedVideos,
  getLikedTweets,
  toggleSnapLike,
  getLikedSnaps,
};

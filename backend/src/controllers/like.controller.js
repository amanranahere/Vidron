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

  try {
    // check if the video is already liked by the user
    const isLiked = await Like.findOne({
      video: videoId,
      likedBy: user._id,
    });

    if (!isLiked) {
      // user is liking the video
      await Like.create({
        video: videoId,
        likedBy: user._id,
      });

      // increment likesCount in the Video model
      video.likesCount += 1;
      await video.save();

      return res.status(200).json(
        new ApiResponse(
          200,
          {
            isLiked: true,
            likesCount: video.likesCount,
          },
          "Video liked successfully"
        )
      );
    } else {
      await Like.deleteOne({
        video: videoId,
        likedBy: user._id,
      });

      if (video.likesCount > 0) {
        video.likesCount -= 1;
      }
      await video.save();

      return res.status(200).json(
        new ApiResponse(
          200,
          {
            isLiked: false,
            likesCount: video.likesCount,
          },
          "Video unliked successfully"
        )
      );
    }
  } catch (error) {
    console.error("Error toggling like/unlike:", error);
    throw new ApiError(
      500,
      "An error occurred while toggling like/unlike of the video"
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

  try {
    // check if the comment is already liked by the user
    const isLiked = await Like.findOne({
      comment: commentId,
      likedBy: user._id,
    });

    if (!isLiked) {
      // user is liking the comment
      await Like.create({
        comment: commentId,
        likedBy: user._id,
      });

      // increment likesCount in the Comment model
      comment.likesCount += 1;
      await comment.save();

      return res.status(200).json(
        new ApiResponse(
          200,
          {
            isLiked: true,
            likesCount: comment.likesCount,
          },
          "Comment liked successfully"
        )
      );
    } else {
      await Like.deleteOne({
        comment: commentId,
        likedBy: user._id,
      });

      if (comment.likesCount > 0) {
        comment.likesCount -= 1;
      }
      await comment.save();

      return res.status(200).json(
        new ApiResponse(
          200,
          {
            isLiked: false,
            likesCount: comment.likesCount,
          },
          "Comment unliked successfully"
        )
      );
    }
  } catch (error) {
    console.error("Error toggling like/unlike:", error);
    throw new ApiError(
      500,
      "An error occurred while toggling like/unlike of the comment"
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

  try {
    // check if the tweet is already liked by the user
    const isLiked = await Like.findOne({
      tweet: tweetId,
      likedBy: user._id,
    });

    if (!isLiked) {
      // user is liking the tweet
      await Like.create({
        tweet: tweetId,
        likedBy: user._id,
      });

      // increment likesCount in the tweet model
      tweet.likesCount += 1;
      await tweet.save();

      return res.status(200).json(
        new ApiResponse(
          200,
          {
            isLiked: true,
            likesCount: tweet.likesCount,
          },
          "Tweet liked successfully"
        )
      );
    } else {
      await Like.deleteOne({
        tweet: tweetId,
        likedBy: user._id,
      });

      if (tweet.likesCount > 0) {
        tweet.likesCount -= 1;
      }
      await tweet.save();

      return res.status(200).json(
        new ApiResponse(
          200,
          {
            isLiked: false,
            likesCount: tweet.likesCount,
          },
          "Tweet unliked successfully"
        )
      );
    }
  } catch (error) {
    console.error("Error toggling like/unlike:", error);
    throw new ApiError(
      500,
      "An error occurred while toggling like/unlike of the tweet"
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

  try {
    // check if the snap is already liked by the user
    const isLiked = await Like.findOne({
      snap: snapId,
      likedBy: user._id,
    });

    if (!isLiked) {
      // user is liking the snap
      await Like.create({
        snap: snapId,
        likedBy: user._id,
      });

      // increment likesCount in the Snap model
      snap.likesCount += 1;
      await snap.save();

      return res.status(200).json(
        new ApiResponse(
          200,
          {
            isLiked: true,
            likesCount: snap.likesCount,
          },
          "Snap liked successfully"
        )
      );
    } else {
      await Like.deleteOne({
        video: snap,
        likedBy: user._id,
      });

      if (snap.likesCount > 0) {
        snap.likesCount -= 1;
      }
      await snap.save();

      return res.status(200).json(
        new ApiResponse(
          200,
          {
            isLiked: false,
            likesCount: snap.likesCount,
          },
          "Snap unliked successfully"
        )
      );
    }
  } catch (error) {
    console.error("Error toggling like/unlike:", error);
    throw new ApiError(
      500,
      "An error occurred while toggling like/unlike of the snap"
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
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "ownerDetails",
        },
      },
      {
        $project: {
          title: 1,
          views: 1,
          owner: {
            _id: 1,
            avatar: { $arrayElemAt: ["$ownerDetails.avatar", 0] },
            fullname: { $arrayElemAt: ["$ownerDetails.fullname", 0] },
            username: { $arrayElemAt: ["$ownerDetails.username", 0] },
          },
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
    const { page = 1, limit = 20 } = req.query;

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
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "ownerDetails",
        },
      },
      {
        $project: {
          content: 1,
          tweetImage: 1,
          owner: {
            _id: 1,
            avatar: { $arrayElemAt: ["$ownerDetails.avatar", 0] },
            fullname: { $arrayElemAt: ["$ownerDetails.fullname", 0] },
            username: { $arrayElemAt: ["$ownerDetails.username", 0] },
          },
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
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "ownerDetails",
        },
      },
      {
        $project: {
          title: 1,
          views: 1,
          owner: {
            _id: 1,
            avatar: { $arrayElemAt: ["$ownerDetails.avatar", 0] },
            fullname: { $arrayElemAt: ["$ownerDetails.fullname", 0] },
            username: { $arrayElemAt: ["$ownerDetails.username", 0] },
          },
          snapThumbnail: 1,
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

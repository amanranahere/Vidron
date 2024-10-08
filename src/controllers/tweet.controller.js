import { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Tweet } from "../models/tweet.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;

  if (!content) {
    throw new ApiError(400, "Content is required");
  }

  const user = await User.findOne({
    refreshToken: req.cookies.refreshToken,
  });

  if (!user) {
    return res
      .status(401)
      .json(new ApiResponse(401, null, "Unauthorized User"));
  }

  const tweet = await Tweet.create({
    content,
    owner: user._id,
  });

  if (!tweet) {
    throw new ApiError(500, "Something went wrong while creating the tweet");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet created successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid User Id");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const tweets = await Tweet.find({
    owner: userId,
  });

  if (tweets.length === 0) {
    return res.status(200).json(new ApiResponse(200, [], "User has no tweets"));
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        numOfTweets: tweets.length,
        tweets,
      },
      "All the User's tweets fetched successfully"
    )
  );
});

const updateTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const { content } = req.body;

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid Tweet Id");
  }

  if (!content) {
    throw new ApiError(400, "Content required");
  }

  // check if user is owner of the tweet
  const user = await User.findOne({
    refreshToken: req.cookies.refreshToken,
  });

  if (!user) {
    return res
      .status(401)
      .json(new ApiResponse(401, null, "Unauthorized User"));
  }

  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  if (user._id.toString() !== tweet.owner.toString()) {
    throw new ApiError(403, "Unauthorized to update this tweet");
  }

  const updatedTweet = await Tweet.findByIdAndUpdate(
    tweetId,
    {
      $set: {
        content,
      },
    },
    { new: true }
  );

  // update the tweet content
  if (!updatedTweet) {
    throw new ApiError(500, "Error while updating the tweet");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedTweet, "Tweet updated successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid Tweet Id");
  }

  // check if user is owner of the tweet
  const user = await User.findOne({
    refreshToken: req.cookies.refreshToken,
  });

  if (!user) {
    return res
      .status(401)
      .json(new ApiResponse(401, null, "Unauthorized User"));
  }

  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  if (user._id.toString() !== tweet.owner.toString()) {
    throw new ApiError(403, "Unauthorized to delete this tweet");
  }

  const deletedTweet = await Tweet.findByIdAndDelete(tweetId);

  if (!deletedTweet) {
    throw new ApiError(500, "Error occurred while deleting the tweet");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Tweet deleted successfully"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };

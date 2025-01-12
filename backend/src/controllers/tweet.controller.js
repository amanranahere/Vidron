import { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Tweet } from "../models/tweet.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;

  // validate content
  if (!content) {
    throw new ApiError(400, "Content is required");
  }

  // find the user based on the refresh token
  const user = await User.findOne({
    refreshToken: req.cookies.refreshToken,
  });

  if (!user) {
    return res
      .status(401)
      .json(new ApiResponse(401, null, "Unauthorized User"));
  }

  // tweet image variable
  let tweetImageUrl = null;

  // check if a tweet image is provided
  if (
    req.files &&
    Array.isArray(req.files.tweetImage) &&
    req.files.tweetImage.length > 0
  ) {
    const tweetImageLocalPath = req.files.tweetImage[0].path;

    const tweetImage = await uploadOnCloudinary(tweetImageLocalPath);

    if (!tweetImage || !tweetImage.url) {
      throw new ApiError(400, "Error while uploading the tweet image");
    }

    tweetImageUrl = tweetImage.url;
  }

  // create tweet
  const tweet = await Tweet.create({
    content,
    owner: user._id,
    tweetImage: tweetImageUrl || "",
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
  }).populate("owner", "username fullname avatar like");

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

const getAllTweets = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, userId, sortBy, sortType } = req.query;

  let filter = {};
  let sortObject = {};

  // filter by userId if provided
  if (userId) {
    filter.owner = userId;
  }

  // sort by sortBy field if provided
  if (sortBy) {
    sortObject[sortBy] = sortType === "desc" ? -1 : 1;
  }

  if (!sortBy) {
    sortObject["createdAt"] = -1;
  }

  try {
    const tweets = await Tweet.find(filter)
      .populate("owner", "username fullname avatar like")
      .sort(sortObject)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalTweets = await Tweet.countDocuments(filter);

    return res.status(200).json({
      success: true,
      totalTweets,
      tweets,
      message: "Tweets fetched successfully",
    });
  } catch (error) {
    throw new ApiError(500, "Error occurred while fetching the tweets");
  }
});

export { createTweet, getUserTweets, updateTweet, deleteTweet, getAllTweets };

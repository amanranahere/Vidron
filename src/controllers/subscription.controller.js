import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid Channel Id");
  }

  const channel = await User.findById(channelId);
  if (!channel) {
    return res
      .status(200)
      .json(ApiResponse(401, null, "Channel does not exist"));
  }

  const user = await User.findOne({ refreshToken: req.cookies.refreshToken });
  if (!user) {
    return res
      .status(401)
      .json(new ApiResponse(401, null, "Unauthorized User"));
  }

  // check if user is subscribed or not
  try {
    const existingSubscription = await Subscription.findOne({
      subscriber: user._id,
      channel: channelId,
    });

    if (!existingSubscription) {
      const subscribe = await Subscription.create({
        subscriber: user._id,
        channel: channelId,
      });

      return res
        .status(200)
        .json(new ApiResponse(200, subscribe, "Subscribed to the channel"));
    } else {
      const unsubscribe = await Subscription.findOneAndDelete({
        subscriber: user._id,
        channel: channelId,
      });

      return res
        .status(200)
        .json(
          new ApiResponse(200, unsubscribe, "Unsubscribed from the channel")
        );
    }
  } catch (error) {
    throw new ApiError(
      500,
      "An error occured while processing the subscription"
    );
  }
});

const getChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!channelId) {
    throw new ApiError(400, "Invalid Channel Id");
  }

  const subscribers = await Subscription.aggregate([
    {
      $match: {
        channel: new mongoose.Types.ObjectId(channelId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "subscriber",
        foreignField: "_id",
        as: "subscribers",
      },
    },
    {
      $project: {
        _id: 1,
        channel: 1,
        subscriber: 1,
        createdAt: 1,
        updatedAt: 1,
        subscribers: {
          $arrayElemAt: ["$subscribers", 0],
        },
      },
    },
    {
      $project: {
        _id: 1,
        subscriber: 1,
        channel: 1,
        subscribers: {
          username: 1,
          avatar: 1,
        },
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ]);

  if (!subscribers || subscribers.length === 0) {
    return res
      .status(404)
      .json(
        new ApiResponse(404, null, "No subscribers found for this channel")
      );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { numOfSubscribers: subscribers.length, subscribers },
        "Channel subscribers fetched successfully"
      )
    );
});

const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;

  if (!isValidObjectId(subscriberId)) {
    throw new ApiError(400, "Invalid Subscriber Id");
  }

  const channels = await Subscription.aggregate([
    {
      $match: {
        subscriber: new mongoose.Types.ObjectId(subscriberId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "subscriber",
        foreignField: "_id",
        as: "channels",
      },
    },
    {
      $project: {
        _id: 1,
        subscriber: 1,
        channel: 1,
        channels: {
          $arrayElemAt: ["$channels", 0],
        },
        createdAt: 1,
        updatedAt: 1,
      },
    },
    {
      $project: {
        _id: 1,
        subscriber: 1,
        channel: 1,
        channels: {
          username: 1,
          avatar: 1,
        },
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ]);

  if (!channels || channels.length === 0) {
    return res
      .status(404)
      .json(
        new ApiResponse(404, null, "No channels found for this subscriber")
      );
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        numOfChannelsSubscribedTo: channels.length,
        channels,
      },
      "Successfully fetched the number of channels user is subscribed to"
    )
  );
});

export { toggleSubscription, getChannelSubscribers, getSubscribedChannels };

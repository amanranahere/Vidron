import { getVideoDurationInSeconds } from "get-video-duration";
import fs from "fs";
import { isValidObjectId } from "mongoose";
import { Snap } from "../models/snaps.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { convertToMMSS } from "../utils/convertToMMSS.js";
import { cloudinary } from "../utils/cloudinary.js";

const findSnapByIdAndOwner = async (id, owner) => {
  try {
    return await Snap.findOne({
      _id: id,
      owner: owner,
    })
      .select("-createdAt -updatedAt")
      .populate("owner", "avatar fullname username");
  } catch (error) {
    throw new ApiError(
      500,
      "Error while checking if the user is owner of the snap"
    );
  }
};

const getAllSnaps = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType } = req.query;

  const filter = {};
  const sortObject = {};

  // If a query is provided, use it to filter by title or description
  if (query) {
    filter["$or"] = [
      { title: new RegExp(query, "i") },
      { description: new RegExp(query, "i") },
    ];
  }

  // If sort options are provided, set the sorting object
  if (sortBy) {
    sortObject[sortBy] = Number(sortType);
  }

  try {
    const snaps = await Snap.find(filter)
      .sort(sortObject)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .populate("owner", "avatar fullname username");

    if (snaps.length > 0) {
      return res
        .status(200)
        .json(new ApiResponse(200, { snaps }, "Snaps fetched successfully"));
    } else {
      throw new ApiError(404, "No Snaps found");
    }
  } catch (error) {
    throw new ApiError(500, "Error occurred while fetching the snaps");
  }
});

const publishASnap = asyncHandler(async (req, res) => {
  // get title and description
  const { title, description } = req.body;

  if (!title || !description) {
    throw new ApiError(400, "Both title and description are required");
  }

  // get thumbnail and snap
  let snapThumbnailLocalPath;
  let snapFileLocalPath;

  if (
    req.files &&
    Array.isArray(req.files.snapThumbnail) &&
    req.files.snapThumbnail.length > 0
  ) {
    snapThumbnailLocalPath = req.files.snapThumbnail[0].path;
  }

  if (
    req.files &&
    Array.isArray(req.files.snapFile) &&
    req.files.snapFile.length > 0
  ) {
    snapFileLocalPath = req.files.snapFile[0].path;
  }

  if (!snapThumbnailLocalPath || !snapFileLocalPath) {
    throw new ApiError(400, "Files required");
  }

  // check duration of the snap, it shouldn't exceed 30 seconds
  const duration = await getVideoDurationInSeconds(snapFileLocalPath);

  if (duration > 30) {
    // remove the snap file as it's too long
    fs.unlinkSync(snapFileLocalPath);
    throw new ApiError(
      400,
      "Video duration cannot exceed 30 seconds. Please upload a shorter video."
    );
  }

  // upload thumbnail to cloudinary
  const snapThumbnail = await uploadOnCloudinary(snapThumbnailLocalPath);

  if (!snapThumbnail || !snapThumbnail.url) {
    throw new ApiError(400, "Error while uploading the snapThumbnail");
  }

  // upload snap to cloudinary
  const snapFile = await uploadOnCloudinary(snapFileLocalPath);

  if (!snapFile || !snapFile.url) {
    throw new ApiError(400, "Error while uploading the snap");
  }

  // convert duration into formatted MM:SS
  const formattedSnapDuration = convertToMMSS(duration);

  // create an entry in db
  const snap = await Snap.create({
    snapFile: snapFile.url,
    snapThumbnail: snapThumbnail.url,
    title,
    description,
    duration: formattedSnapDuration,
    owner: req.user._id,
    snapFilePublicId: snapFile.public_id,
    thumbnailPublicId: snapThumbnail.public_id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, snap, "Snap published successfully"));
});

const getSnapById = asyncHandler(async (req, res) => {
  const { snapId } = req.params;

  // validate snap id
  if (!isValidObjectId(snapId)) {
    throw new ApiError(400, "Invalid snap id");
  }

  // get snap
  const snap = await Snap.findById(snapId)
    .select("-createdAt -updatedAt")
    .populate("owner", "avatar fullname username");

  if (!snap) {
    throw new ApiError(404, "Snap not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, snap, "Snap fetched successfully"));
});

const updateSnapDetails = asyncHandler(async (req, res) => {
  try {
    const { snapId } = req.params;
    const { title, description } = req.body;

    if (!title || !description) {
      throw new ApiError(400, "Both title and description are required");
    }

    // check if the user is owner of the snap
    const userSnap = await findSnapByIdAndOwner(snapId, req.user._id);

    if (!userSnap) {
      throw new ApiError(404, "Snap not found");
    }

    // check if thumbnail is updated or not
    let snapThumbnailUrl = null;

    if (req.file) {
      const snapThumbnailLocalPath = req.file.path;
      const snapThumbnail = await uploadOnCloudinary(snapThumbnailLocalPath);

      if (!snapThumbnail || !snapThumbnail.url) {
        throw new ApiError(400, "Error while uploading the Thumbnail");
      }

      snapThumbnailUrl = snapThumbnail.url;
    }

    const snap = await Snap.findByIdAndUpdate(
      snapId,
      {
        $set: {
          title,
          description,
          ...(snapThumbnailUrl && { snapThumbnail: snapThumbnailUrl }),
        },
      },
      { new: true }
    );

    return res
      .status(200)
      .json(
        new ApiResponse(200, snap, "Snap details has been updated successfully")
      );
  } catch (error) {
    throw new ApiError(400, "Error while updating the snap details");
  }
});

const deleteSnap = asyncHandler(async (req, res) => {
  const { snapId } = req.params;

  // validate snap id
  if (!isValidObjectId(snapId)) {
    throw new ApiError(400, "Invalid snap id");
  }

  // find the snap by its id
  const snap = await Snap.findById(snapId);

  if (!snap) {
    throw new ApiError(404, "Snap not found");
  }

  // delete the snap video and thumbnail files from Cloudinary
  try {
    // Delete snap file (video)
    await cloudinary.uploader.destroy(snap.snapFilePublicId);

    // Delete snap thumbnail (image)
    await cloudinary.uploader.destroy(snap.thumbnailPublicId);
  } catch (error) {
    throw new ApiError(500, "Error deleting snap from Cloudinary");
  }

  // delete the snap entry from the database
  await Snap.findByIdAndDelete(snapId);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Snap deleted successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { snapId } = req.params;

  const userSnap = await findVideoByIdAndOwner(snapId, req.user._id);

  if (!userSnap) {
    throw new ApiError(404, "Snap not found");
  }

  if (userSnap.isPublished) {
    const updateSnapPublishedStatus = await Snap.findByIdAndUpdate(
      snapId,
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
          updateSnapPublishedStatus,
          "Snap has been unpublished successfully"
        )
      );
  } else {
    const updateSnapPublishedStatus = await Snap.findByIdAndUpdate(
      snapId,
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
          updateSnapPublishedStatus,
          "Snap has been published successfully"
        )
      );
  }
});

const getUserSnaps = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, sortType = "desc" } = req.query;
  const { userId } = req.params;

  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user Id");
  }

  const snaps = await Snap.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
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
        snapFile: 1,
        snapThumbnail: 1,
        createdAt: 1,
        description: 1,
        title: 1,
        duration: 1,
        views: 1,
      },
    },
  ]);

  if (!snaps) {
    throw new ApiError(404, "Error while fetching snaps");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, snaps, "Snaps fetched successfully"));
});

export {
  getAllSnaps,
  publishASnap,
  getSnapById,
  updateSnapDetails,
  deleteSnap,
  togglePublishStatus,
  getUserSnaps,
};

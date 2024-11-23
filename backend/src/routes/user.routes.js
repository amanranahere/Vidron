import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  changeCurrentPassword,
  getCurrentUser,
  getUserChannelProfile,
  getVideoWatchHistory,
  getSnapWatchHistory,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  watchVideo,
  watchSnap,
} from "../controllers/user.controller.js";

const router = Router();

// routes
router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),

  registerUser
);

router.route("/login").post(loginUser);

// secured routes - user should be logged in
router.route("/logout").post(verifyJWT, logoutUser);

router.route("/refresh-token").post(refreshAccessToken);

router.route("/change-password").post(verifyJWT, changeCurrentPassword);

router.route("/current-user").get(verifyJWT, getCurrentUser);

router.route("/update-account").patch(verifyJWT, updateAccountDetails);

router
  .route("/avatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);

router
  .route("/cover-image")
  .patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage);

router.route("/channel/:username").get(verifyJWT, getUserChannelProfile);

router.route("/videos-history").get(verifyJWT, getVideoWatchHistory);

router.route("/snaps-history").get(verifyJWT, getSnapWatchHistory);

router.route("/watch-history/video/:videoId").post(verifyJWT, watchVideo);

router.route("/watch-history/snap/:snapId").post(verifyJWT, watchSnap);

export default router;

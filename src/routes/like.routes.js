import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  toggleCommentLike,
  toggleVideoLike,
  toggleTweetLike,
  getLikedTweets,
  getLikedVideos,
  toggleSnapLike,
  getLikedSnaps,
} from "../controllers/like.controller.js";

const router = Router();
router.use(verifyJWT);

// routes
router.route("/toggle/video/:videoId").post(toggleVideoLike);

router.route("/toggle/comment/:commentId").post(toggleCommentLike);

router.route("/toggle/tweet/:tweetId").post(toggleTweetLike);

router.route("/toggle/snap/:snapId").post(toggleSnapLike);

router.route("/videos").get(getLikedVideos);

router.route("/tweets").get(getLikedTweets);

router.route("/snaps").get(getLikedSnaps);

export default router;

import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideoDetails,
  deleteVideo,
  togglePublishStatus,
  getUserVideos,
  getSubscribedVideos,
  updateViewCount,
} from "../controllers/video.controller.js";

const router = Router();
router.use(verifyJWT);

// routes
router
  .route("/")
  .get(getAllVideos)
  .post(
    upload.fields([
      {
        name: "videoFile",
        maxCount: 1,
      },
      {
        name: "thumbnail",
        maxCount: 1,
      },
    ]),
    publishAVideo
  );

router
  .route("/:videoId")
  .get(getVideoById)
  .delete(deleteVideo)
  .patch(upload.single("thumbnail"), updateVideoDetails);

router.route("/user/:userId").get(getUserVideos);

router.route("/toggle/publish/:videoId").patch(togglePublishStatus);

router.route("/subscriptions").get(getSubscribedVideos);

router.route("/views/:videoId").patch(updateViewCount);

export default router;

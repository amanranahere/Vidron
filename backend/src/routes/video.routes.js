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
// router.use(verifyJWT);

// routes
router
  .route("/")
  .get(getAllVideos)
  .post(
    verifyJWT,
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
  .delete(verifyJWT, deleteVideo)
  .patch(verifyJWT, upload.single("thumbnail"), updateVideoDetails);

router.route("/user/:userId").get(getUserVideos);

router.route("/toggle/publish/:videoId").patch(verifyJWT, togglePublishStatus);

router.route("/subscriptions").get(verifyJWT, getSubscribedVideos);

router.route("/views/:videoId").patch(updateViewCount);

export default router;

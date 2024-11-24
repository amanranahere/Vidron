import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
  getAllSnaps,
  publishASnap,
  getSnapById,
  deleteSnap,
  updateSnapDetails,
  togglePublishStatus,
  getUserSnaps,
  updateViewCount,
} from "../controllers/snaps.controller.js";

const router = Router();
router.use(verifyJWT);

// routes
router
  .route("/")
  .get(getAllSnaps)
  .post(
    upload.fields([
      {
        name: "snapFile",
        maxCount: 1,
      },
      {
        name: "snapThumbnail",
        maxCount: 1,
      },
    ]),
    publishASnap
  );

router
  .route("/:snapId")
  .get(getSnapById)
  .delete(deleteSnap)
  .patch(upload.single("snapThumbnail"), updateSnapDetails);

router.route("/user/:userId").get(getUserSnaps);

router.route("/toggle/publish/:snapId").patch(togglePublishStatus);

router.route("/views/:snapId").patch(updateViewCount);

export default router;

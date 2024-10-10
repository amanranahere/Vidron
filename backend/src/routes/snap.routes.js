import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
  getAllSnaps,
  publishASnap,
  getSnapById,
  deleteSnap,
  updateSnapDetails,
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
  .route("/snap/:snapId")
  .get(getSnapById)
  .delete(deleteSnap)
  .patch(upload.single("snapThumbnail"), updateSnapDetails);

export default router;

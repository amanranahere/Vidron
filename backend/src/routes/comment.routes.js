import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getVideoComments,
  addVideoComment,
  updateComment,
  deleteComment,
  getSnapComments,
  addSnapComment,
} from "../controllers/comment.controller.js";

const router = Router();
router.use(verifyJWT);

// routes
router.route("/video/:videoId").get(getVideoComments).post(addVideoComment);

router.route("/comment/:commentId").patch(updateComment).delete(deleteComment);

router.route("/snap/:snapId").get(getSnapComments).post(addSnapComment);

export default router;

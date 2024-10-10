import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getVideoComments,
  addComment,
  updateComment,
  deleteComment,
} from "../controllers/comment.controller.js";

const router = Router();
router.use(verifyJWT);

// routes
router.route("/video/:videoId").get(getVideoComments).post(addComment);

router.route("/comment/:commentId").patch(updateComment).delete(deleteComment);

export default router;

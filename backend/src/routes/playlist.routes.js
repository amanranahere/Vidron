import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createPlaylist,
  getPlaylistById,
  getUserPlaylists,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
  getVideoPlaylist,
} from "../controllers/playlist.controller.js";

const router = Router();
// router.use(verifyJWT);

// routes

router.route("/").post(createPlaylist);

router
  .route("/playlist/:playlistId")
  .get(getPlaylistById)
  .patch(updatePlaylist)
  .delete(deletePlaylist);

router
  .route("/playlist/:playlistId/video/:videoId")
  .patch(addVideoToPlaylist)
  .delete(removeVideoFromPlaylist);

router.route("/user/:userId").get(getUserPlaylists);

router.route("/user/playlist/:videoId").get(getVideoPlaylist);

export default router;

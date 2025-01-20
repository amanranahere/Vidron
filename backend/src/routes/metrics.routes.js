import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getChannelStats,
  getChannelVideos,
  getChannelSnaps,
} from "../controllers/metrics.controller.js";

const router = Router();
// router.use(verifyJWT);

// routes
router.route("/stats/:username?").get(getChannelStats);

router.route("/videos").get(getChannelVideos);

router.route("/snaps").get(getChannelSnaps);

export default router;

import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  toggleSubscription,
  getChannelSubscribers,
  getSubscribedChannels,
} from "../controllers/subscription.controller.js";

const router = Router();
router.use(verifyJWT);

// routes
router
  .route("/channel/:channelId")
  .get(getChannelSubscribers)
  .post(toggleSubscription);

router.route("/user/:subscriberId").get(getSubscribedChannels);

export default router;

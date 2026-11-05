import { inputValidator } from "@/middlewares/input-validator.js";
import {
  generateMagicLinkSchema,
  verifyMagicLinkSchema,
} from "@repo/validation/auth";
import { Router } from "express";
import {
  generateMagicLinkController,
  sessionController,
  verifyMagicLinkController,
  logoutController,
} from "./controller.js";
import { emailRateLimiter } from "@/middlewares/email-rate-limiter.js";
import { requireGuest, requireAuth } from "@/middlewares/auth.js";

const router: Router = Router();

router.post(
  "/link/generate",
  inputValidator({
    body: generateMagicLinkSchema,
  }),
  requireGuest,
  emailRateLimiter,
  generateMagicLinkController,
);

router.post(
  "/link/verify",
  inputValidator({
    body: verifyMagicLinkSchema,
  }),
  verifyMagicLinkController,
);

router.get("/session", requireAuth, sessionController);

router.post("/logout", requireAuth, logoutController);

export default router;

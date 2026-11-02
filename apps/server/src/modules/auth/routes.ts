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
} from "./controller.js";
import { emailRateLimiter } from "@/middlewares/email-rate-limiter.js";
import { requireGuest, requireAuth } from "@/middlewares/auth.js";
import { regenerateSession, saveSession } from "@/utils/session.js";

const router: Router = Router();

router.post(
  "/link/generate",
  inputValidator(generateMagicLinkSchema),
  requireGuest,
  emailRateLimiter,
  generateMagicLinkController,
);

router.post(
  "/link/verify",
  inputValidator(verifyMagicLinkSchema),
  verifyMagicLinkController,
);

router.get("/session", requireAuth, sessionController);

export default router;

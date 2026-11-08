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
import { requireGuest, requireAuth, requireOnboarding } from "@/middlewares/auth.js";

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

router.use(requireAuth);

router.get("/session", sessionController);

router.post("/logout", requireOnboarding, logoutController);

export default router;

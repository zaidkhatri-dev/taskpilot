import { inputValidator } from "@/middlewares/input-validator.js";
import {
  generateMagicLinkSchema,
  onboardingSchema,
  verifyMagicLinkSchema,
} from "@repo/validation/auth";
import { Router } from "express";
import {
  generateMagicLinkController,
  verifyMagicLinkController,
  onboardingController,
} from "./controller.js";
import { emailRateLimiter } from "@/middlewares/email-rate-limiter.js";

const router: Router = Router();

router.post(
  "/link/generate",
  inputValidator(generateMagicLinkSchema),
  emailRateLimiter,
  generateMagicLinkController,
);

router.post(
  "/link/verify",
  inputValidator(verifyMagicLinkSchema),
  verifyMagicLinkController,
);

router.post(
  "/onboarding",
  inputValidator(onboardingSchema),
  onboardingController,
);

export default router;

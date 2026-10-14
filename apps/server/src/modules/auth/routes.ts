import { inputValidator } from "@/middlewares/input-validator.js";
import {
  generateMagicLinkSchema,
  generateOnboardingSchema,
  verifyMagicLinkSchema,
} from "@repo/validation/auth";
import { Router } from "express";
import {
  generateMagicLinkController,
  verifyMagicLinkController,
  onboardingController,
} from "./controller.js";
import { emailRateLimiter } from "@/middlewares/email-rate-limiter.js";
import { fileUpload } from "@/middlewares/file-upload.js";
import { serverConfig } from "@repo/config/server";

const router: Router = Router();

const onboardingSchema = generateOnboardingSchema(
  serverConfig.IMAGE_FILE_UPLOAD_LIMIT,
);

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
  fileUpload.single("avatar"),
  inputValidator(onboardingSchema),
  onboardingController,
);

export default router;

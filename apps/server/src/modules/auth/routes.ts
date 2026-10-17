import { inputValidator } from "@/middlewares/input-validator.js";
import {
  generateMagicLinkSchema,
  verifyMagicLinkSchema,
} from "@repo/validation/auth";
import { Router } from "express";
import {
  generateMagicLinkController,
  verifyMagicLinkController,
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

export default router;

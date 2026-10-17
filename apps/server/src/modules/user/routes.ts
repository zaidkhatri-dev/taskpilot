import { inputValidator } from "@/middlewares/input-validator.js";
import {
  checkUsernameAvailabilitySchema,
  onboardingSchema,
} from "@repo/validation/auth";
import { Router } from "express";
import {
  checkUsernameAvailabilityController,
  onboardingController,
} from "./controller.js";
import { requireAuth } from "@/middlewares/auth.js";

const router: Router = Router();

router.post(
  "/onboarding",
  inputValidator(onboardingSchema),
  onboardingController,
);

router.post(
  "/username/check",
  inputValidator(checkUsernameAvailabilitySchema),
  checkUsernameAvailabilityController,
);

router.use(requireAuth);

export default router;

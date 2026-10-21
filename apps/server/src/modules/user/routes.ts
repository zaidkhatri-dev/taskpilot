import { inputValidator } from "@/middlewares/input-validator.js";
import {
  checkUsernameAvailabilitySchema,
  onboardingSchema,
  updateMeSchema,
} from "@repo/validation/auth";
import { Router } from "express";
import {
  checkUsernameAvailabilityController,
  getMeController,
  onboardingController,
  updateMeController,
} from "./controller.js";

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

router.get("/me", getMeController);

router.patch("/me", inputValidator(updateMeSchema), updateMeController);

export default router;

import { inputValidator } from "@/middlewares/input-validator.js";
import { onboardingSchema } from "@repo/validation/user";
import { Router } from "express";
import { getMeController, onboardingController } from "./controller.js";
import { requireOnboarding } from "@/middlewares/auth.js";

const router: Router = Router();

router.post(
  "/onboarding",
  inputValidator({
    body: onboardingSchema,
  }),
  onboardingController,
);

router.use(requireOnboarding);

router.get("/me", getMeController);

// router.post(
//   "/username/check",
//   inputValidator(checkUsernameAvailabilitySchema),
//   checkUsernameAvailabilityController,
// );

// router.patch("/me", inputValidator(updateMeSchema), updateMeController);

export default router;

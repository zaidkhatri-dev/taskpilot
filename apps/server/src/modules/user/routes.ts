import { inputValidator } from "@/middlewares/input-validator.js";
import { onboardingSchema, updateMeSchema } from "@repo/validation/user";
import { Router } from "express";
import {
  getMeController,
  onboardingController,
  updateMeController,
  getWorkspaceInvitationsController,
} from "./controller.js";
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

router.patch(
  "/me",
  inputValidator({ body: updateMeSchema }),
  updateMeController,
);

router.get("/me/invitations", getWorkspaceInvitationsController);

export default router;

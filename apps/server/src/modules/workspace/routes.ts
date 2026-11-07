import { Router } from "express";
import {
  createWorkspaceController,
  getMyWorkspacesController,
  updateWorkspaceController,
  leaveWorkspaceController,
  getWorkspaceMembersController,
  acceptWorkspaceInvitationController,
} from "./controller.js";
import { inputValidator } from "@/middlewares/input-validator.js";
import {
  createWorkspaceSchema,
  updateWorkspaceSchema,
} from "@repo/validation/workspace";
import { idSchema } from "@repo/validation/shared";

const router: Router = Router();

router.get("/", getMyWorkspacesController);

router.post(
  "/",
  inputValidator({
    body: createWorkspaceSchema,
  }),
  createWorkspaceController,
);

router.patch(
  "/:id",
  inputValidator({
    params: idSchema,
    body: updateWorkspaceSchema.omit({ workspaceId: true }),
  }),
  updateWorkspaceController,
);

router.get(
  "/:id/members",
  inputValidator({ params: idSchema }),
  getWorkspaceMembersController,
);

router.post(
  "/:id/leave",
  inputValidator({ params: idSchema }),
  leaveWorkspaceController,
);

router.post(
  "/:id/accept",
  inputValidator({ params: idSchema }),
  acceptWorkspaceInvitationController,
);

export default router;

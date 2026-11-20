import { Router } from "express";
import {
  createWorkspaceController,
  getMyWorkspacesController,
  updateWorkspaceController,
  leaveWorkspaceController,
  getWorkspaceUsersController,
  acceptWorkspaceInvitationController,
  deleteWorkspaceController,
  inviteUserController
} from "./controller.js";
import { inputValidator } from "@/middlewares/input-validator.js";
import {
  createWorkspaceSchema,
  updateWorkspaceSchema,
  inviteUserSchema,
  getWorkspaceUsersSchema,
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
  "/:id/users",
  inputValidator({ params: idSchema, query: getWorkspaceUsersSchema.omit({ workspaceId: true }) }),
  getWorkspaceUsersController,
);

router.post(
  "/:id/leave",
  inputValidator({ params: idSchema }),
  leaveWorkspaceController,
);

router.post(
  "/:id/invite",
  inputValidator({
    params: idSchema,
    body: inviteUserSchema.omit({ workspaceId: true }),
  }),
  inviteUserController,
);

router.post(
  "/:id/accept",
  inputValidator({ params: idSchema }),
  acceptWorkspaceInvitationController,
);

router.delete(
  "/:id",
  inputValidator({ params: idSchema }),
  deleteWorkspaceController,
);

export default router;

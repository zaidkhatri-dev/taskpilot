import { Router } from "express";
import {
  createWorkspaceController,
  getMyWorkspacesController,
  updateWorkspaceController,
  leaveWorkspaceController,
  getWorkspaceUsersController,
  workspaceInvitationController,
  deleteWorkspaceController,
  inviteUserController,
  removeUserFromWorkspaceController,
  changeUserRoleController,
  transferOwnershipController,
} from "./controller.js";
import { inputValidator } from "@/middlewares/input-validator.js";
import {
  createWorkspaceSchema,
  updateWorkspaceSchema,
  inviteUserSchema,
  getWorkspaceUsersSchema,
  workspaceInvitationSchema,
  removeUserFromWorkspaceSchema,
  changeUserRoleSchema,
  transferOwnershipSchema,
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
  inputValidator({
    params: idSchema,
    query: getWorkspaceUsersSchema.omit({ workspaceId: true }),
  }),
  getWorkspaceUsersController,
);

router.post(
  "/:id/leave",
  inputValidator({ params: idSchema }),
  leaveWorkspaceController,
);

router.post(
  "/:id/remove",
  inputValidator({
    params: idSchema,
    body: removeUserFromWorkspaceSchema.omit({ workspaceId: true }),
  }),
  removeUserFromWorkspaceController,
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
  "/:id/invitations",
  inputValidator({
    params: idSchema,
    body: workspaceInvitationSchema.omit({ workspaceId: true }),
  }),
  workspaceInvitationController,
);

router.post(
  "/:id/change-role",
  inputValidator({
    params: idSchema,
    body: changeUserRoleSchema.omit({ workspaceId: true }),
  }),
  changeUserRoleController,
);

router.post(
  "/:id/transfer",
  inputValidator({
    params: idSchema,
    body: transferOwnershipSchema.omit({ workspaceId: true }),
  }),
  transferOwnershipController,
);

router.delete(
  "/:id",
  inputValidator({ params: idSchema }),
  deleteWorkspaceController,
);

export default router;

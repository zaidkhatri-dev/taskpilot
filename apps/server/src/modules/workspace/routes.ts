import { Router } from "express";
import {
  createWorkspaceController,
  getMyWorkspacesController,
  updateWorkspaceController,
} from "./controller.js";
import { inputValidator } from "@/middlewares/input-validator.js";
import { createWorkspaceSchema, updateWorkspaceSchema } from "@repo/validation/workspace";
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

export default router;

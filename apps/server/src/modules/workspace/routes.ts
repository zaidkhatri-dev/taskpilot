import { Router } from "express";
import {
  createWorkspaceController,
  getMyWorkspacesController,
} from "./controller.js";
import { inputValidator } from "@/middlewares/input-validator.js";
import { createWorkspaceSchema } from "@repo/validation/workspace";

const router: Router = Router();

router.get("/", getMyWorkspacesController);

router.post(
  "/",
  inputValidator(createWorkspaceSchema),
  createWorkspaceController,
);

export default router;

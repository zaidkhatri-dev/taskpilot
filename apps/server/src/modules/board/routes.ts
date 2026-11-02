import { Router } from "express";
import { getWorkspaceBoardsController } from "./controller.js";
import { inputValidator } from "@/middlewares/input-validator.js";
import { getWorkspaceBoardsSchema } from "@repo/validation/board";

const router: Router = Router();

router.get(
  "/",
  inputValidator(getWorkspaceBoardsSchema),
  getWorkspaceBoardsController,
);

export default router;

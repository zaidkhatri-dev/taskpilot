import { Router } from "express";
import { getBoardsController, createBoardController } from "./controller.js";
import { inputValidator } from "@/middlewares/input-validator.js";
import { createBoardSchema } from "@repo/validation/board";
import { idSchema } from "@repo/validation/shared";

const router: Router = Router({ mergeParams: true });

router.get(
  "/",
  inputValidator({
    params: idSchema,
  }),
  getBoardsController,
);

router.post(
  "/",
  inputValidator({
    body: createBoardSchema.omit({ workspaceId: true }),
    params: idSchema,
  }),
  createBoardController,
);

export default router;

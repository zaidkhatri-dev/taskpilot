import { Router } from "express";
import { getBoardsController, createBoardController } from "./controller.js";
import { inputValidator } from "@/middlewares/input-validator.js";
import { createBoardSchema, getBoardsSchema } from "@repo/validation/board";

const router: Router = Router({ mergeParams: true });

router.get(
  "/",
  inputValidator({
    params: getBoardsSchema,
  }),
  getBoardsController,
);

router.post(
  "/",
  inputValidator({
    body: createBoardSchema.omit({ workspaceId: true }),
    params: getBoardsSchema,
  }),
  createBoardController,
);

export default router;

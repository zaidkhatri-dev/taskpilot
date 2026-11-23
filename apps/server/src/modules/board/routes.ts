import { Router } from "express";
import {
  getBoardsController,
  createBoardController,
  updateBoardController,
  deleteBoardController,
} from "./controller.js";
import { inputValidator } from "@/middlewares/input-validator.js";
import {
  boardParamsSchema,
  createBoardSchema,
  updateBoardSchema,
  deleteBoardSchema,
} from "@repo/validation/board";
import { idSchema } from "@repo/validation/shared";

const router: Router = Router({ mergeParams: true });

router.get(
  "/",
  inputValidator({
    params: boardParamsSchema.pick({ workspaceId: true }),
  }),
  getBoardsController,
);

router.post(
  "/",
  inputValidator({
    body: createBoardSchema.omit({ workspaceId: true }),
    params: boardParamsSchema.pick({ workspaceId: true }),
  }),
  createBoardController,
);

router.patch(
  "/:boardId",
  inputValidator({
    params: boardParamsSchema,
    body: updateBoardSchema.omit({ boardId: true, workspaceId: true }),
  }),
  updateBoardController,
);

router.delete(
  "/:boardId",
  inputValidator({ params: boardParamsSchema }),
  deleteBoardController,
);

export default router;

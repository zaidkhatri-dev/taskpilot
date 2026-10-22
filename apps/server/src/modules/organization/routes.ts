import { inputValidator } from "@/middlewares/input-validator.js";
import { Router } from "express";
import { createOrganizationController } from "./controller.js";
import { createOrganizationSchema } from "@repo/validation/organization";

const router: Router = Router();

router.post(
  "/",
  inputValidator(createOrganizationSchema),
  createOrganizationController,
);

export default router;

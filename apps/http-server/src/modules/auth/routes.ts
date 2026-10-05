import { inputValidator } from "@/middlewares/input-validator.js";
import { generateLinkSchema } from "@repo/validation/auth";
import { Router } from "express";
import { generateLinkController } from "./controller.js";

const router = Router()

router.post("/generate-link", inputValidator(generateLinkSchema), generateLinkController)
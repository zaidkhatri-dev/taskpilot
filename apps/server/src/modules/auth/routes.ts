import { inputValidator } from "@/middlewares/input-validator.js";
import { generateLinkSchema } from "@repo/validation/auth";
import { Router } from "express";
import { generateLinkController } from "./controller.js";
import { emailRateLimiter } from "@/middlewares/email-rate-limiter.js";

const router: Router = Router()

router.post("/generate-link", 
    inputValidator(generateLinkSchema),
    emailRateLimiter,
    generateLinkController
)

export default router
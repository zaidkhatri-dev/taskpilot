import { inputValidator } from "@/middlewares/input-validator.js";
import { generateMagicLinkSchema, verifyMagicLinkSchema } from "@repo/validation/auth";
import { Router } from "express";
import { generateMagicLinkController, verifyMagicLinkController, checkIfSignedUpController } from "./controller.js";
import { emailRateLimiter } from "@/middlewares/email-rate-limiter.js";
import { requireAuth } from "@/middlewares/auth.js";

const router: Router = Router()

router.post("/generate-link", 
    inputValidator(generateMagicLinkSchema),
    emailRateLimiter,
    generateMagicLinkController
)

router.post("/verify-link",
    inputValidator(verifyMagicLinkSchema),
    verifyMagicLinkController
)

router.use(requireAuth)
router.get("/signed-up",
    checkIfSignedUpController
)

export default router
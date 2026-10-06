import { inputValidator } from "@/middlewares/input-validator.js";
import { generateMagicLinkSchema, verifyMagicLinkSchema, signupSchema } from "@repo/validation/auth";
import { Router } from "express";
import { generateMagicLinkController, verifyMagicLinkController, checkIfSignedUpController, signupController } from "./controller.js";
import { emailRateLimiter } from "@/middlewares/email-rate-limiter.js";
import { requireAuth } from "@/middlewares/auth.js";
import { fileUpload } from "@/middlewares/file-upload.js";

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

router.post("/signup",
    fileUpload.single('avatar'),
    inputValidator(signupSchema),
    signupController
)

export default router
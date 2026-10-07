import { inputValidator } from "@/middlewares/input-validator.js";
import { generateMagicLinkSchema, generateVerifyMagicLinkSchema, generateSignupSchema } from "@repo/validation/auth";
import { Router } from "express";
import { generateMagicLinkController, verifyMagicLinkController, profileController } from "./controller.js";
import { emailRateLimiter } from "@/middlewares/email-rate-limiter.js";
import { fileUpload } from "@/middlewares/file-upload.js";
import { serverConfig } from "@repo/config/server";

const router: Router = Router()

const verifyMagicLinkSchema = generateVerifyMagicLinkSchema(serverConfig.EMAIL_VERIFICATION_BASE_URL);
const signupSchema = generateSignupSchema(serverConfig.IMAGE_FILE_UPLOAD_LIMIT);

router.post("/generate-link", 
    inputValidator(generateMagicLinkSchema),
    emailRateLimiter,
    generateMagicLinkController
)

router.post("/verify-link",
    inputValidator(verifyMagicLinkSchema),
    verifyMagicLinkController
)

router.patch("/profile",
    fileUpload.single('avatar'),
    inputValidator(signupSchema),
    profileController
)

export default router
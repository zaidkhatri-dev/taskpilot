import multer from "multer"
import { AppError } from "@repo/errors/app-error"
import { serverConfig } from "@repo/config/server"

export const fileUpload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: serverConfig.IMAGE_FILE_UPLOAD_LIMIT,
        files: 1,
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true)
        } else {
            cb(new AppError("Invalid file type", 400))
        }
    }
})
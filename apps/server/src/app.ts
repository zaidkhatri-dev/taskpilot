import express from "express";
import type { Express, Request, Response } from "express";
import { checkIsServerShuttingDown } from "@middlewares/graceful-shutdown.js";
import { globalErrorHandler } from "@middlewares/global-error.js";
import { sessionHandler } from "@middlewares/session.js";
import cookieParser from "cookie-parser"
import cors from "cors"
import { config } from "@repo/config";

const app: Express = express()

app.use(cookieParser())
app.use(express.json())

app.use(cors({
    origin: config.CORS_ORIGIN,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
}))

app.use(checkIsServerShuttingDown)

app.get("/health", (req: Request, res: Response) => {
    res.status(200).json({
        status: "healthy",
        timestamp: Date.now(),
    })
})

app.use(sessionHandler)

app.use(globalErrorHandler)

export default app
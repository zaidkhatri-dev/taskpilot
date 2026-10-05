import express from "express";
import type { Express, Request, Response } from "express";
import { checkIsServerShuttingDown } from "@middlewares/graceful-shutdown.js";
import { globalErrorHandler } from "@middlewares/global-error.js";
import { sessionHandler } from "@middlewares/session.js";

const app: Express = express()

app.use(checkIsServerShuttingDown)

app.use(sessionHandler)

app.get("/health", (req: Request, res: Response) => {
    res.status(200).json({
        status: "ok",
        message: "TaskPilot server is running",
        timestamp: Date.now(),
    })
})

app.use(globalErrorHandler)

export default app
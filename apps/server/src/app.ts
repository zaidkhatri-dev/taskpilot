import express from "express";
import type { Express} from "express";
import { checkIsServerShuttingDown } from "@middlewares/graceful-shutdown.js";
import { globalErrorHandler } from "@middlewares/global-error.js";

const app: Express = express()

app.use(checkIsServerShuttingDown)

app.use(globalErrorHandler)

export default app
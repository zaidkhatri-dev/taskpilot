import express from "express";
import type { Express, Request, Response } from "express";
import { checkIsServerShuttingDown } from "@middlewares/graceful-shutdown.js";
import { globalErrorHandler } from "@middlewares/global-error.js";
import { sessionHandler } from "@middlewares/session.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { serverConfig } from "@repo/config/server";
import authRoutes from "@modules/auth/routes.js";
import userRoutes from "@modules/user/routes.js";
import { requireAuth } from "@middlewares/auth.js";

const app: Express = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: serverConfig.CORS_ORIGIN,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  }),
);

app.use(checkIsServerShuttingDown);

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "healthy",
    timestamp: Date.now(),
  });
});

app.set("trust proxy", 1);
app.use(sessionHandler);

const API_PREFIX = serverConfig.API_PREFIX;

app.use(`${API_PREFIX}/auth`, authRoutes);

app.use(requireAuth);
app.use(`${API_PREFIX}/user`, userRoutes);

app.use(globalErrorHandler);

export default app;

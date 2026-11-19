import express from "express";
import { boardRouter } from "./routers/board.router.js"
import { authRouter } from "./routers/auth.router.js"
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express();

app.set("trust proxy", 1)
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

const allowedOrigins = [
  "http://localhost:5173",
  'http://127.0.0.1:5173',
  process.env.FRONTEND_URL!,
];

app.use(cors({ origin: allowedOrigins, credentials: true }));

app.use("/api/boards", boardRouter);
app.use("/api/auth", authRouter);
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' })
})
export default app;
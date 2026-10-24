import express from "express";
import { boardRouter } from "./routers/board.router.js"
import { authRouter } from "./routers/auth.router.js"
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cookieParser()) 
app.use(cors({
  origin: [
    'http://localhost:5173',
    ...(process.env.FRONTEND_URL
      ? [process.env.FRONTEND_URL]
      : []),
  ],
  credentials: true,
}))

app.use("/api/boards", boardRouter);
app.use("/api/auth", authRouter);

export default app;
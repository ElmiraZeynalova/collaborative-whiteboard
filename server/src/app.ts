import express from "express";
import { boardRouter } from "./routers/board.router.js"
import { authRouter } from "./routers/auth.router.js"
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cookieParser()) 
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL, 
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        /^https:\/\/collaborative-whiteboard-.*\.vercel\.app$/.test(origin)
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use("/api/boards", boardRouter);
app.use("/api/auth", authRouter);

export default app;
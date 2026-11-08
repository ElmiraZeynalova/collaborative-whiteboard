import express from "express";
import { boardRouter } from "./routers/board.router.js"
import { authRouter } from "./routers/auth.router.js"
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express();

app.set("trust proxy", 1)
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cookieParser()) 

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL!, 
];

app.use(cors({origin: allowedOrigins, credentials: true}));

app.use("/api/boards", boardRouter);
app.use("/api/auth", authRouter);
app.get("/api/health", (_req, res) => res.send("ok"));
export default app;
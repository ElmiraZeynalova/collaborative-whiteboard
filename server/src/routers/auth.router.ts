import express from "express"
import {logIn, logOut, refresh, getMe} from '../controllers/auth.controller.js'
import { authMiddleware } from "../middlewares/authMiddleware.js"

export const authRouter = express.Router()

authRouter.post("/login", logIn)
authRouter.post("/logout", logOut)
authRouter.get("/refresh", refresh)
authRouter.get("/me", authMiddleware, getMe)
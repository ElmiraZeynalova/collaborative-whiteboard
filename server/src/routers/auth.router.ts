import express from "express"
import {logIn, logOut, refresh} from '../controllers/auth.controller.js'

export const authRouter = express.Router()

authRouter.post("/login", logIn)
authRouter.post("/logout", logOut)
authRouter.get("/refresh", refresh)
// authRouter.get("/me")
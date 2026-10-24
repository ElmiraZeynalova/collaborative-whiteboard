import express from 'express'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import {changeUserName} from '../controllers/members.controller.js'

export const membersRouter = express.Router()

membersRouter.use(authMiddleware)
membersRouter.patch("/me/name", changeUserName)
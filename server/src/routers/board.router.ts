import express from 'express'
import {getAllBoards, getBoard, createBoard, deleteBoard, joinBoard, getRoleAndUserId, changeBoardName, getAllBoardMembers, changeUserAccessToBoard, getBoardMember } from "../controllers/board.controller.js"
import { authMiddleware } from '../middlewares/authMiddleware.js'

export const boardRouter = express.Router()

boardRouter.use(authMiddleware)
boardRouter.get("/", getAllBoards)
boardRouter.get("/:id", getBoard)
boardRouter.post("/", createBoard)
boardRouter.delete("/:id", deleteBoard)
boardRouter.post("/:id/join", joinBoard)
boardRouter.get("/:id/role", getRoleAndUserId)
boardRouter.put("/:id", changeBoardName)
boardRouter.patch("/:id/members/:userId/access", changeUserAccessToBoard)
boardRouter.get("/:id/members", getAllBoardMembers)
boardRouter.get("/:id/members/:userId", getBoardMember)


import express from 'express'
import {getAllBoards, getBoard, deleteBoard, joinBoard, getRoleAndUserId, changeBoardName, getAllBoardMembers, changeUserAccessToBoard, getBoardMember, changeUserRole,  createBoard } from "../controllers/board.controller.js"
import { authMiddleware } from '../middlewares/authMiddleware.js'

export const boardRouter = express.Router()

boardRouter.post("/guest", createBoard)
boardRouter.delete("/guest/:id", deleteBoard)
boardRouter.get("/guest/:id", getBoard)
boardRouter.patch("/guest/:id", changeBoardName)

boardRouter.use(authMiddleware)
boardRouter.get("/", getAllBoards)
boardRouter.get("/:id", getBoard)
boardRouter.post("/", createBoard)
boardRouter.delete("/:id", deleteBoard)
boardRouter.post("/:id/join", joinBoard)
boardRouter.get("/:id/role", getRoleAndUserId)
boardRouter.patch("/:id", changeBoardName)
boardRouter.patch("/:id/members/:userId/access", changeUserAccessToBoard)
boardRouter.patch("/:id/members/:userId/role", changeUserRole)
boardRouter.get("/:id/members", getAllBoardMembers)
boardRouter.get("/:id/members/:userId", getBoardMember)


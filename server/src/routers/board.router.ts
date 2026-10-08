import express from 'express'
import {getAllBoards, getBoard, createBoard, deleteBoard } from "../controllers/board.controller.js"
import { authMiddleware } from '../middlewares/authMiddleware.js'

export const boardRouter = express.Router()

boardRouter.use(authMiddleware)
boardRouter.get("/", getAllBoards)
boardRouter.get("/:id", getBoard)
boardRouter.post("/", createBoard)
boardRouter.delete("/:id", deleteBoard)
// boardRouter.get("/:id/members", getAllBoardMembers) 
// boardRouter.post("/:id/members", addMemberToBoard)
// boardRouter.delete("/:id/members", deleteMemberFromBoard)
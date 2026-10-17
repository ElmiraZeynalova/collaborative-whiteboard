import type { Request, Response } from "express";
import {getAllUserBoards, getUserBoard, createUserBoard, deleteUserBoard, joinUserToBoard, getUserRoleAndId, updateBoardName, getBoardMembers, changeAccessToBoardByUserId, getBoardMemberByUserId} from '../services/board.service.js'
import {removeUserFromAwareness} from '../utils/removeUserFromAwareness.js'
import { hocuspocus } from "../index.js";

export async function getAllBoards(req: Request, res: Response){
    try{
        const data = await getAllUserBoards(req.user.id)
        const boards = data.map(board => {
            return {
                id: board.id,
                name: board.name,
                userRole: board.board_members[0].role
            }
        })
        res.status(200).json(boards)
    }catch(error){
        res.status(400).json({error: (error as Error).message})
    }
}

export async function getBoard(req: Request, res: Response){
    try{
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
        const board = await getUserBoard(id)
        res.status(200).json(board)
    }catch(error){
        res.status(400).json({error: (error as Error).message})
    }
}

export async function createBoard(req: Request, res: Response){
    try{
        const board = await createUserBoard(req.body, req.user.id)
        res.status(201).json(board)
    }catch(error){
        res.status(400).json({error: (error as Error).message})
    }
}

export async function deleteBoard(req: Request, res: Response){
    try{
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
        const board = await deleteUserBoard(id, req.user.id)
        res.status(200).json(board)
    }catch(error){
        res.status(400).json({error: (error as Error).message})
    }
}

export async function joinBoard(req: Request, res: Response){
    try{
        const boardId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
        const {userName, userColor} = req.body

        const member = await joinUserToBoard(req.user.id, boardId, userName, userColor)

        res.status(200).json(member)
    }catch(error){
        res.status(400).json({error: (error as Error).message})
    }
}

export async function getRoleAndUserId(req: Request, res: Response){
    try{
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
        const userRole = await getUserRoleAndId(req.user.id, id)
        if (!userRole) {
            return res.status(404).json({error: "User role not found"})
        }
        const {role, user_id} = userRole
        res.status(200).json({role, userId: user_id})
    }catch(error){
        res.status(400).json({error: (error as Error).message})
    }
}

export async function changeBoardName(req: Request, res: Response){
    try{
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
        const {name} = req.body
        const board = await updateBoardName(id, name, req.user.id)
        res.status(200).json(board)
    }catch(error){
        res.status(400).json({error: (error as Error).message})
    }
}

export async function changeUserAccessToBoard(req: Request, res: Response){
    try{
        const boardId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
        const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId
        const {isAllowed} = req.body
        const member = await changeAccessToBoardByUserId(boardId, userId, isAllowed)

        const documentName = `board-${boardId}`;
        const document = hocuspocus.documents.get(documentName);

        if (document) {
            removeUserFromAwareness(document.awareness, userId);
        }

        res.status(200).json(member)
    }catch(error){
        res.status(400).json({error: (error as Error).message})
    }
}

export async function getAllBoardMembers(req: Request, res: Response){
    try{
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
        const members = await getBoardMembers(id)
        res.status(200).json(members)
    }catch(error){
        res.status(400).json({error: (error as Error).message})
    }

}

export async function getBoardMember(req: Request, res: Response){
    try{
        const boardId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
        const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId
        const member = await getBoardMemberByUserId(boardId, userId)
        res.status(200).json(member)
    }catch(error){
        res.status(400).json({error: (error as Error).message})
    }
}


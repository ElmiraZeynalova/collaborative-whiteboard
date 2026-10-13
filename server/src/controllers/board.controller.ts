import type { Request, Response } from "express";
import {getAllUserBoards, getUserBoard, createUserBoard, deleteUserBoard, addUserToBoard, getUserRoleAndId, updateBoardName, getBoardMembers} from '../services/board.service.js'

export async function getAllBoards(req: Request, res: Response){
    try{
        const boards = await getAllUserBoards(req.user.id)
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
        const board = await deleteUserBoard(id)
        res.status(200).json(board)
    }catch(error){
        res.status(400).json({error: (error as Error).message})
    }
}

export async function joinBoard(req: Request, res: Response){
    try{
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
        const member = await addUserToBoard(req.user.id, id)
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
        const board = await updateBoardName(id, name)
        res.status(200).json(board)
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
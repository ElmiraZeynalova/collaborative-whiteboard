import type { Request, Response } from "express";
import {getAllUserBoards, getUserBoard, createUserBoard, deleteUserBoard} from '../services/board.service.js'

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
        const board = await createUserBoard(req.body)
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

// export default function addUserToBoard(req: Request, res: Response){

// }

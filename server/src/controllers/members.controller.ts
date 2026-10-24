import type { Request, Response } from "express";
import {changeUsername} from '../services/members.service.js'

export async function changeUserName(req: Request, res: Response){
    try{
        const {name} = req.body
        const user = await changeUsername(req.user.id, name)
        res.status(200).json(user)
    }catch(error){
        res.status(400).json({error: (error as Error).message})
    }
}

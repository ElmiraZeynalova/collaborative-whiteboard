import {logInUser} from '../services/auth.service.js'
import type {Request, Response} from 'express'
import { generateTokens } from '../utils/generateTokens.js'

export async function logIn(req: Request, res: Response){
    try{
        const {refreshToken, accessToken} = await logInUser(req.body)
        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: true,
            maxAge: 60 * 24 * 60 * 60 * 1000,
        })
        res.status(201).json(accessToken)
    }catch(error){
        res.status(400).json({error: (error as Error).message})
    }
}

export async function logOut(req: Request, res: Response){
    try{
        res.cookie("jwt", "", {
            httpOnly: true,
            expires: new Date(0)
        })
        res.status(200).json({status: "success", message: "Logged out successfully"})
    }catch(error){
        res.status(400).json({error: (error as Error).message})
    }
}

export async function refresh(req: Request, res: Response){
    try{
        const {accessToken, refreshToken} = generateTokens(req.user.id)
        res.cookie('jwt', refreshToken, {
            httpOnly: true,                                   
            secure: true,                                        
            maxAge: 60 * 24 * 60 * 60 * 1000,                     
        })
        res.status(201).json({accessToken})
    }catch(error){
        res.status(400).json({error: (error as Error).message})
    }
}
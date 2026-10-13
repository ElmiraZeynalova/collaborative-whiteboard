import {logInUser, logoutUser, refreshJWTToken, getUser} from '../services/auth.service.js'
import type {Request, Response} from 'express'

const isProduction = process.env.NODE_ENV === 'production'

const refreshCookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' as const : 'lax' as const,
    maxAge:  60 * 24 * 60 * 60 * 1000
}

export async function logIn(req: Request, res: Response){
    try{
        const {refreshToken, accessToken} = await logInUser(req.body)
        res.cookie('jwt', refreshToken, refreshCookieOptions)
        res.status(200).json({ accessToken })
    }catch(error){
        res.status(401).json({error: (error as Error).message})
    }
}

export async function logOut(req: Request, res: Response) {
    res.clearCookie('jwt', {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' as const : 'lax' as const,
    })

    try {
        const refreshToken = req.cookies?.jwt

        if (refreshToken) {
            await logoutUser(refreshToken)
        }

        return res.status(200).json({
            status: 'success',
            message: 'Logged out successfully',
        })
    } catch (error) {
        console.error('Logout failed:', error)

        return res.status(500).json({
            error: 'Failed to log out',
        })
    }
}

export async function refresh(req: Request, res: Response){
    try{
        const expiredRefreshToken = req.cookies?.jwt

        if (!expiredRefreshToken) {
            return res.status(401).json({
                error: 'Refresh token missing',
            })
        }
        const {refreshToken, accessToken} = await refreshJWTToken(expiredRefreshToken)
        res.cookie('jwt', refreshToken, refreshCookieOptions)
        res.status(200).json({ accessToken })
    }catch(error){
        res.status(401).json({error: (error as Error).message})
    }
}

export async function getMe(req: Request, res: Response) {
    try {

        const user = await getUser(req.user.id)

        if (!user) {
            return res.status(401).json({
                error: 'User not found',
            })
        }

        return res.status(200).json({ user })
    } catch (error) {
        console.error(error)

        return res.status(500).json({
            error: 'Internal server error',
        })
    }
}
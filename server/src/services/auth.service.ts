import {prisma} from '../prisma.js'
import bcrypt from 'bcrypt'
import { generateTokens } from '../utils/generateTokens.js'

type Credentials = {
    userId: string
    userName: string
    email: string
    password: string
}

export async function logInUser(credentials: Credentials){
    const existingUser = await prisma.app_users.findUnique({
        where: {email: credentials.email}
    })

    if(existingUser){
        const match = await bcrypt.compare(credentials.password, existingUser.password)
        if(match){
            const tokens = generateTokens(credentials.userId)
            return tokens
        }else{
            throw new Error("Invalid password")
        }
    }else{
        const hashedPassword = await bcrypt.hash(credentials.password, 10)
        await prisma.app_users.create({ 
            data: {
                id: credentials.userId,
                username: credentials.userName,
                email: credentials.email,
                password: hashedPassword
            }
        })
        const tokens = generateTokens(credentials.userId)
        return tokens
    }
}

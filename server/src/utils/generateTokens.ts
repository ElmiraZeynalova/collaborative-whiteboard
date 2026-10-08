import jwt from 'jsonwebtoken'

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET

if (!JWT_REFRESH_SECRET || !JWT_ACCESS_SECRET) {
    throw new Error('JWT SECRET is not defined in environment variables')
}


export const generateTokens = (userId: string) => {
    const payload = {id: userId}
    const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, {
        expiresIn: "1d" 
    })
    const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
        expiresIn: "60d"
    })
    return {accessToken, refreshToken}
}
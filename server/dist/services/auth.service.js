import { prisma } from '../prisma.js';
import bcrypt from 'bcrypt';
import { generateTokens } from '../utils/generateTokens.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
export async function logInUser(credentials) {
    const existingUser = await prisma.app_users.findUnique({
        where: { email: credentials.email }
    });
    if (existingUser) {
        const match = await bcrypt.compare(credentials.password, existingUser.password);
        if (match) {
            const { accessToken, refreshToken } = generateTokens(existingUser.id);
            const hash = crypto
                .createHash('sha256')
                .update(refreshToken)
                .digest('hex');
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 60);
            await prisma.app_sessions.create({
                data: {
                    refresh_token_hash: hash,
                    expires_at: expiresAt,
                    user_id: existingUser.id
                }
            });
            return { accessToken, refreshToken, userId: existingUser.id };
        }
        else {
            throw new Error("Invalid password");
        }
    }
    else {
        const userId = crypto.randomUUID();
        const hashedPassword = await bcrypt.hash(credentials.password, 10);
        await prisma.app_users.create({
            data: {
                id: userId,
                email: credentials.email,
                password: hashedPassword
            }
        });
        const { accessToken, refreshToken } = generateTokens(userId);
        const hash = crypto
            .createHash('sha256')
            .update(refreshToken)
            .digest('hex');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 60);
        await prisma.app_sessions.create({
            data: {
                refresh_token_hash: hash,
                expires_at: expiresAt,
                user_id: userId
            }
        });
        return { accessToken, refreshToken, userId: userId };
    }
}
export async function refreshJWTToken(refreshToken) {
    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) {
        throw new Error('JWT_REFRESH_SECRET is not defined');
    }
    const decoded = jwt.verify(refreshToken, secret);
    const hash = crypto
        .createHash('sha256')
        .update(refreshToken)
        .digest('hex');
    const session = await prisma.app_sessions.findUnique({
        where: { refresh_token_hash: hash }
    });
    if (!session) {
        throw new Error('Invalid refresh session');
    }
    if (session.expires_at <= new Date()) {
        throw new Error('Refresh session expired');
    }
    if (decoded.id !== session.user_id) {
        throw new Error('Invalid refresh token');
    }
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(session.user_id);
    const newHash = crypto
        .createHash('sha256')
        .update(newRefreshToken)
        .digest('hex');
    await prisma.app_sessions.update({
        where: { id: session.id },
        data: { refresh_token_hash: newHash }
    });
    return {
        accessToken,
        refreshToken: newRefreshToken
    };
}
export async function logoutUser(refreshToken) {
    const hash = crypto
        .createHash('sha256')
        .update(refreshToken)
        .digest('hex');
    return prisma.app_sessions.deleteMany({
        where: { refresh_token_hash: hash }
    });
}
export async function getUser(userId) {
    return prisma.app_users.findUnique({
        where: { id: userId },
        select: {
            id: true,
        },
    });
}

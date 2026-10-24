import jwt from 'jsonwebtoken';
import { prisma } from '../prisma.js';
export async function authMiddleware(req, res, next) {
    const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
    if (!JWT_ACCESS_SECRET) {
        throw new Error("JWT_ACCESS_SECRET is not defined");
    }
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({
            error: "Access token missing"
        });
    }
    const accessToken = authHeader.split(" ")[1];
    if (!accessToken) {
        return res.status(401).json({
            error: "Access token missing"
        });
    }
    try {
        const decoded = jwt.verify(accessToken, JWT_ACCESS_SECRET);
        const user = await prisma.app_users.findUnique({
            where: { id: decoded.id },
        });
        if (!user) {
            return res.status(401).json({ error: "User no longer exists" });
        }
        req.user = { id: decoded.id };
        next();
    }
    catch {
        res.status(401).json({ error: 'Invalid token' });
    }
}

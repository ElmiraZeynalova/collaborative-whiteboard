import { logInUser, logoutUser, refreshJWTToken, getUser } from '../services/auth.service.js';
const isProduction = process.env.NODE_ENV === 'production';
const refreshCookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 60 * 24 * 60 * 60 * 1000
};
export async function logIn(req, res) {
    try {
        const { refreshToken, accessToken, userId } = await logInUser(req.body);
        res.cookie('jwt', refreshToken, refreshCookieOptions);
        res.status(200).json({ accessToken, userId });
    }
    catch (error) {
        res.status(401).json({ error: error.message });
    }
}
export async function logOut(req, res) {
    res.clearCookie('jwt', {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
    });
    try {
        const refreshToken = req.cookies?.jwt;
        if (refreshToken) {
            await logoutUser(refreshToken);
        }
        return res.status(200).json({
            status: 'success',
            message: 'Logged out successfully',
        });
    }
    catch (error) {
        console.error('Logout failed:', error);
        return res.status(500).json({
            error: 'Failed to log out',
        });
    }
}
export async function refresh(req, res) {
    try {
        const expiredRefreshToken = req.cookies?.jwt;
        if (!expiredRefreshToken) {
            return res.status(401).json({
                error: 'Refresh token missing',
            });
        }
        const { refreshToken, accessToken } = await refreshJWTToken(expiredRefreshToken);
        res.cookie('jwt', refreshToken, refreshCookieOptions);
        res.status(200).json({ accessToken });
    }
    catch (error) {
        res.status(401).json({ error: error.message });
    }
}
export async function getMe(req, res) {
    try {
        const user = await getUser(req.user.id);
        if (!user) {
            return res.status(401).json({
                error: 'User not found',
            });
        }
        return res.status(200).json({ userId: user.id });
    }
    catch (error) {
        return res.status(500).json({
            error: 'Internal server error',
        });
    }
}

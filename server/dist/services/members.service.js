import { prisma } from '../prisma.js';
export async function changeUsername(userId, name) {
    return prisma.app_users.update({
        where: { id: userId },
        data: { name: name },
    });
}
export async function getUserById(userId) {
    return prisma.app_users.findUnique({
        where: { id: userId },
    });
}

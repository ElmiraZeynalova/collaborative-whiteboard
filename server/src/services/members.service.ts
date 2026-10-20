import {prisma} from '../prisma.js'

export async function changeUsername(userId: string, name: string){
    return prisma.app_users.update({
        where: {id: userId},
        data: {name: name},
    })
}

export async function getUserById(userId: string){
    return prisma.app_users.findUnique({
        where: {id: userId},
    })
}
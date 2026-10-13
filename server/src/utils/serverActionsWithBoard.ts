import {prisma} from '../prisma.js'

export async function saveBoardState(state: Uint8Array, boardId: string){
    return prisma.boards.update({
        where: {id: boardId},
        data: {state: Buffer.from(state) }
    })
}

export async function getBoardState(boardId: string){
    return prisma.boards.findUnique({
        where: {id: boardId},
        select: {state: true}
    })
}
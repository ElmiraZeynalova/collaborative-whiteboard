import {prisma} from '../prisma.js'

type Board = {
    id: string,
    name: string,
    state: Uint8Array<ArrayBuffer>
}

export async function getAllUserBoards(userId: string){
    return prisma.boards.findMany({
        where: {
            board_members: {
                some: {
                    user_id: userId,
                },
            },
        },
    });
}

export async function getUserBoard(boardId: string){
    return prisma.boards.findUnique({
        where: {id: boardId},
    });
}

export async function createUserBoard(board: Board) {

    const data = {
        id: board.id,
        name: board.name,
        state: Buffer.from(board.state),
    };

    return prisma.boards.create({data});
}

export async function deleteUserBoard(boardId: string){
    await prisma.boards.delete({where: {id: boardId}})
    return prisma.board_members.deleteMany({where: {board_id: boardId}});
}

// export default function addUserToBoard(boardId: string, userId: string){

// }

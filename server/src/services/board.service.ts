import {prisma} from '../prisma.js'

type Board = {
    id: string,
    name: string,
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

export async function createUserBoard(board: Board, userId: string) {

    return prisma.boards.create({
        data: {
            id: board.id,
            name: board.name,
            board_members: {
                create: {
                    user_id: userId,
                    role: 'owner',
                },
            },
    }});
}

export async function deleteUserBoard(boardId: string){
    return prisma.boards.delete({where: {id: boardId}})
}

export async function joinUserToBoard(userId: string, boardId: string, userName: string, userColor: string) {
    const existingBoard = await prisma.boards.findUnique({
        where: { id: boardId },
        select: { id: true },
    })

    if (!existingBoard) {
        throw new Error("Board not found")
    }

    return prisma.board_members.upsert({
        where: {
            board_id_user_id: {
                user_id: userId,
                board_id: boardId,
            },
        },
        create: {
            user_id: userId,
            board_id: boardId,
            role: "contributor",
            color: userColor,
            name: userName
        },
        update: {name: userName, color: userColor},
    })

}

export async function getUserRoleAndId(userId: string, boardId: string){
    return prisma.board_members.findUnique({
        where: {
            board_id_user_id: {
                user_id: userId,
                board_id: boardId,
            },
        },
        select: {role: true, user_id: true}
    })
}

export async function updateBoardName(boardId: string, newName: string){
    return prisma.boards.update({
        where: {id: boardId},
        data: {name: newName}
    })
}

export async function getBoardMembers(boardId: string){
    return prisma.board_members.findMany({
        where: {
            board_id: boardId,
        }
    })
}

export async function changeAccessToBoardByUserId(boardId: string, userId: string, isAllowed: boolean){
    return prisma.board_members.update({
        where: {
            board_id_user_id: {
                user_id: userId,
                board_id: boardId,
            },
        },
        data: {access: isAllowed}
    })
}

export async function getBoardMemberByUserId(boardId: string, userId: string){
    return prisma.board_members.findUnique({
        where: {
            board_id_user_id: {
                user_id: userId,
                board_id: boardId,
            },
        }
    })
}
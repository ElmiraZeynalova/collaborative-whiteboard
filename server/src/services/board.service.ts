import {prisma} from '../prisma.js'

type Board = {
    id: string,
    name: string,
}

type MemberToJoin = {
    board_id: string
    name?: string
    color?: string
    is_hidden?: boolean
}


export async function getAllUserBoards(userId: string) {
    return prisma.boards.findMany({
        where: {
            board_members: {
                some: {
                    user_id: userId,
                    is_hidden: false,
                },
            },
        },
        include: {
            board_members: {
                where: { user_id: userId },
                select: { role: true },
            },
        },
    })
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

export async function deleteUserBoard(boardId: string, userId: string) {
    const member = await prisma.board_members.findUnique({
        where: {
            board_id_user_id: {
                user_id: userId,
                board_id: boardId,
            },
        },
        select: {
            role: true,
        },
    })

    if (!member) {
        throw new Error('You are not a member of this board')
    }

    if (member.role === 'owner') {
        return prisma.boards.delete({
            where: { id: boardId },
        })
    }
    
    return prisma.board_members.update({
        where: {
            board_id_user_id: {
                board_id: boardId,
                user_id: userId,
            },
        },
        data: {
            is_hidden: true,
        },
    })
}

export async function joinUserToBoard(userId: string, boardId: string, member: MemberToJoin) {
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
            role: "contributor",
            ...member
        },
        update: member,
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

export async function updateBoardName(boardId: string, newName: string, userId: string){
    const userRole = await prisma.board_members.findUnique({
        where: { 
            board_id_user_id: {
                user_id: userId,
                board_id: boardId,
            },
        },
        select: {role: true}
    })

    if(!userRole || userRole.role === "contributor") throw new Error("You don't have permission to rename this board")

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

export async function changeAccessToBoardByUserId(myId: string, boardId: string, userId: string, isAllowed: boolean){

    const member = await prisma.board_members.findUnique({
        where: {
            board_id_user_id: {
                user_id: myId,
                board_id: boardId,
            },
        },
        select: {role: true}
    })

    if(!member || member.role === "contributor") throw new Error("You don't have permission to change this member's access to board.")

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

export async function changeUserBoardRole(myId: string, boardId: string, userId: string, role: string){
    const member = await prisma.board_members.findUnique({
        where: {
            board_id_user_id: {
                user_id: myId,
                board_id: boardId,
            },
        },
        select: {role: true}
    })

    if(!member || member.role !== "owner") throw new Error("You don't have permission to change this member's role.")

    return prisma.board_members.update({
        where: {
            board_id_user_id: {
                user_id: userId,
                board_id: boardId,
            },
        },
        data: {role: role}
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
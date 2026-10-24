import { getBoardMemberByUserId } from "../services/board.service.js"

export async function checkBoardAccess(boardId: string, userId: string){
    const member = await getBoardMemberByUserId(boardId, userId)
    if(member && !member.access) throw new Error('Access denied')
    return member
}
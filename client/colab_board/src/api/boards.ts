import {apiClient} from './client'

type Board = {
    id: string
    name: string
}
type MemberToJoin = {
    board_id: string
    name?: string
    color?: string
    is_hidden?: boolean
}

export async function getAllUsersBoards(){
    const {data} = await apiClient.get("/api/boards/")
    return data 
}

export async function getAccountBoard(boardId: string){
    const {data} = await apiClient.get(`/api/boards/${boardId}`)
    return data 
}


export async function getGuestBoard(boardId: string){
    const {data} = await apiClient.get(`/api/boards/guest/${boardId}`)
    return data 
}

export async function createAccountBoard(board: Board){
    const {data} = await apiClient.post("/api/boards/", board)
    return data 
}

export async function createGuestBoard(board: Board){
    const {data} = await apiClient.post("/api/boards/guest", board)
    return data 
}

export async function joinBoard(member: MemberToJoin){
    const {data} = await apiClient.post(`/api/boards/${member.board_id}/join`, member)
    return data 
}

export async function getUserRoleAndUserId(boardId: string){
    const {data} = await apiClient.get(`/api/boards/${boardId}/role`)
    return data 
}

export async function changeAccountBoardName(boardId: string, name: string){
    const {data} = await apiClient.patch(`/api/boards/${boardId}`, {name})
    return data
}

export async function changeGuestBoardName(boardId: string, name: string){
    const {data} = await apiClient.patch(`/api/boards/guest/${boardId}`, {name})
    return data
}

export async function deleteGuestBoard(boardId: string){
    const {data} = await apiClient.delete(`/api/boards/guest/${boardId}`)
    return data
}


export async function deleteAccountBoard(boardId: string){
    const {data} = await apiClient.delete(`/api/boards/${boardId}`)
    return data
}

export async function getAllBoardMembers(boardId: string){
    const {data} = await apiClient.get(`/api/boards/${boardId}/members`)
    return data
}

export async function changeUserAccessToBoard(boardId: string, userId: string, access: boolean){
    const {data} = await apiClient.patch(`/api/boards/${boardId}/members/${userId}/access`, {isAllowed: access})
    return data
}

export async function changeUserRole(boardId: string, userId: string, role: string){
    const {data} = await apiClient.patch(`/api/boards/${boardId}/members/${userId}/role`, {role})
    return data
}

export async function getBoardMember(boardId: string, userId: string){
    const {data} = await apiClient.get(`/api/boards/${boardId}/members/${userId}`)
    return data
}


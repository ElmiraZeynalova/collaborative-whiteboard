import {apiClient} from './client'

type Board = {
    id: string
    name: string
    type: "local" | "server"
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

export async function getBoard(boardId: string){
    const {data} = await apiClient.get(`/api/boards/${boardId}`)
    return data 
}

export async function createServerBoard(board: Board){
    const {data} = await apiClient.post("/api/boards/", board)
    return data 
}

export async function createLocalBoard(board: Board){
    const {data} = await apiClient.post("/api/boards/local", board)
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

export async function changeBoardName(boardId: string, name: string){
    const {data} = await apiClient.patch(`/api/boards/${boardId}`, {name})
    return data
}

export async function deleteBoard(boardId: string){
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


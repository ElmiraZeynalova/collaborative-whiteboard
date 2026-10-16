import {apiClient} from './client'

type Board = {
    id: string
    name: string
}

export async function getAllUsersBoards(){
    const {data} = await apiClient.get("/api/boards/")
    return data 
}

export async function getBoard(boardId: string){
    const {data} = await apiClient.get(`/api/boards/${boardId}`)
    return data 
}

export async function createBoard(board: Board){
    const {data} = await apiClient.post("/api/boards/", board)
    return data 
}

export async function joinBoard(boardId: string, userName: string, userColor: string){
    const {data} = await apiClient.post(`/api/boards/${boardId}/join`, {userName, userColor})
    return data 
}

export async function getUserRoleAndUserId(boardId: string){
    const {data} = await apiClient.get(`/api/boards/${boardId}/role`)
    return data 
}

export async function changeBoardName(boardId: string, name: string){
    const {data} = await apiClient.put(`/api/boards/${boardId}`, {name})
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

export async function getBoardMember(boardId: string, userId: string){
    const {data} = await apiClient.get(`/api/boards/${boardId}/members/${userId}`)
    return data
}


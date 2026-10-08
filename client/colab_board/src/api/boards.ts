import {apiClient} from './client'

type Board = {
    id: string,
    name: string,
    state: Uint8Array<ArrayBuffer>
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
    const {data} = await apiClient.post("/api/boards/", {board})
    return data 
}


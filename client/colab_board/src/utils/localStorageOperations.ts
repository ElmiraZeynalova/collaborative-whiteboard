import type { Board } from "../types/board"

export function saveBoardToLocalStorage(id: string, name: string) {
    const existingBoards = JSON.parse(localStorage.getItem("boards") ?? "[]") ?? []
    const existingBoard = existingBoards.find((b: Board) => b.id === id)
    if(existingBoard) return
    existingBoards.push({ id, name })

    localStorage.setItem("boards", JSON.stringify(existingBoards))
}

export function deleteBoardFromLocalStorage(boardId: string){
    const existingBoards = JSON.parse(localStorage.getItem("boards") ?? "[]") ?? []
    const updatedBoards = existingBoards.length > 0 ? existingBoards.filter((b:Board) => b.id !== boardId) : []
    localStorage.setItem("boards", JSON.stringify(updatedBoards)) 
}

export async function updateBoardNameInLocalStorage(boardId: string, boardName: string){
    const localBoards = JSON.parse(localStorage.getItem("boards") ?? "[]") ?? []
    if(localBoards.length === 0) return
    const updatedBoards = localBoards.map((board: Board) => {
        return board.id === boardId ? {id: board.id, name: boardName} : board
    })
    localStorage.setItem("boards", JSON.stringify(updatedBoards))
}

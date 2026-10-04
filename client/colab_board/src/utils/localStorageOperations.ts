export type StoredBoard = {
    id: string
    name: string
}

export function saveBoardToLocalStorage(board: StoredBoard) {
    const boards: StoredBoard[] =
        JSON.parse(localStorage.getItem('boards') ?? '[]')

    if (boards.some(b => b.id === board.id)) return

    localStorage.setItem(
        'boards',
        JSON.stringify([...boards, board])
    )
}
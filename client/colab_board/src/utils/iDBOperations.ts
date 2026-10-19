export function deleteLocalBoardFromIDB(boardId: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.deleteDatabase(boardId)

        request.onsuccess = () => resolve()

        request.onerror = () => {
            reject(request.error)
        }

        request.onblocked = () => {
            reject(new Error('Database deletion is blocked by an open connection'))
        }
    })
}
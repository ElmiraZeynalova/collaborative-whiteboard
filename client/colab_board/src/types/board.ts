export type DBBoard = {
    id: string
    createdAt: Date
    updatedAt: Date
    name: string
    state: Uint8Array
}

export type Board = {
    id: string
    name: string
    userRole?: string
}


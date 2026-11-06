// export type DBBoard = {
//     id: string
//     createdAt: Date
//     updatedAt: Date
//     name: string
//     state: Uint8Array
//     type: "local" | "server"
// }

//export type BoardType = "guest" | "account"

export type Board = {
    id: string
    name: string
    userRole?: string
    isGuest: boolean
}


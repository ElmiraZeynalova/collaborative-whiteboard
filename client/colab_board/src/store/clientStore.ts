import {create} from 'zustand'
export type Mode = "local" | "server"

interface ClientStore {
    boardMode: null | Mode
    userId: string | null
    userRole: "owner" | "contributor" | null
    userName: string | null
    userColor: string | null
    isBanned: boolean
    deletedBoardId: string | null
    boardId: string | null
    boardName: string | null
    setBoardMode: (mode: Mode) => void
    setUserId: (id: string | null) => void
    setUserRole: (role:  "owner" | "contributor") => void
    setUserName: (name: string) => void
    setUserColor: (color: string) => void
    setIsBanned: (state: boolean) => void
    setDeletedBoardId: (id: string) => void
    setBoardId: (id: string | null) => void
    setBoardName: (name: string | null) => void
}

export const useClientStore = create<ClientStore>()((set) => ({
    boardMode: null,
    userId: null,
    userRole: null,
    userName: null,
    userColor: null,
    isBanned: false,
    deletedBoardId: null,
    boardId: null,
    boardName: null,
    setBoardMode: (mode) => set({boardMode: mode}),
    setUserId: (id) => set({userId: id}),
    setUserRole: (role) => set({userRole: role}),
    setUserName: (name) => set({userName: name}),
    setUserColor: (color) => set({userColor: color}),
    setIsBanned: (state) => set({isBanned: state}),
    setDeletedBoardId: (id: string) => set({deletedBoardId: id}),
    setBoardId: (id) => set({boardId: id}),
    setBoardName: (name) => set({boardName: name}),
}))
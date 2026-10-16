import {create} from 'zustand'

interface ClientStore {
    userId: string | null
    userRole: "owner" | "contributor" | null
    userName: string | null
    userColor: string | null
    isBanned: boolean
    boardId: string | null
    boardName: string | null
    setUserId: (id: string | null) => void
    setUserRole: (role:  "owner" | "contributor") => void
    setUserName: (name: string) => void
    setUserColor: (color: string) => void,
    setIsBanned: (state: boolean) => void
    setBoardId: (id: string | null) => void
    setBoardName: (name: string | null) => void
}

export const useClientStore = create<ClientStore>()((set) => ({
    userId: null,
    userRole: null,
    userName: null,
    userColor: null,
    isBanned: false,
    boardId: null,
    boardName: null,
    setUserId: (id) => set({userId: id}),
    setUserRole: (role) => set({userRole: role}),
    setUserName: (name) => set({userName: name}),
    setUserColor: (color) => set({userColor: color}),
    setIsBanned: (state) => set({isBanned: state}),
    setBoardId: (id) => set({boardId: id}),
    setBoardName: (name) => set({boardName: name}),
}))
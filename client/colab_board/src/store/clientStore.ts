import {create} from 'zustand'

interface ClientStore {
    userId: string | null
    userRole: "owner" | "contributor" | null
    userName: string | null
    boardId: string | null
    boardName: string | null
    setUserId: (id: string) => void
    setUserRole: (role:  "owner" | "contributor") => void
    setUserName: (name: string) => void
    setBoardId: (id: string | null) => void
    setBoardName: (name: string | null) => void
}

export const useClientStore = create<ClientStore>()((set) => ({
    userId: null,
    userRole: null,
    userName: null,
    boardId: null,
    boardName: null,
    setUserId: (id) => set({userId: id}),
    setUserRole: (role) => set({userRole: role}),
    setUserName: (name) => set({userName: name}),
    setBoardId: (id) => set({boardId: id}),
    setBoardName: (name) => set({boardName: name}),
}))
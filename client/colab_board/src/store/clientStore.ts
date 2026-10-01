import {create} from 'zustand'

interface ClientStore {
    userId: string | null
    userName: string | null
    boardId: string | null
    boardName: string | null
    setUserId: (id: string) => void
    setUserName: (name: string) => void
    setBoardId: (id: string) => void
    setBoardName: (name: string) => void
}

export const useClientStore = create<ClientStore>()((set) => ({
    userId: null,
    userName: null,
    boardId: null,
    boardName: null,
    setUserId: (id) => set(() => ({userId: id})),
    setUserName: (name) => set(() => ({userName: name})),
    setBoardId: (id) => set(() => ({boardId: id})),
    setBoardName: (name) => set(() => ({boardName: name})),
}))
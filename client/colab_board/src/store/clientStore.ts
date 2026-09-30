import {create} from 'zustand'

interface ClientStore {
    userId: string | null
    userName: string | null
    boardId: string | null
    setUserId: (id: string) => void
    setUserName: (name: string) => void
    setBoardId: (id: string) => void
}

export const useClientStore = create<ClientStore>()((set) => ({
    userId: null,
    userName: null,
    boardId: null,
    setUserId: (id) => set(() => ({userId: id})),
    setUserName: (name) => set(() => ({userName: name})),
    setBoardId: (id) => set(() => ({boardId: id})),
}))
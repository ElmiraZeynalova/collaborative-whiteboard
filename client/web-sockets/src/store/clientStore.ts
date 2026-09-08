import {create} from 'zustand'

interface ClientStore {
    userId: string | null
    userName: string | null
    boardId: string | null
    ws: WebSocket | null
    setUserId: (id: string) => void
    setUserName: (name: string) => void
    setBoardId: (id: string) => void
    setWS: (ws: WebSocket) => void
}

export const useClientStore = create<ClientStore>()((set) => ({
    userId: null,
    userName: null,
    boardId: null,
    ws: null,
    setUserId: (id) => set(() => ({userId: id})),
    setUserName: (name) => set(() => ({userName: name})),
    setBoardId: (id) => set(() => ({boardId: id})),
    setWS: (ws) => set(() => ({ws: ws})),
}))
import { create } from 'zustand'

interface CanvasStore {
    userName: string | null
    canvas: HTMLCanvasElement | null
    boardId: string | null,
    ws: WebSocket | null,
    undoList: string[]
    redoList: string[]
    setUserName: (name: string) => void
    setCanvas: (newCanvas: HTMLCanvasElement) => void
    setBoardId: (id: string) => void
    setWS: (ws: WebSocket) => void
    pushToUndo: (data: string) => void
    pushToRedo: (data: string) => void
    undo: () => void
    redo: () => void
}

export const useCanvasStore = create<CanvasStore>()((set, get) => ({
    userName: null,
    canvas: null,
    boardId: null,
    ws: null,
    undoList: [],
    redoList: [],
    setUserName: (name) => set(() => ({userName: name})),
    setCanvas: (newCanvas) => set(() => ({canvas: newCanvas })),
    setBoardId: (id) => set(() => ({boardId: id})),
    setWS: (ws) => set(() => ({ws: ws})),
    pushToUndo: (data) => set((state) => ({
        undoList: [...state.undoList, data]
    })),
    pushToRedo: (data) => set((state) => ({
        redoList: [...state.redoList, data]
    })),
    undo: () => {
        const canvas = get().canvas
        if(!canvas) return

        let ctx = canvas.getContext('2d')

        const currentState = canvas.toDataURL()
        const lastState = get().undoList[get().undoList.length - 1]

        if (lastState === undefined || currentState === undefined) return

        set((state) => ({
            undoList: state.undoList.slice(0, -1),
            redoList: [...state.redoList, currentState]
        }))

        const img = new Image()
        img.src = lastState
        img.onload = () => {
            ctx?.clearRect(0, 0, canvas.width, canvas.height)
            ctx?.drawImage(img, 0, 0, canvas.width, canvas.height)
        }
    },
    redo: () => {
        const canvas = get().canvas
        if(!canvas) return
        let ctx = canvas.getContext('2d')

        const currentState = canvas.toDataURL()
        const lastState = get().redoList[get().redoList.length - 1]

        if (lastState === undefined || currentState === undefined) return

        set((state) => ({
            redoList: state.redoList.slice(0, -1),
            undoList: [...state.undoList, currentState],
        }))

        const img = new Image()
        img.src = lastState
        img.onload = () => {
            ctx?.clearRect(0, 0, canvas.width, canvas.height)
            ctx?.drawImage(img, 0, 0, canvas.width, canvas.height)
        }
    },
}))
import { create } from 'zustand'

export type Shape = {
    id: string
    userId: string
    type: string
    x: number
    y: number
    width?: number
    height?: number
    radius?: number
    fillStyle: string
    strokeStyle: string
    lineWidth: number
    isDeleted: boolean
}

interface CanvasStore {
    canvas: HTMLCanvasElement | null
    shapes: Record<string, Shape>
    undoStack: string[]
    redoStack: string[]
    setCanvas: (newCanvas: HTMLCanvasElement) => void
    addShape: (shape: Shape) => void
    markShapeDeleted: (shapeId: string) => void
    markShapeUnDeleted: (shapeId: string) => void
    pushToUndo: (elemId: string) => void
    pushToRedo: (elemId: string) => void
}

export const useCanvasStore = create<CanvasStore>()((set) => ({
    canvas: null,
    shapes: {},
    undoStack: [],
    redoStack: [],
    setCanvas: (newCanvas) => set(() => ({canvas: newCanvas })),
    addShape: (shape) => set((state) => ({shapes: {...state.shapes, [shape.id]: shape}})),
    markShapeDeleted: (shapeId) => set(state => ({
        shapes: {
            ...state.shapes,
            [shapeId]: {
            ...state.shapes[shapeId],
            isDeleted: true
            }
        }
    })),
    markShapeUnDeleted: (shapeId) => set(state => ({
        shapes: {
            ...state.shapes,
            [shapeId]: {
            ...state.shapes[shapeId],
            isDeleted: false
            }
        }
    })),
    pushToUndo: (elemId) => set((state) => ({undoStack: [...state.undoStack, elemId]})),
    pushToRedo: (elemId) => set((state) => ({redoStack: [...state.redoStack, elemId]})),
}))



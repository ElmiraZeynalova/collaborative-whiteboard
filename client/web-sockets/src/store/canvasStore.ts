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
    startX?: number
    startY?: number
    points?: {x:number, y:number}[]
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
    setShapes: (shapes: Record<string, Shape>) => void
    addShape: (shape: Shape) => void
    updateShape: (shapeId:string, changes: Partial<Shape>) => void
    markShapeDeleted: (shapeId: string) => void
    markShapeUnDeleted: (shapeId: string) => void
    pushToUndo: (elemId: string) => void
    pushToRedo: (elemId: string) => void
    undo: () => string | undefined
    redo: () => string | undefined
}

export const useCanvasStore = create<CanvasStore>()((set) => ({
    canvas: null,
    shapes: {},
    undoStack: [],
    redoStack: [],
    setCanvas: (newCanvas) => set(() => ({canvas: newCanvas })),
    setShapes: (shapes) => set(() =>  ({shapes: shapes})),
    addShape: (shape) => set((state) => ({shapes: {...state.shapes, [shape.id]: shape}})),
    updateShape: (shapeId, changes) =>
        set((state) => {
            const existingShape = state.shapes[shapeId]

            if (!existingShape) {
                return state
            }

            return {
                shapes: {
                    ...state.shapes,
                    [shapeId]: {
                        ...existingShape,
                        ...changes,
                    },
                },
            }
    }),
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

    undo: (): string | undefined => {
        const state = useCanvasStore.getState()
        const lastItem = state.undoStack[state.undoStack.length - 1]

        if (!lastItem || !state.shapes[lastItem]) {
            return
        }

        set((currentState) => ({
            undoStack: currentState.undoStack.slice(0, -1),
            redoStack: [...currentState.redoStack, lastItem],
            shapes: {
                ...currentState.shapes,
                [lastItem]: {
                    ...currentState.shapes[lastItem],
                    isDeleted: true,
                },
            },
        }))
        return lastItem
    },

    redo: (): string | undefined => {
        const state = useCanvasStore.getState()
        const lastItem = state.redoStack[state.redoStack.length - 1]

        if (!lastItem || !state.shapes[lastItem]) {
            return
        }

        set((currentState) => ({
            redoStack: currentState.redoStack.slice(0, -1),
            undoStack: [...currentState.undoStack, lastItem],
            shapes: {
                ...currentState.shapes,
                [lastItem]: {
                    ...currentState.shapes[lastItem],
                    isDeleted: false,
                },
            },
        }))

        return lastItem
    },
}))



import { create } from 'zustand'
import {type Shape, type ShapeChanges} from "../types/shapes"

interface CanvasStore {
    canvas: HTMLCanvasElement | null
    shapes: Record<string, Shape>
    selectedShapeId: string | null
    currentlyDrawingShapeId: string | null
    editingTextId: string | null
    hoveredShapeId: string | null
    undoStack: string[]
    redoStack: string[]
    setCanvas: (newCanvas: HTMLCanvasElement) => void
    setShapes: (shapes: Record<string, Shape>) => void
    setSelectedShapeId: (id: string | null) => void
    setCurrentlyDrawingShapeId: (id: string | null) => void
    setEditingTextId: (id: string | null) => void
    setHoveredShapeId: (id: string | null) => void
    addShape: (shape: Shape) => void
    updateShape: (shapeId:string, changes: ShapeChanges) => void
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
    selectedShapeId: null,
    currentlyDrawingShapeId: null,
    editingTextId: null,
    hoveredShapeId: null,
    undoStack: [],
    redoStack: [],
    setCanvas: (newCanvas) => set({canvas: newCanvas }),
    setShapes: (shapes) => set({shapes: shapes}),
    addShape: (shape) => set((state) => ({shapes: {...state.shapes, [shape.id]: shape}})),
    setSelectedShapeId: (id) => set({selectedShapeId: id}),
    setCurrentlyDrawingShapeId: (id) => set({currentlyDrawingShapeId: id}),
    setEditingTextId: (id) => set({editingTextId: id}),
    setHoveredShapeId: (id) => set({hoveredShapeId: id}),
    updateShape: (shapeId, changes) =>
        set((state) => {
            const existingShape = state.shapes[shapeId]

            if (!existingShape) {
                return state
            }

            const updatedShape: Shape = {
                ...existingShape,
                ...changes,
            } as Shape

            return {
                shapes: {
                    ...state.shapes,
                    [shapeId]: updatedShape,
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



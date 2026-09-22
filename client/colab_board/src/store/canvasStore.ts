import { create } from 'zustand'
import {type Shape, type ShapeChanges} from "../types/shapes"
import { type SelectionRectangleState } from '../types/shapes'

interface CanvasStore {
    canvas: HTMLCanvasElement | null
    scale: number
    shapes: Record<string, Shape>
    currentlyDrawingShapeId: string | null
    editingTextId: string | null
    selectedShapesIds: string[]
    selectionRectangle: SelectionRectangleState
    setSelectedShapesIds: (ids: string[]) => void
    setSelectionRectangle: (rect: SelectionRectangleState) => void
    // undoStack: string[]
    // redoStack: string[]
    setCanvas: (newCanvas: HTMLCanvasElement) => void
    setScale: (scale: number) => void
    setShapes: (shapes: Record<string, Shape>) => void
    setCurrentlyDrawingShapeId: (id: string | null) => void
    setEditingTextId: (id: string | null) => void
    addShape: (shape: Shape) => void
    updateShape: (shapeId:string, changes: ShapeChanges) => void

    // pushToUndo: (elemId: string) => void
    // pushToRedo: (elemId: string) => void
    // undo: () => string | undefined
    // redo: () => string | undefined
}

export const useCanvasStore = create<CanvasStore>()((set) => ({
    canvas: null,
    scale: 1,
    shapes: {},
    currentlyDrawingShapeId: null,
    editingTextId: null,
    selectedShapesIds: [],
    selectionRectangle: { visible: false, x1: 0, y1: 0, x2: 0, y2: 0 },
    setSelectedShapesIds: (ids) => set({ selectedShapesIds: ids }),
    setSelectionRectangle: (rect) => set({ selectionRectangle: rect }),
    // undoStack: [],
    // redoStack: [],
    setCanvas: (newCanvas) => set({canvas: newCanvas }),
    setScale: (scale) => set({ scale }),
    setShapes: (shapes) => set({shapes: shapes}),
    addShape: (shape) => set((state) => ({shapes: {...state.shapes, [shape.id]: shape}})),
    setCurrentlyDrawingShapeId: (id) => set({currentlyDrawingShapeId: id}),
    setEditingTextId: (id) => set({editingTextId: id}),

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

    // pushToUndo: (elemId) => set((state) => ({undoStack: [...state.undoStack, elemId]})),
    // pushToRedo: (elemId) => set((state) => ({redoStack: [...state.redoStack, elemId]})),

    // undo: (): string | undefined => {
    //     const state = useCanvasStore.getState()
    //     const lastItem = state.undoStack[state.undoStack.length - 1]

    //     if (!lastItem || !state.shapes[lastItem]) {
    //         return
    //     }

    //     set((currentState) => ({
    //         undoStack: currentState.undoStack.slice(0, -1),
    //         redoStack: [...currentState.redoStack, lastItem],
    //         shapes: {
    //             ...currentState.shapes,
    //             [lastItem]: {
    //                 ...currentState.shapes[lastItem],
    //                 isDeleted: true,
    //             },
    //         },
    //     }))
    //     return lastItem
    // },

    // redo: (): string | undefined => {
    //     const state = useCanvasStore.getState()
    //     const lastItem = state.redoStack[state.redoStack.length - 1]

    //     if (!lastItem || !state.shapes[lastItem]) {
    //         return
    //     }

    //     set((currentState) => ({
    //         redoStack: currentState.redoStack.slice(0, -1),
    //         undoStack: [...currentState.undoStack, lastItem],
    //         shapes: {
    //             ...currentState.shapes,
    //             [lastItem]: {
    //                 ...currentState.shapes[lastItem],
    //                 isDeleted: false,
    //             },
    //         },
    //     }))

    //     return lastItem
    // },
}))



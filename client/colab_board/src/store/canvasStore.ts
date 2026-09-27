import { create } from 'zustand'
import {type Shape, type ShapeChanges} from "../types/shapes"
import { type SelectionRectangleState } from '../types/shapes'
import { useClientStore } from './clientStore'

type HistoryAction =
    | {
        type: 'add'
        shapes: Shape[]
    }
    | {
        type: 'delete'
        shapes: Shape[]
    }
    | {
        type: 'update'
        changes: {
            shapeId: string
            before: Shape
            after: Shape
        }[]
    }
    | {
        type: 'reorder'
        before: string[]
        after: string[]
    }
    

interface CanvasStore {
    canvas: HTMLCanvasElement | null
    scale: number
    shapes: Record<string, Shape>
    shapesOrder: string[],
    currentlyDrawingShapeId: string | null
    editingTextId: string | null
    selectedShapesIds: string[]
    selectionRectangle: SelectionRectangleState
    undoStack: HistoryAction[]
    redoStack: HistoryAction[]
    setSelectedShapesIds: (ids: string[]) => void
    setSelectionRectangle: (rect: SelectionRectangleState) => void
    setCanvas: (newCanvas: HTMLCanvasElement) => void
    setScale: (scale: number) => void
    setShapes: (shapes: Record<string, Shape>) => void
    setShapesOrder: (ids: string[]) => void
    setCurrentlyDrawingShapeId: (id: string | null) => void
    setEditingTextId: (id: string | null) => void
    addShape: (shape: Shape) => void
    updateShape: (shapeId:string, changes: ShapeChanges) => void
    pushToUndo: (newAction: HistoryAction) => void
    undo: () => void
    redo: () => void
}

export const useCanvasStore = create<CanvasStore>()((set, get) => ({
    canvas: null,
    scale: 1,
    shapes: {},
    shapesOrder: [],
    currentlyDrawingShapeId: null,
    editingTextId: null,
    selectedShapesIds: [],
    selectionRectangle: { visible: false, x1: 0, y1: 0, x2: 0, y2: 0 },
    undoStack: [],
    redoStack: [],
    setSelectedShapesIds: (ids) => set({ selectedShapesIds: ids }),
    setSelectionRectangle: (rect) => set({ selectionRectangle: rect }),
    setCanvas: (newCanvas) => set({canvas: newCanvas }),
    setScale: (scale) => set({ scale }),
    setShapes: (shapes) => set({shapes: shapes}),
    addShape: (shape) => set((state) => ({
        shapes: {...state.shapes, [shape.id]: shape},
        shapesOrder: [...state.shapesOrder, shape.id],
    })),
    setShapesOrder: (ids) => set({shapesOrder: ids}),
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
    pushToUndo: (newAction) => set(state => ({
        undoStack: [...state.undoStack, newAction],
        redoStack: [],
    })),
    undo: () => {
        const undoStack =  get().undoStack

        if(undoStack.length === 0) return null
        const lastAction = undoStack[undoStack.length - 1]
            set(state => ({
                undoStack: state.undoStack.slice(0, -1),
                redoStack: [...state.redoStack, lastAction],
            }))
        if(lastAction.type === "update"){
                const updatesShapes: Record<string, Shape> = Object.fromEntries(
                    lastAction.changes.map(change => [change.shapeId, change.before]),
                )
                set((state) => ({ shapes: { ...state.shapes, ...updatesShapes } }))
                lastAction.changes.forEach(({ before }) => {
                    useClientStore.getState().ws?.send(JSON.stringify({
                        type: "shape:update",
                        shape: before,
                    }))
                })
        }else if (lastAction.type === "add") {
            const deletedShapes = lastAction.shapes.map(shape => ({
                ...shape,
                isDeleted: true,
            }))

            const updates = Object.fromEntries(
                deletedShapes.map(shape => [
                    shape.id,
                    shape,
                ])
            )

            set(state => ({
                shapes: {
                    ...state.shapes,
                    ...updates,
                },
            }))

            deletedShapes.forEach(shape => {
                useClientStore.getState().ws?.send(JSON.stringify({
                    type: "shape:update",
                    shape,
                }))
            })
        }else if (lastAction.type === "delete") {
            const restoredShapes = Object.fromEntries(
                lastAction.shapes.map(shape => [
                    shape.id,
                    { ...shape, isDeleted: false }
                ])
            )

            set(state => ({
                shapes: {
                    ...state.shapes,
                    ...restoredShapes,
                },
            }))

            lastAction.shapes.forEach(shape => {
                const restoredShape = {
                    ...shape,
                    isDeleted: false,
                }

            useClientStore.getState().ws?.send(JSON.stringify({
                    type: "shape:update",
                    shape: restoredShape,
            }))
            })
        }else if(lastAction.type === "reorder"){
            get().setShapesOrder(lastAction.before)
            useClientStore.getState().ws?.send(JSON.stringify({
                    type: "shape:order",
                    shapesOrder: lastAction.before,
            }))
        }

        return null
    },

    redo: () => {
        const redoStack = get().redoStack

        if (redoStack.length === 0) return

        const lastAction = redoStack[redoStack.length - 1]

        set(state => ({
            redoStack: state.redoStack.slice(0, -1),
            undoStack: [...state.undoStack, lastAction],
        }))

        if (lastAction.type === "update") {
            const updatedShapes: Record<string, Shape> = Object.fromEntries(
                lastAction.changes.map(change => [
                    change.shapeId,
                    change.after,
                ])
            )

            set(state => ({
                shapes: {
                    ...state.shapes,
                    ...updatedShapes,
                },
            }))

            lastAction.changes.forEach(({ after }) => {
                useClientStore.getState().ws?.send(JSON.stringify({
                    type: "shape:update",
                    shape: after,
                }))
            })
        }

        else if (lastAction.type === "add") {
            const deletedShapes = lastAction.shapes.map(shape => ({
                ...shape,
                isDeleted: false,
            }))

            const updates = Object.fromEntries(
                deletedShapes.map(shape => [
                    shape.id,
                    shape,
                ])
            )

            set(state => ({
                shapes: {
                    ...state.shapes,
                    ...updates,
                },
            }))

            deletedShapes.forEach(shape => {
                useClientStore.getState().ws?.send(JSON.stringify({
                    type: "shape:update",
                    shape,
                }))
            })
        }else if (lastAction.type === "delete") {
            const restoredShapes = Object.fromEntries(
                lastAction.shapes.map(shape => [
                    shape.id,
                    { ...shape, isDeleted: true }
                ])
            )

            set(state => ({
                shapes: {
                    ...state.shapes,
                    ...restoredShapes,
                },
            }))

            lastAction.shapes.forEach(shape => {
                const restoredShape = {
                    ...shape,
                    isDeleted: true,
                }

                useClientStore.getState().ws?.send(JSON.stringify({
                    type: "shape:update",
                    shape: restoredShape,
                }))
            })
        }else if(lastAction.type === "reorder"){
            get().setShapesOrder(lastAction.after)
            useClientStore.getState().ws?.send(JSON.stringify({
                    type: "shape:order",
                    shapesOrder: lastAction.after,
            }))
        }
    },

}))



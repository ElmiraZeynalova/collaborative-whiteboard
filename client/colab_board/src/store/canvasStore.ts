import { create } from 'zustand'
import {type YShape} from "../types/shapes"
import { type SelectionRectangleState } from '../types/shapes'
import * as Y from 'yjs'

interface CanvasStore {
    canvas: HTMLCanvasElement | null
    scale: number
    yShapes: Y.Map<YShape> | null
    yShapesOrder: Y.Array<string> | null
    yUndoManager: Y.UndoManager | null
    currentlyDrawingShapeId: string | null
    editingTextId: string | null
    selectedShapesIds: string[]
    selectionRectangle: SelectionRectangleState
    setYShapes: (shapes: Y.Map<YShape>) => void
    setYShapesOrder: (order: Y.Array<string>) => void
    setYUndoManager: (manger: Y.UndoManager) => void
    setSelectedShapesIds: (ids: string[]) => void
    setSelectionRectangle: (rect: SelectionRectangleState) => void
    setCanvas: (newCanvas: HTMLCanvasElement) => void
    setScale: (scale: number) => void
    setCurrentlyDrawingShapeId: (id: string | null) => void
    setEditingTextId: (id: string | null) => void
}

export const useCanvasStore = create<CanvasStore>()((set) => ({
    canvas: null,
    scale: 1,
    yShapes: null,
    yShapesOrder: null,
    yUndoManager: null,
    currentlyDrawingShapeId: null,
    editingTextId: null,
    selectedShapesIds: [],
    selectionRectangle: { visible: false, x1: 0, y1: 0, x2: 0, y2: 0 },
    setYShapes: (shapes) => set({yShapes: shapes}),
    setYShapesOrder: (order) => set({yShapesOrder: order}),
    setYUndoManager: (manager) => set({yUndoManager: manager}),
    setSelectedShapesIds: (ids) => set({ selectedShapesIds: ids }),
    setSelectionRectangle: (rect) => set({ selectionRectangle: rect }),
    setCanvas: (newCanvas) => set({canvas: newCanvas }),
    setScale: (scale) => set({ scale }),
    setCurrentlyDrawingShapeId: (id) => set({currentlyDrawingShapeId: id}),
    setEditingTextId: (id) => set({editingTextId: id}),
}))



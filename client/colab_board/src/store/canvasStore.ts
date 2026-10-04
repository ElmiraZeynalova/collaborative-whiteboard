import { create } from 'zustand'
import { type SelectionRectangleState } from '../types/shapes'

interface CanvasStore {
    canvas: HTMLCanvasElement | null
    scale: number
    currentlyDrawingShapeId: string | null
    editingTextId: string | null
    selectedShapesIds: string[]
    selectionRectangle: SelectionRectangleState
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
    currentlyDrawingShapeId: null,
    editingTextId: null,
    selectedShapesIds: [],
    selectionRectangle: { visible: false, x1: 0, y1: 0, x2: 0, y2: 0 },
    setSelectedShapesIds: (ids) => set({ selectedShapesIds: ids }),
    setSelectionRectangle: (rect) => set({ selectionRectangle: rect }),
    setCanvas: (newCanvas) => set({canvas: newCanvas }),
    setScale: (scale) => set({ scale }),
    setCurrentlyDrawingShapeId: (id) => set({currentlyDrawingShapeId: id}),
    setEditingTextId: (id) => set({editingTextId: id}),
}))



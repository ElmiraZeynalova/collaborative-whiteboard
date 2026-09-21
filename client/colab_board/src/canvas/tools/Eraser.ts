import Tool from './Tool'
import { useClientStore } from '../../store/clientStore'
import { useCanvasStore } from '../../store/canvasStore'
import { useToolStore } from '../../store/toolStore'
import type { EraserShape, ShapeChanges } from "../../types/shapes"

export default class Eraser extends Tool{
    readonly type = 'eraser'
    onPointerDown(pos: { x: number; y: number }): void {
        const addShape = useCanvasStore.getState().addShape
        const setCurrentlyDrawingShapeId = useCanvasStore.getState().setCurrentlyDrawingShapeId
        const userId = useClientStore.getState().userId
        if(!userId) return

        const strokeWidth = useToolStore.getState().strokeWidth

        const shapeId =  crypto.randomUUID()
        setCurrentlyDrawingShapeId(shapeId)

        const eraserShape: EraserShape = {
            id: shapeId,
            userId: userId,
            type: this.type,
            isDeleted: false,
            x: pos.x,
            y: pos.y,
            points: [{x: pos.x, y: pos.y}],
            strokeStyle: '#ffffff',
            strokeWidth: strokeWidth,
        }

        addShape(eraserShape)
    }

    onPointerMove(shapeId: string, pos: { x: number; y: number }): void {
        const updateShape = useCanvasStore.getState().updateShape
        const shape = useCanvasStore.getState().shapes[shapeId]

        if (!shape || shape.type !== this.type) return
        const thisShape: EraserShape = shape

        const changes: ShapeChanges = {
            points: [...thisShape.points, {x: pos.x, y: pos.y}]
        }
        updateShape(shapeId, changes)
    }

    onPointerUp(shapeId: string): void {
        const ws = useClientStore.getState().ws
        const shape = useCanvasStore.getState().shapes[shapeId]
        const setCurrentlyDrawingShapeId = useCanvasStore.getState().setCurrentlyDrawingShapeId

        const message = {
            type: "shape:add",
            shape: shape
        }

        ws?.send(JSON.stringify(message))
        setCurrentlyDrawingShapeId(null)
    }
}
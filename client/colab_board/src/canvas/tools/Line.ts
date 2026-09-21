import Tool from './Tool'
import { useClientStore } from '../../store/clientStore'
import { useCanvasStore } from '../../store/canvasStore'
import { useToolStore } from '../../store/toolStore'
import type {LineShape, ShapeChanges } from "../../types/shapes"

export default class Line extends Tool{
    readonly type = 'line'

    onPointerDown(pos: { x: number; y: number }): void {
        const addShape = useCanvasStore.getState().addShape
        const setCurrentlyDrawingShapeId = useCanvasStore.getState().setCurrentlyDrawingShapeId
        const userId = useClientStore.getState().userId
        if(!userId) return

        const strokeColor = useToolStore.getState().strokeColor
        const strokeWidth = useToolStore.getState().strokeWidth

        const shapeId =  crypto.randomUUID()
        setCurrentlyDrawingShapeId(shapeId)

        const lineShape: LineShape = {
            id: shapeId,
            userId: userId,
            type: this.type,
            isDeleted: false,
            startX: pos.x,
            startY: pos.y,
            x: pos.x,
            y: pos.y,
            strokeStyle: strokeColor,
            strokeWidth: strokeWidth,
        }

        addShape(lineShape)
    }

    onPointerMove(shapeId: string, pos: { x: number; y: number }): void {
        const updateShape = useCanvasStore.getState().updateShape

        const changes: ShapeChanges = {
            x: pos.x,
            y: pos.y,
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
   
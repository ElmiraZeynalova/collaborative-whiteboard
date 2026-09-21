import Tool from './Tool'
import { useClientStore } from '../../store/clientStore'
import { useCanvasStore } from '../../store/canvasStore'
import type { RectShape, ShapeChanges } from "../../types/shapes"
import { useToolStore } from '../../store/toolStore'

export default class Rect extends Tool{
    readonly type = 'rect'

    onPointerDown(pos: { x: number; y: number }): void {
        const addShape = useCanvasStore.getState().addShape
        const setCurrentlyDrawingShapeId = useCanvasStore.getState().setCurrentlyDrawingShapeId
        const userId = useClientStore.getState().userId
        if(!userId) return

        const strokeColor = useToolStore.getState().strokeColor
        const strokeWidth = useToolStore.getState().strokeWidth
        const fillColor = useToolStore.getState().fillColor

        const shapeId =  crypto.randomUUID()
        setCurrentlyDrawingShapeId(shapeId)

        const rectShape: RectShape = {
            id: shapeId,
            userId: userId,
            type: this.type,
            isDeleted: false,
            x: pos.x,
            y: pos.y,
            fillStyle: fillColor,
            strokeStyle: strokeColor,
            strokeWidth: strokeWidth,
            width: 0,
            height: 0
        }

        addShape(rectShape)
    }

    onPointerMove(shapeId: string, pos: { x: number; y: number }): void {
        const updateShape = useCanvasStore.getState().updateShape
        const shape = useCanvasStore.getState().shapes[shapeId]

        if (!shape || shape.type !== this.type) return
        const thisShape: RectShape = shape

        const changes: ShapeChanges = {
            width: pos.x - thisShape.x,
            height: pos.y - thisShape.y
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


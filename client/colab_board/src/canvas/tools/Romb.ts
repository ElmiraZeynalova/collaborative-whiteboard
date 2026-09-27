import Tool from './Tool'
import { useClientStore } from '../../store/clientStore'
import { useCanvasStore } from '../../store/canvasStore'
import { useToolStore } from '../../store/toolStore'
import type { RombShape, ShapeChanges } from "../../types/shapes"

export default class Romb extends Tool{
    readonly type = 'romb'

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

        const rombShape: RombShape = {
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

        addShape(rombShape)
    }

    onPointerMove(shapeId: string, pos: { x: number; y: number }): void {
        const updateShape = useCanvasStore.getState().updateShape
        const shape = useCanvasStore.getState().shapes[shapeId]

        if (!shape || shape.type !== this.type) return
        const thisShape: RombShape = shape

        const changes: ShapeChanges = {
            width: pos.x - thisShape.x,
            height: pos.y - thisShape.y
        }
        updateShape(shapeId, changes)
    }

    onPointerUp(shapeId: string): void {
        const store = useCanvasStore.getState()
        const shape = store.shapes[shapeId]

        if (!shape || shape.type !== this.type) return

        const message = {
            type: "shape:add",
            shape,
            shapesOrder: store.shapesOrder,
        }

        useClientStore.getState().ws?.send(
            JSON.stringify(message)
        )

        store.setCurrentlyDrawingShapeId(null)

        store.pushToUndo({
            type: "add",
            shapes: [shape],
        })
    }
}
    
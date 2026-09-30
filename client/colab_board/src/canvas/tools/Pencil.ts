import Tool from './Tool'
import { useClientStore } from '../../store/clientStore'
import { useCanvasStore } from '../../store/canvasStore'
import { useToolStore } from '../../store/toolStore'
import * as Y from 'yjs'
import type { Point, YShape } from '../../types/shapes'

export default class Pencil extends Tool{
    readonly type = 'pencil'

    onPointerDown(pos: { x: number; y: number }): void {
        const canvasStore = useCanvasStore.getState()
        const toolStore = useToolStore.getState()
        const setCurrentlyDrawingShapeId = canvasStore.setCurrentlyDrawingShapeId
        const userId = useClientStore.getState().userId
        if(!userId) return

        const strokeColor = toolStore.strokeColor
        const strokeWidth = toolStore.strokeWidth

        const shapeId =  crypto.randomUUID()
        setCurrentlyDrawingShapeId(shapeId)

        const yPencilShape = new Y.Map() as YShape
        yPencilShape.set("id", shapeId)
        yPencilShape.set("userId", userId)
        yPencilShape.set("type", this.type)
        yPencilShape.set("isDeleted", false)
        yPencilShape.set("x", pos.x)
        yPencilShape.set("y", pos.y)
        yPencilShape.set("points", [{x: pos.x, y: pos.y}])
        yPencilShape.set("strokeStyle", strokeColor)
        yPencilShape.set("strokeWidth", strokeWidth)

        canvasStore.yShapes?.set(shapeId, yPencilShape)
        canvasStore.yShapesOrder?.push([shapeId])
    }

    onPointerMove(shapeId: string, pos: { x: number; y: number }): void {
        const canvasStore = useCanvasStore.getState()
        const yPencilShape = canvasStore.yShapes?.get(shapeId)

        if (!yPencilShape) return
        const existingPoints = yPencilShape.get("points") as Point[]
        yPencilShape.set('points', [...existingPoints,  {x: pos.x, y: pos.y}])
    }

    
    onPointerUp(): void {
        useCanvasStore.getState().setCurrentlyDrawingShapeId(null)
    }
}


import Tool from './Tool'
import { useCanvasStore } from '../../store/canvasStore'
import { useToolStore } from '../../store/toolStore'
import * as Y from 'yjs'
import type { YShape } from '../../types/shapes'

export default class Line extends Tool{
    readonly type = 'line'

    onPointerDown(pos: { x: number; y: number }): void {
        const canvasStore = useCanvasStore.getState()
        const toolStore = useToolStore.getState()
        const setCurrentlyDrawingShapeId = canvasStore.setCurrentlyDrawingShapeId

        const strokeColor = toolStore.strokeColor
        const strokeWidth = toolStore.strokeWidth

        const shapeId =  crypto.randomUUID()
        setCurrentlyDrawingShapeId(shapeId)

        const yLineShape = new Y.Map() as YShape
        yLineShape.set("id", shapeId)
        yLineShape.set("type", this.type)
        yLineShape.set("isDeleted", false)
        yLineShape.set("x", pos.x)
        yLineShape.set("y", pos.y)
        yLineShape.set("startX", pos.x)
        yLineShape.set("startY", pos.y)
        yLineShape.set("strokeStyle", strokeColor)
        yLineShape.set("strokeWidth", strokeWidth)

        this.ctx.yShapes.set(shapeId, yLineShape)
        this.ctx.yShapesOrder.push([shapeId])
    }


    onPointerMove(shapeId: string, pos: { x: number; y: number }): void {
        const yLineShape = this.ctx.yShapes.get(shapeId)

        if (!yLineShape) return

        yLineShape.set('x', pos.x)
        yLineShape.set('y', pos.y)
    }
    
    onPointerUp(): void {
        useCanvasStore.getState().setCurrentlyDrawingShapeId(null)
    }
}
   
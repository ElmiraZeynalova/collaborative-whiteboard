import Tool from './Tool'
import { useCanvasStore } from '../../store/canvasStore'
import { useToolStore } from '../../store/toolStore'
import * as Y from 'yjs'
import type { YShape, Point } from '../../types/shapes'

export default class Eraser extends Tool{
    readonly type = 'eraser'
    onPointerDown(pos: { x: number; y: number }): void {
        const canvasStore = useCanvasStore.getState()
        const toolStore = useToolStore.getState()
        const setCurrentlyDrawingShapeId = canvasStore.setCurrentlyDrawingShapeId
        const strokeWidth = toolStore.strokeWidth

        const shapeId =  crypto.randomUUID()
        setCurrentlyDrawingShapeId(shapeId)

        const yEraserShape = new Y.Map() as YShape
        yEraserShape.set("id", shapeId)
        yEraserShape.set("type", this.type)
        yEraserShape.set("isDeleted", false)
        yEraserShape.set("x", pos.x)
        yEraserShape.set("y", pos.y)
        yEraserShape.set("points", [{x: pos.x, y: pos.y}])
        yEraserShape.set("strokeStyle", "#ffffff")
        yEraserShape.set("strokeWidth", strokeWidth)

        this.ctx.yShapes.set(shapeId, yEraserShape)
        this.ctx.yShapesOrder.push([shapeId])
    }

    onPointerMove(shapeId: string, pos: { x: number; y: number }): void {
        const yEraserShape = this.ctx.yShapes.get(shapeId)

        if (!yEraserShape) return
        const existingPoints = yEraserShape.get("points") as Point[]
        yEraserShape.set('points', [...existingPoints,  {x: pos.x, y: pos.y}])
    }

    
    onPointerUp(): void {
        useCanvasStore.getState().setCurrentlyDrawingShapeId(null)
    }
}
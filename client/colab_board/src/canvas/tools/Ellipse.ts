import Tool from './Tool'
import { useClientStore } from '../../store/clientStore'
import { useCanvasStore } from '../../store/canvasStore'
import { useToolStore } from '../../store/toolStore'
import * as Y from 'yjs'
import type { YShape } from '../../types/shapes'

export default class Ellipse extends Tool{
    readonly type = 'ellipse'

    onPointerDown(pos: { x: number; y: number }): void {
        const canvasStore = useCanvasStore.getState()
        const toolStore = useToolStore.getState()
        const setCurrentlyDrawingShapeId = canvasStore.setCurrentlyDrawingShapeId
        const userId = useClientStore.getState().userId
        if(!userId) return

        const strokeColor = toolStore.strokeColor
        const strokeWidth = toolStore.strokeWidth
        const fillColor = toolStore.fillColor

        const shapeId =  crypto.randomUUID()
        setCurrentlyDrawingShapeId(shapeId)

        const yEllipseShape = new Y.Map() as YShape
        yEllipseShape.set("id", shapeId)
        yEllipseShape.set("userId", userId)
        yEllipseShape.set("type", this.type)
        yEllipseShape.set("isDeleted", false)
        yEllipseShape.set("x", pos.x)
        yEllipseShape.set("y", pos.y)
        yEllipseShape.set("fillStyle", fillColor)
        yEllipseShape.set("strokeStyle", strokeColor)
        yEllipseShape.set("strokeWidth", strokeWidth)
        yEllipseShape.set("radius", {x: 0, y: 0})

        canvasStore.yShapes?.set(shapeId, yEllipseShape)
        canvasStore.yShapesOrder?.push([shapeId])
    }

    onPointerMove(shapeId: string, pos: { x: number; y: number }): void {
        const canvasStore = useCanvasStore.getState()
        const yEllipseShape = canvasStore.yShapes?.get(shapeId)

        if (!yEllipseShape) return

        const x = yEllipseShape.get('x')
        const y = yEllipseShape.get('y')

        if (typeof x !== 'number' || typeof y !== 'number') return

        yEllipseShape.set('radius', {x: Math.abs(pos.x - x), y: Math.abs(pos.y - y)})
    }


    onPointerUp(): void {
        useCanvasStore.getState().setCurrentlyDrawingShapeId(null)
    }
}

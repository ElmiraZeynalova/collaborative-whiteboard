import Tool from './Tool'
import { useClientStore } from '../../store/clientStore'
import { useCanvasStore } from '../../store/canvasStore'
import { useToolStore } from '../../store/toolStore'
import * as Y from 'yjs'
import type { YShape } from '../../types/shapes'

export default class Rect extends Tool{
    readonly type = 'rect'

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

        const yRectShape = new Y.Map() as YShape
        yRectShape.set("id", shapeId)
        yRectShape.set("userId", userId)
        yRectShape.set("type", this.type)
        yRectShape.set("isDeleted", false)
        yRectShape.set("x", pos.x)
        yRectShape.set("y", pos.y)
        yRectShape.set("width", 0)
        yRectShape.set("height", 0)
        yRectShape.set("fillStyle", fillColor)
        yRectShape.set("strokeStyle", strokeColor)
        yRectShape.set("strokeWidth", strokeWidth)

        canvasStore.yShapes?.set(shapeId, yRectShape)
        canvasStore.yShapesOrder?.push([shapeId])
    }

    onPointerMove(shapeId: string, pos: { x: number; y: number }): void {
        const canvasStore = useCanvasStore.getState()
        const yRectShape = canvasStore.yShapes?.get(shapeId)

        if (!yRectShape) return

        const x = yRectShape.get('x')
        const y = yRectShape.get('y')

        if (typeof x !== 'number' || typeof y !== 'number') return

        yRectShape.set('width', pos.x - x)
        yRectShape.set('height', pos.y - y)
    }


    onPointerUp(): void {
        useCanvasStore.getState().setCurrentlyDrawingShapeId(null)
    }
}


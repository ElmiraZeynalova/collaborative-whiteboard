import Tool from './Tool'
import { useClientStore } from '../../store/clientStore'
import { useCanvasStore } from '../../store/canvasStore'
import { useToolStore } from '../../store/toolStore'
import * as Y from 'yjs'
import type { YShape } from '../../types/shapes'

export default class Romb extends Tool{
    readonly type = 'romb'

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

        const yRombShape = new Y.Map() as YShape
        yRombShape.set("id", shapeId)
        yRombShape.set("userId", userId)
        yRombShape.set("type", this.type)
        yRombShape.set("isDeleted", false)
        yRombShape.set("x", pos.x)
        yRombShape.set("y", pos.y)
        yRombShape.set("width", 0)
        yRombShape.set("height", 0)
        yRombShape.set("fillStyle", fillColor)
        yRombShape.set("strokeStyle", strokeColor)
        yRombShape.set("strokeWidth", strokeWidth)

        canvasStore.yShapes?.set(shapeId, yRombShape)
        canvasStore.yShapesOrder?.push([shapeId])
    }

    onPointerMove(shapeId: string, pos: { x: number; y: number }): void {
        const canvasStore = useCanvasStore.getState()
        const yRombShape = canvasStore.yShapes?.get(shapeId)

        if (!yRombShape) return

        const x = yRombShape.get('x')
        const y = yRombShape.get('y')

        if (typeof x !== 'number' || typeof y !== 'number') return

        yRombShape.set('width', pos.x - x)
        yRombShape.set('height', pos.y - y)
    }

    onPointerUp(): void {
        useCanvasStore.getState().setCurrentlyDrawingShapeId(null)
    }
}
    
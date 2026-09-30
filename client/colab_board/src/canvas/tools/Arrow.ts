import Tool from './Tool'
import { useCanvasStore } from '../../store/canvasStore';
import { useToolStore } from '../../store/toolStore';
import { useClientStore } from '../../store/clientStore';
import * as Y from 'yjs'
import type { YShape } from '../../types/shapes'

export default class Arrow extends Tool{
    readonly type = 'arrow'

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

        const yArrowShape = new Y.Map() as YShape
        yArrowShape.set("id", shapeId)
        yArrowShape.set("userId", userId)
        yArrowShape.set("type", this.type)
        yArrowShape.set("isDeleted", false)
        yArrowShape.set("x", pos.x)
        yArrowShape.set("y", pos.y)
        yArrowShape.set("startX", pos.x)
        yArrowShape.set("startY", pos.y)
        yArrowShape.set("strokeStyle", strokeColor)
        yArrowShape.set("strokeWidth", strokeWidth)
        yArrowShape.set('fillStyle', fillColor)

        canvasStore.yShapes?.set(shapeId, yArrowShape)
        canvasStore.yShapesOrder?.push([shapeId])
    }


    onPointerMove(shapeId: string, pos: { x: number; y: number }): void {
        const canvasStore = useCanvasStore.getState()
        const yArrowShape = canvasStore.yShapes?.get(shapeId)

        if (!yArrowShape) return

        yArrowShape.set('x', pos.x)
        yArrowShape.set('y', pos.y)
    }
    
    onPointerUp(): void {
        useCanvasStore.getState().setCurrentlyDrawingShapeId(null)
    }


}
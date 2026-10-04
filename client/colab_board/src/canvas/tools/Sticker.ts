import Tool from './Tool'
import { useToolStore } from '../../store/toolStore';
import { useCanvasStore } from '../../store/canvasStore';
import * as Y from 'yjs'
import type { YShape } from '../../types/shapes'

export default class Sticker extends Tool{
    readonly type = 'sticker'
    
    onPointerDown(pos: { x: number; y: number }): void {
        const canvasStore = useCanvasStore.getState()
        const toolStore = useToolStore.getState()
        const setCurrentlyDrawingShapeId = canvasStore.setCurrentlyDrawingShapeId
        const strokeColor = toolStore.strokeColor
        const strokeWidth = toolStore.strokeWidth
        const fillColor = toolStore.fillColor
        const fontSize = toolStore.fontSize

        const shapeId =  crypto.randomUUID()
        setCurrentlyDrawingShapeId(shapeId)

        const yStickerShape = new Y.Map() as YShape
        yStickerShape.set("id", shapeId)
        yStickerShape.set("type", this.type)
        yStickerShape.set("isDeleted", false)
        yStickerShape.set("x", pos.x)
        yStickerShape.set("y", pos.y)
        yStickerShape.set("width", 200)
        yStickerShape.set("height", 200)
        yStickerShape.set("fillStyle", fillColor)
        yStickerShape.set("strokeStyle", strokeColor)
        yStickerShape.set("strokeWidth", strokeWidth)
        yStickerShape.set("fontSize", fontSize)
        yStickerShape.set("text", "")

        this.ctx.yShapes.set(shapeId, yStickerShape)
        this.ctx.yShapesOrder.push([shapeId])

        canvasStore.setEditingTextId(shapeId)
    }

    onPointerUp(): void {
        useCanvasStore.getState().setCurrentlyDrawingShapeId(null)
    }
}
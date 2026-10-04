import Tool from './Tool'
import { useToolStore } from '../../store/toolStore';
import { useCanvasStore } from '../../store/canvasStore';
import * as Y from 'yjs'
import type { YShape } from '../../types/shapes'

export default class Text extends Tool{
    readonly type = 'text'

    onPointerDown(pos: { x: number; y: number }): void {
        const canvasStore = useCanvasStore.getState()
        const toolStore = useToolStore.getState()

        const strokeColor = toolStore.strokeColor
        const strokeWidth = toolStore.strokeWidth
        const fontSize = toolStore.fontSize
        const textAlign = toolStore.textAlign

        const shapeId =  crypto.randomUUID()

        const yStickerShape = new Y.Map() as YShape
        yStickerShape.set("id", shapeId)
        yStickerShape.set("type", this.type)
        yStickerShape.set("isDeleted", false)
        yStickerShape.set("x", pos.x)
        yStickerShape.set("y", pos.y)
        yStickerShape.set("width", 0)
        yStickerShape.set("strokeStyle", strokeColor)
        yStickerShape.set("strokeWidth", strokeWidth)
        yStickerShape.set("fontSize", fontSize)
        yStickerShape.set("textAlign", textAlign)
        yStickerShape.set("text", "")

        this.ctx.yShapes.set(shapeId, yStickerShape)
        this.ctx.yShapesOrder.push([shapeId])

        canvasStore.setEditingTextId(shapeId)
    }

}
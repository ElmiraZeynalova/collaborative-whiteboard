import Tool from './Tool'
import { useToolStore } from '../../store/toolStore';
import { useCanvasStore } from '../../store/canvasStore';
import * as Y from 'yjs'
import type { YShape } from '../../types/shapes'

export default class Text extends Tool {
    readonly type = 'text'

    onPointerDown(pos: { x: number; y: number }): void {
        console.log('TEXT TOOL POINTER DOWN', pos)
        const canvasStore = useCanvasStore.getState()
        const toolStore = useToolStore.getState()

        const strokeColor = toolStore.strokeColor
        const strokeWidth = toolStore.strokeWidth
        const fontSize = toolStore.fontSize
        const textAlign = toolStore.textAlign

        const shapeId = crypto.randomUUID()

        const yTextShape = new Y.Map() as YShape
        yTextShape.set("id", shapeId)
        yTextShape.set("type", this.type)
        yTextShape.set("isDeleted", false)
        yTextShape.set("x", pos.x)
        yTextShape.set("y", pos.y)
        yTextShape.set("width", 0)
        yTextShape.set("strokeStyle", strokeColor)
        yTextShape.set("strokeWidth", strokeWidth)
        yTextShape.set("fontSize", fontSize)
        yTextShape.set("textAlign", textAlign)
        yTextShape.set("text", "")

        this.ctx.yShapes.set(shapeId, yTextShape)
        this.ctx.yShapesOrder.push([shapeId])
        console.log("SHAPE CREATED", shapeId)

        canvasStore.setEditingTextId(shapeId)
        console.log(
            'EDITING TEXT ID:',
            useCanvasStore.getState().editingTextId
        )
    }

}
import Tool from './Tool'
import { useToolStore } from '../../store/toolStore';
import { useCanvasStore } from '../../store/canvasStore';
import { useClientStore } from '../../store/clientStore';
import { type StickerShape } from '../../types/shapes';


export default class Sticker extends Tool{
    readonly type = 'sticker'
    
    onPointerDown(pos: { x: number; y: number }): void {
        const addShape = useCanvasStore.getState().addShape
        const setCurrentlyDrawingShapeId = useCanvasStore.getState().setCurrentlyDrawingShapeId
        const setEditingTextId = useCanvasStore.getState().setEditingTextId
        const userId = useClientStore.getState().userId
        if(!userId) return


        const fillColor = useToolStore.getState().fillColor
        const strokeColor = useToolStore.getState().strokeColor
        const strokeWidth = useToolStore.getState().strokeWidth
        const fontSize = useToolStore.getState().fontSize

        const shapeId =  crypto.randomUUID()
        setCurrentlyDrawingShapeId(shapeId)

        const stickerShape: StickerShape = {
            id: shapeId,
            userId: userId,
            type: this.type,
            isDeleted: false,
            x: pos.x,
            y: pos.y,
            fillStyle: fillColor,
            strokeStyle: strokeColor,
            strokeWidth: strokeWidth,
            fontSize: fontSize,
            text: "",
            width: 200, 
            height: 200,
        }

        addShape(stickerShape)
        setEditingTextId(shapeId)

    }

    onPointerUp(shapeId: string): void {
        const store = useCanvasStore.getState()
        const shape = store.shapes[shapeId]

        if (!shape || shape.type !== this.type) return

        const message = {
            type: "shape:add",
            shape,
            shapesOrder: store.shapesOrder,
        }

        useClientStore.getState().ws?.send(
            JSON.stringify(message)
        )

        store.setCurrentlyDrawingShapeId(null)

        store.pushToUndo({
            type: "add",
            shapes: [shape],
        })
    }
}
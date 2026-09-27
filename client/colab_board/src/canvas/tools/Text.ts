import Tool from './Tool'
import { type TextShape } from '../../types/shapes';
import { useToolStore } from '../../store/toolStore';
import { useClientStore } from '../../store/clientStore';
import { useCanvasStore } from '../../store/canvasStore';


export default class Text extends Tool{
    readonly type = 'text'

    onPointerDown(pos: { x: number; y: number }): void {
        const addShape = useCanvasStore.getState().addShape
        const setEditingTextId = useCanvasStore.getState().setEditingTextId
        const userId = useClientStore.getState().userId
        if(!userId) return

        const strokeColor = useToolStore.getState().strokeColor
        const strokeWidth = useToolStore.getState().strokeWidth
        const fontSize = useToolStore.getState().fontSize
        const textAlign = useToolStore.getState().textAlign

        const shapeId =  crypto.randomUUID()

        const textShape: TextShape = {
            id: shapeId,
            userId: userId,
            type: this.type,
            isDeleted: false,
            x: pos.x,
            y: pos.y,
            strokeStyle: strokeColor,
            strokeWidth: strokeWidth,
            fontSize: fontSize,
            textAlign: textAlign,
            text: "",
            width: 0,
        }

        addShape(textShape)
        setEditingTextId(shapeId)
        const message = {
            type: "shape:add",
            shape: textShape,
            shapesOrder: useCanvasStore.getState().shapesOrder,
        }

        useClientStore.getState().ws?.send(JSON.stringify(message))

    }

}
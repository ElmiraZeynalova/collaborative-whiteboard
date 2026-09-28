import { type Shape } from "../types/shapes"
import { useToolStore } from "../store/toolStore"
import type { ToolType } from "../canvas/tools/Tool"

export function updateSettingsBar(shape: Shape) {
    const {
        setFontSize,
        setTextAlign,
        setFillColor,
        setStrokeColor,
        setStrokeWidth
    } = useToolStore.getState()

    setStrokeColor(shape.strokeStyle)
    setStrokeWidth(shape.strokeWidth)

    if (shape.type === 'rect' ||
        shape.type === 'ellipse' ||
        shape.type === 'romb' ||
        shape.type === 'sticker') {
        setFillColor(shape.fillStyle)
    }

    if (shape.type === 'text' || shape.type === 'sticker') {
        console.log(shape.fontSize)
        setFontSize(shape.fontSize)
    }

    if (shape.type === 'text') {
        setTextAlign(shape.textAlign)
    }
}

export function refreshSettingsBar(type: ToolType){
    const {setFontSize, setTextAlign, setFillColor, setStrokeColor, setStrokeWidth} = useToolStore.getState()

    const strokeTools: ToolType[] = ["pencil", "eraser", "line", "arrow"]
    setStrokeWidth(strokeTools.includes(type) ? 1 : 0)

    setFillColor("#000000")
    setStrokeColor("#000000")
    setFontSize("S")
    setTextAlign("left")
    return
}
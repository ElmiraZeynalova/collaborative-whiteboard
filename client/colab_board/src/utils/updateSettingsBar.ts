import { type Shape } from "../types/shapes"
import { useToolStore } from "../store/toolStore"

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
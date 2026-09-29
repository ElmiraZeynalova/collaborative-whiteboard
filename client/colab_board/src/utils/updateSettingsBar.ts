import { type YShape } from "../types/shapes"
import { useToolStore } from "../store/toolStore"
import type { ToolType } from "../canvas/tools/Tool"
import {getShapeType, getShapeStringValue, getShapeNumber} from '../utils/yShapeGetters'

export function updateSettingsBar(shape: YShape) {
    const {
        setFontSize,
        setTextAlign,
        setFillColor,
        setStrokeColor,
        setStrokeWidth
    } = useToolStore.getState()

    const shapeType = getShapeType(shape)
    const strokeStyle = getShapeStringValue(shape, 'strokeStyle')
    const strokeWidth = getShapeNumber(shape, 'strokeWidth')
    const fillStyle = getShapeStringValue(shape, 'fillStyle')
    const fontSize = getShapeStringValue(shape, 'fontSize')
    const textAlign = getShapeStringValue(shape, 'textAlign')

    setStrokeColor(strokeStyle)
    setStrokeWidth(strokeWidth)

    if (shapeType === 'rect' ||
        shapeType === 'ellipse' ||
        shapeType === 'romb' ||
        shapeType === 'sticker') {
        setFillColor(fillStyle)
    }

    if (shapeType === 'text' || shapeType === 'sticker') {
        setFontSize(fontSize)
    }

    if (shapeType === 'text') {
        setTextAlign(textAlign)
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
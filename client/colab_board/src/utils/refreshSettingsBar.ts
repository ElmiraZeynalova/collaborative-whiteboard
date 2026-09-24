import type { ToolType } from "../canvas/tools/Tool";
import { useToolStore } from "../store/toolStore";

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
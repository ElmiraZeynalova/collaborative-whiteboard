import { create } from 'zustand'

export type FontSize = "S" | "M" | "L" | "XL"
export type TextAlign = "left" | "center" | "right"

interface ToolsStore {
    tool: any,
    fillColor: string,
    strokeColor: string,
    strokeWidth: number,
    fontSize: FontSize,
    textAlign: TextAlign,
    setTool: (tool: any) => void,
    setFillColor: (color: string) => void,
    setStrokeColor: (color: string) => void,
    setStrokeWidth: (width: number) => void,
    setFontSize: (size: FontSize) => void,
    setTextAlign: (align: TextAlign) => void
}

export const useToolStore = create<ToolsStore>()((set) => ({
    tool: null,
    fillColor: "#000000",
    strokeColor: "#000000",
    strokeWidth: 0,
    fontSize: "S",
    textAlign: "left",
    setTool: (tool) => set({tool: tool}),
    setFillColor: (color) => set({fillColor: color}),
    setStrokeColor: (color) => set({strokeColor: color}),
    setStrokeWidth: (width) => set({strokeWidth: width}),
    setFontSize: (size) => set({fontSize: size}),
    setTextAlign: (align) => set({textAlign: align})
}))

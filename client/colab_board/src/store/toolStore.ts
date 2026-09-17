import { create } from 'zustand'

interface ToolsStore {
    tool: any,
    fillColor: string,
    strokeColor: string,
    strokeWidth: number,
    fontSize: string,
    textAlign: string,
    setTool: (tool: any) => void,
    setFillColor: (color: string) => void,
    setStrokeColor: (color: string) => void,
    setStrokeWidth: (width: number) => void,
    setFontSize: (size: string) => void,
    setTextAlign: (align: string) => void
}

export const useToolStore = create<ToolsStore>()((set) => ({
    tool: null,
    fillColor: "#000000",
    strokeColor: "#000000",
    strokeWidth: 0,
    fontSize: "S",
    textAlign: "start",
    setTool: (tool) => set({tool: tool}),
    setFillColor: (color) => set({fillColor: color}),
    setStrokeColor: (color) => set({strokeColor: color}),
    setStrokeWidth: (width) => set({strokeWidth: width}),
    setFontSize: (size) => set({fontSize: size}),
    setTextAlign: (align) => set({textAlign: align})
}))

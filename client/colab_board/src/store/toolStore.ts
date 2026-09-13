import { create } from 'zustand'

interface ToolsStore {
    tool: any,
    fillColor: string,
    strokeColor: string,
    lineWidth: number,
    setTool: (tool: any) => void,
    setFillColor: (color: string) => void,
    setStrokeColor: (color: string) => void,
    setLineWidth: (width: number) => void

}

export const useToolStore = create<ToolsStore>()((set) => ({
    tool: null,
    fillColor: "#000000",
    strokeColor: "#000000",
    lineWidth: 0,
    setTool: (tool) => set(() => ({tool: tool})),
    setFillColor: (color) => set(() => ({fillColor: color})),
    setStrokeColor: (color) => set(() => ({strokeColor: color})),
    setLineWidth: (width) => set(() => ({lineWidth: width})),
}))

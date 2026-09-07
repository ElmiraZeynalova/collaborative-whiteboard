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

export const useToolsStore = create<ToolsStore>()((set) => ({
    tool: null,
    fillColor: "black",
    strokeColor: "black",
    lineWidth: 1,
    setTool: (tool) => set(() => ({tool: tool})),
    setFillColor: (color) => set(() => ({fillColor: color})),
    setStrokeColor: (color) => set(() => ({strokeColor: color})),
    setLineWidth: (width) => set(() => ({lineWidth: width})),
}))

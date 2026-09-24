import { create } from 'zustand'

export type FontSize = "S" | "M" | "L" | "XL"
export type TextAlign = "left" | "center" | "right"
type ChangedSetting =
    | 'fillColor'
    | 'strokeColor'
    | 'strokeWidth'
    | 'fontSize'
    | 'textAlign'
    | null

interface ToolsStore {
    toolSettingChangedByUser: boolean
    toolSettingChanged: ChangedSetting
    tool: any,
    fillColor: string,
    strokeColor: string,
    strokeWidth: number,
    fontSize: FontSize,
    textAlign: TextAlign,
    setToolSettingChangedByUser:(value: boolean) => void,
    setToolSettingChanged: (setting: ChangedSetting) => void,
    setTool: (tool: any) => void,
    setFillColor: (color: string) => void,
    setStrokeColor: (color: string) => void,
    setStrokeWidth: (width: number) => void,
    setFontSize: (size: FontSize) => void,
    setTextAlign: (align: TextAlign) => void
}

export const useToolStore = create<ToolsStore>()((set) => ({
    toolSettingChangedByUser: false,
    toolSettingChanged: null,
    tool: null,
    fillColor: "#000000",
    strokeColor: "#000000",
    strokeWidth: 0,
    fontSize: "S",
    textAlign: "left",
    setToolSettingChangedByUser: (value) => set({toolSettingChangedByUser: value}),
    setToolSettingChanged: (setting: ChangedSetting) => set({ toolSettingChanged: setting }),
    setTool: (tool) => set({tool: tool}),
    setFillColor: (color) => set({fillColor: color}),
    setStrokeColor: (color) => set({strokeColor: color}),
    setStrokeWidth: (width) => set({strokeWidth: width}),
    setFontSize: (size) => set({fontSize: size}),
    setTextAlign: (align) => set({textAlign: align})
}))

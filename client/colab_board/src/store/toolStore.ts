import { create } from 'zustand'
import type { ToolType } from '../canvas/tools/Tool'

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
    tool: ToolType,
    fillColor: string,
    strokeColor: string,
    strokeWidth: number,
    fontSize: string,
    textAlign: string,
    setToolSettingChangedByUser:(value: boolean) => void,
    setToolSettingChanged: (setting: ChangedSetting) => void,
    setTool: (tool: ToolType) => void,
    setFillColor: (color: string) => void,
    setStrokeColor: (color: string) => void,
    setStrokeWidth: (width: number) => void,
    setFontSize: (size: string) => void,
    setTextAlign: (align: string) => void
}

export const useToolStore = create<ToolsStore>()((set) => ({
    toolSettingChangedByUser: false,
    toolSettingChanged: null,
    tool: "selection",
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

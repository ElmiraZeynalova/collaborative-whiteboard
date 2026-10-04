import { useToolStore } from "../../../store/toolStore";
import { Icon } from '@iconify/react'

export const FillColor = () => {
    const setFillColor = useToolStore(state => state.setFillColor)
    const fillColor = useToolStore(state => state.fillColor)
    const setToolSettingChangedByUser = useToolStore(state => state.setToolSettingChangedByUser)
    const setToolSettingChanged = useToolStore(state => state.setToolSettingChanged)
    return(
        <div className="flex gap-2 items-center">
            <p className="text-[#686868]">Fill</p>
            <input 
                className="cursor-pointer rounded-full w-7 h-7"
                value={fillColor}
                onChange={(e) => {
                    setFillColor(e.target.value)
                    setToolSettingChangedByUser(true)
                    setToolSettingChanged('fillColor')
                }}
                type="color"/>
        </div>
    )
}

export const FontSize = () => {
    const setFontSize = useToolStore(state => state.setFontSize)
    const fontSize = useToolStore(state => state.fontSize)
    const setToolSettingChangedByUser = useToolStore(state => state.setToolSettingChangedByUser)
    const setToolSettingChanged = useToolStore(state => state.setToolSettingChanged)
    return(
        <div className="flex gap-2 items-center">
            <p className="text-[#686868] whitespace-nowrap">Font size</p>
            <div className="flex gap-2 items-center">{(["S", "M", "L", "XL"] as const).map((item) => (
                <button 
                    key={item}
                    onClick={() => {
                        setToolSettingChangedByUser(true)
                        setToolSettingChanged('fontSize')
                        setFontSize(item)
                    }}
                    className={`cursor-pointer p-2 min-w-8 max-w-8 min-h-8 max-h-8 rounded-lg grid place-content-center ${fontSize === item ? 'bg-[#D0ECDF]' : 'bg-[#F0F0F0]'}`}>
                        <p className="text-[#5F5F5F] m-0 text-sm">{item}</p>
                </button>
            ))}</div>
        </div>
    )
}

export const StrokeColor = () => {
    const setStrokeColor = useToolStore(state => state.setStrokeColor)
    const strokeColor = useToolStore(state => state.strokeColor)
    const setToolSettingChangedByUser = useToolStore(state => state.setToolSettingChangedByUser)
    const setToolSettingChanged = useToolStore(state => state.setToolSettingChanged)
    return(
        <div className="flex gap-2 items-center">
            <p className="text-[#686868]">Stroke</p>
            <input 
                className="cursor-pointer rounded-full w-7 h-7"
                value={strokeColor}
                onChange={(e) => {
                    setToolSettingChangedByUser(true)
                    setToolSettingChanged('strokeColor')
                    setStrokeColor(e.target.value)
                }}
                type="color"/>
        </div>
    )
}

export const StrokeWidth = () => {
    const setStrokeWidth = useToolStore(state => state.setStrokeWidth)
    const strokeWidth = useToolStore(state => state.strokeWidth)
    const setToolSettingChangedByUser = useToolStore(state => state.setToolSettingChangedByUser)
    const setToolSettingChanged = useToolStore(state => state.setToolSettingChanged)
    return(
        <div className="flex gap-2 items-center">
            <p className="text-[#686868] whitespace-nowrap">Stroke width</p>
            <input 
                value={strokeWidth}
                onChange={(e) => {
                    setToolSettingChangedByUser(true)
                    setToolSettingChanged('strokeWidth')
                    setStrokeWidth(Number(e.target.value))
                }}
                className="cursor-pointer rounded-md w-12 h-8 border-[#D9D9D9] border text-end text-[#686868]"
                type="number"/>
        </div>
    )
}

export const TextAlign = () => {
    const setTextAlign = useToolStore(state => state.setTextAlign)
    const textAlign = useToolStore(state => state.textAlign)
    const setToolSettingChangedByUser = useToolStore(state => state.setToolSettingChangedByUser)
    const setToolSettingChanged = useToolStore(state => state.setToolSettingChanged)

    
    const textAlignIcons = {
        "left": <Icon icon="pixelarticons:text-align-left" color="#5F5F5F" width={18} height={18} />,
        "center": <Icon icon="pixelarticons:text-align-center" color="#5F5F5F" width={18} height={18} />,
        "right": <Icon icon="pixelarticons:text-align-right" color="#5F5F5F" width={18} height={18} />
    }

    return(
        <div className="flex gap-2 items-center">
            <p className="text-[#686868] whitespace-nowrap">Text align</p>
            <div className="flex gap-2 items-center">{(["left", "center", "right"] as const).map(item => (
                <button 
                    key={item}
                    onClick={() => {
                        setToolSettingChangedByUser(true)
                        setToolSettingChanged('textAlign')
                        setTextAlign(item)
                    }}
                    className={`cursor-pointer p-2 min-w-8 max-w-8 min-h-8 max-h-8 rounded-lg grid place-content-center ${textAlign === item ? 'bg-[#D0ECDF]' : 'bg-[#F0F0F0]'}`}>
                        {textAlignIcons[item]}
                </button>
            ))}</div>
        </div>
    )
}
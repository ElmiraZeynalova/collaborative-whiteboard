import { useToolStore } from "../../../store/toolStore";

export default function StrokeWidth(){
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
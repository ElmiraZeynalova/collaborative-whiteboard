import { useToolStore } from "../../../store/toolStore";

export default function StrokeColor(){
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
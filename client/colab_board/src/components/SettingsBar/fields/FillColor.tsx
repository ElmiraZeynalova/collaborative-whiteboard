import { useToolStore } from "../../../store/toolStore";

export default function FillColor(){
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
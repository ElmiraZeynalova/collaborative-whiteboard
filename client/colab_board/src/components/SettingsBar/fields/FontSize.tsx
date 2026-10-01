import { useToolStore} from "../../../store/toolStore";

export default function FontSize(){
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
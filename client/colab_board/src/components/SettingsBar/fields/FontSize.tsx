import { useToolStore, type FontSize } from "../../../store/toolStore";

export default function FontSize(){
    const setFontSize = useToolStore(state => state.setFontSize)
    const fontSize = useToolStore(state => state.fontSize)

    return(
        <div className="flex gap-2 items-center">
            <p className="text-[#686868] whitespace-nowrap">Font size</p>
            <div className="flex gap-2 items-center">{(["S", "M", "L", "XL"] as FontSize[]).map((item) => (
                <button 
                    key={item}
                    onClick={() => setFontSize(item)}
                    className={`cursor-pointer p-2 min-w-8 min-h-7 rounded-lg grid place-content-center ${fontSize === item ? 'bg-[#D0ECDF]' : 'bg-[#F0F0F0]'}`}>
                        <p className="text-[#5F5F5F] m-0 text-sm">{item}</p>
                </button>
            ))}</div>
        </div>
    )
}
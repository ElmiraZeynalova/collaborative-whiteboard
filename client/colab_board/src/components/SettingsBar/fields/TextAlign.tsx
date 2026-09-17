import { useToolStore } from "../../../store/toolStore";
import { Icon } from '@iconify/react'

const textAlignIcons = {
    "start": <Icon icon="pixelarticons:text-align-left" color="#5F5F5F" width={18} height={18} />,
    "center": <Icon icon="pixelarticons:text-align-center" color="#5F5F5F" width={18} height={18} />,
    "end": <Icon icon="pixelarticons:text-align-right" color="#5F5F5F" width={18} height={18} />
}

export default function TextAlign(){
    const setTextAlign = useToolStore(state => state.setTextAlign)
    const textAlign = useToolStore(state => state.textAlign)

    return(
        <div className="flex gap-2 items-center">
            <p className="text-[#686868] whitespace-nowrap">Text align</p>
            <div className="flex gap-2 items-center">{(["start", "center", "end"] as const).map(item => (
                <button 
                    key={item}
                    onClick={() => setTextAlign(item)}
                    className={`cursor-pointer p-2 min-w-8 min-h-8 rounded-lg grid place-content-center ${textAlign === item ? 'bg-[#D0ECDF]' : 'bg-[#F0F0F0]'}`}>
                        {textAlignIcons[item]}
                </button>
            ))}</div>
        </div>
    )
}
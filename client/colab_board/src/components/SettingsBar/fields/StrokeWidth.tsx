import { useToolStore } from "../../../store/toolStore";

export default function StrokeWidth(){
    const setStrokeWidth = useToolStore(state => state.setStrokeWidth)

    return(
        <div className="flex gap-2 items-center">
            <p className="text-[#686868]">Stroke width</p>
            <input 
                placeholder='0'
                onChange={(e) => setStrokeWidth(Number(e.target.value))}
                className="cursor-pointer rounded-md w-12 h-8 border-[#D9D9D9] border text-end text-[#686868]"
                type="number"/>
        </div>
    )
}
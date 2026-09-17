import { useToolStore } from "../../../store/toolStore";

export default function FillColor(){
    const setFillColor = useToolStore(state => state.setFillColor)

    return(
        <div className="flex gap-2 items-center">
            <p className="text-[#686868]">Fill</p>
            <input 
                className="cursor-pointer rounded-full w-7 h-7"
                onChange={(e) => setFillColor(e.target.value)}
                type="color"/>
        </div>
    )
}
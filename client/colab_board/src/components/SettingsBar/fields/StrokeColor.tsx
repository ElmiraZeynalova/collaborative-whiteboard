import { useToolStore } from "../../../store/toolStore";

export default function StrokeColor(){
    const setStrokeColor = useToolStore(state => state.setStrokeColor)

    return(
        <div className="flex gap-2 items-center">
            <p className="text-[#686868]">Stroke</p>
            <input 
                className="cursor-pointer rounded-full w-7 h-7"
                onChange={(e) => setStrokeColor(e.target.value)}
                type="color"/>
        </div>
    )
}
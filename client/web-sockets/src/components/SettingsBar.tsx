import { useToolsStore } from '../store/toolStore'

export default function SettingsBar(){
    const lineWidth = useToolsStore(state => state.lineWidth)
    const setLineWidth = useToolsStore(state => state.setLineWidth)
    const setStrokeStyle = useToolsStore(state => state.setStrokeColor)
    
    return(
        <div className="bg-white h-12 border-b-2 border-[#aaa] px-6 py-4 flex items-center gap-9">
            <div className="flex gap-3.5 items-center">
                <p>Line width</p>
                <input 
                    value={lineWidth ?? 0}
                    type="number"
                    onChange={(e) => setLineWidth(Number(e.target.value))}
                    className="border border-black p-2 w-14 h-7 flex items-center justify-center"
                />
            </div>
            <div className="flex gap-3.5 items-center">
                <p>Stroke color</p>
                <input 
                    type="color"
                    onChange={(e) => setStrokeStyle(e.target.value)}
                />
            </div>
        </div>
    )
}
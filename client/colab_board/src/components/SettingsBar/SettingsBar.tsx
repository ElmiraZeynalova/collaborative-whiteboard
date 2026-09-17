import { useToolStore } from '../../store/toolStore'
import EraserSettings from './settings/EraserSettings'
import ShapeSettings from './settings/ShapeSettings'
import TextSettings from './settings/TextSettings'
import LineSettings from './settings/LineSettings'
import StickerSettings from './settings/StickerSettings'
import { Icon } from '@iconify/react'
import {useState} from 'react'
import Menu from '../Menu'

const bars: Record<string, React.ComponentType> = {
    rect: ShapeSettings,
    ellipse: ShapeSettings,
    romb: ShapeSettings,
    pencil: ShapeSettings,
    text: TextSettings,
    eraser: EraserSettings,
    line: LineSettings,
    arrow: LineSettings,
    sticker: StickerSettings
}
export default function SettingsBar(){
    const tool = useToolStore(state => state.tool)
    const Settings = bars[tool?.type]
    const [showMenu, setShowMenu] = useState<boolean>(false)

    return(
        <div className="absolute bottom-18 left-[50%] z-10 translate-x-[-50%] px-3 py-2 flex items-center gap-4 rounded-xl drop-shadow-md bg-white border border-black/15">
            {Settings && <Settings />}
            <button onClick={() => setShowMenu(prev => !prev)}>
                <Icon icon="ph:dots-three-outline-vertical-fill" className="cursor-pointer" color="#686868" width={20} height={20} />
            </button>

            {showMenu && <Menu className="absolute bottom-full right-0 mb-2" />}
        </div>
    )
}



// import {useCanvasStore} from '../store/canvasStore'
// import { useClientStore } from '../store/clientStore'
// import {useEffect} from "react"

// export default function SettingsBar(){
//     const lineWidth = useToolStore(state => state.lineWidth)
//     const setLineWidth = useToolStore(state => state.setLineWidth)
//     const setStrokeStyle = useToolStore(state => state.setStrokeColor)
//     const tool = useToolStore(state => state.tool)
//     const setFillStyle = useToolStore(state => state.setFillColor)
//     const selectedShapeId = useCanvasStore(state => state.selectedShapeId)
//     const updateShape = useCanvasStore(state => state.updateShape)
//     const ws = useClientStore(state => state.ws)
//     const shapes = useCanvasStore(state => state.shapes)
//     const fillColor = useToolStore(state => state.fillColor)
//     const strokeStyle = useToolStore(state => state.strokeColor)
//     const selectedShape = selectedShapeId ? shapes[selectedShapeId] : null

//     useEffect(() => {
//         if(!tool) return
//         if(tool.type === "line" || tool.type === "brush" || tool.type === "eraser"){
//             setLineWidth(1)
//         }else{setLineWidth(0)}

//         setFillStyle("#000000")
//         setStrokeStyle("#000000")
//     }, [tool])

//     function handleFillColorChange(color: string){
//         setFillStyle(color)
//         if(tool.type === 'selection' && selectedShapeId){
//             updateShape(selectedShapeId, {fillStyle: color})
//             ws!.send(JSON.stringify({type: "shape:update", shape: {id: selectedShapeId, fillStyle: color}}))
//         }
//     }

//     function handleStrokeColorChange(color: string){
//         setStrokeStyle(color)
//         if(tool.type === 'selection' && selectedShapeId){
//             updateShape(selectedShapeId, {strokeStyle: color})
//             ws!.send(JSON.stringify({type: "shape:update", shape: {id: selectedShapeId, strokeStyle: color}}))
//         }
//     }

//     function handleLineWidthChange(width: number){
//         setLineWidth(width)
//         if(tool.type === 'selection' && selectedShapeId){
//             updateShape(selectedShapeId, {lineWidth: width})
//             ws!.send(JSON.stringify({type: "shape:update", shape: {id: selectedShapeId, lineWidth: width}}))
//         }
//     }

//     return(
//         <div className="bg-white h-12 border-b-2 border-[#aaa] px-6 py-4 flex items-center gap-9">
//             <div className="flex gap-3.5 items-center">
//                 <p>Line width</p>
//                 <input 
//                     value={selectedShape?.lineWidth ?? lineWidth}
//                     type="number"
//                     onChange={(e) => handleLineWidthChange(Number(e.target.value))}
//                     className="border border-black p-2 w-14 h-7 flex items-center justify-center"
//                 />
//             </div>
//             <div className="flex gap-3.5 items-center">
//                 <p>Fill color</p>
//                 <input 
//                     type="color" 
//                     value={selectedShape?.fillStyle ?? fillColor}
//                     onChange={(e) => handleFillColorChange(e.target.value)}/>
//             </div>
//             <div className="flex gap-3.5 items-center">
//                 <p>Stroke color</p>
//                 <input 
//                     type="color"
//                     value={selectedShape?.strokeStyle ?? strokeStyle}
//                     onChange={(e) =>  handleStrokeColorChange(e.target.value)}
//                 />
//             </div>
//         </div>
//     )
// }
      
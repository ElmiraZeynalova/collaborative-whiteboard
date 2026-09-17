import { useToolStore } from '../store/toolStore'
import Rect from '../canvas/tools/Rect'
import Ellipse from '../canvas/tools/Ellipse'
import Eraser from '../canvas/tools/Eraser'
import Line from '../canvas/tools/Line'
import Romb from '../canvas/tools/Romb'
import Selection from '../canvas/tools/Selection'
import Arrow from '../canvas/tools/Arrow'
import Text from '../canvas/tools/Text'
import Sticker from '../canvas/tools/Sticker'
import Pencil from '../canvas/tools/Pencil'
import { Icon } from '@iconify/react'

export default function ToolBar(){
    const setTool = useToolStore(state => state.setTool)
    const tool = useToolStore(state => state.tool)

    return(
        <div className="px-3 py-1 flex items-center gap-4 rounded-xl drop-shadow-md bg-white border border-black/15">
            <button 
                className={`cursor-pointer p-2 rounded-lg ${tool?.type === 'selection' ? "bg-[#D0ECDF]" : "bg-white"}`}
                onClick={() => setTool(new Selection())}>
                <Icon icon="tabler:pointer-2" width={22} height={22} />
            </button>
            <button
                className={`cursor-pointer p-2 rounded-lg ${tool?.type === 'rect' ? "bg-[#D0ECDF]" : "bg-white"}`}
                onClick={() => setTool(new Rect())}>
                <Icon icon="ph:rectangle" width={23} height={23} />
            </button>
            <button
                className={`cursor-pointer p-2 rounded-lg ${tool?.type === 'romb' ? "bg-[#D0ECDF]" : "bg-white"}`}
                onClick={() => setTool(new Romb())}> 
                <Icon icon="lucide:diamond" width={22} height={22} />
            </button>
            <button
                className={`cursor-pointer p-2 rounded-lg ${tool?.type === 'ellipse' ? "bg-[#D0ECDF]" : "bg-white"}`}
                onClick={() => setTool(new Ellipse())}>
                <Icon icon="lucide:circle" width={21} height={21} />
            </button>
            <button
                className={`cursor-pointer p-2 rounded-lg ${tool?.type === 'arrow' ? "bg-[#D0ECDF]" : "bg-white"}`}
                onClick={() => setTool(new Arrow())}>
                <Icon icon="gg:arrow-right" width={22} height={22} />
            </button>
            <button
                className={`cursor-pointer p-2 rounded-lg ${tool?.type === 'line' ? "bg-[#D0ECDF]" : "bg-white"}`}
                onClick={() => setTool(new Line())}>
                <Icon icon="fluent:line-horizontal-1-20-filled" width={22} height={22} />
            </button>
            <button
                className={`cursor-pointer p-2 rounded-lg ${tool?.type === 'pencil' ? "bg-[#D0ECDF]" : "bg-white"}`}
                onClick={() => setTool(new Pencil())}>
                <Icon icon="mynaui:pencil" width={22} height={22} />
            </button>
            <button
                className={`cursor-pointer p-2 rounded-lg ${tool?.type === 'text' ? "bg-[#D0ECDF]" : "bg-white"}`}
                onClick={() => setTool(new Text())}>
                <Icon icon="mi:text" width={22} height={22} />
            </button>
            <button
                className={`cursor-pointer p-2 rounded-lg ${tool?.type === 'sticker' ? "bg-[#D0ECDF]" : "bg-white"}`}
                onClick={() => setTool(new Sticker())}>
                <Icon icon="ph:sticker" width={24} height={24} />
            </button>
            <button
                className={`cursor-pointer p-2 rounded-lg ${tool?.type === 'eraser' ? "bg-[#D0ECDF]" : "bg-white"}`}
                onClick={() => setTool(new Eraser())}>
                <Icon icon="proicons:eraser" width={24} height={24} />
            </button>
        </div>
    )
}

// export default function ToolBar(){
//     const setTool = useToolStore(state => state.setTool)
//     const canvas = useCanvasStore(state => state.canvas)
//     const tool = useToolStore(state => state.tool)
//     const lineWidth = useToolStore(state => state.lineWidth)
//     const fillStyle = useToolStore(state => state.fillColor)
//     const strokeStyle = useToolStore(state => state.strokeColor)
//     const ws = useClientStore(state => state.ws)
//     const boardId = useClientStore(state => state.boardId)
//     const undo = useCanvasStore(state => state.undo)
//     const redo = useCanvasStore(state => state.redo)
//     const setSelectedShapeId = useCanvasStore(state => state.setSelectedShapeId)
//     const setHoverShapeId = useCanvasStore(state => state.setHoveredShapeId)

//     useEffect(() => {
//         if(tool){
//             tool.updateOptions({fillStyle, strokeStyle, lineWidth})
//         }
//     }, [tool, fillStyle, strokeStyle, lineWidth])

//     useEffect(() => {
//         setSelectedShapeId(null)
//         setHoverShapeId(null)
//     }, [tool])

//     function handleUndo() {
//         const deletedItemId = undo()

//         if (!deletedItemId) return

//         ws?.send(JSON.stringify({
//             type: "shape:delete",
//             shape: {
//                 id: deletedItemId
//             }
//         }))
//     }

//     function handleRedo() {
//         const returnedItemId = redo()

//         if (!returnedItemId) return

//         ws?.send(JSON.stringify({
//             type: "shape:update",
//             shape: {
//                 id: returnedItemId,
//                 isDeleted: false
//             }
//         }))
//     }

//     return(
//         <div className="bg-white h-12 border-b-2 border-[#aaa] px-6 py-4 flex">
//             <div className="flex grow gap-3 items-center">
//                 <button
//                     className={`cursor-pointer w-7 h-7 p-1 ${tool?.type === 'selection' ? "border-2 border-blue-400" : "bg-white"}`}
//                     onClick={() => {
//                         if (!canvas || !ws|| !boardId) return
//                         setTool(new Selection(canvas, ws, boardId))
//                     }}><Icon icon="tabler:pointer-2" width={22} height={22} />
//                 </button>
//                 <button 
//                     className={`cursor-pointer w-7 h-7 p-1 ${tool?.type === 'brush' ? "border-2 border-blue-400" : "bg-white"}`}
//                     onClick={() => {
//                         if (!canvas || !ws|| !boardId) return
//                         setTool(new Brush(canvas, {lineWidth, fillStyle, strokeStyle}, ws, boardId))
//                     }}><Icon icon="mynaui:pencil" width={24} height={24} />
//                 </button>
//                 <button 
//                     className={`cursor-pointer w-7 h-7 p-1 ${tool?.type === 'rect' ? "border-2 border-blue-400" : "bg-white"}`}
//                     onClick={() => {
//                         if (!canvas || !ws|| !boardId) return
//                         setTool(new Rect(canvas, {lineWidth, fillStyle, strokeStyle}, ws, boardId))
//                     }}><Icon icon="ph:rectangle" width={24} height={24} />
//                 </button>
//                 <button 
//                     className={`cursor-pointer w-7 h-7 p-1 ${tool?.type === 'ellipse' ? "border-2 border-blue-400" : "bg-white"}`}
//                     onClick={() => {
//                         if (!canvas || !ws|| !boardId) return
//                         setTool(new Ellipse(canvas, {lineWidth, fillStyle, strokeStyle}, ws, boardId))
//                     }}
//                     ><Icon icon="lucide:circle" width={22} height={22} />
//                 </button>
//                 <button 
//                     className={`cursor-pointer w-7 h-7 p-1 ${tool?.type === 'romb' ? "border-2 border-blue-400" : "bg-white"}`}
//                     onClick={() => {
//                         if (!canvas || !ws|| !boardId) return
//                         setTool(new Romb(canvas, {lineWidth, fillStyle, strokeStyle}, ws, boardId))
//                     }}
//                     ><Icon icon="lucide:diamond" width={24} height={24} />
//                 </button>
//                 <button 
//                     className={`cursor-pointer w-7 h-7 p-1 ${tool?.type === 'eraser' ? "border-2 border-blue-400" : "bg-white"}`}
//                     onClick={() => {
//                         if (!canvas || !ws|| !boardId) return
//                         setTool(new Eraser(canvas, {lineWidth, fillStyle, strokeStyle}, ws, boardId))
//                     }}
//                     ><Icon icon="proicons:eraser" width={24} height={24} />
//                 </button>
//                 <button 
//                     className={`cursor-pointer w-7 h-7 p-1 ${tool?.type === 'line' ? "border-2 border-blue-400" : "bg-white"}`}
//                     onClick={() => {
//                         if (!canvas || !ws|| !boardId) return
//                         setTool(new Line(canvas, {lineWidth, fillStyle, strokeStyle}, ws, boardId))
//                     }}
//                     ><Icon icon="fluent:line-horizontal-1-20-filled" width={24} height={24} />
//                 </button>
//                 <button>
//                     <Icon icon="mi:text" width={24} height={24} />
//                 </button>
//                 <button>
//                     <Icon icon="gg:arrow-right" width={24} height={24} />
//                 </button>
//                 <button>
//                     <Icon icon="ph:sticker" width={24} height={24} />
//                 </button>
//             </div>
//             <div className="flex gap-3 items-center">
//                 <button 
//                     className="cursor-pointer w-5 h-5"
//                     onClick={handleUndo}
//                 ><Icon icon="lucide:undo" width={24} height={24} />
//                 </button>
//                 <button 
//                     className="cursor-pointer w-5 h-5"
//                     onClick={handleRedo}
//                 ><Icon icon="lucide:redo" width={24} height={24} />
//                 </button>
//             </div>
//         </div>
//     )
// }


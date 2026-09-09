import brushImg from '../assets/brush.png'
import rectImg from '../assets/rect.png'
import circleImg from '../assets/circle.png'
import eraserImg from '../assets/eraser.png'
import lineImg from '../assets/line.png'
import undoImg from '../assets/undo.png'
import redoImg from '../assets/redo.png'
import saveImg from '../assets/save.png'
import { useToolsStore } from '../store/toolStore'
import { useCanvasStore } from '../store/canvasStore'
import Brush from '../canvas/tools/Brush'
import Rect from '../canvas/tools/Rect'
import Circle from '../canvas/tools/Circle'
import Eraser from '../canvas/tools/Eraser'
import Line from '../canvas/tools/Line'
import {useEffect} from 'react'
import { useClientStore } from '../store/clientStore'

export default function ToolBar(){
    const setTool = useToolsStore(state => state.setTool)
    const canvas = useCanvasStore(state => state.canvas)
    const tool = useToolsStore(state => state.tool)
    const lineWidth = useToolsStore(state => state.lineWidth)
    const fillStyle = useToolsStore(state => state.fillColor)
    const strokeStyle = useToolsStore(state => state.strokeColor)
    const setFillStyle = useToolsStore(state => state.setFillColor)
    const setStrokeStyle = useToolsStore(state => state.setStrokeColor)
    const ws = useClientStore(state => state.ws)
    const boardId = useClientStore(state => state.boardId)
    const undo = useCanvasStore(state => state.undo)
    const redo = useCanvasStore(state => state.redo)

    useEffect(() => {
        if(tool){
            tool.updateOptions({fillStyle, strokeStyle, lineWidth})
        }
    }, [tool, fillStyle, strokeStyle, lineWidth])

    function handleUndo() {
        const deletedItemId = undo()

        if (!deletedItemId) return

        ws?.send(JSON.stringify({
            type: "shape:delete",
            shape: {
                id: deletedItemId
            }
        }))
    }

    function handleRedo() {
        const returnedItemId = redo()

        if (!returnedItemId) return

        ws?.send(JSON.stringify({
            type: "shape:update",
            shape: {
                id: returnedItemId,
                isDeleted: false
            }
        }))
    }

    return(
        <div className="bg-white h-12 border-b-2 border-[#aaa] px-6 py-4 flex">
            <div className="flex grow gap-3 items-center">
                <button 
                    className={`cursor-pointer w-7 h-7 p-1 ${tool?.type === 'brush' ? "border-2 border-blue-400" : "bg-white"}`}
                    onClick={() => {
                        if (!canvas || !ws|| !boardId) return
                        setTool(new Brush(canvas, {lineWidth, fillStyle, strokeStyle}, ws, boardId))
                    }}><img src={brushImg}/>
                </button>
                <button 
                    className={`cursor-pointer w-7 h-7 p-1 ${tool?.type === 'rect' ? "border-2 border-blue-400" : "bg-white"}`}
                    onClick={() => {
                        if (!canvas || !ws|| !boardId) return
                        setTool(new Rect(canvas, {lineWidth, fillStyle, strokeStyle}, ws, boardId))
                    }}><img src={rectImg}/></button>
                <button 
                    className={`cursor-pointer w-7 h-7 p-1 ${tool?.type === 'circle' ? "border-2 border-blue-400" : "bg-white"}`}
                    onClick={() => {
                        if (!canvas || !ws|| !boardId) return
                        setTool(new Circle(canvas, {lineWidth, fillStyle, strokeStyle}, ws, boardId))
                    }}
                    ><img src={circleImg}/></button>
                <button 
                    className={`cursor-pointer w-7 h-7 p-1 ${tool?.type === 'eraser' ? "border-2 border-blue-400" : "bg-white"}`}
                    onClick={() => {
                        if (!canvas || !ws|| !boardId) return
                        setTool(new Eraser(canvas, {lineWidth, fillStyle, strokeStyle}, ws, boardId))
                    }}
                    ><img src={eraserImg}/></button>
                <button 
                    className={`cursor-pointer w-7 h-7 p-1 ${tool?.type === 'line' ? "border-2 border-blue-400" : "bg-white"}`}
                    onClick={() => {
                        if (!canvas || !ws|| !boardId) return
                        setTool(new Line(canvas, {lineWidth, fillStyle, strokeStyle}, ws, boardId))
                    }}
                    ><img src={lineImg}/></button>
                <input 
                    className="w-10 h-7" 
                    type="color" 
                    onChange={(e) => {
                    setFillStyle(e.target.value)
                }}/>
            </div>
            <div className="flex gap-3">
                <button 
                    className="cursor-pointer w-5 h-5"
                    onClick={handleUndo}
                ><img src={undoImg}/></button>
                <button 
                    className="cursor-pointer w-5 h-5"
                    onClick={handleRedo}
                ><img src={redoImg}/></button>
                <button className="cursor-pointer w-5 h-5"><img src={saveImg}/></button>
            </div>
        </div>
    )
}
import ToolBar from "./ToolBar"
import SettingsBar from "./SettingsBar/SettingsBar"
import UndoRedoBar from "./UndoRedoBar"
import { useToolStore } from "../store/toolStore"
import { useCanvasStore } from "../store/canvasStore"

export default function BoardBottomSection(){
    const tool = useToolStore(state => state.tool)
    const selectedShapesIds = useCanvasStore(state => state.selectedShapesIds)
    
    return(
        <>
            <div className="absolute bottom-2 left-3 right-3 z-10 flex items-center justify-between gap-2">
                <div className="flex-1" />
                <ToolBar/>
                <div className="flex-1 flex justify-end">
                    <UndoRedoBar/>
                </div>
            </div>
            {tool && (tool.type !== 'selection' || selectedShapesIds.length > 0) && <SettingsBar/>}
        </>
    )
}
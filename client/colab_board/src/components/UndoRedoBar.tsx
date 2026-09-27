import { Icon } from '@iconify/react'
import { useCanvasStore } from '../store/canvasStore'

export default function UndoRedoBar(){
    const undo = useCanvasStore(state => state.undo)
    const redo = useCanvasStore(state => state.redo)

    return(
        <div className="px-4 py-2 flex items-center gap-4 rounded-xl drop-shadow-md bg-white border border-black/15">
            <button
                onClick={undo}
                className="cursor-pointer border-r border-black/11 pr-4 py-1">
                <Icon icon="lucide:undo" width={22} height={22} />
            </button>
            <button
                onClick={redo}
                className="cursor-pointer">
                <Icon icon="lucide:redo" width={22} height={22} />
            </button>
        </div>
    )
}
import { Icon } from '@iconify/react'
import { useEffect, useState } from 'react'
import { useCanvasYjs } from '../../hooks/useCanvasYjs'

export default function UndoRedoBar(){
    const {yUndoManager} = useCanvasYjs()
    const [, forceRender] = useState(0)

    useEffect(() => {
        if (!yUndoManager) return

        const update = () => {
            forceRender(value => value + 1)
        }

        yUndoManager.on('stack-item-added', update)
        yUndoManager.on('stack-item-popped', update)
        yUndoManager.on('stack-cleared', update)

        return () => {
            yUndoManager.off('stack-item-added', update)
            yUndoManager.off('stack-item-popped', update)
            yUndoManager.off('stack-cleared', update)
        }
    }, [yUndoManager])
    
    return(
        <div className="px-4 py-2 flex items-center gap-4 rounded-xl drop-shadow-md bg-white border border-black/15">
            <button
                disabled={!yUndoManager?.canUndo()}
                onClick={() => yUndoManager?.undo()}
                className="cursor-pointer border-r border-black/11 pr-4 py-1 disabled:cursor-default">
                <Icon icon="lucide:undo" width={22} height={22} color={yUndoManager?.canUndo() ? "black" : "#919191"}/>
            </button>
            <button
                disabled={!yUndoManager?.canRedo()}
                onClick={() => yUndoManager?.redo()}
                className="cursor-pointer disabled:cursor-default">
                <Icon icon="lucide:redo" width={22} height={22} color={yUndoManager?.canRedo() ? "black" : "#919191"}/>
            </button>
        </div>
    )
}
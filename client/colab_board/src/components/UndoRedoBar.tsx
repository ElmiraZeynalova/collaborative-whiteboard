import { Icon } from '@iconify/react'

export default function UndoRedoBar(){
    return(
        <div className="px-4 py-2 flex items-center gap-4 rounded-xl drop-shadow-md bg-white border border-black/15">
            <button
                className="cursor-pointer border-r border-black/11 pr-4 py-1">
                <Icon icon="lucide:undo" width={22} height={22} />
            </button>
            <button
                className="cursor-pointer">
                <Icon icon="lucide:redo" width={22} height={22} />
            </button>
        </div>
    )
}
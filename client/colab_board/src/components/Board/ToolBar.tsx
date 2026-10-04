import { useToolStore } from '../../store/toolStore'
import { Icon } from '@iconify/react'
import {useEffect} from 'react'
import { refreshSettingsBar } from '../../utils/updateSettingsBar'

export default function ToolBar(){
    const setTool = useToolStore(state => state.setTool)
    const tool = useToolStore(state => state.tool)
    const setToolSettingChangedByUser = useToolStore(state => state.setToolSettingChangedByUser)
    
    useEffect(() => { 
        setToolSettingChangedByUser(false)
        refreshSettingsBar(tool)
    }, [tool])

    return(
        <div className="px-3 py-1 flex items-center gap-4 rounded-xl drop-shadow-md bg-white border border-black/15">
            <button 
                className={`cursor-pointer p-2 rounded-lg ${tool === 'selection' ? "bg-[#D0ECDF]" : "bg-white"}`}
                onClick={() => setTool("selection")}>
                <Icon icon="tabler:pointer-2" width={22} height={22} />
            </button>
            <button
                className={`cursor-pointer p-2 rounded-lg ${tool === 'rect' ? "bg-[#D0ECDF]" : "bg-white"}`}
                onClick={() => setTool("rect")}>
                <Icon icon="ph:rectangle" width={23} height={23} />
            </button>
            <button
                className={`cursor-pointer p-2 rounded-lg ${tool === 'romb' ? "bg-[#D0ECDF]" : "bg-white"}`}
                onClick={() => setTool("romb")}> 
                <Icon icon="lucide:diamond" width={22} height={22} />
            </button>
            <button
                className={`cursor-pointer p-2 rounded-lg ${tool === 'ellipse' ? "bg-[#D0ECDF]" : "bg-white"}`}
                onClick={() => setTool("ellipse")}>
                <Icon icon="lucide:circle" width={21} height={21} />
            </button>
            <button
                className={`cursor-pointer p-2 rounded-lg ${tool === 'arrow' ? "bg-[#D0ECDF]" : "bg-white"}`}
                onClick={() => setTool("arrow")}>
                <Icon icon="gg:arrow-right" width={22} height={22} />
            </button>
            <button
                className={`cursor-pointer p-2 rounded-lg ${tool === 'line' ? "bg-[#D0ECDF]" : "bg-white"}`}
                onClick={() => setTool("line")}>
                <Icon icon="fluent:line-horizontal-1-20-filled" width={22} height={22} />
            </button>
            <button
                className={`cursor-pointer p-2 rounded-lg ${tool === 'pencil' ? "bg-[#D0ECDF]" : "bg-white"}`}
                onClick={() => setTool("pencil")}>
                <Icon icon="mynaui:pencil" width={22} height={22} />
            </button>
            <button
                className={`cursor-pointer p-2 rounded-lg ${tool === 'text' ? "bg-[#D0ECDF]" : "bg-white"}`}
                onClick={() => setTool("text")}>
                <Icon icon="mi:text" width={22} height={22} />
            </button>
            <button
                className={`cursor-pointer p-2 rounded-lg ${tool === 'sticker' ? "bg-[#D0ECDF]" : "bg-white"}`}
                onClick={() => setTool("sticker")}>
                <Icon icon="ph:sticker" width={24} height={24} />
            </button>
            <button
                className={`cursor-pointer p-2 rounded-lg ${tool === 'eraser' ? "bg-[#D0ECDF]" : "bg-white"}`}
                onClick={() => setTool("eraser")}>
                <Icon icon="proicons:eraser" width={24} height={24} />
            </button>
        </div>
    )
}

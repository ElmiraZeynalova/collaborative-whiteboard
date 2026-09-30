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
import {useEffect} from 'react'
import { refreshSettingsBar } from '../utils/updateSettingsBar'

export default function ToolBar(){
    const setTool = useToolStore(state => state.setTool)
    const tool = useToolStore(state => state.tool)
    const setToolSettingChangedByUser = useToolStore(state => state.setToolSettingChangedByUser)
    
    useEffect(() => {
        if(!tool) return 
        setToolSettingChangedByUser(false)
        refreshSettingsBar(tool.type)
    }, [tool])

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

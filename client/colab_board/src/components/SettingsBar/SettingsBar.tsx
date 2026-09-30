import { useToolStore } from '../../store/toolStore'
import { useCanvasStore } from '../../store/canvasStore'
import EraserSettings from './settings/EraserSettings'
import ShapeSettings from './settings/ShapeSettings'
import TextSettings from './settings/TextSettings'
import LineSettings from './settings/LineSettings'
import StickerSettings from './settings/StickerSettings'
import AllSettings from './settings/AllSettings'
import { Icon } from '@iconify/react'
import { getShapeType } from '../../utils/yShapeGetters'

const bars: Record<string, React.ComponentType> = {
    rect: ShapeSettings,
    ellipse: ShapeSettings,
    romb: ShapeSettings,
    pencil: LineSettings,
    text: TextSettings,
    eraser: EraserSettings,
    line: LineSettings,
    arrow: ShapeSettings,
    sticker: StickerSettings,
    all: AllSettings
}
export default function SettingsBar(){
    const tool = useToolStore(state => state.tool)
    if(!tool) return
    const selectedShapesIds = useCanvasStore(state => state.selectedShapesIds)
    const yShapes = useCanvasStore(state => state.yShapes)

    let Settings

    if (tool.type !== 'selection') {
        Settings = bars[tool.type]
    } else if (selectedShapesIds.length === 1) {
        const shape = yShapes?.get(selectedShapesIds[0])
        if(!shape) return
        const type = getShapeType(shape)
        Settings = bars[type]
    } else if (selectedShapesIds.length > 1) {
        Settings = bars.all
    }

    return(
        <div className="absolute bottom-16 left-[50%] z-10 translate-x-[-50%] px-3 py-2 flex items-center gap-4 rounded-xl drop-shadow-md bg-white border border-black/15">
            {Settings && <Settings />}
            <button>
                <Icon icon="ph:dots-three-outline-vertical-fill" className="cursor-pointer" color="#686868" width={20} height={20} />
            </button>
        </div>
    )
}


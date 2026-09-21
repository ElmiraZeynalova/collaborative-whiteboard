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
    pencil: LineSettings,
    text: TextSettings,
    eraser: EraserSettings,
    line: LineSettings,
    arrow: ShapeSettings,
    sticker: StickerSettings
}
export default function SettingsBar(){
    const tool = useToolStore(state => state.tool)
    const Settings = bars[tool?.type]
    const [showMenu, setShowMenu] = useState<boolean>(false)

    return(
        <div className="absolute bottom-16 left-[50%] z-10 translate-x-[-50%] px-3 py-2 flex items-center gap-4 rounded-xl drop-shadow-md bg-white border border-black/15">
            {Settings && <Settings />}
            <button onClick={() => setShowMenu(prev => !prev)}>
                <Icon icon="ph:dots-three-outline-vertical-fill" className="cursor-pointer" color="#686868" width={20} height={20} />
            </button>

            {showMenu && <Menu className="absolute bottom-full right-0 mb-2" />}
        </div>
    )
}


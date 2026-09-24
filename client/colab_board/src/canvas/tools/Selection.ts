import Tool, { type PointerModifiers } from './Tool'
import { useCanvasStore } from '../../store/canvasStore'
import { updateSettingsBar } from '../../utils/updateSettingsBar';
import {refreshSettingsBar} from '../../utils/refreshSettingsBar'
import { useToolStore } from '../../store/toolStore';

export default class Selection extends Tool {
    readonly type = 'selection'

    onPointerDown(
        _pos?: { x: number; y: number },
        modifiers?: PointerModifiers,
        targetId?: string,
    ): void {
        const {selectedShapesIds, setSelectedShapesIds } = useCanvasStore.getState()


        const shape = targetId
            ? useCanvasStore.getState().shapes[targetId]
            : null

        const metaPressed = !!(modifiers?.shiftKey || modifiers?.ctrlKey || modifiers?.metaKey)

        if (!shape) {
            if (!metaPressed) {
                setSelectedShapesIds([])  
            }
            return
        }

        const isSelected = selectedShapesIds.includes(shape.id)

        if (!metaPressed && !isSelected) {
            setSelectedShapesIds([shape.id])
            useToolStore.getState().setToolSettingChangedByUser(false)
            updateSettingsBar(shape)
        } else if (metaPressed && isSelected) {
            setSelectedShapesIds(selectedShapesIds.filter(id => id !== shape.id))
        } else if (metaPressed && !isSelected) {
            const newSelectedIds = [...selectedShapesIds, shape.id]
            setSelectedShapesIds(newSelectedIds)
            if (newSelectedIds.length === 2) {
                useToolStore.getState().setToolSettingChangedByUser(false)
                refreshSettingsBar(this.type)
            }
        }

    }

    onPointerMove(): void {}
    onPointerUp(): void {}
}

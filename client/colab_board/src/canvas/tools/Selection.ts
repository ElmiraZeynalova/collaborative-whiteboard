import Tool, { type PointerModifiers } from './Tool'
import { useCanvasStore } from '../../store/canvasStore'
import { updateSettingsBar } from '../../utils/updateSettingsBar';
import {refreshSettingsBar} from '../../utils/updateSettingsBar'
import { useToolStore } from '../../store/toolStore';
import { getShapeId } from '../../utils/yShapeGetters';

export default class Selection extends Tool {
    readonly type = 'selection'

    onPointerDown(_pos?: { x: number; y: number }, modifiers?: PointerModifiers, targetId?: string): void {
        const canvasStore = useCanvasStore.getState()
        const selectedShapesIds = canvasStore.selectedShapesIds
        const setSelectedShapesIds = canvasStore.setSelectedShapesIds

        const shape = targetId ? this.ctx.yShapes.get(targetId) : null

        const metaPressed = !!(modifiers?.shiftKey || modifiers?.ctrlKey || modifiers?.metaKey)

        if (!shape) {
            if (!metaPressed) {
                setSelectedShapesIds([])  
            }
            return
        }

        const shapeId = getShapeId(shape)
        const isSelected = selectedShapesIds.includes(shapeId)

        if (!metaPressed && !isSelected) {
            setSelectedShapesIds([shapeId])
            useToolStore.getState().setToolSettingChangedByUser(false)
            updateSettingsBar(shape)
        } else if (metaPressed && isSelected) {
            setSelectedShapesIds(selectedShapesIds.filter(id => id !== shapeId))
        } else if (metaPressed && !isSelected) {
            const newSelectedIds = [...selectedShapesIds, shapeId]
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

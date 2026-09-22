import Tool, { type PointerModifiers } from './Tool'
import { useCanvasStore } from '../../store/canvasStore'

export default class Selection extends Tool {
    readonly type = 'selection'

    onPointerDown(pos: { x: number; y: number }, modifiers?: PointerModifiers,  targetId?: string): void {
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
        } else if (metaPressed && isSelected) {
            setSelectedShapesIds(selectedShapesIds.filter(id => id !== shape.id))
        } else if (metaPressed && !isSelected) {
            setSelectedShapesIds([...selectedShapesIds, shape.id])
        }
    }

    onPointerMove(): void {}
    onPointerUp(): void {}
}

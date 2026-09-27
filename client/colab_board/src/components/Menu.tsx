import { useCanvasStore } from "../store/canvasStore"
import { useClientStore } from "../store/clientStore"
import type { Shape } from "../types/shapes"
import { moveBackward, moveForward, moveToFront, moveToBack } from "../utils/shapeLayering"

const menuOptions = ["Duplicate",  "Bring forward", "Send backward", "Bring to front", "Send to back", "Delete"]

export default function Menu({className, closeModal, position}: {className: string, closeModal: () => void, position: { x: number; y: number }}){
    const shapes = useCanvasStore(state => state.shapes)
    const selectedShapesIds = useCanvasStore(state => state.selectedShapesIds)
    const pushToUndo = useCanvasStore(state => state.pushToUndo)
    const ws = useClientStore(state => state.ws)
    const updateShape = useCanvasStore(state => state.updateShape)
    const addShape = useCanvasStore(state => state.addShape)
    const shapesOrder = useCanvasStore(state => state.shapesOrder)

    function handleClick(menuOption: string){
        if (menuOption === "Delete") {
            const deletedShapes: Shape[] = []

            for (const id of selectedShapesIds) {
                const shape = shapes[id]

                updateShape(id, {
                    isDeleted: true,
                })

                const updatedShape = useCanvasStore.getState().shapes[id]

                ws?.send(JSON.stringify({
                    type: 'shape:update',
                    shape: updatedShape,
                }))

                deletedShapes.push(shape)
            }

            pushToUndo({
                type: 'delete',
                shapes: deletedShapes,
            })
        }else if (menuOption === 'Duplicate') {
            const duplicatedShapes: Shape[] = []

            for (const id of selectedShapesIds) {
                const shape = shapes[id]
                if (!shape) continue

                const duplicatedShape = {
                    ...shape,
                    id: crypto.randomUUID(),
                }

                addShape(duplicatedShape)

                ws?.send(JSON.stringify({
                    type: 'shape:add',
                    shape: duplicatedShape,
                    shapesOrder: useCanvasStore.getState().shapesOrder
                }))

                duplicatedShapes.push(duplicatedShape)
            }

            if (duplicatedShapes.length > 0) {
                pushToUndo({
                    type: 'add',
                    shapes: duplicatedShapes,
                })
            }
        }else if(menuOption === "Bring forward"){
            moveForward(shapesOrder, selectedShapesIds)
        }else if(menuOption === "Send backward"){
            moveBackward(shapesOrder, selectedShapesIds)
        }else if(menuOption === "Bring to front"){
            moveToFront(shapesOrder, selectedShapesIds)
        }else if(menuOption === "Send to back"){
            moveToBack(shapesOrder, selectedShapesIds)

        }

        closeModal()
    }

    return(
        <div 
            style={{position: 'fixed', left: position.x, top: position.y}}
            className={`z-10 flex flex-col bg-[#F0F0F0] border border-black/25 ${className}`}>
            {menuOptions.map(item => (
                <button
                    onClick={() => handleClick(item)}
                    key={item}
                    className={`cursor-pointer hover:bg-[#D0ECDF] px-3 py-1 ${item === "Delete" ? 'border-t border-black/25': ''} ${item === "Duplicate" ? 'border-b border-black/25': ''}`}>
                    <p className={`text-sm text-start ${item === 'Delete' ? 'text-red-600' : 'text-black'}`}>{item}</p>
                </button>
            ))}
        </div>
    )
}



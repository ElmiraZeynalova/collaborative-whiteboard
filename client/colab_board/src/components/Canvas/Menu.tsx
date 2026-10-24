import { useCanvasYjs } from "../../hooks/useCanvasYjs";
import { useCanvasStore } from "../../store/canvasStore"
import { moveBackward, moveForward, moveToFront, moveToBack } from "../../utils/shapeLayering"

const menuOptions = ["Duplicate",  "Bring forward", "Send backward", "Bring to front", "Send to back", "Delete"]

export default function Menu({className, closeModal, position}: {className?: string, closeModal: () => void, position: { x: number; y: number }}){
    const { yShapes, yShapesOrder } = useCanvasYjs()
    const selectedShapesIds = useCanvasStore(state => state.selectedShapesIds)

    function handleClick(menuOption: string){
        if (menuOption === "Delete") {
            for (const id of selectedShapesIds) {
                const shape = yShapes?.get(id)
                shape?.set("isDeleted", true)
            }
        }else if (menuOption === 'Duplicate') {
            for (const id of selectedShapesIds) {
                const shape = yShapes?.get(id)
                if(!shape) return
                const newId = crypto.randomUUID()
                shape?.set("id", newId)
                yShapes?.set(newId, shape)
                yShapesOrder?.push([newId])
            }
        }else if(menuOption === "Bring forward"){
            if(!yShapesOrder) return
            moveForward(yShapesOrder, selectedShapesIds)
        }else if(menuOption === "Send backward"){
            if(!yShapesOrder) return
            moveBackward(yShapesOrder, selectedShapesIds)
        }else if(menuOption === "Bring to front"){
            if(!yShapesOrder) return
            moveToFront(yShapesOrder, selectedShapesIds)
        }else if(menuOption === "Send to back"){
            if(!yShapesOrder) return
            moveToBack(yShapesOrder, selectedShapesIds)

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



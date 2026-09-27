import { useCanvasStore } from "../store/canvasStore";
import { useClientStore } from "../store/clientStore";

export function moveForward(
    shapesOrder: string[],
    selectedShapesIds: string[]
) {
    const store = useCanvasStore.getState()
    const selected = new Set(selectedShapesIds)
    const newOrder = [...shapesOrder]

    for (let i = newOrder.length - 2; i >= 0; i--) {
        if (
            selected.has(newOrder[i]) &&
            !selected.has(newOrder[i + 1])
        ) {
            [newOrder[i], newOrder[i + 1]] = [
                newOrder[i + 1],
                newOrder[i],
            ]
        }
    }

    store.setShapesOrder(newOrder)
    store.pushToUndo({
        type: "reorder",
        before: shapesOrder,
        after: newOrder,
    })
    const ws = useClientStore.getState().ws
    ws?.send(JSON.stringify({type: "shape:order", shapesOrder: useCanvasStore.getState().shapesOrder}))
}

export function moveBackward(
    shapesOrder: string[],
    selectedShapesIds: string[]
) {
    const store = useCanvasStore.getState()
    const selected = new Set(selectedShapesIds)
    const newOrder = [...shapesOrder]

    for (let i = 1; i < newOrder.length; i++) {
        if (
            selected.has(newOrder[i]) &&
            !selected.has(newOrder[i - 1])
        ) {
            [newOrder[i], newOrder[i - 1]] = [
                newOrder[i - 1],
                newOrder[i],
            ]
        }
    }

    store.setShapesOrder(newOrder)
    store.pushToUndo({
        type: "reorder",
        before: shapesOrder,
        after: newOrder,
    })
    const ws = useClientStore.getState().ws
    ws?.send(JSON.stringify({type: "shape:order", shapesOrder: useCanvasStore.getState().shapesOrder}))
}

export function moveToFront(shapesOrder: string[], selectedShapesIds: string[]){
    const store = useCanvasStore.getState()
    const newOrder = [...shapesOrder.filter(id => !selectedShapesIds.includes(id)), ...selectedShapesIds]
    store.setShapesOrder(newOrder)
    store.pushToUndo({
        type: "reorder",
        before: shapesOrder,
        after: newOrder,
    })
    const ws = useClientStore.getState().ws
    ws?.send(JSON.stringify({type: "shape:order", shapesOrder: useCanvasStore.getState().shapesOrder}))
}

export function moveToBack(shapesOrder: string[], selectedShapesIds: string[]){
    const store = useCanvasStore.getState()
    const newOrder = [...selectedShapesIds, ...shapesOrder.filter(id => !selectedShapesIds.includes(id))]
    store.setShapesOrder(newOrder)
    store.pushToUndo({
        type: "reorder",
        before: shapesOrder,
        after: newOrder,
    })
    const ws = useClientStore.getState().ws
    ws?.send(JSON.stringify({type: "shape:order", shapesOrder: useCanvasStore.getState().shapesOrder}))

}
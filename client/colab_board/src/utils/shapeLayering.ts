import * as Y from 'yjs'

function getIdIndex(id: string, order: Y.Array<string>) {
    for (let i = 0; i < order.length; i++) {
        if (order.get(i) === id) return i
    }

    return -1
}

export function moveForward(
    order: Y.Array<string>,
    selectedIds: string[]
) {
    for (const id of selectedIds) {
        const index = getIdIndex(id, order)

        if (index === -1 || index === order.length - 1) {
            continue
        }

        const nextId = order.get(index + 1)

        order.delete(index, 2)
        order.insert(index, [nextId, id])
    }
}

export function moveBackward(
    order: Y.Array<string>,
    selectedIds: string[]
) {
    for (const id of selectedIds) {
        const index = getIdIndex(id, order)

        if (index <= 0) {
            continue
        }

        const prevId = order.get(index - 1)

        order.delete(index - 1, 2)
        order.insert(index - 1, [id, prevId])
    }
}

export function moveToFront(yShapesOrder: Y.Array<string>, selectedShapesIds: string[]){
    for(const id of selectedShapesIds){
        const thisIdIndex = getIdIndex(id, yShapesOrder)
    
        yShapesOrder.delete(thisIdIndex, 1)
        yShapesOrder.push([id])
    }
}


export function moveToBack(yShapesOrder: Y.Array<string>, selectedShapesIds: string[]){
    for(const id of selectedShapesIds){
        const thisIdIndex = getIdIndex(id, yShapesOrder)
    
        yShapesOrder.delete(thisIdIndex, 1)
        yShapesOrder.insert(0, [id])
    }
}
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
    for (const id of [...selectedIds].reverse()) {
        const index = getIdIndex(id, order);

        if (index === -1 || index === order.length - 1) {
            continue;
        }

        const nextId = order.get(index + 1);

        if (selectedIds.includes(nextId)) continue;

        order.delete(index, 2);
        order.insert(index, [nextId, id]);
    }
}

export function moveBackward(
    order: Y.Array<string>,
    selectedIds: string[]
) {
    for (const id of selectedIds) {
        const index = getIdIndex(id, order);

        if (index <= 0) continue;

        const prevId = order.get(index - 1);

        if (selectedIds.includes(prevId)) continue;

        order.delete(index - 1, 2);
        order.insert(index - 1, [id, prevId]);
    }
}

export function moveToFront(
    order: Y.Array<string>,
    selectedIds: string[]
) {
    const selected = new Set(selectedIds);
    const current = order.toArray();

    const unselected = current.filter(id => !selected.has(id));
    const selectedInOrder = current.filter(id => selected.has(id));

    order.delete(0, order.length);
    order.insert(0, [...unselected, ...selectedInOrder]);
}

export function moveToBack(
    order: Y.Array<string>,
    selectedIds: string[]
) {
    const selected = new Set(selectedIds);
    const current = order.toArray();

    const selectedInOrder = current.filter(id => selected.has(id));
    const unselected = current.filter(id => !selected.has(id));

    order.delete(0, order.length);
    order.insert(0, [...selectedInOrder, ...unselected]);
}
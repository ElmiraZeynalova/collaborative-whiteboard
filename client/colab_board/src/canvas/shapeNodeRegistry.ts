import type Konva from 'konva'

const registry = new Map<string, Konva.Node>()

export function registerShapeNode(id: string, node: Konva.Node | null) {
    if (node) {
        registry.set(id, node)
    } else {
        registry.delete(id)
    }
}

export function getShapeNodes(ids: string[]): Konva.Node[] {
    return ids
        .map(id => registry.get(id))
        .filter((n): n is Konva.Node => !!n)
}
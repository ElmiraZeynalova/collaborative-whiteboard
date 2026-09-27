import type Konva from 'konva'
import type { Shape } from '../types/shapes'
import { moveShape } from '../utils/moveShape'
import { useCanvasStore } from '../store/canvasStore'
import { useClientStore } from '../store/clientStore'

const ABSOLUTE_POSITION_TYPES: Shape['type'][] = ['rect', 'ellipse', 'romb', 'sticker', 'text', 'arrow']

function getDragDelta(shape: Shape, node: Konva.Node) {
    if (shape.type === 'line') {
        return { dx: node.x(), dy: node.y(), resetNode: true }
    }
    if (shape.type === 'arrow') {
        return { dx: node.x() - shape.startX, dy: node.y() - shape.startY, resetNode: false }
    }
    if (ABSOLUTE_POSITION_TYPES.includes(shape.type)) {
        return { dx: node.x() - shape.x, dy: node.y() - shape.y, resetNode: false }
    }
    if (shape.type === 'pencil' || shape.type === 'eraser') {
        return {
            dx: node.x(),
            dy: node.y(),
            resetNode: true
        }
    }
    return { dx: node.x(), dy: node.y(), resetNode: true }
}

export function handleShapeDragEnd(shape: Shape, node: Konva.Node) {
    const shapeBeforeChange = useCanvasStore.getState().shapes[shape.id]
    const { dx, dy, resetNode } = getDragDelta(shape, node)
    const changes = moveShape(shape, dx, dy)

    useCanvasStore.getState().updateShape(shape.id, changes)

    if (resetNode) {
        node.position({ x: 0, y: 0 })   
    }

    const updated = useCanvasStore.getState().shapes[shape.id]
    useClientStore.getState().ws?.send(JSON.stringify({ type: 'shape:update', shape: updated }))
    useCanvasStore.getState().pushToUndo({type: 'update', changes: [ 
        {
            shapeId: shape.id,
            before: shapeBeforeChange,
            after: updated
        }
    ]})
}

export function handleTransformEnd(shape: Shape, node: Konva.Node) {
    const shapeBeforeChange = useCanvasStore.getState().shapes[shape.id]
    const scaleX = node.scaleX()
    const scaleY = node.scaleY()

    node.scaleX(1)
    node.scaleY(1)

    let changes: Record<string, unknown> = {
        x: node.x(),
        y: node.y(),
        rotation: node.rotation(),
    }

    if (shape.type === 'rect' || shape.type === 'romb' || shape.type === 'sticker') {
        changes = {
            ...changes,
            width: Math.max(5, shape.width * scaleX),
            height: Math.max(5, shape.height * scaleY),
        }
    } else if (shape.type === 'ellipse') {
        changes = {
            ...changes,
            radius: {
                x: Math.max(5, shape.radius.x * scaleX),
                y: Math.max(5, shape.radius.y * scaleY),
            },
        }
    } else if (shape.type === 'pencil' || shape.type === 'eraser') {
        changes = {
            ...changes,
            points: shape.points.map(point => ({
                x: point.x * scaleX,
                y: point.y * scaleY,
            })),
        }
    }

    useCanvasStore.getState().updateShape(shape.id, changes)

    const updated = useCanvasStore.getState().shapes[shape.id]

    useClientStore.getState().ws?.send(
        JSON.stringify({
            type: 'shape:update',
            shape: updated,
        })
    )
    useCanvasStore.getState().pushToUndo({type: 'update', changes: [ 
        {
            shapeId: shape.id,
            before: shapeBeforeChange,
            after: updated
        }
    ]})
}

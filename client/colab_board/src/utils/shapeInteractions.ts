import type Konva from 'konva'
import type { ShapeChanges, YShape, YShapeValue } from '../types/shapes'
import { moveShape } from '../utils/moveShape'
import {getShapeNumber, getShapePoints, getShapeRadius, getShapeType } from '../utils/yShapeGetters'
const ABSOLUTE_POSITION_TYPES = ['rect', 'ellipse', 'romb', 'sticker', 'text', 'arrow']

function getDragDelta(shape: YShape, node: Konva.Node) {
    const shapeType = getShapeType(shape)

    if (shapeType === 'line') {
        return { dx: node.x(), dy: node.y(), resetNode: true }
    }
    if (shapeType === 'arrow') {
        const startX = getShapeNumber(shape, 'startX')
        const startY = getShapeNumber(shape, 'startY')
        return { dx: node.x() - startX, dy: node.y() - startY, resetNode: false }
    }
    if (ABSOLUTE_POSITION_TYPES.includes(shapeType)) {
        const x = getShapeNumber(shape, 'x')
        const y = getShapeNumber(shape, 'y')
        return { dx: node.x() - x, dy: node.y() - y, resetNode: false }
    }
    if (shapeType === 'pencil' || shapeType === 'eraser') {
        return {
            dx: node.x(),
            dy: node.y(),
            resetNode: true
        }
    }
    return { dx: node.x(), dy: node.y(), resetNode: true }
}

export function handleShapeDragEnd(shape: YShape, node: Konva.Node) {
    const { dx, dy, resetNode } = getDragDelta(shape, node)
    const changes: ShapeChanges = moveShape(shape, dx, dy)


    for (const [key, value] of Object.entries(changes)) {
        shape.set(key, value)
    }

    if (resetNode) {
        node.position({ x: 0, y: 0 })   
    }
}

export function handleTransformEnd(shape: YShape, node: Konva.Node) {
    const shapeType = getShapeType(shape)

    const scaleX = node.scaleX()
    const scaleY = node.scaleY()

    node.scaleX(1)
    node.scaleY(1)

    let changes: Record<string, YShapeValue> = {
        x: node.x(),
        y: node.y(),
        rotation: node.rotation(),
    }

    if (shapeType === 'rect' || shapeType === 'romb' || shapeType === 'sticker') {
        const width = getShapeNumber(shape, 'width')
        const height = getShapeNumber(shape, 'height')
        changes = {
            ...changes,
            width: Math.max(5, width * scaleX),
            height: Math.max(5, height * scaleY),
        }
    } else if (shapeType === 'ellipse') {
        const radius = getShapeRadius(shape) 
        changes = {
            ...changes,
            radius: {
                x: Math.max(5, radius.x * scaleX),
                y: Math.max(5, radius.y * scaleY),
            },
        }
    } else if (shapeType === 'pencil' || shapeType === 'eraser') {
        const points = getShapePoints(shape) 
        changes = {
            ...changes,
            points: points.map(point => ({
                x: point.x * scaleX,
                y: point.y * scaleY,
            })),
        }
    }

    for (const [key, value] of Object.entries(changes)) {
        shape.set(key, value)
    }

}

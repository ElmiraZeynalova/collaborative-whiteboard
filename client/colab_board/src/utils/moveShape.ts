import type {ShapeChanges, YShape} from '../types/shapes'
import { getShapeNumber, getShapePoints, getShapeType } from './yShapeGetters'

export function moveShape(shape: YShape, dx: number, dy: number): ShapeChanges{
    const x = getShapeNumber(shape, 'x')
    const y = getShapeNumber(shape, 'y')
    const startX = getShapeNumber(shape, 'startX')
    const startY = getShapeNumber(shape, 'startY')
    const shapeType = getShapeType(shape)
    const points = getShapePoints(shape)

    switch(shapeType){
        case "rect":
            return {x: x + dx, y: y + dy}
        case "ellipse":
            return {x: x + dx, y: y + dy}
        case "romb":
            return {x: x + dx, y: y + dy}
        case "sticker":
            return {x: x + dx, y: y + dy}
        case "text":
            return {x: x + dx, y: y + dy}
        case "line":
        case "arrow":
            return {startX: startX + dx, startY: startY + dy, x: x + dx, y: y + dy}
        case "pencil":
        case "eraser":
            return {
                x: x + dx,
                y: y + dy,
                points: points.map(p => ({ x: p.x + dx, y: p.y + dy }))
            }
    }
    return {}
}
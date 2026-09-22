import {type Shape, type ShapeChanges} from '../types/shapes'

export function moveShape(shape: Shape, dx: number, dy: number): ShapeChanges{
    switch(shape.type){
        case "rect":
            return {x: shape.x + dx, y: shape.y + dy}
        case "ellipse":
            return {x: shape.x + dx, y: shape.y + dy}
        case "romb":
            return {x: shape.x + dx, y: shape.y + dy}
        case "sticker":
            return {x: shape.x + dx, y: shape.y + dy}
        case "text":
            return {x: shape.x + dx, y: shape.y + dy}
        case "line":
        case "arrow":
            return {startX: shape.startX + dx, startY: shape.startY + dy, x: shape.x + dx, y: shape.y + dy}
        case "pencil":
        case "eraser":
            return {
                x: shape.x + dx,
                y: shape.y + dy,
                points: shape.points.map(p => ({ x: p.x + dx, y: p.y + dy }))
            }
    }
    return {}
}
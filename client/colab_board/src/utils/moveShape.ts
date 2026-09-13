import {type Shape, type ShapeChanges} from '../types/shapes'

export function moveShape(shape: Shape, dx: number, dy: number): ShapeChanges{
    switch(shape.type){
        case "rect":
            return {x: shape.x + dx, y: shape.y + dy}
        case "circle":
            return {x: shape.x + dx, y: shape.y + dy}
        case "line":
            return {startX: shape.startX + dx, startY: shape.startY + dy, x: shape.x + dx, y: shape.y + dy}
    }
    return {}
}
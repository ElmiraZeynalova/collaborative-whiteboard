import {type RectShape, type CircleShape, type LineShape, type Shape} from '../types/shapes'

export function isPointInsideShape(shape: Shape, x: number, y: number): boolean{
    switch(shape.type){
        case "rect":
            return isPointInsideRect(shape, x, y)
        case "circle":
            return isPointInsideCircle(shape, x, y)
        case "line":
            return isPointNearLine(shape, x, y)
    }
    return false
}


function isPointNearLine(shape: LineShape, x: number, y: number){
    const px = x
    const py = y
    const x1 = shape.startX
    const y1 = shape.startY
    const x2 = shape.x
    const y2 = shape.y
    const tolerance = 5

    const dx = x2 - x1
    const dy = y2 - y1

    const lengthSquared = dx * dx + dy * dy


    if (lengthSquared === 0) {
        return Math.hypot(px - x1, py - y1) <= tolerance
    }


    let t = ((px - x1) * dx + (py - y1) * dy) / lengthSquared

    t = Math.max(0, Math.min(1, t))

    const closestX = x1 + t * dx
    const closestY = y1 + t * dy

    const distance = Math.hypot(
        px - closestX,
        py - closestY
    )

    return distance <= tolerance
}

function isPointInsideRect(shape: RectShape, x: number, y: number): boolean{
    const top = shape.y
    const bottom = shape.y + shape.height
    const left = shape.x
    const right = shape.x + shape.width

    return x > left && x < right && y > top && y < bottom
}

function isPointInsideCircle(shape: CircleShape, x: number, y: number): boolean{
    const top = shape.y - shape.radius
    const bottom = shape.y + shape.radius
    const left = shape.x - shape.radius
    const right = shape.x + shape.radius

    return x > left && x < right && y > top && y < bottom
}
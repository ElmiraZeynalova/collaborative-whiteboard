import {type RectShape, type EllipseShape, type LineShape, type RombShape, type BrushShape, type EraserShape, type Shape} from '../types/shapes'
import { getShapeBounds } from './getShapeBounds'

export function isPointInsideShape(shape: Shape, x: number, y: number): boolean{
    switch(shape.type){
        case "rect":
            return isPointInsideRect(shape, x, y)
        case "ellipse":
            return isPointInsideEllipse(shape, x, y)
        case "romb":
            return isPointInsideRomb(shape, x, y)
        case "line":
            return isPointNearLine(shape, x, y)
        case "brush":
        case "eraser": {
            const bounds = getShapeBounds(shape)
            if (!bounds) return false
            const inBox = x >= bounds.x - 5 && x <= bounds.x + bounds.width + 5 &&
                          y >= bounds.y - 5 && y <= bounds.y + bounds.height + 5
            if (!inBox) return false
            return isPointNearBrush(shape, x, y)
        }
    }
    return false
}

function isPointNearLine(shape: LineShape, x: number, y: number): boolean {
    const tolerance = 5
    return distanceToSegment(x, y, shape.startX, shape.startY, shape.x, shape.y) <= tolerance
}

function isPointInsideRect(shape: RectShape, x: number, y: number): boolean{
    const top = shape.y
    const bottom = shape.y + shape.height
    const left = shape.x
    const right = shape.x + shape.width

    return x > left && x < right && y > top && y < bottom
}


function isPointInsideEllipse(shape: EllipseShape, x: number, y: number): boolean {
    if (shape.radius.x === 0 || shape.radius.y === 0) return false
    const dx = (x - shape.x) / shape.radius.x
    const dy = (y - shape.y) / shape.radius.y
    return dx * dx + dy * dy <= 1
}

function isPointInsideRomb(shape: RombShape, x: number, y: number): boolean {
    const centerX = shape.x + shape.width / 2
    const centerY = shape.y + shape.height / 2
    const halfW = shape.width / 2
    const halfH = shape.height / 2
    if (halfW === 0 || halfH === 0) return false

    const dx = Math.abs(x - centerX) / halfW
    const dy = Math.abs(y - centerY) / halfH
    return dx + dy <= 1
}

function isPointNearBrush(shape: BrushShape | EraserShape, x: number, y: number): boolean {
    if (!shape.points?.length) return false

    const tolerance = (shape.lineWidth ?? 1) / 2 + 5 

    const allPoints = [{ x: shape.x, y: shape.y }, ...shape.points]

    for (let i = 0; i < allPoints.length - 1; i++) {
        const p1 = allPoints[i]
        const p2 = allPoints[i + 1]

        if (distanceToSegment(x, y, p1.x, p1.y, p2.x, p2.y) <= tolerance) {
            return true
        }
    }

    return false
}

function distanceToSegment(
    px: number, py: number,
    x1: number, y1: number,
    x2: number, y2: number
): number {
    const dx = x2 - x1
    const dy = y2 - y1
    const lengthSquared = dx * dx + dy * dy

    if (lengthSquared === 0) {
        return Math.hypot(px - x1, py - y1)
    }

    let t = ((px - x1) * dx + (py - y1) * dy) / lengthSquared
    t = Math.max(0, Math.min(1, t))

    const closestX = x1 + t * dx
    const closestY = y1 + t * dy

    return Math.hypot(px - closestX, py - closestY)
}
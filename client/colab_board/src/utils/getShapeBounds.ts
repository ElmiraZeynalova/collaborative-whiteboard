import type { Shape } from '../types/shapes'

export interface Bounds {
    x: number
    y: number
    width: number
    height: number
}

export function getShapeBounds(shape: Shape): Bounds | null {
    switch (shape.type) {
        case 'rect':
            return { x: shape.x, y: shape.y, width: shape.width, height: shape.height }

        case 'circle':
            return {
                x: shape.x - shape.radius,
                y: shape.y - shape.radius,
                width: shape.radius * 2,
                height: shape.radius * 2
            }

        case 'line':
            return {
                x: Math.min(shape.startX, shape.x),
                y: Math.min(shape.startY, shape.y),
                width: Math.abs(shape.x - shape.startX),
                height: Math.abs(shape.y - shape.startY)
            }

        case 'brush':
        case 'eraser': {
            if (!shape.points?.length) return null
            const xs = shape.points.map(p => p.x)
            const ys = shape.points.map(p => p.y)
            return {
                x: Math.min(...xs),
                y: Math.min(...ys),
                width: Math.max(...xs) - Math.min(...xs),
                height: Math.max(...ys) - Math.min(...ys)
            }
        }

        default:
            return null
    }
}
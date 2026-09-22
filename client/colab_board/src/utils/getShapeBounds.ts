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

        case 'ellipse':
            return {
                x: shape.x - shape.radius.x,
                y: shape.y - shape.radius.y,
                width: shape.radius.x * 2,
                height: shape.radius.y * 2
            }
        case 'romb':
            return { x: shape.x, y: shape.y, width: shape.width, height: shape.height }

        case 'line':
            return {
                x: Math.min(shape.startX, shape.x),
                y: Math.min(shape.startY, shape.y),
                width: Math.abs(shape.x - shape.startX),
                height: Math.abs(shape.y - shape.startY)
            }

        case 'pencil':
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
        case 'sticker':
            return { x: shape.x, y: shape.y, width: shape.width, height: shape.height }
        case 'text':
            return { x: shape.x, y: shape.y, width: shape.width ?? 100, height: shape.fontSize * 1.5 }
        case 'arrow':
            return {
                x: Math.min(shape.startX, shape.x),
                y: Math.min(shape.startY, shape.y),
                width: Math.abs(shape.x - shape.startX),
                height: Math.abs(shape.y - shape.startY)
            }

        default:
            return null
    }
}
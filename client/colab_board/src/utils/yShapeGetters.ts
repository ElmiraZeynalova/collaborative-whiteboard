import type { Point, YShape } from "../types/shapes"
import type { ToolType } from "../canvas/tools/Tool"

export function getShapeType(shape: YShape) {
    return shape.get('type') as ToolType
}

export function getShapeNumber(shape: YShape, key: string) {
    const value = shape.get(key)

    return typeof value === 'number' ? value : 0
}

export function getShapeStringValue(shape: YShape, key: string): string {
    const value = shape.get(key)

    return typeof value === 'string' ? value : ''
}

export function getShapeId(shape: YShape) {
    const value = shape.get('id')

    return typeof value === 'string' ? value : ''
}

export function getShapePoints(shape: YShape): Point[] {
    const value = shape.get('points')

    if (!Array.isArray(value)) {
        return []
    }

    return value.filter(
        (point): point is Point =>
            typeof point === 'object' &&
            point !== null &&
            typeof point.x === 'number' &&
            typeof point.y === 'number'
    )
}

export function getShapeRadius(shape: YShape): Point {
    const value = shape.get('radius')

    if (
        typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value) &&
        typeof value.x === 'number' &&
        typeof value.y === 'number'
    ) {
        return value
    }

    return { x: 0, y: 0 }
}
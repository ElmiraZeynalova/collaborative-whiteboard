import {type Shape} from "../types/shapes"
import { isPointInsideShape } from './isPointInsideShape'

export function hitTest(shapes: Record<string, Shape>,x: number, y: number) {
  const shapeList = Object.values(shapes)

  for (let i = shapeList.length - 1; i >= 0; i--) {
    const shape = shapeList[i]

    if (shape.isDeleted) continue

    if (isPointInsideShape(shape, x, y)) {
      return shape
    }
  }

  return null
}
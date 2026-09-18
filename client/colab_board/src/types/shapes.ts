export type ShapeChanges = {
    x?: number
    y?: number
    width?: number
    height?: number
    radius?: number
    startX?: number
    startY?: number
    points?: {x:number, y:number}[]
    fillStyle?: string
    strokeStyle?: string
    lineWidth?: number
    isDeleted?: boolean
}

export type Shape =
  | RectShape
  | EllipseShape
  | LineShape
  | BrushShape
  | EraserShape
  | RombShape

export type BaseShape = {
    id: string
    userId: string
    isDeleted: boolean
    x: number
    y: number
    strokeStyle: string
    strokeWidth: number
}

export type RectShape = BaseShape & {
    type: 'rect'
    width: number
    height: number
    fillStyle: string
}

export type RombShape = BaseShape & {
    type: 'romb'
    width: number
    height: number
    fillStyle: string
}

export type EllipseShape = BaseShape & {
    type: 'ellipse'
    radius: {x: number, y: number}
    fillStyle: string
}

export type LineShape = BaseShape & {
    type: 'line'
    startX: number
    startY: number
}

export type BrushShape = BaseShape & {
    type: 'brush'
    points: {x:number, y:number}[]
}

export type EraserShape = BaseShape & {
    type: 'eraser'
    points: {x:number, y:number}[]
}
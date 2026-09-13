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
  | CircleShape
  | LineShape
  | BrushShape
  | EraserShape

export type BaseShape = {
    id: string
    userId: string
    isDeleted: boolean
    x: number
    y: number
    strokeStyle: string
    lineWidth: number
    fillStyle?: string
}

export type RectShape = BaseShape & {
    type: 'rect'
    width: number
    height: number
}

export type CircleShape = BaseShape & {
    type: 'circle'
    radius: number
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
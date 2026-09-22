import { type TextAlign } from "../store/toolStore"

export interface SelectionRectangleState {
    visible: boolean
    x1: number
    y1: number
    x2: number
    y2: number
}

export type ShapeChanges = {
    x?: number
    y?: number
    width?: number
    height?: number
    radius?: {x: number, y: number}
    startX?: number
    startY?: number
    points?: {x:number, y:number}[]
    fillStyle?: string
    strokeStyle?: string
    lineWidth?: number
    isDeleted?: boolean
    fontSize?: number
    textAlign?: TextAlign
    text?: string
    
}

export type Shape =
  | RectShape
  | EllipseShape
  | LineShape
  | PencilShape
  | EraserShape
  | RombShape
  | ArrowShape
  | TextShape
  | StickerShape


export type BaseShape = {
    id: string
    userId: string
    isDeleted: boolean
    x: number
    y: number
    strokeStyle: string
    strokeWidth: number
    rotation?: number
}

export type StickerShape = BaseShape & {
    type: 'sticker'
    fillStyle: string
    fontSize: number
    text: string
    height: number
    width: number
}

export type TextShape = BaseShape & {
    type: 'text'
    fontSize: number
    textAlign: TextAlign
    width: number
    text: string
}

export type ArrowShape = BaseShape & {
    type: 'arrow'
    startX: number
    startY: number
    fillStyle: string
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

export type PencilShape = BaseShape & {
    type: 'pencil'
    points: {x:number, y:number}[]
}

export type EraserShape = BaseShape & {
    type: 'eraser'
    points: {x:number, y:number}[]
}
import { type TextAlign, type FontSize } from "../store/toolStore"
import * as Y from 'yjs'


export type Point = {
    x: number
    y: number
}

export type YShapeValue =
    | string
    | number
    | boolean
    | Point
    | Point[]

export type YShape = Y.Map<YShapeValue>

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
    strokeWidth?: number
    isDeleted?: boolean
    fontSize?: FontSize
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
    fontSize: FontSize
    text: string
    height: number
    width: number
}

export type TextShape = BaseShape & {
    type: 'text'
    fontSize: FontSize
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
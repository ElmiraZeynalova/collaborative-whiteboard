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
    fontSize?: string
    textAlign?: string
    text?: string
    
}


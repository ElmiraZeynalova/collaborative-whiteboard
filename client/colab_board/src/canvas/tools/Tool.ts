export type ToolType = 'pencil' | 'rect' | 'romb' | 'ellipse' | 'eraser' | 'line' | 'selection' | 'arrow' | 'text' | 'sticker'

export interface PointerModifiers {
    shiftKey: boolean
    ctrlKey: boolean
    metaKey: boolean
}

export default abstract class Tool {
    abstract readonly type: ToolType

    onPointerDown(_pos?: { x: number; y: number }, _modifiers?: PointerModifiers, _targetId?: string): void {}
    onPointerMove(_shapeId: string, _pos: { x: number; y: number }): void {}
    onPointerUp(_shapeId: string): void {}
}
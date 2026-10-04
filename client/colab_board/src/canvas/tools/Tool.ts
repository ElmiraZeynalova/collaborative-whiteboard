export type ToolType = 'pencil' | 'rect' | 'romb' | 'ellipse' | 'eraser' | 'line' | 'selection' | 'arrow' | 'text' | 'sticker'
import type { YShape } from "../../types/shapes"
import * as Y from 'yjs'

export interface PointerModifiers {
    shiftKey: boolean
    ctrlKey: boolean
    metaKey: boolean
}
type ToolContext = {
    yShapes: Y.Map<YShape>
    yShapesOrder: Y.Array<string>
}

export default abstract class Tool {
    abstract readonly type: ToolType

    protected ctx: ToolContext

    constructor(ctx: ToolContext) {
        this.ctx = ctx
    }

    onPointerDown(
        _pos?: { x: number; y: number },
        _modifiers?: PointerModifiers,
        _targetId?: string
    ): void {}

    onPointerMove(
        _shapeId: string,
        _pos: { x: number; y: number }
    ): void {}

    onPointerUp(_shapeId: string): void {}
}
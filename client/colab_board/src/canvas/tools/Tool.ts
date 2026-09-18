export type ToolType = 'pencil' | 'rect' | 'romb' | 'ellipse' | 'eraser' | 'line' | 'selection' | 'arrow' | 'text' | 'sticker'

export type ToolOptions = {
  lineWidth: number
  fillStyle: string
  strokeStyle: string
}

export default abstract class Tool {
  abstract readonly type: ToolType

  onPointerDown( pos: { x: number; y: number }): void {}
  onPointerMove( shapeId: string, pos: { x: number; y: number }): void {}
  onPointerUp(shapeId: string): void {}
}
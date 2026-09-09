type ToolType = 'brush' | 'rect' | 'circle' | 'eraser' | 'line'
export type ToolOptions = {
  lineWidth: number
  fillStyle: string
  strokeStyle: string
}

export default abstract class Tool {
  abstract readonly type: ToolType
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  lineWidth!: number
  fillStyle!: string
  strokeStyle!: string
  boardId: string
  ws: WebSocket
  
  constructor(canvas: HTMLCanvasElement, options: ToolOptions, ws: WebSocket, boardId: string) {
    this.canvas = canvas;
    this.boardId = boardId
    this.ws = ws

    const ctx = canvas.getContext('2d')
    if (!ctx) {
        throw new Error('Could not get canvas context');
    }
    this.ctx = ctx 
    this.destroyEvents()
    this.updateOptions(options)

  }

  updateOptions(options:  ToolOptions){
    this.lineWidth = options.lineWidth
    this.fillStyle = options.fillStyle
    this.strokeStyle = options.strokeStyle
    this.ctx.lineWidth = this.lineWidth
    this.ctx.fillStyle = this.fillStyle
    this.ctx.strokeStyle = this.strokeStyle
  }

  destroyEvents(){
    this.canvas.onmouseup = null
    this.canvas.onmousemove = null
    this.canvas.onmousedown = null
  }
}
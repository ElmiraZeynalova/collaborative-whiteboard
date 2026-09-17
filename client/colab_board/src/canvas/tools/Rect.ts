import Tool, { type ToolOptions } from './Tool'
import { useClientStore } from '../../store/clientStore'
import { useCanvasStore } from '../../store/canvasStore'
import type { RectShape } from "../../types/shapes"

export default class Rect extends Tool{
    readonly type = 'rect'
    // mouseDown: boolean
    // startX: number
    // startY: number
    // width: number
    // height: number
    // saved: ImageData | null

    // constructor(canvas: HTMLCanvasElement, options: ToolOptions, ws: WebSocket, boardId: string){
    //     super(canvas, options, ws, boardId)
    //     this.mouseDown = false
    //     this.listen()
    //     this.startX = 0
    //     this.startY = 0
    //     this.width = 0
    //     this.height = 0
    //     this.saved = null
    // }

    // listen(){
    //     this.canvas.onmouseup = this.mouseUpHandler.bind(this)
    //     this.canvas.onmousemove = this.mouseMoveHandler.bind(this)
    //     this.canvas.onmousedown = this.mouseDownHandler.bind(this)
    // }

    // mouseDownHandler(e: MouseEvent) {
    //     this.mouseDown = true;
    //     const rect = this.canvas.getBoundingClientRect();

    //     this.startX = e.clientX - rect.left;
    //     this.startY = e.clientY - rect.top;

    //     this.width = 0;
    //     this.height = 0;

    //     this.saved = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
    // }

    // mouseUpHandler(){
    //     this.mouseDown = false
    //     if (this.width === 0 && this.height === 0) {
    //         return;
    //     }
    //     const userId = useClientStore.getState().userId

    //     if (!userId) return

    //     const shape: RectShape = {
    //         id: crypto.randomUUID(),
    //         userId: userId,
    //         type: this.type,
    //         x: this.startX,
    //         y: this.startY,
    //         width: this.width,
    //         height: this.height,
    //         fillStyle: this.fillStyle,
    //         strokeStyle: this.strokeStyle,
    //         lineWidth: this.lineWidth,
    //         isDeleted: false
    //     }
        
    //     const message = {
    //         type: "shape:add",
    //         shape: shape
    //     }
    //     const { addShape, pushToUndo } = useCanvasStore.getState()
    //     addShape(message.shape)
    //     pushToUndo(message.shape.id)
    //     this.ws.send(JSON.stringify(message))
    // }

    // mouseMoveHandler(e: MouseEvent){
    //     if(this.mouseDown){
    //         const rect = this.canvas.getBoundingClientRect();
    //         let currentX = e.clientX - rect.left;
    //         let currentY = e.clientY - rect.top;
    //         this.width = currentX - this.startX
    //         this.height = currentY - this.startY
    //         this.draw(this.startX, this.startY, this.width, this.height)
    //     }
    // }

    // draw(x: number, y: number, w: number, h: number){
    //     if (!this.saved) return
    //     this.ctx.putImageData(this.saved, 0, 0)

    //     this.ctx.beginPath()
    //     this.ctx.rect(x, y, w, h)
    //     this.ctx.closePath()

    //     this.ctx.fillStyle = this.fillStyle
    //     this.ctx.fill()

    //     if(this.lineWidth > 0) {
    //         this.ctx.strokeStyle = this.strokeStyle
    //         this.ctx.lineWidth = this.lineWidth
    //         this.ctx.stroke()
    //     }
    // }

    // static staticDraw(ctx: CanvasRenderingContext2D, shape: RectShape){
    //     if(shape.width === undefined || shape.height === undefined) return
        
    //     ctx.fillStyle = shape.fillStyle ?? "#000000"
    //     ctx.strokeStyle = shape.strokeStyle ?? "#000000"
    //     ctx.lineWidth = shape.lineWidth ?? 0
        
    //     ctx.beginPath()
    //     ctx.rect(shape.x, shape.y, shape.width, shape.height)
    //     ctx.fill()
    //     if(shape.lineWidth > 0) ctx.stroke()

    // }
    
}
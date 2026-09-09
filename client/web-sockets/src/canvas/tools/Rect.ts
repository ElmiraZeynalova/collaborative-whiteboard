import Tool, { type ToolOptions } from './Tool'
import { useClientStore } from '../../store/clientStore'
import { useCanvasStore } from '../../store/canvasStore'
import type { Shape } from '../../store/canvasStore'

export default class Rect extends Tool{
    readonly type = 'rect'
    mouseDown: boolean
    startX: number
    startY: number
    width: number
    height: number
    saved: string

    constructor(canvas: HTMLCanvasElement, options: ToolOptions, ws: WebSocket, boardId: string){
        super(canvas, options, ws, boardId)
        this.mouseDown = false
        this.listen()
        this.startX = 0
        this.startY = 0
        this.width = 0
        this.height = 0
        this.saved = ""
    }

    listen(){
        this.canvas.onmouseup = this.mouseUpHandler.bind(this)
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this)
        this.canvas.onmousedown = this.mouseDownHandler.bind(this)
    }

    mouseDownHandler(e: MouseEvent) {
        this.mouseDown = true;
        const rect = this.canvas.getBoundingClientRect();

        this.startX = e.clientX - rect.left;
        this.startY = e.clientY - rect.top;

        this.width = 0;
        this.height = 0;

        this.ctx.beginPath();
        this.saved = this.canvas.toDataURL()
    }

    mouseUpHandler(){
        this.mouseDown = false
        if (this.width === 0 && this.height === 0) {
            return;
        }
        const userId = useClientStore.getState().userId

        if (!userId) return

        const message = {
            type: "shape:add",
            shape: {
                id: crypto.randomUUID(),
                userId: userId,
                type: this.type,
                x: this.startX,
                y: this.startY,
                width: this.width,
                height: this.height,
                fillStyle: this.fillStyle,
                strokeStyle: this.strokeStyle,
                lineWidth: this.lineWidth,
                isDeleted: false
            }
        }
        const { addShape, pushToUndo } = useCanvasStore.getState()
        addShape(message.shape)
        pushToUndo(message.shape.id)
        this.ws.send(JSON.stringify(message))
    }

    mouseMoveHandler(e: MouseEvent){
        if(this.mouseDown){
            const rect = this.canvas.getBoundingClientRect();
            let currentX = e.clientX - rect.left;
            let currentY = e.clientY - rect.top;
            this.width = currentX - this.startX
            this.height = currentY - this.startY
            this.draw(this.startX, this.startY, this.width, this.height)
        }
    }

    draw(x: number, y: number, w: number, h: number){
        const img = new Image()
        img.src = this.saved
        img.onload = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
            this.ctx.beginPath()
            this.ctx.rect(x, y, w, h)
            this.ctx.fill()
            this.ctx.stroke()
        }
    }

    static staticDraw(ctx: CanvasRenderingContext2D, shape: Shape){
        if(shape.width === undefined || shape.height === undefined) return
        
        ctx.fillStyle = shape.fillStyle ?? 'black'
        ctx.strokeStyle = shape.strokeStyle ?? 'black'
        ctx.lineWidth = shape.lineWidth ?? 1
        
        ctx.beginPath()
        ctx.rect(shape.x, shape.y, shape.width, shape.height)
        ctx.fill()
        ctx.stroke()

    }
    
}
import Tool, { type ToolOptions } from './Tool'
import { useClientStore } from '../../store/clientStore'
import { useCanvasStore } from '../../store/canvasStore'
import type { Shape } from '../../store/canvasStore'

export default class Line extends Tool{
    readonly type = 'line'
    mouseDown: boolean
    startX: number
    startY: number
    endX: number
    endY: number
    saved: string
    
    constructor(canvas: HTMLCanvasElement, options: ToolOptions, ws: WebSocket, boardId: string){
        super(canvas, options,  ws, boardId)
        this.mouseDown = false
        this.listen()
        this.startX = 0
        this.startY = 0
        this.endX = 0
        this.endY = 0
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

        this.endX = 0;
        this.endY = 0;

        this.ctx.beginPath();
        this.saved = this.canvas.toDataURL()
    }

    mouseUpHandler(){
        this.mouseDown = false
        if (this.endX === 0 && this.endY === 0) {
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
                x: this.endX,
                y: this.endY,
                startX: this.startX,
                startY: this.startY,
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
            this.endX = e.clientX - rect.left;
            this.endY = e.clientY - rect.top;
            this.draw(this.endX, this.endY)
        }
    }

    draw(x: number, y: number){
        const img = new Image()
        img.src = this.saved
        img.onload = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
            this.ctx.beginPath()
            this.ctx.moveTo(this.startX, this.startY)
            this.ctx.lineTo(x, y)
            this.ctx.stroke()
        }
    }

    static staticDraw(ctx: CanvasRenderingContext2D, shape: Shape){
        if(shape.startX === undefined || shape.startY === undefined) return
        
        ctx.strokeStyle = shape.strokeStyle ?? 'black'
        ctx.lineWidth = shape.lineWidth ?? 1
        
        ctx.beginPath()
        ctx.moveTo(shape.startX, shape.startY)
        ctx.lineTo(shape.x, shape.y)
        ctx.stroke()

    }
}
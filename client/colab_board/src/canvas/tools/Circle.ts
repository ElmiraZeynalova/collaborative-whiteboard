import Tool, { type ToolOptions } from './Tool'
import { useClientStore } from '../../store/clientStore'
import { useCanvasStore } from '../../store/canvasStore'
import type { CircleShape } from "../../types/shapes"

export default class Circle extends Tool{
    readonly type = 'circle'
    mouseDown: boolean
    startX: number
    startY: number
    radius: number
    saved: string
    
    constructor(canvas: HTMLCanvasElement, options: ToolOptions, ws: WebSocket, boardId: string){
        super(canvas, options,  ws, boardId)
        this.mouseDown = false
        this.listen()
        this.startX = 0
        this.startY = 0
        this.radius = 0
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

        this.radius = 0;

        this.ctx.beginPath();
        this.saved = this.canvas.toDataURL()

    }

    mouseUpHandler(){
        this.mouseDown = false

        if (this.radius === 0) {
            return;
        }

        const userId = useClientStore.getState().userId

        if (!userId) return

        const shape: CircleShape = {
            id: crypto.randomUUID(),
            userId: userId,
            type: this.type,
            x: this.startX,
            y: this.startY,
            radius: this.radius,
            fillStyle: this.fillStyle,
            strokeStyle: this.strokeStyle,
            lineWidth: this.lineWidth,
            isDeleted: false
        }
        
        const message = {
            type: "shape:add",
            shape: shape
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
            this.radius = Math.abs(currentX - this.startX)
            this.draw(this.startX, this.startY, this.radius)
        }
    }

    draw(x: number, y: number, radius: number){
        const img = new Image()
        img.src = this.saved
        img.onload = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
            this.ctx.beginPath()
            this.ctx.arc(x, y, radius,  0, 2 * Math.PI)
            this.ctx.fill()
            if(this.lineWidth > 0) this.ctx.stroke()
        }
    }

    static staticDraw(ctx: CanvasRenderingContext2D, shape: CircleShape){
        if(shape.radius === undefined) return
        
        ctx.fillStyle = shape.fillStyle ?? "#000000"
        ctx.strokeStyle = shape.strokeStyle ?? "#000000"
        ctx.lineWidth = shape.lineWidth ?? 0
        
        ctx.beginPath()
        ctx.arc(shape.x, shape.y, shape.radius,  0, 2 * Math.PI)
        ctx.fill()
        if(shape.lineWidth > 0) ctx.stroke()

    }
}
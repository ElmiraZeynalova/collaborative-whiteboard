import Tool, { type ToolOptions } from './Tool'
import { useClientStore } from '../../store/clientStore'
import { useCanvasStore } from '../../store/canvasStore'
import type { Shape } from '../../store/canvasStore'

export default class Brush extends Tool{
    readonly type = 'brush'
    mouseDown: boolean
    startX: number
    startY: number
    points: { x: number; y: number }[] 

    constructor(canvas: HTMLCanvasElement, options: ToolOptions,  ws: WebSocket, boardId: string){
        super(canvas, options,  ws, boardId)
        this.mouseDown = false
        this.listen()
        this.startX = 0
        this.startY = 0
        this.points = []
    }

    listen(){
        this.canvas.onmouseup = this.mouseUpHandler.bind(this)
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this)
        this.canvas.onmousedown = this.mouseDownHandler.bind(this)
    }

    mouseUpHandler(){
        this.mouseDown = false

        if (this.points.length === 0) {
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
                points: this.points,
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
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.points.push({ x, y })
            this.draw(x, y)
        }
    }


    mouseDownHandler(e: MouseEvent) {
        this.mouseDown = true;

        const rect = this.canvas.getBoundingClientRect();

        this.startX = e.clientX - rect.left;
        this.startY = e.clientY - rect.top;

        this.points = []
        this.ctx.beginPath();
        this.ctx.moveTo(this.startX, this.startY);
    }


    draw(x: number, y: number){
        this.ctx.lineTo(x, y)
        this.ctx.stroke()
    }

    static staticDraw(ctx: CanvasRenderingContext2D, shape: Shape) {
        if (!shape.points?.length) return

        ctx.strokeStyle = shape.strokeStyle ?? 'black'
        ctx.lineWidth = shape.lineWidth ?? 1

        ctx.beginPath()

        ctx.moveTo(shape.x, shape.y)

        for (const point of shape.points.slice(1)) {
            ctx.lineTo(point.x, point.y)
        }

        ctx.stroke()
    }
}
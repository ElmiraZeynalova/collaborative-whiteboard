import Tool, { type ToolOptions } from './Tool'
import { useClientStore } from '../../store/clientStore'
import { useCanvasStore } from '../../store/canvasStore'
import type { EraserShape } from "../../types/shapes"

export default class Eraser extends Tool{
    readonly type = 'eraser'
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

        const userId = useClientStore.getState().userId

        if (!userId) return

        const shape: EraserShape = {
            id: crypto.randomUUID(),
            userId: userId,
            type: this.type,
            x: this.startX,
            y: this.startY,
            points: this.points,
            strokeStyle: "#FFFFFF",
            lineWidth: this.lineWidth,
            fillStyle: "",
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
        this.ctx.strokeStyle = "#FFFFFF"
        this.ctx.lineTo(x, y)
        this.ctx.stroke()
    }

    static staticDraw(ctx: CanvasRenderingContext2D, shape: EraserShape) {
        if (!shape.points?.length) return

        ctx.strokeStyle = "#FFFFFF"
        ctx.lineWidth = shape.lineWidth ?? 1

        ctx.beginPath()

        ctx.moveTo(shape.x, shape.y)

        for (const point of shape.points.slice(1)) {
            ctx.lineTo(point.x, point.y)
        }

        ctx.stroke()
    }
}
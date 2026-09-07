import Tool, { type ToolOptions } from './Tool'

export default class Eraser extends Tool{
    readonly type = 'eraser'
    mouseDown: boolean

    constructor(canvas: HTMLCanvasElement, options: ToolOptions, ws: WebSocket, boardId: string){
        super(canvas, options,  ws, boardId)
        this.mouseDown = false
        this.listen()

    }

    listen(){
        this.canvas.onmouseup = this.mouseUpHandler.bind(this)
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this)
        this.canvas.onmousedown = this.mouseDownHandler.bind(this)
    }

    mouseUpHandler(){
        this.mouseDown = false
    }

    mouseMoveHandler(e: MouseEvent){
        if(this.mouseDown){
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            this.draw(x, y)
        }
    }


    mouseDownHandler(e: MouseEvent) {
        this.mouseDown = true;

        const rect = this.canvas.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
    }


    draw(x: number, y: number){
        this.ctx.lineTo(x, y)
        this.ctx.stroke()
        this.ctx.strokeStyle = "white"
    }
}
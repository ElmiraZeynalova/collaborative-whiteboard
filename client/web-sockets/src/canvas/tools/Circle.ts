import Tool, { type ToolOptions } from './Tool'

export default class Circle extends Tool{
    readonly type = 'circle'
    mouseDown: boolean
    startX: number
    startY: number
    saved: string
    
    constructor(canvas: HTMLCanvasElement, options: ToolOptions, ws: WebSocket, boardId: string){
        super(canvas, options,  ws, boardId)
        this.mouseDown = false
        this.listen()
        this.startX = 0
        this.startY = 0
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
        this.ctx.beginPath();
        this.startX = e.clientX - rect.left;
        this.startY = e.clientY - rect.top;
        this.saved = this.canvas.toDataURL()

    }

    mouseUpHandler(){
        this.mouseDown = false
    }

    mouseMoveHandler(e: MouseEvent){
        if(this.mouseDown){
            const rect = this.canvas.getBoundingClientRect();
            let currentX = e.clientX - rect.left;
            let radius = Math.abs(currentX - this.startX)
            this.draw(this.startX, this.startY, radius)
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
            this.ctx.stroke()
        }
    }
}
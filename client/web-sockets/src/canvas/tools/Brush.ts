import Tool, { type ToolOptions } from './Tool'


export default class Brush extends Tool{
    readonly type = 'brush'
    mouseDown: boolean

    constructor(canvas: HTMLCanvasElement, options: ToolOptions,  ws: WebSocket, boardId: string){
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
        this.ws.send(JSON.stringify({ type: "draw:end", boardId: this.boardId, shape: "brush"}));
    }

    mouseMoveHandler(e: MouseEvent){
        if(this.mouseDown){
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            this.ws.send(JSON.stringify({ type: "draw:move", boardId: this.boardId, shape: "brush", x, y}));
            Brush.draw(this.ctx, x, y)
        }
    }


    mouseDownHandler(e: MouseEvent) {
        this.mouseDown = true;

        const rect = this.canvas.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        this.ws.send(JSON.stringify({ type: "draw:start", boardId: this.boardId, shape: "brush", x, y}))
        Brush.start(this.ctx, x, y)
    }

    static start(ctx: CanvasRenderingContext2D, x: number, y: number){
        ctx.beginPath();
        ctx.moveTo(x, y);
    }

    static draw(ctx: CanvasRenderingContext2D, x: number, y: number){
        ctx.lineTo(x, y)
        ctx.stroke()
    }
}
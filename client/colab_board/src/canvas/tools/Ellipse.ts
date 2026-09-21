    import Tool from './Tool'
import { useClientStore } from '../../store/clientStore'
import { useCanvasStore } from '../../store/canvasStore'
import { useToolStore } from '../../store/toolStore'
import type { EllipseShape, ShapeChanges } from "../../types/shapes"

export default class Ellipse extends Tool{
    readonly type = 'ellipse'

    onPointerDown(pos: { x: number; y: number }): void {
        const addShape = useCanvasStore.getState().addShape
        const setCurrentlyDrawingShapeId = useCanvasStore.getState().setCurrentlyDrawingShapeId
        const userId = useClientStore.getState().userId
        if(!userId) return

        const strokeColor = useToolStore.getState().strokeColor
        const strokeWidth = useToolStore.getState().strokeWidth
        const fillColor = useToolStore.getState().fillColor

        const shapeId =  crypto.randomUUID()
        setCurrentlyDrawingShapeId(shapeId)

        const ellipseShape: EllipseShape = {
            id: shapeId,
            userId: userId,
            type: this.type,
            isDeleted: false,
            x: pos.x,
            y: pos.y,
            fillStyle: fillColor,
            strokeStyle: strokeColor,
            strokeWidth: strokeWidth,
            radius: {x: 0, y: 0},
        }

        addShape(ellipseShape)
    }

    onPointerMove(shapeId: string, pos: { x: number; y: number }): void {
        const updateShape = useCanvasStore.getState().updateShape
        const shape = useCanvasStore.getState().shapes[shapeId]

        if (!shape || shape.type !== this.type) return
        const thisShape: EllipseShape = shape

        const changes: ShapeChanges = {
           radius: {x: Math.abs(pos.x - thisShape.x), y: Math.abs(pos.y - thisShape.y)}
        }
        updateShape(shapeId, changes)
    }

    onPointerUp(shapeId: string): void {
        const ws = useClientStore.getState().ws
        const shape = useCanvasStore.getState().shapes[shapeId]
        const setCurrentlyDrawingShapeId = useCanvasStore.getState().setCurrentlyDrawingShapeId

        const message = {
            type: "shape:add",
            shape: shape
        }

        ws?.send(JSON.stringify(message))
        setCurrentlyDrawingShapeId(null)
    }
}

    // mouseDown: boolean
    // startX: number
    // startY: number
    // radiusX: number
    // radiusY: number
    // saved: ImageData | null

    // constructor(canvas: HTMLCanvasElement, options: ToolOptions, ws: WebSocket, boardId: string){
    //     super(canvas, options, ws, boardId)
    //     this.mouseDown = false
    //     this.listen()
    //     this.startX = 0
    //     this.startY = 0
    //     this.radiusX = 0
    //     this.radiusY = 0
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

    //     this.radiusX = 0;
    //     this.radiusY = 0;

    //     this.saved = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
    // }

    // mouseUpHandler(){
    //     this.mouseDown = false

    //     if (this.radiusX === 0 && this.radiusY === 0) {
    //         return;
    //     }

    //     const userId = useClientStore.getState().userId
    //     if (!userId) return

    //     const shape: EllipseShape = {
    //         id: crypto.randomUUID(),
    //         userId: userId,
    //         type: this.type,
    //         x: this.startX,
    //         y: this.startY,
    //         radius: {x: this.radiusX, y: this.radiusY},
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
    //         const currentX = e.clientX - rect.left;
    //         const currentY = e.clientY - rect.top;

    //         this.radiusX = Math.abs(currentX - this.startX)
    //         this.radiusY = Math.abs(currentY - this.startY)

    //         this.draw(this.startX, this.startY, this.radiusX, this.radiusY)
    //     }
    // }

    // draw(x: number, y: number, radiusX: number, radiusY: number){
    //     if (!this.saved) return

    //     this.ctx.putImageData(this.saved, 0, 0)

    //     this.ctx.beginPath()
    //     this.ctx.ellipse(x, y, radiusX, radiusY, 0, 0, 2 * Math.PI)
    //     this.ctx.closePath()

    //     this.ctx.fillStyle = this.fillStyle
    //     this.ctx.fill()

    //     if(this.lineWidth > 0) {
    //         this.ctx.strokeStyle = this.strokeStyle
    //         this.ctx.lineWidth = this.lineWidth
    //         this.ctx.stroke()
    //     }
    // }

    // static staticDraw(ctx: CanvasRenderingContext2D, shape: EllipseShape){
    //     if(shape.radius.x === undefined || shape.radius.x === undefined) return

    //     ctx.fillStyle = shape.fillStyle ?? "#000000"
    //     ctx.strokeStyle = shape.strokeStyle ?? "#000000"
    //     ctx.lineWidth = shape.lineWidth ?? 0

    //     ctx.beginPath()
    //     ctx.ellipse(shape.x, shape.y, shape.radius.x, shape.radius.y, 0, 0, 2 * Math.PI)
    //     ctx.closePath()
    //     ctx.fill()
    //     if(shape.lineWidth && shape.lineWidth > 0) ctx.stroke()
    // }
//}


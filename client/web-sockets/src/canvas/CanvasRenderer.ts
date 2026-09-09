import {type Shape, useCanvasStore} from "../store/canvasStore"
import Rect from "./tools/Rect"
import Circle from "./tools/Circle"
import Line from "./tools/Line"
import Brush from "./tools/Brush"
import Eraser from "./tools/Eraser"


export default class CanvasRenderer{
    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D

    constructor(canvas: HTMLCanvasElement){
        this.canvas = canvas

        const ctx = canvas.getContext('2d')
            if (!ctx) {
                throw new Error('Could not get canvas context');
            }
        this.ctx = ctx
    }

    rerender(shapes: Record<string, Shape>){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        for(const [_, shape] of Object.entries(shapes)){
            console.log("shape: ", shape)
            if(!shape.isDeleted) this.drawShape(shape)
        }
    }

    private drawShape(shape: Shape){
        switch(shape.type){
            case "brush":
                break
            case "rect":
                Rect.staticDraw(this.ctx, shape)
                break
            case "circle":
                break
            case "eraser":
                break
            case "line": 
                break
        }
    }
}

// export type Shape = {
//     id: string
//     userId: string
//     type: string
//     x: number
//     y: number
//     width?: number
//     height?: number
//     radius?: number
//     fillStyle: string
//     strokeStyle: string
//     lineWidth: number
//     isDeleted: boolean
// }
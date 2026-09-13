import {type Shape} from "../types/shapes"
import Rect from "./tools/Rect"
import Circle from "./tools/Circle"
import Line from "./tools/Line"
import Brush from "./tools/Brush"
import Eraser from "./tools/Eraser"
import { getShapeBounds } from "../utils/getShapeBounds"

export default class CanvasRenderer {
    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas
        const ctx = canvas.getContext('2d')
        if (!ctx) throw new Error('Could not get canvas context')
        this.ctx = ctx
    }

    rerender(
        shapes: Record<string, Shape>,
        selectedShapeId: string | null = null,
        hoveredShapeId: string | null = null
    ) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

        for (const [_, shape] of Object.entries(shapes)) {
            if (!shape.isDeleted) this.drawShape(shape)
        }

        for (const [_, shape] of Object.entries(shapes)) {
            if (shape.isDeleted) continue
            if (shape.id === selectedShapeId) {
                this.drawOutline(shape, { color: '#0D8CE9', width: 2 })
            } else if (shape.id === hoveredShapeId) {
                this.drawOutline(shape, { color: '#0D8CE9', width: 2 })
            }
        }
    }

    private drawShape(shape: Shape) {
        switch (shape.type) {
            case "brush": Brush.staticDraw(this.ctx, shape); break
            case "rect": Rect.staticDraw(this.ctx, shape); break
            case "circle": Circle.staticDraw(this.ctx, shape); break
            case "eraser": Eraser.staticDraw(this.ctx, shape); break
            case "line": Line.staticDraw(this.ctx, shape); break
        }
    }

    private drawOutline(shape: Shape, opts: { color: string; width: number; alpha?: number }) {
        const bounds = getShapeBounds(shape)
        if (!bounds) return

        const padding = 0

        this.ctx.save()
        this.ctx.globalAlpha = opts.alpha ?? 1
        this.ctx.strokeStyle = opts.color
        this.ctx.lineWidth = opts.width
        this.ctx.setLineDash([])

        if (shape.type === 'circle') {
            this.ctx.beginPath()
            this.ctx.arc(
                shape.x, shape.y,
                shape.radius + padding,
                0, Math.PI * 2
            )
            this.ctx.stroke()
        } else {
            this.ctx.strokeRect(
                bounds.x - padding,
                bounds.y - padding,
                bounds.width + padding * 2,
                bounds.height + padding * 2
            )
        }

        this.ctx.restore()
    }
}
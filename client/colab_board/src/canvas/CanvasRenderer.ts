import {type Shape} from "../types/shapes"
import Rect from "./tools/Rect"
import Ellipse from "./tools/Ellipse"
import Line from "./tools/Line"
import Brush from "./tools/Brush"
import Eraser from "./tools/Eraser"
import Romb from "./tools/Romb"

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
            if (shape.isDeleted) continue

            const isHighlighted = shape.id === selectedShapeId || shape.id === hoveredShapeId
            const isLineLike = shape.type === 'line' || shape.type === 'brush' || shape.type === 'eraser'

            if (isHighlighted && isLineLike) {
                this.drawHighlight(shape, selectedShapeId, hoveredShapeId)
            }

            this.drawShape(shape)

            if (isHighlighted && !isLineLike) {
                this.drawHighlight(shape, selectedShapeId, hoveredShapeId)
            }
        }
    }

    private drawHighlight(shape: Shape, selectedShapeId: string | null, hoveredShapeId: string | null) {
        if (shape.id === selectedShapeId) {
            this.drawOutline(shape, { color: '#3b82f6', width: 1.5 })
        } else if (shape.id === hoveredShapeId) {
            this.drawOutline(shape, { color: '#3b82f6', width: 1.5, alpha: 0.6 })
        }
    }

    private drawShape(shape: Shape) {
        switch (shape.type) {
            case "brush": Brush.staticDraw(this.ctx, shape); break
            case "rect": Rect.staticDraw(this.ctx, shape); break
            case "ellipse": Ellipse.staticDraw(this.ctx, shape); break
            case "romb": Romb.staticDraw(this.ctx, shape); break
            case "eraser": Eraser.staticDraw(this.ctx, shape); break
            case "line": Line.staticDraw(this.ctx, shape); break
        }
    }


    private drawOutline(shape: Shape, opts: { color: string; width: number; alpha?: number }) {
        this.ctx.save()
        this.ctx.globalAlpha = opts.alpha ?? 1
        this.ctx.strokeStyle = opts.color
        this.ctx.lineCap = 'round'
        this.ctx.lineJoin = 'round'

        const padding = 4

        switch (shape.type) {
            case 'rect': {
                this.ctx.lineWidth = opts.width
                this.ctx.strokeRect(
                    shape.x - padding,
                    shape.y - padding,
                    shape.width + padding * 2,
                    shape.height + padding * 2
                )
                break
            }

            case 'ellipse': {
                this.ctx.lineWidth = opts.width
                this.ctx.beginPath()
                this.ctx.ellipse(
                    shape.x, shape.y,
                    shape.radius.x + padding,
                    shape.radius.y + padding,
                    0, 0, 2 * Math.PI
                )
                this.ctx.stroke()
                break
            }

            case 'romb': {
                this.ctx.lineWidth = opts.width
                const centerX = shape.x + shape.width / 2
                const centerY = shape.y + shape.height / 2
                const halfW = shape.width / 2 + padding
                const halfH = shape.height / 2 + padding

                this.ctx.beginPath()
                this.ctx.moveTo(centerX, centerY - halfH)
                this.ctx.lineTo(centerX + halfW, centerY)
                this.ctx.lineTo(centerX, centerY + halfH)
                this.ctx.lineTo(centerX - halfW, centerY)
                this.ctx.closePath()
                this.ctx.stroke()
                break
            }

            case 'line': {
                this.ctx.lineWidth = (shape.lineWidth ?? 1) + opts.width * 2
                this.ctx.beginPath()
                this.ctx.moveTo(shape.startX, shape.startY)
                this.ctx.lineTo(shape.x, shape.y)
                this.ctx.stroke()
                break
            }

            case 'brush':
            case 'eraser': {
                if (!shape.points?.length) break
                this.ctx.lineWidth = (shape.lineWidth ?? 1) + opts.width * 2
                this.ctx.beginPath()
                this.ctx.moveTo(shape.x, shape.y)
                for (const point of shape.points) {
                    this.ctx.lineTo(point.x, point.y)
                }
                this.ctx.stroke()
                break
            }
        }

        this.ctx.restore()
    }
}
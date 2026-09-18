import Tool from './Tool'
import {type Shape, type ShapeChanges} from '../../types/shapes'
import { useCanvasStore } from '../../store/canvasStore'



export default class Selection extends Tool{
    readonly type = 'selection'
    // private isDragging = false
    // private hasMoved = false
    // shape: null | Shape
    // changes: null | ShapeChanges
    // private dragOffset = {
    //     x: 0,
    //     y: 0
    // }

    // constructor(canvas: HTMLCanvasElement, ws: WebSocket, boardId: string){
    //     super(canvas, undefined, ws, boardId)
    //     this.listen()
    //     this.shape = null
    //     this.changes = null
    // }

    // listen(){
    //     this.canvas.onpointerdown = this.pointerDownHandler.bind(this)
    //     this.canvas.onpointermove = this.pointerMoveHandler.bind(this)
    //     this.canvas.onpointerup = this.pointerUpHandler.bind(this)
    // }

    // pointerDownHandler(e: PointerEvent){
    //     const rect = this.canvas.getBoundingClientRect();
    //     const setSelectedShapeId = useCanvasStore.getState().setSelectedShapeId
    //     const x = e.clientX - rect.left
    //     const y = e.clientY - rect.top

    //     const shapes = useCanvasStore.getState().shapes
    //     const shape = hitTest(shapes, x, y) 

    //     if (!shape) {
    //         setSelectedShapeId(null)
    //         this.isDragging = false
    //         return
    //     }

    //     this.shape = shape
    //     this.dragOffset.x = x - shape.x
    //     this.dragOffset.y = y - shape.y

    //     setSelectedShapeId(shape.id)
    //     useCanvasStore.getState().setHoveredShapeId(null)
    //     this.isDragging = true
    //     this.hasMoved = false

    //     this.canvas.setPointerCapture(e.pointerId) 
    // }

    // pointerMoveHandler(e: PointerEvent){
    //     const rect = this.canvas.getBoundingClientRect()
    //     const x = e.clientX - rect.left
    //     const y = e.clientY - rect.top

    //     const selectedShapeId = useCanvasStore.getState().selectedShapeId

    //     if (!this.isDragging) {
    //         const shapes = useCanvasStore.getState().shapes
    //         const hovered = hitTest(shapes, x, y)
    //         const setHoveredShapeId = useCanvasStore.getState().setHoveredShapeId
    //         const currentHoveredId = useCanvasStore.getState().hoveredShapeId

    //         const hoveredId = hovered ? hovered.id : null

    //         if (hoveredId !== currentHoveredId) {
    //             setHoveredShapeId(hoveredId)
    //         }

    //         this.canvas.style.cursor = hovered ? 'pointer' : 'default'
    //         return
    //     }

    //     if (!selectedShapeId) return

    //     const newX = x - this.dragOffset.x
    //     const newY = y - this.dragOffset.y

    //     const dx = newX - this.shape!.x
    //     const dy = newY - this.shape!.y

    //     this.changes = moveShape(this.shape!, dx, dy)
    //     this.hasMoved = true

    //     useCanvasStore.getState().updateShape(selectedShapeId, this.changes)
    // }

    // pointerUpHandler(e: PointerEvent){
    //     this.isDragging = false
    //     const selectedShapeId = useCanvasStore.getState().selectedShapeId
    //     if(selectedShapeId && this.hasMoved) this.ws.send(JSON.stringify({type: "shape:update", shape: {id: selectedShapeId, ...this.changes}}))
    //     this.hasMoved = false

    //     if (this.canvas.hasPointerCapture(e.pointerId)) {  
    //         this.canvas.releasePointerCapture(e.pointerId)
    //     }
    // }
}
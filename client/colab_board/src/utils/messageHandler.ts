import type { Shape, ShapeChanges } from "../types/shapes"
import { useCanvasStore } from "../store/canvasStore"

type Message =
  | {
      type: "connection"
      content: string
    }
  | {
      type: "shape:add"
      shape: Shape
      shapesOrder: string[]
    }
  | {
        type: "shape:update"
        shape: ShapeChanges & {id: string}
    }
  | {
        type: "board:state"
        shapes: Record<string, Shape>
        shapesOrder: string[]
    }
  | {
        type: "shape:order"
        shapesOrder: string[]
    }

export function handleMessage(message: Message){
    const {setShapes, addShape, updateShape, setShapesOrder} = useCanvasStore.getState()

    switch(message.type){
        case "connection":
            console.log(message.content)
            break
        case "board:state":
            setShapes(message.shapes)
            setShapesOrder(message.shapesOrder)
            break
        case "shape:order":
            setShapesOrder(message.shapesOrder)
            break
        case "shape:add":
            addShape(message.shape)
            setShapesOrder(message.shapesOrder)
            break
        case "shape:update":
            updateShape(message.shape.id, message.shape)
            break

    }

}
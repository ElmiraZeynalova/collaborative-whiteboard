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
            console.log("received shapes: ", message.shapes)
            console.log("received order: ", message.shapesOrder)
            setShapes(message.shapes)
            setShapesOrder(message.shapesOrder)
            break
        case "shape:order":
            console.log("received order")
            setShapesOrder(message.shapesOrder)
            break
        case "shape:add":
            console.log("adding sent shape...")
            addShape(message.shape)
            setShapesOrder(message.shapesOrder)
            console.log("shape added")
            break
        case "shape:update":
            console.log("updating sent shape...")
            updateShape(message.shape.id, message.shape)
            break

    }

}
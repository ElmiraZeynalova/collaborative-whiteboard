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
    }
  | {
      type: "shape:delete"
      shape: {id: string}
    }
  | {
        type: "shape:update"
        shape: ShapeChanges & {id: string}
    }
  | {
        type: "board:state"
        shapes: Record<string, Shape>
    }


export function handleMessage(message: Message){
    const {setShapes, addShape, updateShape, markShapeDeleted} = useCanvasStore.getState()

    switch(message.type){
        case "connection":
            console.log(message.content)
            break
        case "board:state":
            setShapes(message.shapes)
            break
        case "shape:add":
            console.log("adding sent shape...")
            addShape(message.shape)
            break
        case "shape:update":
            console.log("updating sent shape...")
            updateShape(message.shape.id, message.shape)
            break
        case "shape:delete":
            markShapeDeleted(message.shape.id)
            break

    }

}
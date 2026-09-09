import type { Shape } from "../store/canvasStore"
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
      shape: Partial<Shape> & { id: string }
    }


export function handleMessage(message: Message){
    const addShape = useCanvasStore.getState().addShape
    const updateShape = useCanvasStore.getState().updateShape
    const markShapeDeleted = useCanvasStore.getState().markShapeDeleted

    switch(message.type){
        case "connection":
            console.log(message.content)
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
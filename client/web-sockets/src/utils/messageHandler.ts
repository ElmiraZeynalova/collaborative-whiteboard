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
      shape: Shape
    }
  | {
      type: "shape:update"
      shape: Shape
    }


export function handleMessage(message: Message){
    const addShape = useCanvasStore.getState().addShape
    const markShapeDeleted = useCanvasStore.getState().markShapeDeleted

    switch(message.type){
        case "connection":
            console.log(message.content)
            break
        case "shape:add":
            console.log("adding sent shape...")
            addShape(message.shape)
            break
        case "shape:delete":
            markShapeDeleted(message.shape.id)
    }

}
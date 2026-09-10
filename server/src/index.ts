import express from "express";
import { createServer } from "http";
import { WebSocketServer, type Server, type WebSocket } from "ws";

export type Shape = {
    id: string
    userId: string
    type: string
    x: number
    y: number
    width?: number
    height?: number
    radius?: number
    startX?: number
    startY?: number
    points?: {x:number, y:number}[]
    fillStyle: string
    strokeStyle: string
    lineWidth: number
    isDeleted: boolean
}

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

const ALLOWED_ORIGINS = ["http://localhost:5173"]

const clients = new Map<WebSocket, {boardId: string}>()
const boardsStates = new Map<string, Record<string, Shape>>()

wss.on("connection", (ws, req) => {
  const origin = req.headers.origin

  if(!ALLOWED_ORIGINS.includes(origin!)){
    ws.close(1008, "Origin not allowed")
    return
  }

  ws.on("message", (data) => {
    let message

    try{
      message = JSON.parse(data.toString())
      console.log(message)

      if(message.type === "connection"){
        clients.set(ws, {boardId: message.boardId})
        const shapes = boardsStates.get(message.boardId)
        ws.send(JSON.stringify({
            type: 'board:state',
            shapes: Object.values(shapes ?? {})
        }))
        const payload = {type: "connection", content: `${message.userName} entered the room.`}
        broadcast(wss, ws, payload)
      }else if(message.type.startsWith("shape:")){
        handleShapeMessage(message, ws)
      }

    }catch{
      ws.send(JSON.stringify({error: 'Invalid JSON'}))
    }
  })

  ws.on("error", (err) => console.error("Client error:", err.message));
  ws.on("close", () => console.log("client disconnected"));
});


function broadcast(server: Server, sender: WebSocket, message: any) {
  const payload = JSON.stringify(message);
  const senderData = clients.get(sender)
  for (const client of server.clients) {
    const clientData = clients.get(client)
    if (client !== sender && client.readyState === 1 && senderData?.boardId === clientData?.boardId) {
      client.send(payload);
    }
  }
}

function handleShapeMessage(message: {type: string, shape: Shape}, ws: WebSocket){
  broadcast(wss, ws, message)

  const boardId = clients.get(ws)!.boardId 
  const boardState = boardsStates.get(boardId) ?? {}
  const existingShape = boardState[message.shape.id]

  switch(message.type){
    case "shape:add":
      boardsStates.set(boardId, {...boardState, [message.shape.id]: message.shape})
      break
    case "shape:delete":
      if(!existingShape) return
      boardsStates.set(boardId, {...boardState, [existingShape.id]: {...existingShape, isDeleted: true}})
      break
    case "shape:update":
      if(!existingShape) return
      boardsStates.set(boardId, {...boardState, [existingShape.id]: {...existingShape, ...message.shape}})
      break
  }
}
server.listen(3000, () => console.log("listening on :3000"));
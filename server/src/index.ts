import express from "express";
import { createServer } from "http";
import { WebSocketServer, type Server, type WebSocket } from "ws";

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

const ALLOWED_ORIGINS = ["http://localhost:5173"]

const clients = new Map<WebSocket, {boardId: string}>()
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
        const payload = {type: "connection", content: `${message.userName} entered the room.`}
        broadcast(wss, ws, payload)
      }else if(message.type.startsWith("shape:")){
        console.log("got figure: ", message)
        broadcast(wss, ws, message)
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

server.listen(3000, () => console.log("listening on :3000"));
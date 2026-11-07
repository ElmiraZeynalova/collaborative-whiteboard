import { createServer } from "http";
import { type WebSocketLike } from '@hocuspocus/server'
import crossws from 'crossws/adapters/node'
import { hocuspocus } from "./hocuspocus.js";

const server = createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200);
    res.end("ok");
    return;
  }
  res.writeHead(404);
  res.end();
});

const ws = crossws({hooks: {
    open(peer) {
      const clientConnection = hocuspocus.handleConnection(
        peer.websocket as unknown as WebSocketLike,
        peer.request as Request,
      );
      (peer as any)._hocuspocus = clientConnection;
    },
    message(peer, message) {
      (peer as any)._hocuspocus?.handleMessage(message.uint8Array());
    },
    close(peer, event) {
      (peer as any)._hocuspocus?.handleClose({
        code: event.code,
        reason: event.reason,
      });
    },
    error(peer, error) {
      console.error("WebSocket error for peer:", peer.id);
      console.error(error);
    },
  }});
server.on("upgrade", (req, socket, head) => ws.handleUpgrade(req, socket, head));

const port = Number(process.env.PORT) || 1234;

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
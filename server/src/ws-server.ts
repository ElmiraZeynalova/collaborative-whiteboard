import { createServer } from "http";
import crossws from "crossws/adapters/node";
import type { WebSocketLike } from "@hocuspocus/server";
import { hocuspocus } from "./hocuspocus.js";

const server = createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("ok");
    return;
  }
  res.writeHead(404);
  res.end();
});

const ws = crossws({
  hooks: {
    open(peer) {
      console.log("WS OPEN:", peer.id);

      const clientConnection = hocuspocus.handleConnection(
        peer.websocket as unknown as WebSocketLike,
        peer.request as Request,
      );

      (peer as any)._hocuspocus = clientConnection;
    },
    message(peer, message) {
      console.log("WS MESSAGE:", peer.id, message.uint8Array().length);
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
  },
});

server.on("upgrade", (request, socket, head) => {
  console.log("UPGRADE REQUEST:", request.url);
  console.log("UPGRADE HEADERS:", request.headers);

  ws.handleUpgrade(request, socket, head);
});

const port = Number(process.env.PORT) || 1234;
server.listen(port, () => {
  console.log(`WS server listening on port ${port}`);
});

//git pull && npm ci && npm run build && sudo systemctl restart hocuspocus.
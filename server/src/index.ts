import { createServer } from "http";
import { Hocuspocus, type WebSocketLike } from '@hocuspocus/server'
import crossws from 'crossws/adapters/node'
import app from "./app.js";
import { saveBoardState, getBoardState } from "./utils/serverActionsWithBoard.js";
import * as Y from 'yjs'

const hocuspocus = new Hocuspocus({
  async onLoadDocument({ document, documentName }) {
    const boardId = documentName.replace(/^board-/, '')
    const board = await getBoardState(boardId)
    if (board?.state) {
        Y.applyUpdate(document, new Uint8Array(board.state))
    }


    return document
  },

  async onStoreDocument({ document, documentName }) {
    const boardId = documentName.replace(/^board-/, '')
    const state = Y.encodeStateAsUpdate(document)
    await saveBoardState(state, boardId)
  },

  async onStateless({ payload, document, connection }) {
      for (const client of document.getConnections()) {
          if (client !== connection) {
              client.sendStateless(payload)
          }
      }
  },
})

const server = createServer(app)

const ws = crossws({
  hooks: {
    open(peer) {
      const clientConnection = hocuspocus.handleConnection(
        peer.websocket as unknown as WebSocketLike,
        peer.request as Request,
        { user_id: 1234 },
      )
      ;(peer as any)._hocuspocus = clientConnection
    },
    message(peer, message) {
      ;(peer as any)._hocuspocus?.handleMessage(message.uint8Array())
    },
    
    close(peer, event) {
      ;(peer as any)._hocuspocus?.handleClose({
        code: event.code,
        reason: event.reason,
      })
    },
    error(peer, error) {
      console.error('WebSocket error for peer:', peer.id)
      console.error(error)
    },
  },
})

server.on('upgrade', (request, socket, head) => {
  ws.handleUpgrade(request, socket, head)
})

server.listen(1234, () => console.log('Listening on http://127.0.0.1:1234'))


import { createServer } from "http";
import { Hocuspocus, type WebSocketLike } from '@hocuspocus/server'
import crossws from 'crossws/adapters/node'
import app from "./app.js";
import { saveBoardState, getBoardState } from "./utils/serverActionsWithBoard.js";
import * as Y from 'yjs'
import {checkBoardAccess} from './utils/checkBoardAccess.js'
import jwt from 'jsonwebtoken'

export const hocuspocus = new Hocuspocus({

  async onAuthenticate({ token, documentName }) {
    const secret = process.env.JWT_ACCESS_SECRET
    if (!token) {
      throw new Error("Token wasn't provided")
    }
    if (!secret) {
      throw new Error('JWT_ACCESS_SECRET is not configured')
    }
    const user = jwt.verify(token, secret)

    if (!user || typeof user === 'string' || !user.id) {
      throw new Error('Unauthorized')
    }

    const boardId = documentName.replace(/^board-/, '') 

    await checkBoardAccess(boardId, user.id)

    return {
      userId: user.id,
    }
  },

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
      const payloadObj = JSON.parse(payload)

      if(payloadObj.type === "access"){
        const targetUserId = payloadObj.content.userId

        for (const client of document.getConnections()) {
            if (client.context.userId === targetUserId) {
                client.sendStateless(
                    JSON.stringify({
                        type: 'access',
                        content: payloadObj.content.message,
                    })
                )
                client.close()

            }
        }
      }else if(payloadObj.type === "connection"){
        for (const client of document.getConnections()) {
          if (client !== connection) {
              client.sendStateless(
                       JSON.stringify({
                        type: 'connection',
                        content: payloadObj.content,
                    }))
          }
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


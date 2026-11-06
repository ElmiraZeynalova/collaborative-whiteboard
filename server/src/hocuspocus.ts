
import { Hocuspocus, type WebSocketLike } from '@hocuspocus/server'
import { saveBoardState, getBoardState, getBoardById, getBoardMemberByUserId } from "./services/board.service.js"
import * as Y from 'yjs'
import {checkBoardAccess} from './utils/checkBoardAccess.js'
import jwt from 'jsonwebtoken'

export const hocuspocus = new Hocuspocus({

  async onAuthenticate({ token, documentName }) {

    const isLocalDocument = documentName.startsWith("board-guest-")
    const boardId = documentName.replace(isLocalDocument ? /^board-guest-/ : /^board-/, "")

    const board = await getBoardById(boardId)

    if (!board) {
      throw new Error("Board not found")
    }

    if (isLocalDocument) {
      if (!board.is_guest) {
        throw new Error("Invalid board type")
      }

      return {
       boardId,
        isGuest: true,
      }
    }

    if (board.is_guest) {
      throw new Error("Invalid board type")
    }

    if (!token) {
      throw new Error("Token wasn't provided")
    }

    const secret = process.env.JWT_ACCESS_SECRET

    if (!secret) {
      throw new Error('JWT_ACCESS_SECRET is not configured')
    }

    const user = jwt.verify(token, secret)

    if (!user || typeof user === 'string' || !user.id) {
      throw new Error('Unauthorized')
    }

    await checkBoardAccess(boardId, user.id)

    return {
      userId: user.id,
      boardId,
      isGuest: false,
    }
  },

  async onLoadDocument({ document, documentName }) {
    const isLocalBoard = documentName.startsWith("board-guest-")
    const boardId = isLocalBoard ? documentName.replace(/^board-guest-/, "") : documentName.replace(/^board-/, '')
    const board = await getBoardState(boardId)
    if (board?.state) {
        Y.applyUpdate(document, new Uint8Array(board.state))
    }


    return document
  },

  async onStoreDocument({ document, documentName }) {
    const isLocalBoard = documentName.startsWith("board-guest-")
    const boardId = isLocalBoard ? documentName.replace(/^board-guest-/, "") : documentName.replace(/^board-/, '')
    const state = Y.encodeStateAsUpdate(document)
    await saveBoardState(state, boardId)
  },

  async onStateless({ payload, document, connection }) {
    let message

    try {
      message = JSON.parse(payload)
    } catch {
      return
    }

    if (message.type === "connection") {
      const user = connection.context

      const userName = user.userName

      if (!userName) return

      const content = `${userName} entered the room`

      for (const client of document.getConnections()) {
        if (client !== connection) {
          client.sendStateless(JSON.stringify({
            type: "connection",
            content,
          }))
        }
      }
    }

    if(message.type === "access"){
      const senderUserId = connection.context.userId
      const boardId = connection.context.boardId

      if (!senderUserId || connection.context.isGuest) {
        return
      }

      const member = await getBoardMemberByUserId(boardId, senderUserId)

      if (!member || member.role === "contributor") {
        return
      }

      const targetUserId = message.content.userId

      for (const client of document.getConnections()) {
        if (!client.context.isGuest && client.context.userId === targetUserId) {
            client.sendStateless(
                JSON.stringify({
                    type: 'access',
                    content: "access prohibited",
                })
            )
            client.close()
        }
      }
    }
  },
})
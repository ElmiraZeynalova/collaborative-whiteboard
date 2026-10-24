import { createServer } from "http";
import { Hocuspocus } from '@hocuspocus/server';
import crossws from 'crossws/adapters/node';
import app from "./app.js";
import { saveBoardState, getBoardState, getBoardById, getBoardMemberByUserId } from "./services/board.service.js";
import * as Y from 'yjs';
import { checkBoardAccess } from './utils/checkBoardAccess.js';
import jwt from 'jsonwebtoken';
export const hocuspocus = new Hocuspocus({
    async onAuthenticate({ token, documentName }) {
        const isLocalDocument = documentName.startsWith("board-local-");
        const boardId = documentName.replace(isLocalDocument ? /^board-local-/ : /^board-/, "");
        const board = await getBoardById(boardId);
        if (!board) {
            throw new Error("Board not found");
        }
        if (isLocalDocument) {
            if (board.type !== "local") {
                throw new Error("Invalid board type");
            }
            return {
                boardId,
                isGuest: true,
            };
        }
        if (board.type !== "server") {
            throw new Error("Invalid board type");
        }
        if (!token) {
            throw new Error("Token wasn't provided");
        }
        const secret = process.env.JWT_ACCESS_SECRET;
        if (!secret) {
            throw new Error('JWT_ACCESS_SECRET is not configured');
        }
        const user = jwt.verify(token, secret);
        if (!user || typeof user === 'string' || !user.id) {
            throw new Error('Unauthorized');
        }
        await checkBoardAccess(boardId, user.id);
        return {
            userId: user.id,
            boardId,
            isGuest: false,
        };
    },
    async onLoadDocument({ document, documentName }) {
        const isLocalBoard = documentName.startsWith("board-local-");
        const boardId = isLocalBoard ? documentName.replace(/^board-local-/, "") : documentName.replace(/^board-/, '');
        const board = await getBoardState(boardId);
        if (board?.state) {
            Y.applyUpdate(document, new Uint8Array(board.state));
        }
        return document;
    },
    async onStoreDocument({ document, documentName }) {
        const isLocalBoard = documentName.startsWith("board-local-");
        const boardId = isLocalBoard ? documentName.replace(/^board-local-/, "") : documentName.replace(/^board-/, '');
        const state = Y.encodeStateAsUpdate(document);
        await saveBoardState(state, boardId);
    },
    async onStateless({ payload, document, connection }) {
        let message;
        try {
            message = JSON.parse(payload);
        }
        catch {
            return;
        }
        if (message.type === "connection") {
            const user = connection.context;
            const userName = user.userName;
            if (!userName)
                return;
            const content = `${userName} entered the room`;
            for (const client of document.getConnections()) {
                if (client !== connection) {
                    client.sendStateless(JSON.stringify({
                        type: "connection",
                        content,
                    }));
                }
            }
        }
        if (message.type === "access") {
            const senderUserId = connection.context.userId;
            const boardId = connection.context.boardId;
            if (!senderUserId || connection.context.isGuest) {
                return;
            }
            const member = await getBoardMemberByUserId(boardId, senderUserId);
            if (!member || member.role === "contributor") {
                return;
            }
            const targetUserId = message.content.userId;
            for (const client of document.getConnections()) {
                if (!client.context.isGuest && client.context.userId === targetUserId) {
                    client.sendStateless(JSON.stringify({
                        type: 'access',
                        content: "access prohibited",
                    }));
                    client.close();
                }
            }
        }
    },
});
const server = createServer(app);
const ws = crossws({
    hooks: {
        open(peer) {
            const clientConnection = hocuspocus.handleConnection(peer.websocket, peer.request);
            peer._hocuspocus = clientConnection;
        },
        message(peer, message) {
            ;
            peer._hocuspocus?.handleMessage(message.uint8Array());
        },
        close(peer, event) {
            ;
            peer._hocuspocus?.handleClose({
                code: event.code,
                reason: event.reason,
            });
        },
        error(peer, error) {
            console.error('WebSocket error for peer:', peer.id);
            console.error(error);
        },
    },
});
server.on('upgrade', (request, socket, head) => {
    ws.handleUpgrade(request, socket, head);
});
const port = Number(process.env.PORT) || 1234;
server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

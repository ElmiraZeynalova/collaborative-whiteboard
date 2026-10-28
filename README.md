# Collaborative Whiteboard

Real-time collaborative whiteboard with shared boards, role-based access control and CRDT-based synchronization.
Feel free to try: [https://collaborative-whiteboard-plum.vercel.app/](https://collaborative-whiteboard-plum.vercel.app/)

## Features

- **Real-time collaboration.** Multiple users edit the same board simultaneously, and changes appear instantly for everyone.
- **Conflict-free sync.** Board state is synchronized with Yjs (CRDT) through Hocuspocus, so concurrent edits merge without conflicts.
- **Canvas rendering.** Shapes are drawn and manipulated on a Konva canvas.
- **Guest and account boards.** Work on guest boards without logging in.
- **Browser persistence.** Board data is stored in IndexedDB for both guest and account boards, so boards are saved in the browser and load quickly.
- **Account boards with roles.** Role-based access control with three roles: `owner`, `admin` and `contributor`, each with its own permissions for board management and content editing. 
- **Authentication.** JWT-based auth with short-lived access tokens and refresh tokens.
- **REST API.** Endpoints for boards, backed by a PostgreSQL schema managed with Prisma.

## Tech Stack

| Area | Technologies |
| --- | --- |
| Frontend | React, TypeScript, Vite, Zustand, Konva |
| Real-time & sync | Yjs, Hocuspocus, WebSockets |
| Client storage | IndexedDB |
| Backend | Node.js, Express, REST API |
| Database | PostgreSQL, Prisma |
| Auth | JWT (access + refresh tokens) |

## Architecture

The project development went through a couple of stages:

1. **Custom implementation.** I first built a WebSocket synchronization layer and a shape engine from scratch to understand how real-time sync and state consistency work.
2. **Migration to Konva + Yjs/Hocuspocus.** I then moved rendering to Konva and synchronization to Yjs/Hocuspocus. A CRDT-based approach handles concurrent edits and conflict resolution far more reliably than a hand-written solution.

**Guest boards** require no account therefore have no roles and are stored in IndexedDB and server. **Account boards** are stored in IndexedDB as well and synchronized through the server, where roles and permissions are enforced.

## Roles and Permissions

| Action | Owner | Admin | Contributor |
| --- | :---: | :---: | :---: |
| Edit board content | ✅ | ✅ | ✅ |
| Rename board | ✅ | ✅ | ❌ |
| Delete board | ✅ | ❌ | ❌ |
| Invite members | ✅ | ✅ | ❌ |
| Change member's role | ✅ | ❌ | ❌ |
| Ban / unban member | ✅ | ✅ | ❌ |
| Change username | ✅ | ✅ | ✅ |


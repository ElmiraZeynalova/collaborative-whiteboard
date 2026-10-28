# Collaborative Whiteboard

Real-time collaborative whiteboard with shared boards, role-based access control and CRDT-based synchronization.

**[Live demo](https://YOUR-DEMO-LINK)** · **[Source code](https://github.com/YOUR-USERNAME/YOUR-REPO)**

<!-- Add a screenshot or GIF here. A short GIF of two browser windows drawing on the same board works best. -->
![Whiteboard screenshot](docs/screenshot.png)

## Features

- **Real-time collaboration.** Multiple users edit the same board simultaneously, and changes appear instantly for everyone.
- **Conflict-free sync.** Board state is synchronized with Yjs (CRDT) through Hocuspocus, so concurrent edits merge without conflicts.
- **Canvas rendering.** Shapes are drawn and manipulated on a Konva canvas.
- **Local and shared boards.** Work on a local board without an account or a server, or create a shared board on the server and collaborate with others.
- **Browser persistence.** Board data is stored in IndexedDB for both local and shared boards, so boards are saved in the browser and load quickly.
- **Shared boards with roles.** Role-based access control with three roles: `owner`, `admin` and `contributor`, each with its own permissions for board management and content editing. Roles apply to shared boards only.
- **Authentication.** JWT-based auth with short-lived access tokens and refresh tokens.
- **REST API.** Endpoints for users, boards and permissions, backed by a PostgreSQL schema managed with Prisma.

## Tech Stack

| Area | Technologies |
| --- | --- |
| Frontend | React, TypeScript, Vite, Zustand, Konva |
| Real-time & sync | Yjs, Hocuspocus, WebSockets |
| Client storage | IndexedDB (local and shared boards) |
| Backend | Node.js, Express, REST API |
| Database | PostgreSQL, Prisma |
| Auth | JWT (access + refresh tokens) |

## Architecture

The project went through two stages of real-time synchronization:

1. **Custom implementation.** I first built a WebSocket synchronization layer and a shape engine from scratch to understand how real-time sync and state consistency work.
2. **Migration to Konva + Yjs/Hocuspocus.** I then moved rendering to Konva and synchronization to Yjs/Hocuspocus. A CRDT-based approach handles concurrent edits and conflict resolution far more reliably than a hand-written solution.

```
Client (React, Konva, Zustand)
   │  Yjs document (CRDT)
   ├──► IndexedDB            (all boards: local and shared)
   │
   ▼  shared boards only
Hocuspocus server  ◄──►  Express REST API  ◄──►  PostgreSQL (Prisma)
        (real-time sync)     (auth, boards, roles)
```

**Local boards** live entirely in the browser: no account, no server, no roles. **Shared boards** are stored in IndexedDB as well and synchronized through the server, where roles and permissions are enforced.

<!-- Adjust the diagram to match your real architecture, e.g. where Hocuspocus persists documents. -->


## Roles and Permissions

Roles exist only on **shared boards**. Local boards belong to a single user in their browser, so there are no roles or permissions there.

| Action | Owner | Admin | Contributor |
| --- | :---: | :---: | :---: |
| Edit board content | ✅ | ✅ | ✅ |
| Invite / manage members | ✅ | ✅ | ❌ |
| Rename / configure board | ✅ | ✅ | ❌ |
| Delete board | ✅ | ❌ | ❌ |

<!-- Edit this table so it matches the permissions you actually implemented. -->

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL
- npm (or pnpm / yarn)

### Installation

```bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPO.git
cd YOUR-REPO

# Install dependencies (adjust if the client and server live in separate folders)
cd server && npm install
cd ../client && npm install
```

### Environment variables

Create a `.env` file in the server folder:

```env
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/whiteboard
JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret
PORT=3000
```

Create a `.env` file in the client folder:

```env
VITE_API_URL=http://localhost:3000
VITE_COLLAB_URL=ws://localhost:1234
```

<!-- Replace with the variables your project really uses. -->

### Database

```bash
cd server
npx prisma migrate dev
```

### Run locally

```bash
# Terminal 1: backend
cd server
npm run dev

# Terminal 2: frontend
cd client
npm run dev
```

Open `http://localhost:5173` in two browser windows to see real-time collaboration in action.

## Project Structure

```
.
├── client/          # React + TypeScript frontend
│   ├── src/
│   │   ├── components/
│   │   ├── store/       # Zustand stores
│   │   └── ...
├── server/          # Node.js + Express backend
│   ├── src/
│   │   ├── routes/
│   │   ├── middleware/  # auth, role checks
│   │   └── ...
│   └── prisma/          # schema and migrations
└── README.md
```

<!-- Replace with your real folder structure. -->

## What I Learned

- Designing real-time systems and why CRDTs are a better fit than custom conflict handling.
- Replacing a custom solution with a proven library and making that trade-off deliberately.
- Implementing role-based access control on both the API and the collaboration layer.
- Supporting both local-only and server-synced boards with browser persistence in IndexedDB.
- Designing a REST API and a relational schema with Prisma.

## Roadmap

<!-- Optional: list real ideas only, or delete this section. -->
- [ ] Idea 1
- [ ] Idea 2

## Author

**Elmira Zeynalova**
[GitHub](https://github.com/YOUR-USERNAME) · [LinkedIn](https://linkedin.com/in/YOUR-PROFILE) · elmirazeynalova39@gmail.com

# Collaborative Whiteboard

Real-time collaborative whiteboard with CRDT-based synchronization. Live demo: [https://d18fd4vg2lc443.cloudfront.net](https://d18fd4vg2lc443.cloudfront.net)

## Features

- **Real-time collaboration.** Multiple users edit the same board simultaneously, and changes appear instantly for everyone.
- **Conflict-free sync.** Board state is synchronized with Yjs (CRDT) through Hocuspocus, so concurrent edits merge without conflicts.
- **Canvas rendering.** Shapes are drawn and manipulated on a Konva canvas.
- **Guest and account boards.** Work on guest boards without logging in.
- **Browser persistence.** Board data is stored in IndexedDB for both guest and account boards, so boards are saved in the browser and load quickly.
- **Account boards with roles.** Role-based access control with three roles: `owner`, `admin` and `contributor`, each with its own permissions for board management. 
- **Authentication.** JWT-based auth with short-lived access tokens and refresh tokens.
- **REST API.** Endpoints for boards, backed by a PostgreSQL schema managed with Prisma.

## Architecture

The project development went through a couple of stages:

1. **Custom implementation.** I first built a WebSocket synchronization layer and a shape engine from scratch to understand how real-time synchronization, state consistency and canvas rendering work.
2. **Migration to Konva + Yjs/Hocuspocus.** I then moved rendering to Konva and synchronization to Yjs/Hocuspocus. A CRDT-based approach handles concurrent edits and conflict resolution far more reliably than a hand-written solution.

**Guest boards:** 
  - require no account - have no roles
  - stored in IndexedDB
  - synced through the server
    
**Account boards:**
  - require authentication
  - have roles and role based permissions
  - stored in IndexedDB
  - synced through the server
    

**Roles and permissions:**

*Contributor*
- Opens the board and sees changes from other users in real time
- Edits the content

*Admin*
- Everything a contributor can do
- Generates special board-sharing link
- Can ban/unban members
- Renames the board

*Owner*
- Everything an admin can do
- Deletes the board permanently
- Changes members roles

## Tech Stack

| Area | Technologies |
| --- | --- |
| Frontend | React, TypeScript, Vite, Zustand, Konva |
| Real-time & sync | Yjs, Hocuspocus, WebSockets |
| Client storage | IndexedDB |
| Backend | Node.js, Express, REST API |
| Database | PostgreSQL, Prisma |
| Testing | Playwright, Vitest |
| Hosting | AWS: EC2 (WebSocket server, PostgreSQL container), S3 + CloudFront (frontend), Lambda + API Gateway (REST API) |

## Deployment

CI/CD runs on GitHub Actions. After CI passes on `main`, the CD workflow:
- authenticates to AWS via OIDC,
- deploys the REST API with AWS SAM (Lambda + API Gateway),
- updates the WebSocket server on EC2, connecting through SSM and executing shell script on instance,
- syncs the frontend build to S3 and invalidates CloudFront.

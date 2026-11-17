import request from "supertest";
import app from "../app.js";

type Board = {
    id: string
    name: string
}

type User = {
    accessToken: string
    userId: string
}

type MemberRole = "owner" | "contributor" | "admin"

type MemberToJoin = {
    board_id: string
    name: string
    color: string
    is_hidden?: boolean
}

export async function createUser() {
  const res = await request(app).post("/api/auth/login").send({ email: `email${crypto.randomUUID()}@gmail.com`, password: "12345" });
  return { accessToken: res.body.accessToken as string, userId: res.body.userId as string };
}

export const bearer = (token: string) => ({ Authorization: `Bearer ${token}` });

export async function init(boardCount: number, memberRole: MemberRole){
    const owner: User = await createUser()

    const boards: Board[] = []
    for(let i = 0; i < boardCount; i++){
        const board = {id: crypto.randomUUID(), name: `board-${i}`}
        const res = await request(app)
            .post("/api/boards")
            .set(bearer(owner.accessToken))
            .send(board);

        if (res.status !== 201) {
            throw new Error(`Failed to create board: ${res.status} ${JSON.stringify(res.body)}`);
        }

        boards.push(board)
    }

    if(memberRole === "owner") return {user: owner, owner, boards}
    
    const anotherMember: User = await createUser()
    
    const boardId = boards[0].id
    const member: MemberToJoin = {board_id: boardId, name: "Ivan", color: '#ffffff'}
    await request(app)
        .post(`/api/boards/${boardId}/join`)
        .set(bearer(anotherMember.accessToken))
        .send(member);

    if(memberRole === "contributor") return {user: anotherMember, owner, boards}

    await request(app)
    .patch(`/api/boards/${boardId}/members/${anotherMember.userId}/role`)
    .set(bearer(owner.accessToken))
    .send({ role: 'admin' });

    return {user: anotherMember, owner, boards}
}
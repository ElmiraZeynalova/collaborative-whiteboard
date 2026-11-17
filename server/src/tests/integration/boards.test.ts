import { describe, it, expect } from "vitest";
import request from "supertest"
import app from "../../app.js"
import {prisma} from '../../prisma.js'
import { createUser, bearer, init } from "../helpers.js";

describe("guest boards CRUD", () => {
    it("creates guest board", async() => {
        const board = {id: crypto.randomUUID(), name: "guest-board"}
        const res = await request(app).post("/api/boards/guest").send(board);
        expect(res.status).toBe(201);
        expect(res.body.id).toBe(board.id);
        expect(res.body.name).toBe(board.name);
        expect(res.body.is_guest).toBe(true);
    });

    it("gets guest board by id", async() => {
        const board = {id: crypto.randomUUID(), name: "guest-board"}
        await request(app).post("/api/boards/guest").send(board);
        const res = await request(app).get(`/api/boards/guest/${board.id}`);
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(board.id);
        expect(res.body.is_guest).toBe(true);
    });

    it("changes guest board name", async() => {
        const boardId = crypto.randomUUID()
        const board = {id: boardId, name: "guest-board"}
        await request(app).post("/api/boards/guest").send(board);

        const updatedBoard = {id: boardId, name: "guest-board2"}
        const res = await request(app).patch(`/api/boards/guest/${boardId}`).send(updatedBoard);
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(boardId);
        expect(res.body.name).toBe(updatedBoard.name);
        expect(res.body.is_guest).toBe(true);
    });

    it("deletes guest board", async() => {
        const board = {id: crypto.randomUUID(), name: "guest-board"}
        await request(app).post("/api/boards/guest").send(board);

        const res = await request(app).delete(`/api/boards/guest/${board.id}`);
        expect(res.status).toBe(200);
        const left = await prisma.boards.count({ where: { id: board.id } });
        expect(left).toBe(0);
    });

})


describe("authorization check", () => {
    it("returns 401 without a token", async () => {
        const res = await request(app).get("/api/boards");
        expect(res.status).toBe(401);
    });

    it("returns 401 with an invalid token", async () => {
        const res = await request(app).get("/api/boards").set(bearer("garbage"));
        expect(res.status).toBe(401);
    });

    it("gets board with valid access token set", async () => {
        const {user, boards} = await init(1, 'owner')
        const boardId = boards[0].id
        const boardName = boards[0].name
        const res = await request(app).get(`/api/boards/${boardId}`).set(bearer(user.accessToken));
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(boardId);
        expect(res.body.name).toBe(boardName);
        expect(res.body.is_guest).toBe(false);
    });
})


describe("creates and gets account boards", () => {
    it("creates account board and adds member entry for authenticated user", async () => {
        const user = await createUser()
        const board = {id: crypto.randomUUID(), name: "board-222"}
        const res = await request(app).post("/api/boards").set(bearer(user.accessToken)).send(board);

        expect(res.status).toBe(201);
        expect(res.body.id).toBe(board.id);
        expect(res.body.name).toBe(board.name);
        expect(res.body.is_guest).toBe(false);
        const member = await prisma.board_members.findUnique({
            where: {
                board_id_user_id: {
                    user_id: user.userId,
                    board_id: board.id,
                },
            }
        })
        expect(member?.role).toBe("owner");
        expect(member?.user_id).toBe(user.userId);
        expect(member?.board_id).toBe(board.id)
    });

    it("gets board by id", async () => {
        const {user, boards} = await init(1, "owner")
        const boardId = boards[0].id
        const boardName = boards[0].name
        const res = await request(app).get(`/api/boards/${boardId}`).set(bearer(user.accessToken))
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(boardId);
        expect(res.body.name).toBe(boardName);
        expect(res.body.is_guest).toBe(false);
    });

    it("gets all member's boards", async () => {
        const { user, boards } = await init(3, "owner")
        const { user: user2, boards: boards2 } = await init(2, "owner")
        const res = await request(app).get(`/api/boards/`).set(bearer(user.accessToken));
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(3);
    });

})

describe("deletes account board", () => {
    it(" deletes board permanently if 'owner' ", async () => {
        const {user, boards} = await init(1, 'owner')
        const boardId = boards[0].id
        const res = await request(app).delete(`/api/boards/${boardId}`).set(bearer(user.accessToken))
        
        expect(res.status).toBe(200);
        expect(res.body.deleted).toBe(true)
        expect(res.body.board.id).toBe(boardId)

        const left = await prisma.boards.count({ where: { id: boardId } })
        expect(left).toBe(0)
    })

    it(" doesn't delete board permanently if 'admin' ", async () => {
        const {user, boards} = await init(1, 'admin')
        const boardId = boards[0].id
        const res = await request(app).delete(`/api/boards/${boardId}`).set(bearer(user.accessToken))
        expect(res.status).toBe(200);
        expect(res.body.deleted).toBe(false)
        expect(res.body.updatedMember.user_id).toBe(user.userId)
        expect(res.body.updatedMember.board_id).toBe(boardId)
        expect(res.body.updatedMember.role).toBe('admin')
        expect(res.body.updatedMember.is_hidden).toBe(true)
    })

    it(" doesn't delete board permanently if 'contributor' ", async () => {
        const {user, boards} = await init(1, 'contributor')
        const boardId = boards[0].id
        const res = await request(app).delete(`/api/boards/${boardId}`).set(bearer(user.accessToken))
        expect(res.status).toBe(200);
        expect(res.body.deleted).toBe(false)
        expect(res.body.updatedMember.user_id).toBe(user.userId)
        expect(res.body.updatedMember.board_id).toBe(boardId)
        expect(res.body.updatedMember.role).toBe('contributor')
        expect(res.body.updatedMember.is_hidden).toBe(true)
    })

    it("is unable to delete board if not a member", async () => {
        const { boards } = await init(1, "owner");
        const outsider = await createUser();
        const boardId = boards[0].id;

        const res = await request(app)
            .delete(`/api/boards/${boardId}`)
            .set(bearer(outsider.accessToken));

        expect(res.status).toBe(400);
        expect(res.body.error).toBe("You are not a member of this board");
    });

})

describe("changes member role", () => {
    it("allows owner to change member role to admin", async () => {
        const { owner, user: member, boards } = await init(1, "contributor");
        const boardId = boards[0].id;

        const res = await request(app)
            .patch(`/api/boards/${boardId}/members/${member.userId}/role`)
            .set(bearer(owner.accessToken))
            .send({ role: "admin" });

        expect(res.status).toBe(200);
        expect(res.body.user_id).toBe(member.userId);
        expect(res.body.board_id).toBe(boardId);
        expect(res.body.role).toBe("admin");
    });

    it("does not allow admin to change member role", async () => {
        const { user: admin, boards } = await init(1, "admin");
        const boardId = boards[0].id;

        const anotherUser = await createUser();

        const member = {
            name: "Another",
            color: "#ffffff",
            is_hidden: false
        };

        await request(app)
            .post(`/api/boards/${boardId}/join`)
            .set(bearer(anotherUser.accessToken))
            .send(member);

        const res = await request(app)
            .patch(`/api/boards/${boardId}/members/${anotherUser.userId}/role`)
            .set(bearer(admin.accessToken))
            .send({ role: "admin" });

        expect(res.status).toBe(400);
        expect(res.body.error).toBe(
            "You don't have permission to change this member's role."
        );
    });

    it("does not allow contributor to change member role", async () => {
        const { user: contributor, boards } = await init(1, "contributor");
        const boardId = boards[0].id;

        const res = await request(app)
            .patch(`/api/boards/${boardId}/members/${contributor.userId}/role`)
            .set(bearer(contributor.accessToken))
            .send({ role: "admin" });

        expect(res.status).toBe(400);
        expect(res.body.error).toBe(
            "You don't have permission to change this member's role."
        );
    });

    it("does not allow non-member to change member role", async () => {
        const { user: owner, boards } = await init(1, "owner");
        const outsider = await createUser()

        const boardId = boards[0].id;

        const res = await request(app)
            .patch(`/api/boards/${boardId}/members/${owner.userId}/role`)
            .set(bearer(outsider.accessToken))
            .send({ role: "admin" });

        expect(res.status).toBe(400);
        expect(res.body.error).toBe(
            "You don't have permission to change this member's role."
        );
    });
});

describe("changes member access", () => {
    it("allows owner to revoke member access", async () => {
        const { owner, user: member, boards } = await init(1, "contributor");
        const boardId = boards[0].id;

        const res = await request(app)
            .patch(`/api/boards/${boardId}/members/${member.userId}/access`)
            .set(bearer(owner.accessToken))
            .send({ isAllowed: false });

        expect(res.status).toBe(200);
        expect(res.body.user_id).toBe(member.userId);
        expect(res.body.board_id).toBe(boardId);
        expect(res.body.access).toBe(false);

        const updatedMember = await prisma.board_members.findUnique({
            where: {
                board_id_user_id: {
                    board_id: boardId,
                    user_id: member.userId,
                },
            },
        });

        expect(updatedMember?.access).toBe(false);
    });

    it("allows owner to restore member access", async () => {
        const { owner, user: member, boards } = await init(1, "contributor");
        const boardId = boards[0].id;

        await prisma.board_members.update({
            where: {
                board_id_user_id: {
                    board_id: boardId,
                    user_id: member.userId,
                },
            },
            data: { access: false },
        });

        const res = await request(app)
            .patch(`/api/boards/${boardId}/members/${member.userId}/access`)
            .set(bearer(owner.accessToken))
            .send({ isAllowed: true });

        expect(res.status).toBe(200);
        expect(res.body.access).toBe(true);
    });

    it("allows admin to change member access", async () => {
        const { owner, user: admin, boards } = await init(1, "admin");
        const boardId = boards[0].id;

        const anotherMember = await createUser();

        await request(app)
            .post(`/api/boards/${boardId}/join`)
            .set(bearer(anotherMember.accessToken))
            .send({
                board_id: boardId,
                name: "Another",
                color: "#ffffff",
            });

        const res = await request(app)
            .patch(`/api/boards/${boardId}/members/${anotherMember.userId}/access`)
            .set(bearer(admin.accessToken))
            .send({ isAllowed: false });

        expect(res.status).toBe(200);
        expect(res.body.user_id).toBe(anotherMember.userId);
        expect(res.body.access).toBe(false);
    });

    it("does not allow contributor to change member access", async () => {
        const { user: contributor, boards } = await init(1, "contributor");
        const boardId = boards[0].id;

        const anotherMember = await createUser();

        await request(app)
            .post(`/api/boards/${boardId}/join`)
            .set(bearer(anotherMember.accessToken))
            .send({
                board_id: boardId,
                name: "Another",
                color: "#ffffff",
            });

        const res = await request(app)
            .patch(`/api/boards/${boardId}/members/${anotherMember.userId}/access`)
            .set(bearer(contributor.accessToken))
            .send({ isAllowed: false });

        expect(res.status).toBe(400);
        expect(res.body.error).toBe(
            "You don't have permission to change this member's access to board."
        );
    });

    it("does not allow non-member to change member access", async () => {
        const { owner, boards } = await init(1, "owner");
        const outsider = await createUser();
        const boardId = boards[0].id;

        const res = await request(app)
            .patch(`/api/boards/${boardId}/members/${owner.userId}/access`)
            .set(bearer(outsider.accessToken))
            .send({ isAllowed: false });

        expect(res.status).toBe(400);
        expect(res.body.error).toBe(
            "You don't have permission to change this member's access to board."
        );
    });
})
import { describe, it, expect } from "vitest";
import request from "supertest"
import app from "../../app.js"
import {prisma} from '../../prisma.js'
import { createUser, bearer } from "../helpers.js";

describe("/api/board/guest", () => {
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
        const res = await request(app).get(`/api/boards/guest/${board.id}`).send(board.id);
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

        const res = await request(app).delete(`/api/boards/guest/${board.id}`).send(board.id);
        expect(res.status).toBe(200);
        const left = await prisma.boards.count({ where: { id: board.id } });
        expect(left).toBe(0);
    });

})


describe("/api/boards (auth required)", () => {
    it("returns 401 without a token", async () => {
        const res = await request(app).get("/api/boards");
        expect(res.status).toBe(401);
    });

    it("returns 401 with an invalid token", async () => {
        const res = await request(app).get("/api/boards").set(bearer("garbage"));
        expect(res.status).toBe(401);
    });

    it("creates account board for authenticated user", async () => {
        const user = await createUser()
        const board = {id: crypto.randomUUID(), name: "board-222"}
        const res = await request(app).post("/api/boards").set(bearer(user.token)).send(board);
        expect(res.status).toBe(201);
        expect(res.body.id).toBe(board.id);
        expect(res.body.name).toBe(board.name);
        expect(res.body.is_guest).toBe(false);
    });

    it("gets account board for authenticated user", async () => {
        const user = await createUser()
        const board = {id: crypto.randomUUID(), name: "board-222"}
        await request(app).post("/api/boards").set(bearer(user.token)).send(board);
        const res = await request(app).get(`/api/boards/${board.id}`).set(bearer(user.token)).send(board.id);
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(board.id);
        expect(res.body.name).toBe(board.name);
        expect(res.body.is_guest).toBe(false);
    });

    // it("deletes account board for authenticated user", async () => {
    //     const user = await createUser()
    //     const board = {id: crypto.randomUUID(), name: "board-222"}
    //     const res = await request(app).post("/api/boards").set(bearer(user.token)).send(board);
    //     expect(res.status).toBe(201);
    //     expect(res.body.id).toBe(board.id);
    //     expect(res.body.name).toBe(board.name);
    //     expect(res.body.is_guest).toBe(false);
    // });


})
import { describe, it, expect } from "vitest"
import request from "supertest"
import app from "../../app.js"
import {prisma} from '../../prisma.js'

const credentials = { email: "example@gmail.com", password: "StrongPassword12345" };

describe("POST /api/auth/login", () => {
  it("creates a new user on first request and returns access token", async () => {
    const res = await request(app).post("/api/auth/login").send(credentials);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
    expect(res.body).toHaveProperty("userId");
  });

  it("logs in an existing user and returns the same userId", async () => {
    const first = await request(app).post("/api/auth/login").send(credentials);
    const second = await request(app).post("/api/auth/login").send(credentials);

    expect(second.status).toBe(200);
    expect(second.body.userId).toBe(first.body.userId);
  });

  it("creates a separate session for each login", async () => {
    const first = await request(app).post("/api/auth/login").send(credentials);
    await request(app).post("/api/auth/login").send(credentials);

    const sessions = await prisma.app_sessions.count({
      where: { user_id: first.body.userId },
    });
    expect(sessions).toBe(2);
  });

  it("rejects wrong password for an existing user", async () => {
    await request(app).post("/api/auth/login").send(credentials);

    const res = await request(app)
      .post("/api/auth/login")
      .send({ ...credentials, password: "WrongPassword1" });

    expect(res.status).toBe(401); 
  });
});

describe("POST /api/auth/logout", () => {
  it("removes only the current session", async () => {
    const a = await request(app).post("/api/auth/login").send(credentials);
    await request(app).post("/api/auth/login").send(credentials);

    const cookie = a.headers["set-cookie"]; 
    const res = await request(app).post("/api/auth/logout").set("Cookie", cookie);

    expect(res.status).toBe(200);
    const left = await prisma.app_sessions.count({ where: { user_id: a.body.userId } });
    expect(left).toBe(1);
  });

  it("succeeds without a cookie", async () => {
    const res = await request(app).post("/api/auth/logout");
    expect(res.status).toBe(200);
  });
});

describe("GET /api/auth/refresh", () => {
  it("rotates the token: old cookie stops working", async () => {

    const login = await request(app).post("/api/auth/login").send(credentials);
    expect(login.status).toBe(200);
    const oldCookie = login.headers["set-cookie"];
    expect(oldCookie).toBeDefined();

    const first = await request(app).get("/api/auth/refresh").set("Cookie", oldCookie);
    expect(first.status).toBe(200);

    const second = await request(app).get("/api/auth/refresh").set("Cookie", oldCookie);
    expect(second.status).toBe(401);
  });

  it("returns 401 after logout", async () => {
    const login = await request(app).post("/api/auth/login").send(credentials);
    const cookie = login.headers["set-cookie"];

    await request(app).post("/api/auth/logout").set("Cookie", cookie);
    const res = await request(app).get("/api/auth/refresh").set("Cookie", cookie);
    expect(res.status).toBe(401);
  });

  it("returns 401 for a garbage token", async () => {
    const res = await request(app)
      .get("/api/auth/refresh")
      .set("Cookie", "jwt=not-a-real-token");
    expect(res.status).toBe(401);
  });
});
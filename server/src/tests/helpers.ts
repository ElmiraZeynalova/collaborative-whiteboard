import request from "supertest";
import app from "../app.js";

export async function createUser(email = "owner@example.com", password = "StrongPassword12345") {
  const res = await request(app).post("/api/auth/login").send({ email, password });
  return { token: res.body.accessToken as string, userId: res.body.userId as string };
}

export const bearer = (token: string) => ({ Authorization: `Bearer ${token}` });
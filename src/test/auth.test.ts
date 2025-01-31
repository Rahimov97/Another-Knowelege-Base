import request from "supertest";
import app from "../app";
import { connectTestDB, disconnectTestDB } from "./dbTestUtils";

beforeAll(async () => {
  await connectTestDB();
});

afterAll(async () => {
  await disconnectTestDB();
});

describe("Auth API", () => {
  let token: string;

  it("Должен зарегистрировать пользователя", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({ email: "test@example.com", password: "password123" });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Пользователь зарегистрирован");
  });

  it("Должен залогинить пользователя и вернуть JWT", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "test@example.com", password: "password123" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    token = res.body.token;
  });

  it("Должен отклонить логин с неверным паролем", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "test@example.com", password: "wrongpassword" });

    expect(res.status).toBe(401);
  });
});

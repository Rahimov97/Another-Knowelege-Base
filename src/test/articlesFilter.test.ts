import request from "supertest";
import app from "../app";
import { connectTestDB, disconnectTestDB } from "./dbTestUtils";

let token: string;

beforeAll(async () => {
  await connectTestDB();

  await request(app)
    .post("/auth/register")
    .send({ email: "filter@example.com", password: "password123" });

  const loginRes = await request(app)
    .post("/auth/login")
    .send({ email: "filter@example.com", password: "password123" });

  token = loginRes.body.token;

  await request(app)
    .post("/articles")
    .set("Authorization", `Bearer ${token}`)
    .send({
      title: "Статья 1",
      content: "Содержимое 1",
      tags: ["javascript"],
      isPublic: true,
    });

  await request(app)
    .post("/articles")
    .set("Authorization", `Bearer ${token}`)
    .send({
      title: "Статья 2",
      content: "Содержимое 2",
      tags: ["nodejs"],
      isPublic: true,
    });
});

afterAll(async () => {
  await disconnectTestDB();
});

describe("Article filtering by tags", () => {
  it("Должен фильтровать статьи по тегу 'javascript'", async () => {
    const res = await request(app).get("/articles?tags=javascript");

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].tags).toContain("javascript");
  });

  it("Должен фильтровать статьи по тегу 'nodejs'", async () => {
    const res = await request(app).get("/articles?tags=nodejs");

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].tags).toContain("nodejs");
  });

  it("Должен вернуть пустой массив, если статей с тегом нет", async () => {
    const res = await request(app).get("/articles?tags=python");

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(0);
  });
});

import request from "supertest";
import app from "../app";
import { connectTestDB, disconnectTestDB } from "./dbTestUtils";

let token: string;
let articleId: string;

beforeAll(async () => {
  await connectTestDB();

  const res = await request(app)
    .post("/auth/register")
    .send({ email: "test@example.com", password: "password123" });

  const loginRes = await request(app)
    .post("/auth/login")
    .send({ email: "test@example.com", password: "password123" });

  token = loginRes.body.token;
});

afterAll(async () => {
  await disconnectTestDB();
});

describe("Articles API", () => {
  it("Должен создать статью", async () => {
    const res = await request(app)
      .post("/articles")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Тестовая статья",
        content: "Это содержимое тестовой статьи",
        tags: ["test", "api"],
        isPublic: true,
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("_id");
    articleId = res.body._id;
  });

  it("Должен получить список статей", async () => {
    const res = await request(app).get("/articles");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it("Должен получить статью по ID", async () => {
    const res = await request(app)
      .get(`/articles/${articleId}`)
      .set("Authorization", `Bearer ${token}`);
  
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Тестовая статья");
  });  

  it("Должен обновить статью", async () => {
    const res = await request(app)
      .put(`/articles/${articleId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Обновлённая статья",
        content: "Обновлённое содержимое",
      });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Обновлённая статья");
  });

  it("Должен удалить статью", async () => {
    const res = await request(app)
      .delete(`/articles/${articleId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
  });
});

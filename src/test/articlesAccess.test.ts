import request from "supertest";
import app from "../app";
import { connectTestDB, disconnectTestDB } from "./dbTestUtils";

let token1: string;
let token2: string;
let publicArticleId: string;
let privateArticleId: string;

beforeAll(async () => {
  await connectTestDB();

  await request(app)
    .post("/auth/register")
    .send({ email: "user1@example.com", password: "password123" });

  const loginRes1 = await request(app)
    .post("/auth/login")
    .send({ email: "user1@example.com", password: "password123" });

  token1 = loginRes1.body.token;

  await request(app)
    .post("/auth/register")
    .send({ email: "user2@example.com", password: "password123" });

  const loginRes2 = await request(app)
    .post("/auth/login")
    .send({ email: "user2@example.com", password: "password123" });

  token2 = loginRes2.body.token;

  const publicArticleRes = await request(app)
    .post("/articles")
    .set("Authorization", `Bearer ${token1}`)
    .send({
      title: "Публичная статья",
      content: "Содержимое публичной статьи",
      tags: ["test"],
      isPublic: true,
    });

  publicArticleId = publicArticleRes.body._id;

  const privateArticleRes = await request(app)
    .post("/articles")
    .set("Authorization", `Bearer ${token1}`)
    .send({
      title: "Приватная статья",
      content: "Содержимое приватной статьи",
      tags: ["private"],
      isPublic: false,
    });

  privateArticleId = privateArticleRes.body._id;
});

afterAll(async () => {
  await disconnectTestDB();
});

describe("Access control for articles", () => {
  it("Неавторизованный пользователь должен видеть только публичные статьи", async () => {
    const res = await request(app).get("/articles");
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].title).toBe("Публичная статья");
  });

  it("Авторизованный пользователь может видеть свои приватные статьи", async () => {
    const res = await request(app)
      .get(`/articles/${privateArticleId}`)
      .set("Authorization", `Bearer ${token1}`);

    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Приватная статья");
  });

  it("Обычный пользователь НЕ может видеть чужие приватные статьи", async () => {
    const res = await request(app)
      .get(`/articles/${privateArticleId}`)
      .set("Authorization", `Bearer ${token2}`);

    expect(res.status).toBe(403);
  });

  it("Обычный пользователь НЕ может удалить чужую статью", async () => {
    const res = await request(app)
      .delete(`/articles/${publicArticleId}`)
      .set("Authorization", `Bearer ${token2}`);

    expect(res.status).toBe(403);
  });
});

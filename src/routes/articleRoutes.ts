import { Router } from "express";
import { body } from "express-validator";
import {
  createArticle,
  getArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
} from "../controllers/articleController";
import { authenticate } from "../middlewares/authMiddleware";
import { validateRequest } from "../middlewares/validateMiddleware";

const router = Router();

/**
 * @swagger
 * /articles:
 *   post:
 *     summary: Создать новую статью
 *     tags: [Articles]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               isPublic:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Статья создана
 *       400:
 *         description: Некорректные данные
 *       401:
 *         description: Неавторизованный доступ
 */
router.post(
  "/",
  authenticate,
  [
    body("title").notEmpty().withMessage("Заголовок обязателен"),
    body("content").notEmpty().withMessage("Содержимое статьи обязательно"),
    body("tags").isArray().withMessage("Теги должны быть массивом"),
    body("isPublic").isBoolean().withMessage("isPublic должен быть true или false"),
    validateRequest,
  ],
  createArticle
);

/**
 * @swagger
 * /articles:
 *   get:
 *     summary: Получить список статей
 *     tags: [Articles]
 *     parameters:
 *       - in: query
 *         name: tags
 *         schema:
 *           type: string
 *         description: Фильтр по тегам (разделять запятой)
 *     responses:
 *       200:
 *         description: Успешный запрос
 */
router.get("/", getArticles);

/**
 * @swagger
 * /articles/{id}:
 *   get:
 *     summary: Получить статью по ID
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Статья найдена
 *       404:
 *         description: Статья не найдена
 */
router.get("/:id", authenticate, getArticleById);

/**
 * @swagger
 * /articles/{id}:
 *   put:
 *     summary: Обновить статью
 *     tags: [Articles]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               isPublic:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Статья обновлена
 *       400:
 *         description: Некорректные данные
 *       403:
 *         description: Нет доступа
 */
router.put(
  "/:id",
  authenticate,
  [
    body("title").optional().notEmpty().withMessage("Заголовок обязателен"),
    body("content").optional().notEmpty().withMessage("Содержимое статьи обязательно"),
    body("tags").optional().isArray().withMessage("Теги должны быть массивом"),
    body("isPublic").optional().isBoolean().withMessage("isPublic должен быть true или false"),
    validateRequest,
  ],
  updateArticle
);

/**
 * @swagger
 * /articles/{id}:
 *   delete:
 *     summary: Удалить статью
 *     tags: [Articles]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Статья удалена
 *       403:
 *         description: Нет доступа
 */
router.delete("/:id", authenticate, deleteArticle);

export default router;

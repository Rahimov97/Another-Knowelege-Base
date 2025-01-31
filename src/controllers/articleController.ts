import { Request, Response } from "express";
import Article from "../models/Article";
import { AuthRequest } from "../middlewares/authMiddleware";

export const createArticle = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, content, tags, isPublic } = req.body;

    const newArticle = new Article({
      title,
      content,
      tags,
      isPublic,
      author: req.user?.userId,
    });

    await newArticle.save();
    res.status(201).json(newArticle);
  } catch (error) {
    res.status(500).json({ message: "Ошибка при создании статьи" });
  }
};

export const getArticles = async (req: Request, res: Response): Promise<void> => {
    try {
      const { tags } = req.query;
  
      let query: Record<string, any> = { isPublic: true }; 
  
      if (tags) {
        query.tags = { $in: (tags as string).split(",") };
      }
  
      const articles = await Article.find(query);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Ошибка при получении статей" });
    }
  };
  
export const getArticleById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const article = await Article.findById(id);
  
      if (!article) {
        res.status(404).json({ message: "Статья не найдена" });
        return;
      }
  
      if (!article.isPublic && (!req.user || req.user.userId !== article.author.toString())) {
        res.status(403).json({ message: "Нет доступа к этой статье" });
        return;
      }
  
      res.json(article);
    } catch (error) {
      res.status(500).json({ message: "Ошибка при получении статьи" });
    }
  };
  

export const updateArticle = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const article = await Article.findById(id);
  
      if (!article) {
        res.status(404).json({ message: "Статья не найдена" });
        return;
      }
  
      if (req.user?.userId !== article.author.toString()) {
        res.status(403).json({ message: "Нет прав на редактирование статьи" });
        return;
      }
  
      Object.assign(article, req.body);
      await article.save();
      res.json(article);
    } catch (error) {
      res.status(500).json({ message: "Ошибка при обновлении статьи" });
    }
  };
  
export const deleteArticle = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const article = await Article.findById(id);
  
      if (!article) {
        res.status(404).json({ message: "Статья не найдена" });
        return;
      }
  
      if (req.user?.userId !== article.author.toString()) {
        res.status(403).json({ message: "Нет прав на удаление статьи" });
        return;
      }
  
      await Article.findByIdAndDelete(id);
      res.json({ message: "Статья удалена" });
    } catch (error) {
      res.status(500).json({ message: "Ошибка при удалении статьи" });
    }
  };
  
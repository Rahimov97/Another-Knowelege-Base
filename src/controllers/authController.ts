import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "Email уже используется" });
      return;
    }

    const user = new User({ email, password });
    await user.save();

    res.status(201).json({ message: "Пользователь зарегистрирован" });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: "Неверный email или пароль" });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ message: "Неверный email или пароль" });
      return;
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, { expiresIn: "7d" });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

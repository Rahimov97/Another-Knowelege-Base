import express from "express"; 
import cors from "cors";
import mongoose from "mongoose";
import { setupSwagger } from "./swagger";
import authRoutes from "./routes/authRoutes";
import articleRoutes from "./routes/articleRoutes";
import { errorHandler } from "./middlewares/errorMiddleware";
import { config } from "./config/config";

const app = express();

setupSwagger(app);

app.use(express.json());
app.use(cors());
app.use(errorHandler);

app.use("/auth", authRoutes);
app.use("/articles", articleRoutes);

if (config.nodeEnv !== "test") {
  mongoose
    .connect(config.mongoURI)
    .then(() => console.log("✅ Подключено к MongoDB"))
    .catch((err) => console.error("❌ Ошибка подключения MongoDB:", err));
}

app.get("/", (req, res) => {
  res.send("Another Knowledge Base API работает 🚀");
});

export default app;

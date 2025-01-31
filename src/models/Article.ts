import mongoose from "mongoose";

interface IArticle extends mongoose.Document {
  title: string;
  content: string;
  tags: string[];
  isPublic: boolean;
  author: mongoose.Schema.Types.ObjectId;
}

const ArticleSchema = new mongoose.Schema<IArticle>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: { type: [String], default: [] },
  isPublic: { type: Boolean, default: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const Article = mongoose.model<IArticle>("Article", ArticleSchema);
export default Article;

import { Router } from "express";
import {
  getAllBlogs,
  createBlog,
  updateLikes,
  deleteBlog,
} from "../controller/blogcontroller.js";
const router = new Router();
router.get("/", getAllBlogs);
router.post("/", createBlog);
router.patch("/:id/like", updateLikes);
router.delete("/:id", deleteBlog);

export default router;

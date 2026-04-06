import { Router } from "express";
import {
  getAllBlogs,
  createBlog,
  updateLikes,
} from "../controller/blogcontroller.js";
const router = new Router();
router.get("/", getAllBlogs);
router.post("/", createBlog);
router.patch("/:id/like", updateLikes);

export default router;

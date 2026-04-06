import { Router } from "express";
import {
    getAllBlogs,
    createBlog
} from "../controller/blogcontroller.js";
import { getAllUsers, createUser } from "../controller/usercontroller.js";
//Blog Routes
const router = new Router();
router.get("/", getAllBlogs);
router.post("/", createBlog);
//User Routes
router.get("/", getAllUsers);
router.post("/", createUser);

export default router;

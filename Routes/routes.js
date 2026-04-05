import { Router } from "express";
import {
    getAllBlogs,
    createBlog
} from "../controller/blogcontroller.js";
//const router = express.Router()
const router = new Router();
router.get("/", getAllBlogs);
// router.get("/:id", getPersonById);
router.post("/", createBlog);
// router.delete("/:id", deletePerson);
// router.patch("/:id", personcontroller.updateTour);
export default router;

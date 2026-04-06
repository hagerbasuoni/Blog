import { Router } from "express";
import { getAllUsers, createUser } from "../controller/usercontroller.js";

const userRouter = new Router();
//User Routes
userRouter.get("/", getAllUsers);
userRouter.post("/", createUser);

export default userRouter;

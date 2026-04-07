import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Router } from "express";
import User from "../models/user.js";
const loginRouter = new Router();
loginRouter.post("/", async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    //make sure the password is correct 
    const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.passwordHash);
    if (!(user && passwordCorrect)) {
        const msg = res.status(401).json({ error: "invalid username or password" })
        return msg
    }
    const userForToken = {
        username: user.username,
        id:user._id,
    }
    //token Generation
    const token = jwt.sign(userForToken, process.env.SECRET);
    res
      .status(200)
      .send({ token, username: user.username, name: user.name });
})
export default loginRouter;
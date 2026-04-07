import User from "../models/user.js";
import bcrypt from "bcrypt";
const getAllUsers = async (req, res,next) => {
  try {
    const Users = await User.find().populate("blogs", {
      url: 1,
      title: 1,
      author: 1,
    });
    res.status(200).json({
      status: "success",
      result: Users.length,
      data: { Users },
    });
  } catch (err) {
    next(err)
  }
};
const createUser = async (req, res,next) => {
    try {
        const { name, username, password } = req.body;
        if (!password || password.length < 3) {
            const msg = res.status(400).json({
                error: "password must be at least 3 characters long"
            });
            return msg;
        }
        if (!username || username.length < 3) {
            const msg2 = res.status(400).json({
                error: "username must be at least 3 characters long"
            });
          return msg2
        }
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);
        const newUser = await User.create({
          username,
          name,
          passwordHash,
        });
    res.status(201).json({
      status: "success",
      data: { newUser },
    });
  } catch (err) {
    next(err)
  
  }
};
export { createUser, getAllUsers };

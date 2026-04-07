import User from "../models/user.js";
import jwt from "jsonwebtoken";
const userExtractor = async (req, res, next) => {
    if (req.token) {
        const decodedToken = await jwt.verify(req.token, process.env.SECRET, {expiresIn: "6h", });
        if(decodedToken.id){
            req.user = await User.findById(decodedToken.id)
        }
    }
    next()
}
const tokenExtractor= (req,res,next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    req.token= authorization.replace("Bearer ", "");
  } else {
    req.token = null;
  }
  next();
}
const errorHandler = (req, res, next, error) => {
    console.error(error.message); 

    if (error.name === "CastError") {
      return res.status(400).send({ error: "malformatted id" });
    } else if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "token invalid" });
    } else if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "token expired" });
    }
    next(error);
}
export { userExtractor, tokenExtractor, errorHandler };
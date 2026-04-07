import express from "express";
import router from "./Routes/routes.js";
import userRouter from "./Routes/userRoutes.js";
import mongoose from "mongoose";
import loginRouter from "./controller/login.js";
if (process.argv.length < 3) {
  console.log("give password as an argument");
  process.exit(1);
}
const password = process.argv[2];
const DB = process.env.DATABASE.replace("<PASSWORD>", password);
mongoose
  .connect(DB, { family: 4 })
  .then((c) => {
    console.log("Connected");
  })
  .catch((e) => {
    console.log("Connected failed", e);
  });
const app = express();
app.use(express.json());
app.use('/api/blogs', router);
app.use("/api/users", userRouter);
app.use("/api/login", loginRouter);
app.listen(process.env.PORT, () => {
  console.log(`App running on port ${process.env.PORT}...`);
});

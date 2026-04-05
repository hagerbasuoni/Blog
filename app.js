import express from "express";
import router from "./Routes/routes.js";
const app = express();
app.use(express.json());
app.use('/api/blogs', router);
app.listen(process.env.PORT, () => {
  console.log(`App running on port ${process.env.PORT}...`);
});

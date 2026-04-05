import mongoose from "mongoose";
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
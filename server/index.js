import express from "express";
import dotenv from "dotenv";
import todoRouter from "./routes/todo.routes.js";
import authRouter from "./routes/auth.routes.js";
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use("/api/auth", authRouter);
app.use("/api/todo", todoRouter);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.get("/", function (req, res) {
  res.send("Welcome to test route");
});

app.listen(port, () => {
  console.log(`Server is running on port:${port}`);
});

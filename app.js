import express from "express";
import db_connection from "./DB/connection.js";
import userRouter from "./src/modules/Users/user.route.js";
import taskRouter from "./src/modules/Tasks/task.route.js";
import { config } from "dotenv";
import { globalResponse } from "./src/middlewares/globalResponse.js";
config({ path: "./config/dev.config.env" });

const app = express();

app.use(express.json());

app.use("/uploads", express.static("uploads"));
app.use("/users", userRouter);
app.use("/tasks", taskRouter);

app.use(globalResponse);

db_connection();
app.listen(process.env.PORT, () => {
  console.log("listening in Port: " + process.env.PORT);
});

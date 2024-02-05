import { Router } from "express";
import EAH from "express-async-handler";
import * as tc from "./task.controller.js";
import { auth } from "../../middlewares/authmiddleware.js";
import { validationMiddleWare } from "../../middlewares/validation.middleware.js";
import {
  addTaskSchema,
  deleteTaskSchema,
  getTasksSchema,
  updateTaskSchema,
} from "./task.validation.js";
import { multerMiddle } from "../../middlewares/multer.js";
import { allowedExtensions } from "../../utils/allowedExtensions.js";

const router = Router();

router.post(
  "/addTask",
  auth(),
  multerMiddle({
    extensions: allowedExtensions.image,
  }).array("image", 3),
  validationMiddleWare(addTaskSchema),
  EAH(tc.addTask)
);

router.put(
  "/updateTask",
  auth(),
  validationMiddleWare(updateTaskSchema),
  EAH(tc.updateTask)
);

router.delete(
  "/deleteTask",
  auth(),
  validationMiddleWare(deleteTaskSchema),
  EAH(tc.deleteTask)
);

router.get("/getAllTasks", EAH(tc.getAllTasks));

router.get(
  "/getAllTasksUser",
  auth(),
  validationMiddleWare(getTasksSchema),
  EAH(tc.getAllTasksUser)
);

router.get(
  "/getAllTasksWithUserData",
  auth(),
  validationMiddleWare(getTasksSchema),
  EAH(tc.getAllTasksWithUserData)
);

router.get(
  "/getAllTasksNotDone",
  auth(),
  validationMiddleWare(getTasksSchema),
  EAH(tc.getAllTasksNotDone)
);

router.post(
  "/image",
  auth(),
  multerMiddle({
    extensions: allowedExtensions.image,
  }).array("picture"),
  EAH(tc.uploadFile)
);
export default router;

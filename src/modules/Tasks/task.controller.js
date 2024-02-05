import { createDocument } from "../../../DB/dbMethods.js";
import Task from "../../../DB/models/task.model.js";
import User from "../../../DB/models/user.model.js";
import generateUniqueString from "../../utils/generateUniqueString.js";
import cloudinaryConnection from "../../utils/cloudinary.js";

//=============================== Add Task ============================//
/**
 * destructuring data from req.body
 * destructuring data from req.authUser (loggedInUser)
 * if not found user return error
 * check user send for email exist
 * if email not found return error
 * create new task
 * if task not creates return error
 * return success response
 */
export const addTask = async (req, res, next) => {
  const { title, description, status, assignTo, deadline } = req.body;
  const { _id } = req.authUser;

  if (!_id) return next(new Error("Please Login first", { cause: 400 }));

  const isEmailExist = await User.findOne({ email: assignTo });
  if (!isEmailExist) {
    return next(new Error("This mail you send is not there", { cause: 400 }));
  }

  if (!req.files?.length)
    return next(new Error("Please upload at least one image", { cause: 400 }));
  let Images = [];
  let publicIdsArr = [];

  const folderId = generateUniqueString(5);
  for (const file of req.files) {
    const { secure_url, public_id } =
      await cloudinaryConnection().uploader.upload(file.path, {
        folder: `upVoteImages/products/${_id}/${folderId}`,
      });
    publicIdsArr.push(public_id);
    Images.push({ secure_url, public_id, folderId });
  }

  const task = await createDocument(Task, {
    title,
    description,
    status,
    userID: _id,
    assignTo: isEmailExist._id,
    deadline: new Date(deadline),
    Images,
  });

  if (!task) {
    const data = await cloudinaryConnection().api.delete_resources(
      publicIdsArr
    );
    return next(new Error("task not created", { cause: 400 }));
  }
  res.status(200).json({ message: "Task created successfully", task });
};

//=============================== Update Task ============================//
/**
 * destructuring data fromreq.query
 * destructuring data from req.body
 * destructuring data from req.authUser (loggedInUser)
 * find task
 * if task not exist return error
 * if not user'task need to edit task return error => Authorization
 * check you will send task for user exist
 * if not user exist return error
 * update task
 * if task not update task return error
 * return success response
 */
export const updateTask = async (req, res, next) => {
  const { idTask } = req.query;
  const { title, description, status, assignTo } = req.body;
  const { _id } = req.authUser;
  const task = await Task.findById(idTask);
  if (!task) return next(new Error("Task not found", { cause: 400 }));
  if (!task.userID.equals(_id)) {
    return next(new Error("You cannot Update", { cause: 400 }));
  }
  const sendTo = await User.findOne({ email: assignTo });
  if (!sendTo) {
    return next(new Error("This Email Not Found", { cause: 400 }));
  }
  const taskUpdate = await Task.findByIdAndUpdate(
    { _id: idTask },
    { title, description, status, assignTo: sendTo._id },
    { new: true }
  );
  if (!taskUpdate) {
    return next(new Error("Task Not Updated", { cause: 400 }));
  }
  res.status(200).json({ message: "Task updated successfully", taskUpdate });
};

//=============================== Delete Task ============================//
/**
 * destructuring data fromreq.query
 * destructuring data from req.authUser (loggedInUser)
 * find task
 * if not user'task need to edit task return error => Authorization
 * find task and delete
 * if not deleted task return error
 * return success response
 */
export const deleteTask = async (req, res, next) => {
  const { idTask } = req.query;
  const { _id } = req.authUser;

  const task = await Task.findById(idTask);
  if (!task.userID.equals(_id)) {
    return next(new Error("You cannot delete", { cause: 400 }));
  }

  const deletedTask = await Task.deleteOne({ _id: idTask });
  if (!deletedTask) {
    return next(new Error("Task not deleted", { cause: 400 }));
  }

  let publicIdsArr = [];
  // delete images from cloudinary
  for (const image of task.Images) {
    publicIdsArr.push(image.public_id);
    await cloudinaryConnection().uploader.destroy(image.public_id)
  }
  await cloudinaryConnection().api.delete_resources(publicIdsArr);

  res.status(200).json({ message: "Task deleted successfully", deletedTask });
};

//=============================== Get All Tasks ============================//
/**
 * find all tasks
 * if not found tasks return error
 * return success response
 */
export const getAllTasks = async (req, res, next) => {
  const allTasks = await Task.find();
  if (!allTasks.length)
    return next(new Error("Task not found", { cause: 400 }));
  res.status(200).json({ message: "All tasks", allTasks });
};

//=============================== Get All Tasks User ============================//
/**
 * destructuring data from req.authUser (loggedInUser)
 * find all tasks for user
 * if not found tasks return error
 * return success response
 */
export const getAllTasksUser = async (req, res, next) => {
  const { _id } = req.authUser;
  const alltasksUser = await Task.find({ userID: _id });
  if (!alltasksUser.length) {
    return next(new Error("Task not found For This User", { cause: 400 }));
  }
  res.status(200).json({ message: "All tasks", alltasksUser });
};

//=============================== Get All Tasks With User Data ============================//
/**
 * destructuring data from req.authUser (loggedInUser)
 * find all tasks user with user data
 * if not found return error
 * return success response
 */
export const getAllTasksWithUserData = async (req, res, next) => {
  const { _id } = req.authUser;
  const tasks = await Task.find({ userID: _id }).populate({ path: "userID" });
  if (!tasks.length) {
    return next(new Error("Task not found", { cause: 400 }));
  }
  res.status(200).json({ messages: "Tasks User", tasks });
};

//=============================== Get All Tasks Not Done ============================//
/**
 * destructuring data from req.authUser (loggedInUser)
 * find all tasks with { feild => (toDo || dong) } && { deadline is finished }
 * if not found return error
 * return success response
 */
export const getAllTasksNotDone = async (req, res, next) => {
  const { _id } = req.authUser;
  const allTasksNotDone = await Task.find({
    $or: [{ status: "toDo" }, { status: "doing" }],
    deadline: { $lt: new Date() },
  });
  if (!allTasksNotDone)
    return next(new Error("Not Found Tasks", { cause: 400 }));
  res.status(200).json({ message: "Tasks", allTasksNotDone });
};

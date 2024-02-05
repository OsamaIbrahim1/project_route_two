import Joi from "joi";

export const addTaskSchema = {
  body: Joi.object({
    title: Joi.string().alphanum().required(),
    description: Joi.string().min(20).required(),
    status: Joi.string().valid("toDo", "doing", "done"),
    assignTo: Joi.string().email().required(),
    deadline: Joi.date().required(),
  }),
  headers: Joi.object({
    accesstoken: Joi.string().trim().required(),
  }).options({
    allowUnknown: true,
  }),
};

export const updateTaskSchema = {
  query: Joi.object({
    idTask: Joi.string().trim().required(),
  }),
  body: Joi.object({
    title: Joi.string().alphanum(),
    description: Joi.string().min(20),
    status: Joi.string().valid("toDo", "doing", "done"),
    assignTo: Joi.string().email(),
    deadline: Joi.date(),
  }),
  headers: Joi.object({
    accesstoken: Joi.string().trim().required(),
  }).options({
    allowUnknown: true,
  }),
};

export const deleteTaskSchema = {
  query: Joi.object({
    idTask: Joi.string().trim().required(),
  }),
  headers: Joi.object({
    accesstoken: Joi.string().trim().required(),
  }).options({
    allowUnknown: true,
  }),
};

export const getTasksSchema = {
  headers: Joi.object({
    accesstoken: Joi.string().trim().required(),
  }).options({
    allowUnknown: true,
  }),
};

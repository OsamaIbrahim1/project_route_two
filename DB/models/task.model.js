import mongoose, { Schema, model } from "mongoose";

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["toDo", "doing", "done"],
      default: "toDo",
    },
    userID: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    assignTo: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    deadline: {
      type: Date,
      default: Date.now,
    },
    Images: [
      {
        secure_url: {
          type: String,
          required: true,
        },

        public_id: {
          type: String,
          required: true,
          unique: true,
        },
        folderId: {
          type: String,
          required: true,
          unique: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const Task = model("Task", taskSchema);

export default Task;

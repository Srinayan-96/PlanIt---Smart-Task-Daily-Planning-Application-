const mongoose = require("mongoose");




const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required!"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters long"],
    },
    completed: {
      type: Boolean,
      default: false,
    },
    // Optional date by which the user plans to complete this task.
    dueDate: {
      type: Date,
    },
    // Optional reminder timestamp to support custom reminders.
    reminderAt: {
      type: Date,
    },
  },
  { timestamps: true }
);






module.exports = mongoose.model("Task", taskSchema);

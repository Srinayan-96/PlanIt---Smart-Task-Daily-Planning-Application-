const Task = require("../models/Task");


const getTasks = async (req, res, next) => {
  try {
    // Sort by due date first (for planning), then by creation time.
    const tasks = await Task.find()
      .sort({ dueDate: 1, createdAt: 1 })
      .lean();
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};


const updateTask = async(req, res,next) => {
    try{
        const { id } = req.params;

        const task = await Task.findByIdAndUpdate(
            id,
            req.body,
            {new: true}
        );

        if (!task) {
            const error = new Error("Task not found");
            error.statusCode = 404;
            throw error;
        }

        res.json(task);

    }
    catch(err){
        next(err)
    }
    
};


const deleteTask = async (req, res, next) => {
    try {
        const { id } = req.params;

        const task = await Task.findByIdAndDelete(id);

        if (!task) {
            const error = new Error("Task not found");
            error.statusCode = 404;
            throw error;
        }

        res.json({ message: "Task deleted", task });
    } catch (err) {
        next(err)
    }
};



const addTask = async (req, res, next) => {
  try {
    const { title, dueDate, reminderAt } = req.body;

    if (!title) {
      const error = new Error("Title is required");
      error.statusCode = 400;
      throw error;
    }

    const payload = {
      title,
    };

    if (dueDate) {
      payload.dueDate = dueDate;
    }

    if (reminderAt) {
      payload.reminderAt = reminderAt;
    }

    const task = await Task.create(payload);
    console.log("New Task Added:", task.title);

    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

const toggleTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);

    if (!task) {
      const error = new Error("Task not found");
      error.statusCode = 404;
      throw error;
    }

    task.completed = !task.completed;
    await task.save();

    res.json(task);
  } catch (err) {
    next(err);
  }
};






module.exports = { getTasks, addTask, updateTask, deleteTask, toggleTask};

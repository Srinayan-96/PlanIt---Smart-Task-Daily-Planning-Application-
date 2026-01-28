import { useState } from "react";
import { addTask } from "./api";

function TodoInput({ setTasks }) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [reminderTime, setReminderTime] = useState("");

  function handleAdd() {
    if (title.trim() === "") return;

    const payload = {
      title: title.trim(),
    };

    if (dueDate) {
      payload.dueDate = dueDate;
    }

    if (reminderTime) {
      // Combine due date + time if both are present, otherwise just use time.
      // The backend stores a single Date in reminderAt.
      const baseDate = dueDate || new Date().toISOString().slice(0, 10);
      payload.reminderAt = new Date(`${baseDate}T${reminderTime}`).toISOString();
    }

    addTask(payload)
      .then((res) => {
        setTasks((prev) => [...prev, res.data]);
        setTitle("");
        setDueDate("");
        setReminderTime("");
      })
      .catch((err) => console.error("Add error:", err));
  }

  return (
    <div className="todo-input">
      <div className="todo-input-main">
        <input
          type="text"
          placeholder="What do you want to get done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button onClick={handleAdd}>Add Task</button>
      </div>

      <div className="todo-input-meta">
        <div className="field">
          <label>Plan for</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <div className="field">
          <label>Reminder at</label>
          <input
            type="time"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

export default TodoInput;

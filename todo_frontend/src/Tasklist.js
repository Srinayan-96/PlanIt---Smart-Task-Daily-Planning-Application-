import { useMemo, useState, useEffect } from "react";
import { deleteTask, toggleTask } from "./api";

function formatDate(value) {
  if (!value) return "";
  const d = new Date(value);
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatTime(value) {
  if (!value) return "";
  const d = new Date(value);
  return d.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Tasklist({ tasks, setTasks }) {
  const [filter, setFilter] = useState("today");
  const [now, setNow] = useState(new Date());

  // Light "real-time" updates: tick every minute so reminders visually update.
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const todaySummary = useMemo(() => {
    const todayStr = now.toISOString().slice(0, 10);

    let plannedToday = 0;
    let completedToday = 0;

    tasks.forEach((task) => {
      const due = task.dueDate ? new Date(task.dueDate) : null;
      const dueStr = due ? due.toISOString().slice(0, 10) : null;

      if (!due || dueStr === todayStr) {
        if (task.completed) {
          completedToday += 1;
        } else {
          plannedToday += 1;
        }
      }
    });

    return { plannedToday, completedToday };
  }, [tasks, now]);

  const filteredTasks = useMemo(() => {
    const todayStr = now.toISOString().slice(0, 10);

    return tasks.filter((task) => {
      const due = task.dueDate ? new Date(task.dueDate) : null;
      const dueStr = due ? due.toISOString().slice(0, 10) : null;

      if (filter === "completed") {
        return task.completed;
      }

      if (filter === "upcoming") {
        if (!due) return false;
        return dueStr > todayStr && !task.completed;
      }

      // "today" – either explicitly today or undated and not completed.
      if (!due && !task.completed) return true;
      return dueStr === todayStr && !task.completed;
    });
  }, [tasks, filter, now]);

  const handleDelete = (id) => {
    deleteTask(id).then(() => {
      setTasks((prev) => prev.filter((task) => task._id !== id));
    });
  };

  const handleToggle = (id) => {
    toggleTask(id).then((res) => {
      setTasks((prev) =>
        prev.map((t) => (t._id === id ? res.data : t))
      );
    });
  };

  const isReminderDue = (task) => {
    if (!task.reminderAt) return false;
    return new Date(task.reminderAt) <= now && !task.completed;
  };

  const anyReminderDue = useMemo(
    // eslint-disable-next-line react-hooks/exhaustive-deps
    () => tasks.some((t) => isReminderDue(t)),
    [tasks, now]
  );

  return (
    <section className="task-section">
      {anyReminderDue && (
        <div className="reminder-banner">
          <span className="dot" />
          You have tasks with reminders due now. Check your list.
        </div>
      )}

      <div className="task-header">
        <div className="task-header-left">
          <h2>Your Plan</h2>
          <div className="today-overview">
            <span className="pill">
              Planned today: {todaySummary.plannedToday}
            </span>
            <span className="pill muted">
              Completed today: {todaySummary.completedToday}
            </span>
          </div>
        </div>
        <div className="task-filters">
          <button
            className={filter === "today" ? "active" : ""}
            onClick={() => setFilter("today")}
          >
            Today
          </button>
          <button
            className={filter === "upcoming" ? "active" : ""}
            onClick={() => setFilter("upcoming")}
          >
            Upcoming
          </button>
          <button
            className={filter === "completed" ? "active" : ""}
            onClick={() => setFilter("completed")}
          >
            Completed
          </button>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <p className="empty-state">Nothing here yet. Add a task to start planning.</p>
      ) : (
        <ul className="todo-list">
          {filteredTasks.map((task) => {
            const highlightReminder = isReminderDue(task);

            return (
              <li
                key={task._id}
                className={`todo-item ${
                  task.completed ? "completed" : ""
                } ${highlightReminder ? "reminder-due" : ""}`}
              >
                <div className="todo-main">
                  <input
                    type="checkbox"
                    checked={!!task.completed}
                    onChange={() => handleToggle(task._id)}
                  />
                  <span className="todo-title">{task.title}</span>
                </div>

                <div className="todo-meta">
                  {task.dueDate && (
                    <span className="chip">
                      Due {formatDate(task.dueDate)}
                    </span>
                  )}
                  {task.reminderAt && (
                    <span className="chip reminder">
                      Reminds at {formatTime(task.reminderAt)}
                    </span>
                  )}
                </div>

                <button
                  className="delete-btn"
                  onClick={() => handleDelete(task._id)}
                >
                  ❌
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default Tasklist;

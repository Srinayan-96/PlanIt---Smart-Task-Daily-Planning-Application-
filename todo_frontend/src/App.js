import "./App.css";
import { useState, useEffect } from "react";
import TodoInput from "./TodoInput";
import Tasklist from "./Tasklist";
import { getTasks } from "./api";

function App() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    getTasks()
      .then((res) => {
        setTasks(res.data);
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  return (
    <div className="app-root">
      <header className="app-header">
        <h1>PlanIt – Smart Daily Planner</h1>
        <p>
          Plan, track, and manage your day with tasks, due dates, and custom
          reminders.
        </p>
      </header>

      <main>
        <TodoInput setTasks={setTasks} />
        <Tasklist tasks={tasks} setTasks={setTasks} />
      </main>
    </div>
  );
}

export default App;

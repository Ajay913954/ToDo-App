import { useState, useEffect } from "react";

export default function App() {
  const [input, setInput] = useState("");
  const [todos, setTodos] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const [darkMode, setDarkMode] = useState(() => {
    return (
      JSON.parse(localStorage.getItem("darkMode")) ||
      false
    );
  });

  // Dark Mode Save
  useEffect(() => {
    localStorage.setItem(
      "darkMode",
      JSON.stringify(darkMode)
    );
  }, [darkMode]);

  // Load Todos
  useEffect(() => {
    const savedTodos =
      JSON.parse(localStorage.getItem("todos")) || [];

    setTodos(savedTodos);
  }, []);

  // Save Todos
  useEffect(() => {
    localStorage.setItem(
      "todos",
      JSON.stringify(todos)
    );
  }, [todos]);

  const addTask = () => {
    if (!input.trim()) return;

    const duplicate = todos.some(
      (todo) =>
        todo.text.toLowerCase() ===
        input.trim().toLowerCase()
    );

    if (duplicate) {
      alert("Task already exists!");
      return;
    }

    const newTodo = {
      id: Date.now(),
      text: input.trim(),
      isCompleted: false,
      createdAt: new Date().toLocaleString(),
    };

    setTodos((prevTodos) => [
      ...prevTodos,
      newTodo,
    ]);

    setInput("");
  };

  const deleteTask = (id) => {
    setTodos((prevTodos) =>
      prevTodos.filter(
        (todo) => todo.id !== id
      )
    );
  };

  const editTask = (todo) => {
    setEditId(todo.id);
    setEditText(todo.text);
  };

  const saveTask = (id) => {
    if (!editText.trim()) return;

    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id
          ? {
            ...todo,
            text: editText.trim(),
          }
          : todo
      )
    );

    setEditId(null);
    setEditText("");
  };

  const toggleComplete = (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id
          ? {
            ...todo,
            isCompleted:
              !todo.isCompleted,
          }
          : todo
      )
    );
  };

  const clearCompleted = () => {
    setTodos((prevTodos) =>
      prevTodos.filter(
        (todo) => !todo.isCompleted
      )
    );
  };

  const filteredTodos = todos
    .filter((todo) => {
      if (filter === "completed")
        return todo.isCompleted;

      if (filter === "pending")
        return !todo.isCompleted;

      return true;
    })
    .filter((todo) =>
      todo.text
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .sort(
      (a, b) =>
        Number(a.isCompleted) -
        Number(b.isCompleted)
    );

  const completedCount = todos.filter(
    (todo) => todo.isCompleted
  ).length;

  const pendingCount =
    todos.length - completedCount;

  return (
    <div
      className={`container ${darkMode ? "dark" : ""
        }`}
    >
      <h1>✅ ToDo App</h1>

      <button
        className="theme-btn"
        onClick={() =>
          setDarkMode(!darkMode)
        }
      >
        {darkMode
          ? "☀️ Light Mode"
          : "🌙 Dark Mode"}
      </button>

      <div className="stats">
        <p>Total: {todos.length}</p>
        <p>Completed: {completedCount}</p>
        <p>Pending: {pendingCount}</p>
      </div>

      <div className="input-group">
        <input
          type="text"
          placeholder="Enter Your Task..."
          value={input}
          onChange={(e) =>
            setInput(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addTask();
            }
          }}
        />

        <button onClick={addTask}>
          Add Task
        </button>
      </div>

      <div className="input-group">
        <input
          type="text"
          placeholder="🔍 Search Tasks..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />
      </div>

      <div className="filters">
        <button
          className={
            filter === "all"
              ? "active-filter"
              : ""
          }
          onClick={() =>
            setFilter("all")
          }
        >
          All
        </button>

        <button
          className={
            filter === "completed"
              ? "active-filter"
              : ""
          }
          onClick={() =>
            setFilter("completed")
          }
        >
          Completed
        </button>

        <button
          className={
            filter === "pending"
              ? "active-filter"
              : ""
          }
          onClick={() =>
            setFilter("pending")
          }
        >
          Pending
        </button>

        <button
          onClick={clearCompleted}
        >
          Clear Completed
        </button>
      </div>

      {filteredTodos.length === 0 && (
        <p className="empty">
          No tasks found 🔍
        </p>
      )}

      <ul>
        {filteredTodos.map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.isCompleted}
              onChange={() =>
                toggleComplete(todo.id)
              }
            />

            {editId === todo.id ? (
              <>
                <input
                  value={editText}
                  onChange={(e) =>
                    setEditText(
                      e.target.value
                    )
                  }
                  onKeyDown={(e) => {
                    if (
                      e.key === "Enter"
                    ) {
                      saveTask(todo.id);
                    }
                  }}
                />

                <button
                  style={{
                    background: "#22c55e",
                    color: "white",
                    border: "none",
                    padding: "10px 16px",
                    borderRadius: "10px",
                    cursor: "pointer"
                  }}
                  onClick={() => saveTask(todo.id)}
                >
                  Save
                </button>
              </>
            ) : (
              <>
                <div className="todo-content">
                  <span
                    style={{
                      textDecoration:
                        todo.isCompleted
                          ? "line-through"
                          : "none",
                      opacity:
                        todo.isCompleted
                          ? 0.6
                          : 1,
                    }}
                  >
                    {todo.text}
                  </span>

                  <small className="date">
                    📅 {todo.createdAt}
                  </small>
                </div>

                <div className="action-buttons">
                  <button
                    onClick={() =>
                      editTask(todo)
                    }
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      deleteTask(
                        todo.id
                      )
                    }
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
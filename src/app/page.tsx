"use client";

import { useState, useEffect } from "react";
import { Trash2, Edit3, CheckCircle2, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Task = {
  id: number;
  text: string;
  category: string;
  priority: string;
  dueDate: string | null;
  completed: boolean;
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [text, setText] = useState("");
  const [category, setCategory] = useState("Personal");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState<string | null>(null);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("tasks");
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!text.trim()) return;
    const newTask: Task = {
      id: Date.now(),
      text,
      category,
      priority,
      dueDate,
      completed: false,
    };
    setTasks([...tasks, newTask]);
    setText("");
    setCategory("Personal");
    setPriority("Medium");
    setDueDate(null);
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === "Completed" && !task.completed) return false;
    if (filter === "Active" && task.completed) return false;
    if (filter === "High" && task.priority !== "High") return false;
    if (search && !task.text.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const priorityColor = (p: string) => {
    switch (p) {
      case "High": return "bg-red-100 border-red-400";
      case "Medium": return "bg-yellow-100 border-yellow-400";
      case "Low": return "bg-green-100 border-green-400";
      default: return "bg-gray-100 border-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-4">To-Do List</h1>

      {/* Add Task Form */}
      <div className="w-full max-w-xl bg-white shadow-md rounded-lg p-4 mb-6">
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            placeholder="Enter task..."
            value={text}
            onChange={e => setText(e.target.value)}
            className="flex-1 border p-2 rounded-lg"
          />
          <button
            onClick={addTask}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="border p-2 rounded-lg"
          >
            <option>Personal</option>
            <option>Work</option>
            <option>Study</option>
            <option>Other</option>
          </select>
          <select
            value={priority}
            onChange={e => setPriority(e.target.value)}
            className="border p-2 rounded-lg"
          >
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
          <input
            type="date"
            value={dueDate ?? ""}
            onChange={e => setDueDate(e.target.value)}
            className="border p-2 rounded-lg"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        {["All", "Active", "Completed", "High"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-lg border ${
              filter === f ? "bg-blue-500 text-white" : "bg-white"
            }`}
          >
            {f}
          </button>
        ))}
        <div className="flex items-center border rounded-lg px-2">
          <Search size={16} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="p-1 outline-none"
          />
        </div>
      </div>

      {/* Task List */}
      <div className="w-full max-w-xl space-y-3">
        <AnimatePresence>
          {filteredTasks.map(task => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`flex items-center justify-between p-3 border rounded-lg ${priorityColor(
                task.priority
              )}`}
            >
              <div className="flex flex-col">
                <span
                  onClick={() => toggleTask(task.id)}
                  className={`cursor-pointer font-medium ${
                    task.completed ? "line-through text-gray-500" : ""
                  }`}
                >
                  {task.text}
                </span>
                <span className="text-sm text-gray-600">
                  {task.category} • {task.priority}{" "}
                  {task.dueDate && `• Due: ${task.dueDate}`}
                </span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => toggleTask(task.id)}>
                  <CheckCircle2 className="text-green-600" />
                </button>
                <button onClick={() => deleteTask(task.id)}>
                  <Trash2 className="text-red-600" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

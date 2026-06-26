require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB, inMemoryDB } = require("./db");
const taskRoutes = require("./taskRoutes");

const app = express();

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/tasks", taskRoutes);

// ─── Health check ─────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Student Portal API is running",
    db: inMemoryDB.connected ? "MySQL" : "in-memory",
  });
});

// ─── Shared sample task builder ───────────────────────────────────────────────
const buildSampleTasks = () => {
  const today = new Date();
  const d = (offsetDays) => {
    const dt = new Date(today);
    dt.setDate(dt.getDate() + offsetDays);
    return dt.toISOString().slice(0, 10);
  };
  return [
    { title: "Design Database Schema",    description: "Create ER diagram and define all tables for the student portal system.", status: "Completed",   dueDate: d(-16) },
    { title: "Setup Express REST API",    description: "Initialize Node.js project, configure Express server, add middleware and define routes.", status: "Completed",   dueDate: d(-14) },
    { title: "Build React Frontend",      description: "Create Vite + React app with Tailwind CSS. Build all components.", status: "Completed",   dueDate: d(-11) },
    { title: "Implement Dark Mode",       description: "Add dark mode toggle with localStorage persistence.", status: "Completed",   dueDate: d(-10) },
    { title: "Add Search and Filter",     description: "Implement debounced search by title/description and filter by status.", status: "In Progress", dueDate: d(2)  },
    { title: "Integrate Axios API Calls", description: "Connect frontend to backend using Axios with centralized error handling.", status: "In Progress", dueDate: d(4)  },
    { title: "Write Unit Tests",          description: "Write tests for all API endpoints using Jest and Supertest.", status: "Pending",     dueDate: d(7)  },
    { title: "Deploy to Production",      description: "Deploy backend to Render and frontend to Vercel.", status: "Pending",     dueDate: d(10) },
    { title: "Add User Authentication",   description: "Implement JWT-based login and registration. Protect API routes with JWT.", status: "Pending",     dueDate: d(14) },
  ];
};

// ─── Seed endpoint ────────────────────────────────────────────────────────────
app.post("/api/seed", async (req, res) => {
  const Task = require("./taskModel");
  const { v4: uuidv4 } = require("uuid");
  const sampleTasks = buildSampleTasks();

  try {
    if (inMemoryDB.connected) {
      await Task.destroy({ where: {}, truncate: true });
      await Task.bulkCreate(sampleTasks);
    } else {
      inMemoryDB.tasks = sampleTasks.map((t) => ({
        _id: uuidv4(),
        ...t,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
    }
    res.json({ success: true, message: `Seeded ${sampleTasks.length} tasks` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── 404 handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ─── Centralized error handler ────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ success: false, message: "Internal server error", error: err.message });
});

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  // Auto-seed in-memory DB on every start so data is always available
  if (!inMemoryDB.connected) {
    const { v4: uuidv4 } = require("uuid");
    const sampleTasks = buildSampleTasks();
    inMemoryDB.tasks = sampleTasks.map((t) => ({
      _id: uuidv4(),
      ...t,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    console.log(`📦 Auto-seeded ${sampleTasks.length} sample tasks into in-memory store.`);
  }

  app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
});

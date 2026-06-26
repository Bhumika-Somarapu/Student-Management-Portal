const express = require("express");
const { body, validationResult } = require("express-validator");
const { Op } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const Task = require("./taskModel");
const { inMemoryDB } = require("./db");

const router = express.Router();

// ─── Helper ───────────────────────────────────────────────────────────────────
const usesMySQL = () => inMemoryDB.connected;

// Normalize a Sequelize row so the frontend always sees { _id, title, ... }
const normalize = (row) => {
  const obj = row.toJSON ? row.toJSON() : row;
  obj._id = String(obj.id);
  return obj;
};

// ─── Validation rules ─────────────────────────────────────────────────────────
const taskValidation = [
  body("title")
    .trim()
    .notEmpty().withMessage("Title is required")
    .isLength({ min: 3 }).withMessage("Title must be at least 3 characters")
    .isLength({ max: 100 }).withMessage("Title cannot exceed 100 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage("Description cannot exceed 500 characters"),
  body("status")
    .optional()
    .isIn(["Pending", "In Progress", "Completed"]).withMessage("Invalid status value"),
  body("dueDate")
    .optional({ nullable: true, checkFalsy: true })
    .isISO8601().withMessage("Invalid date format"),
];

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
  next();
};

// ─── GET /api/tasks ────────────────────────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const { search, status, sort } = req.query;
    const order = sort === "oldest" ? "ASC" : "DESC";

    if (usesMySQL()) {
      const where = {};
      if (status && status !== "All") where.status = status;
      if (search) {
        where[Op.or] = [
          { title:       { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } },
        ];
      }
      const rows = await Task.findAll({ where, order: [["createdAt", order]] });
      return res.json({ success: true, data: rows.map(normalize) });
    }

    // In-memory fallback
    let tasks = [...inMemoryDB.tasks];
    if (status && status !== "All") tasks = tasks.filter((t) => t.status === status);
    if (search) {
      const q = search.toLowerCase();
      tasks = tasks.filter(
        (t) => t.title.toLowerCase().includes(q) || (t.description || "").toLowerCase().includes(q)
      );
    }
    tasks.sort((a, b) =>
      order === "ASC"
        ? new Date(a.createdAt) - new Date(b.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt)
    );
    res.json({ success: true, data: tasks });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

// ─── GET /api/tasks/stats ──────────────────────────────────────────────────────
router.get("/stats", async (req, res) => {
  try {
    if (usesMySQL()) {
      const [total, pending, inProgress, completed] = await Promise.all([
        Task.count(),
        Task.count({ where: { status: "Pending" } }),
        Task.count({ where: { status: "In Progress" } }),
        Task.count({ where: { status: "Completed" } }),
      ]);
      return res.json({ success: true, data: { total, pending, inProgress, completed } });
    }

    const tasks = inMemoryDB.tasks;
    res.json({
      success: true,
      data: {
        total:      tasks.length,
        pending:    tasks.filter((t) => t.status === "Pending").length,
        inProgress: tasks.filter((t) => t.status === "In Progress").length,
        completed:  tasks.filter((t) => t.status === "Completed").length,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

// ─── GET /api/tasks/:id ────────────────────────────────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    if (usesMySQL()) {
      const task = await Task.findByPk(req.params.id);
      if (!task) return res.status(404).json({ success: false, message: "Task not found" });
      return res.json({ success: true, data: normalize(task) });
    }
    const task = inMemoryDB.tasks.find((t) => t._id === req.params.id);
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });
    res.json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

// ─── POST /api/tasks ───────────────────────────────────────────────────────────
router.post("/", taskValidation, handleValidation, async (req, res) => {
  try {
    const { title, description, status, dueDate } = req.body;

    if (usesMySQL()) {
      const task = await Task.create({ title, description, status, dueDate: dueDate || null });
      return res.status(201).json({ success: true, data: normalize(task), message: "Task created successfully" });
    }

    const task = {
      _id: uuidv4(),
      title,
      description: description || "",
      status: status || "Pending",
      dueDate: dueDate || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    inMemoryDB.tasks.push(task);
    res.status(201).json({ success: true, data: task, message: "Task created successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

// ─── PUT /api/tasks/:id ────────────────────────────────────────────────────────
router.put("/:id", taskValidation, handleValidation, async (req, res) => {
  try {
    const { title, description, status, dueDate } = req.body;

    if (usesMySQL()) {
      const task = await Task.findByPk(req.params.id);
      if (!task) return res.status(404).json({ success: false, message: "Task not found" });
      await task.update({ title, description, status, dueDate: dueDate || null });
      return res.json({ success: true, data: normalize(task), message: "Task updated successfully" });
    }

    const idx = inMemoryDB.tasks.findIndex((t) => t._id === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, message: "Task not found" });
    inMemoryDB.tasks[idx] = {
      ...inMemoryDB.tasks[idx],
      title,
      description: description || "",
      status: status || inMemoryDB.tasks[idx].status,
      dueDate: dueDate || null,
      updatedAt: new Date().toISOString(),
    };
    res.json({ success: true, data: inMemoryDB.tasks[idx], message: "Task updated successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

// ─── DELETE /api/tasks/:id ─────────────────────────────────────────────────────
router.delete("/:id", async (req, res) => {
  try {
    if (usesMySQL()) {
      const task = await Task.findByPk(req.params.id);
      if (!task) return res.status(404).json({ success: false, message: "Task not found" });
      await task.destroy();
      return res.json({ success: true, message: "Task deleted successfully" });
    }

    const idx = inMemoryDB.tasks.findIndex((t) => t._id === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, message: "Task not found" });
    inMemoryDB.tasks.splice(idx, 1);
    res.json({ success: true, message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

module.exports = router;

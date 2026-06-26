require("dotenv").config();
const { connectDB, inMemoryDB } = require("./db");
const Task = require("./taskModel");

const today = new Date();
const d = (offsetDays) => {
  const dt = new Date(today);
  dt.setDate(dt.getDate() + offsetDays);
  return dt.toISOString().slice(0, 10);
};

const sampleTasks = [
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

const seed = async () => {
  await connectDB();

  if (inMemoryDB.connected) {
    await Task.destroy({ where: {}, truncate: true });
    await Task.bulkCreate(sampleTasks);
    console.log(`✅ Seeded ${sampleTasks.length} tasks to MySQL`);
  } else {
    console.log("ℹ️  MySQL not available. Start backend and use POST /api/seed instead.");
  }

  process.exit(0);
};

seed();

# 🎓 Student Mini Project Management Portal

A full-stack task management portal built with **React + Vite + Tailwind CSS** (frontend) and **Express + Node.js + MongoDB** (backend).

---

## ✨ Features

| Feature | Details |
|---|---|
| Task CRUD | Create, Read, Update, Delete tasks |
| Dashboard Stats | Total, Pending, In Progress, Completed |
| Search | Search tasks by title and description |
| Filter | Filter by status (All / Pending / In Progress / Completed) |
| Sort | Sort by created date (Newest / Oldest) |
| Dark Mode | Toggle with localStorage persistence |
| REST API | Axios with centralized error handling |
| Validation | Client-side + server-side with express-validator |
| DB Fallback | MongoDB with automatic in-memory fallback |
| Loading States | Skeleton loaders + empty state screens |
| Notifications | Toast notifications via react-hot-toast |
| Confirmation | Modal before destructive delete actions |
| Responsive UI | Works on mobile, tablet, and desktop |

---

## 🗂️ Project Structure

```
STUDENT MANAGEMENT PORTAL/
├── backend/
│   ├── .env
│   ├── package.json
│   ├── server.js        ← Express entry point
│   ├── db.js            ← MongoDB + in-memory fallback
│   ├── taskModel.js     ← Mongoose schema
│   └── taskRoutes.js    ← REST API routes with validation
│
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── src/
        ├── main.jsx
        ├── index.css
        ├── App.jsx               ← Main component
        ├── api/taskApi.js        ← Axios instance + API calls
        ├── hooks/
        │   ├── useTasks.js       ← Task state management
        │   └── useDarkMode.js    ← Dark mode with localStorage
        └── components/
            ├── Navbar.jsx
            ├── StatCard.jsx
            ├── TaskCard.jsx
            ├── TaskModal.jsx     ← Create/Edit form
            └── ConfirmModal.jsx  ← Delete confirmation
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (optional — app falls back to in-memory storage)

### 1. Install & run the backend

```bash
cd backend
npm install
npm run dev
# Server starts at http://localhost:5000
```

### 2. Install & run the frontend

```bash
cd frontend
npm install
npm run dev
# App opens at http://localhost:5173
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tasks` | Get all tasks (supports `?search=&status=&sort=`) |
| GET | `/api/tasks/stats` | Get dashboard statistics |
| GET | `/api/tasks/:id` | Get single task |
| POST | `/api/tasks` | Create a task |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |
| GET | `/api/health` | Health check |

---

## 🛠️ Tech Stack

**Frontend:** React 18, Vite 5, Tailwind CSS 3, Axios, react-hot-toast  
**Backend:** Node.js, Express 4, Mongoose 8, express-validator, dotenv  
**Database:** MongoDB (auto-falls back to in-memory if unavailable)

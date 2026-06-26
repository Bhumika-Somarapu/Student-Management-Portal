import { useState } from "react";
import toast from "react-hot-toast";
import { useTasks } from "./hooks/useTasks";
import { useDarkMode } from "./hooks/useDarkMode";
import api from "./api/taskApi";
import Navbar from "./components/Navbar";
import StatCard from "./components/StatCard";
import TaskCard from "./components/TaskCard";
import TaskModal from "./components/TaskModal";
import ConfirmModal from "./components/ConfirmModal";

const STATUSES = ["All", "Pending", "In Progress", "Completed"];

// SVG illustration for empty state — matches screenshot style
function EmptyIllustration() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Document */}
      <rect x="15" y="10" width="40" height="52" rx="4" fill="#e0e7ff" stroke="#c7d2fe" strokeWidth="1.5"/>
      <rect x="22" y="22" width="26" height="3" rx="1.5" fill="#a5b4fc"/>
      <rect x="22" y="30" width="20" height="3" rx="1.5" fill="#a5b4fc"/>
      <rect x="22" y="38" width="16" height="3" rx="1.5" fill="#c7d2fe"/>
      {/* Pencil */}
      <rect x="44" y="44" width="8" height="22" rx="2" transform="rotate(-40 44 44)" fill="#f97316"/>
      <path d="M54 62 l-4 6 2-1 3-4z" fill="#fbbf24"/>
      <rect x="44" y="44" width="8" height="5" rx="1" transform="rotate(-40 44 44)" fill="#fb923c"/>
    </svg>
  );
}

export default function App() {
  const [darkMode, setDarkMode] = useDarkMode();
  const {
    tasks, stats, loading,
    search, setSearch,
    statusFilter, setStatusFilter,
    sortOrder, setSortOrder,
    addTask, editTask, removeTask,
    refetch,
  } = useTasks();

  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [seeding, setSeeding] = useState(false);

  const openCreate = () => { setEditingTask(null); setTaskModalOpen(true); };
  const openEdit   = (task) => { setEditingTask(task); setTaskModalOpen(true); };
  const closeModal = () => { setTaskModalOpen(false); setEditingTask(null); };

  const handleSubmit = async (data) => {
    if (editingTask) {
      await editTask(editingTask._id, data);
    } else {
      await addTask(data);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try { await removeTask(deleteId); } finally { setDeleteId(null); }
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
      await api.post("/seed");
      toast.success("9 sample tasks loaded!");
      await refetch();
    } catch {
      toast.error("Could not load sample tasks");
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      <main className="max-w-6xl mx-auto px-5 sm:px-8 py-8 space-y-8">

        {/* ── Dashboard ─────────────────────────────────────────── */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Dashboard</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Tasks"   value={stats.total}      color="blue"   iconKey="clipboard" />
            <StatCard label="Pending"        value={stats.pending}    color="yellow" iconKey="hourglass" />
            <StatCard label="In Progress"    value={stats.inProgress} color="orange" iconKey="refresh"   />
            <StatCard label="Completed"      value={stats.completed}  color="green"  iconKey="check"     />
          </div>
        </section>

        {/* ── Search / Filter / Sort ────────────────────────────── */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65" strokeLinecap="round"/>
                </svg>
              </span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title or description..."
                className="w-full pl-9 pr-8 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg leading-none"
                >×</button>
              )}
            </div>

            {/* Status filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[90px]"
            >
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>

            {/* Sort */}
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[130px]"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>

            {/* New Task button */}
            <button
              onClick={openCreate}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg whitespace-nowrap shadow-sm transition-colors"
            >
              + New Task
            </button>
          </div>
        </section>

        {/* ── Task Grid ─────────────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Tasks
              {!loading && (
                <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                  ({tasks.length})
                </span>
              )}
            </h2>
            {!loading && stats.total > 0 && (
              <button
                onClick={handleSeed}
                disabled={seeding}
                className="text-xs text-blue-500 hover:text-blue-700 underline disabled:opacity-50"
              >
                {seeding ? "Loading..." : "Reload sample tasks"}
              </button>
            )}
          </div>

          {/* Loading skeleton */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 animate-pulse">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-3" />
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-1" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                </div>
              ))}
            </div>
          )}

          {/* Empty state — matches screenshot illustration style */}
          {!loading && tasks.length === 0 && (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-600 shadow-sm">
              <div className="flex justify-center mb-4">
                {search || statusFilter !== "All" ? (
                  <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                    <circle cx="28" cy="28" r="18" stroke="#94a3b8" strokeWidth="3" fill="#f1f5f9"/>
                    <line x1="41" y1="41" x2="55" y2="55" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                ) : (
                  <EmptyIllustration />
                )}
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                {search || statusFilter !== "All" ? "No tasks match your filters" : "No tasks yet"}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                {search || statusFilter !== "All"
                  ? "Try adjusting your search or filter"
                  : "Create your first task to get started"}
              </p>
              {!search && statusFilter === "All" && (
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={openCreate}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
                  >
                    + Create Task
                  </button>
                  <button
                    onClick={handleSeed}
                    disabled={seeding}
                    className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
                  >
                    {seeding ? "Loading..." : "Load Sample Tasks"}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Task cards */}
          {!loading && tasks.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onEdit={openEdit}
                  onDelete={setDeleteId}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* ── Modals ─────────────────────────────────────────────── */}
      <TaskModal
        isOpen={taskModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        task={editingTask}
      />
      <ConfirmModal
        isOpen={!!deleteId}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
        title="Delete Task?"
        message="This will permanently delete the task. This cannot be undone."
      />
    </div>
  );
}

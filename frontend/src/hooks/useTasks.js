import { useState, useEffect, useCallback, useRef } from "react";
import toast from "react-hot-toast";
import { getTasks, getStats, createTask, updateTask, deleteTask } from "../api/taskApi";

export function useTasks() {
  const [tasks, setTasks]   = useState([]);
  const [stats, setStats]   = useState({ total: 0, pending: 0, inProgress: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortOrder, setSortOrder]   = useState("newest");

  // Ref so fetchTasks never goes stale inside callbacks
  const filtersRef = useRef({ search, statusFilter, sortOrder });
  useEffect(() => {
    filtersRef.current = { search, statusFilter, sortOrder };
  }, [search, statusFilter, sortOrder]);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const { search: s, statusFilter: sf, sortOrder: so } = filtersRef.current;
      const params = { sort: so };
      if (s)          params.search = s;
      if (sf !== "All") params.status = sf;
      const [data, statsData] = await Promise.all([getTasks(params), getStats()]);
      setTasks(data);
      setStats(statsData);
    } catch (err) {
      toast.error(err.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, []); // stable — never recreated

  // Re-fetch whenever filters change (with debounce for search)
  useEffect(() => {
    const delay = search ? 300 : 0;
    const timer = setTimeout(fetchTasks, delay);
    return () => clearTimeout(timer);
  }, [search, statusFilter, sortOrder, fetchTasks]);

  // ── CRUD ─────────────────────────────────────────────────────
  const addTask = async (taskData) => {
    const data = await createTask(taskData); // throws on error — modal catches it
    toast.success("Task created!");
    await fetchTasks();                      // refresh list + stats
    return data;
  };

  const editTask = async (id, taskData) => {
    const data = await updateTask(id, taskData);
    toast.success("Task updated!");
    await fetchTasks();
    return data;
  };

  const removeTask = async (id) => {
    await deleteTask(id);
    toast.success("Task deleted!");
    await fetchTasks();
  };

  return {
    tasks, stats, loading,
    search, setSearch,
    statusFilter, setStatusFilter,
    sortOrder, setSortOrder,
    addTask, editTask, removeTask,
    refetch: fetchTasks,
  };
}

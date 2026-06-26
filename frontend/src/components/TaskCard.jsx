const STATUS_STYLES = {
  "Pending":     "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  "In Progress": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  "Completed":   "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
};

const STATUS_DOT = {
  "Pending":     "bg-yellow-500",
  "In Progress": "bg-blue-500",
  "Completed":   "bg-green-500",
};

// Parse YYYY-MM-DD safely without UTC offset shifting the day
const parseDate = (dateStr) => {
  if (!dateStr) return null;
  // If already a full ISO string, use as-is; if date-only, add T00:00 in local time
  if (dateStr.length === 10) {
    const [y, m, d] = dateStr.split("-").map(Number);
    return new Date(y, m - 1, d); // local time, no UTC shift
  }
  return new Date(dateStr);
};

const formatDate = (dateStr) => {
  const dt = parseDate(dateStr);
  if (!dt || isNaN(dt)) return null;
  return dt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

export default function TaskCard({ task, onEdit, onDelete }) {
  const createdDate = formatDate(task.createdAt);
  const dueFormatted = task.dueDate ? formatDate(task.dueDate) : null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDateObj = task.dueDate ? parseDate(task.dueDate) : null;
  const isOverdue = dueDateObj && dueDateObj < today && task.status !== "Completed";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
      {/* Status badge + actions */}
      <div className="flex items-center justify-between mb-3">
        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[task.status]}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[task.status]}`} />
          {task.status}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(task)}
            className="text-gray-400 hover:text-blue-500 transition-colors p-1"
            title="Edit"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="text-gray-400 hover:text-red-500 transition-colors p-1"
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Title */}
      <h3 className={`font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2 ${task.status === "Completed" ? "line-through opacity-60" : ""}`}>
        {task.title}
      </h3>

      {/* Description */}
      {task.description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
          {task.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 pt-2 border-t border-gray-100 dark:border-gray-700">
        <span>Created {createdDate}</span>
        {dueFormatted && (
          <span className={isOverdue ? "text-red-500 font-medium" : "text-gray-400 dark:text-gray-500"}>
            {isOverdue ? "⚠️ " : "📅 "}Due {dueFormatted}
          </span>
        )}
      </div>
    </div>
  );
}

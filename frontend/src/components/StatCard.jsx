const CONFIGS = {
  blue: {
    card: "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800",
    iconBg: "bg-blue-100 dark:bg-blue-800/40",
    value: "text-blue-600 dark:text-blue-400",
    label: "text-blue-500 dark:text-blue-400",
  },
  yellow: {
    card: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-100 dark:border-yellow-800",
    iconBg: "bg-yellow-100 dark:bg-yellow-800/40",
    value: "text-yellow-600 dark:text-yellow-400",
    label: "text-yellow-500 dark:text-yellow-400",
  },
  orange: {
    card: "bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-800",
    iconBg: "bg-orange-100 dark:bg-orange-800/40",
    value: "text-orange-600 dark:text-orange-400",
    label: "text-orange-500 dark:text-orange-400",
  },
  green: {
    card: "bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800",
    iconBg: "bg-green-100 dark:bg-green-800/40",
    value: "text-green-600 dark:text-green-400",
    label: "text-green-500 dark:text-green-400",
  },
};

// SVG icons matching the screenshot style
const ICONS = {
  clipboard: (
    <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth="1.8">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" strokeLinecap="round"/>
      <rect x="9" y="3" width="6" height="4" rx="1" strokeLinecap="round"/>
      <line x1="9" y1="12" x2="15" y2="12" strokeLinecap="round"/>
      <line x1="9" y1="16" x2="13" y2="16" strokeLinecap="round"/>
    </svg>
  ),
  hourglass: (
    <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth="1.8">
      <path d="M5 4h14M5 20h14M7 4v4l5 4-5 4v4M17 4v4l-5 4 5 4v4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  refresh: (
    <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 4v5h5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M20 20v-5h-5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4.93 13a8 8 0 1014.14-8.36L16 7M7 17l-2.07 2.36A8 8 0 0019.07 11" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="3" strokeLinecap="round"/>
      <path d="M8 12l3 3 5-5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};

export default function StatCard({ label, value, color, iconKey }) {
  const cfg = CONFIGS[color];
  return (
    <div className={`rounded-2xl border p-5 flex items-center gap-4 ${cfg.card}`}>
      <div className={`rounded-xl p-3 ${cfg.iconBg} ${cfg.value} flex-shrink-0`}>
        {ICONS[iconKey]}
      </div>
      <div>
        <p className={`text-3xl font-bold ${cfg.value}`}>{value}</p>
        <p className={`text-sm font-semibold mt-0.5 ${cfg.label}`}>{label}</p>
      </div>
    </div>
  );
}

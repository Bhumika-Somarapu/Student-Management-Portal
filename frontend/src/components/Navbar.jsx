export default function Navbar({ darkMode, setDarkMode }) {
  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm">
            SP
          </div>
          <div>
            <h1 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base leading-tight">
              Student Portal
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block leading-tight">
              Project Management
            </p>
          </div>
        </div>

        {/* Dark mode toggle — matches screenshot moon/sun style */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-gray-500 dark:text-yellow-300 transition-colors shadow-sm"
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? (
            // Sun
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="4"/>
              <line x1="12" y1="2" x2="12" y2="4" strokeLinecap="round"/>
              <line x1="12" y1="20" x2="12" y2="22" strokeLinecap="round"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" strokeLinecap="round"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" strokeLinecap="round"/>
              <line x1="2" y1="12" x2="4" y2="12" strokeLinecap="round"/>
              <line x1="20" y1="12" x2="22" y2="12" strokeLinecap="round"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" strokeLinecap="round"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" strokeLinecap="round"/>
            </svg>
          ) : (
            // Moon — exactly like the screenshot
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}

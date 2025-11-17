 import { useEffect, useState } from "react";

export const logActivity = (action, itemName) => {
  const logs = JSON.parse(localStorage.getItem("activityLog")) || [];

  logs.push({
    id: Date.now() + Math.random(),   // UNIQUE
    action,
    itemName,
    timestamp: new Date().toLocaleString(),
    date: new Date().toDateString(),
  });

  localStorage.setItem("activityLog", JSON.stringify(logs));
};

export default function Activity() {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortType, setSortType] = useState("newest");

  const loadLogs = () => {
    const saved = JSON.parse(localStorage.getItem("activityLog")) || [];
    setLogs(saved.reverse()); 
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const logDate = new Date(log.date);
    const today = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(today.getDate() - 7);

    if (filter === "today") {
      return (
        logDate.getDate() === today.getDate() &&
        logDate.getMonth() === today.getMonth() &&
        logDate.getFullYear() === today.getFullYear()
      );
    }

    if (filter === "week") {
      return logDate >= oneWeekAgo;
    }

    return true;
  });

  const searchedLogs = filteredLogs.filter((log) =>
    `${log.action} ${log.itemName}`.toLowerCase().includes(search.toLowerCase())
  );

  const sortedLogs = [...searchedLogs].sort((a, b) => {
    if (sortType === "newest") return b.id - a.id;
    if (sortType === "oldest") return a.id - b.id;
    if (sortType === "action") return a.action.localeCompare(b.action);
    if (sortType === "item") return a.itemName.localeCompare(b.itemName);
    return 0;
  });

  const handleClear = () => {
    if (!window.confirm("Clear all activity logs?")) return;
    localStorage.removeItem("activityLog");
    setLogs([]);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 md:mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">📋 Activity Log</h1>
        <button
          onClick={handleClear}
          className="px-4 md:px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-semibold text-sm md:text-base w-full md:w-auto"
        >
          🗑️ Clear Log
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-6">

        <input
          type="text"
          placeholder="🔍 Search..."
          className="w-full p-2 md:p-3 border-2 border-gray-300 rounded-lg text-sm md:text-base dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:border-blue-500 transition-all duration-200"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="w-full p-2 md:p-3 border-2 border-gray-300 rounded-lg text-sm md:text-base dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:border-blue-500 transition-all duration-200 font-semibold"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">📅 All Time</option>
          <option value="today">☀️ Today</option>
          <option value="week">📆 This Week</option>
        </select>

        <select
          className="w-full p-2 md:p-3 border-2 border-gray-300 rounded-lg text-sm md:text-base dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:border-blue-500 transition-all duration-200 font-semibold"
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
        >
          <option value="newest">⏫ Newest</option>
          <option value="oldest">⏬ Oldest</option>
          <option value="action">🔤 Action</option>
          <option value="item">📦 Item</option>
        </select>
      </div>

      {/* Activity List */}
      <div className="bg-white dark:bg-gray-800 dark:text-gray-200 shadow-lg rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        {sortedLogs.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-12 text-base md:text-lg">📭 No activity found.</p>
        ) : (
          <ul className="divide-y dark:divide-gray-700">
            {sortedLogs.map((log) => (
              <li
                key={log.id}
                className="flex flex-col md:flex-row md:justify-between md:items-center p-3 md:p-6 hover:bg-blue-50 dark:hover:bg-gray-700/50 transition-colors duration-150 gap-2"
              >
                <div className="flex-1 min-w-0">
                  <span className="font-bold text-blue-600 dark:text-blue-400 text-sm md:text-base break-words">{log.action}</span>
                  <span className="text-gray-700 dark:text-gray-300 mx-2 hidden md:inline">→</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-100 text-sm md:text-base block md:inline break-words">{log.itemName}</span>
                </div>
                <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400 md:text-right flex-shrink-0">
                  🕐 {log.timestamp}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

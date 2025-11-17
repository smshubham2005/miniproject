 import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getHighPriorityNotifications } from "../utils/notifications";

export default function DashboardLayout({ children, darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  // Get notification count
  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("items") || "[]");
    const highPriority = getHighPriorityNotifications(items);
    setNotificationCount(highPriority.length);
  }, []);

  // PROTECT ROUTES
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("loggedIn");
    if (!isLoggedIn) navigate("/");
  }, []);

  // Close sidebar when navigating
  useEffect(() => {
    setSidebarOpen(false);
  }, [currentPath]);

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 dark:text-gray-200">

      {/* SIDEBAR - Desktop & Mobile */}
      <div className={`fixed md:static w-64 h-screen bg-white dark:bg-gray-800 shadow-xl border-r border-gray-200 dark:border-gray-700 p-5 overflow-y-auto transition-transform duration-300 z-50 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}>
        
        <div className="mb-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            SmartShelf
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Inventory Management</p>
        </div>

        <ul className="space-y-2 text-gray-700 dark:text-gray-200">

          {/* Dashboard */}
          <li
            onClick={() => navigate("/dashboard")}
            className={`cursor-pointer px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-between gap-3 
              ${
                currentPath === "/dashboard"
                  ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
          >
            <span className="flex items-center gap-2">📊 Dashboard</span>
            {notificationCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">{notificationCount}</span>
            )}
          </li>          {/* Items */}
          <li
            onClick={() => navigate("/items")}
            className={`cursor-pointer px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-3
              ${
                currentPath === "/items"
                  ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
          >
            📦 Items
          </li>

          {/* Add Item */}
          <li
            onClick={() => navigate("/add-item")}
            className={`cursor-pointer px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-3
              ${
                currentPath === "/add-item"
                  ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
          >
            ➕ Add Item
          </li>

          {/* Activity Log */}
          <li
            onClick={() => navigate("/activity")}
            className={`cursor-pointer px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-3
              ${
                currentPath === "/activity"
                  ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
          >
            📋 Activity Log
          </li>
          {/* Analytics */}
          <li
            onClick={() => navigate("/analytics")}
            className={`cursor-pointer px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-3
              ${
                currentPath === "/analytics"
                  ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
          >
            📈 Analytics
          </li>

          {/* Categories */}
          <li
            onClick={() => navigate("/categories")}
            className={`cursor-pointer px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-3
              ${
                currentPath === "/categories"
                  ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
          >
            📂 Categories
          </li>


        </ul>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col">

        {/* TOPBAR */}
        <div className="w-full bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-between px-4 md:px-8">
          
          {/* Hamburger Menu - Mobile Only */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
          >
            {sidebarOpen ? (
              <span className="text-2xl">✖️</span>
            ) : (
              <span className="text-2xl">☰</span>
            )}
          </button>

          <div className="flex-1 md:flex-none">
            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 hidden md:block">Welcome back!</p>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            {/* DARK MODE TOGGLE */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-2 md:px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 font-semibold text-xs md:text-base
                         hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-100 transition-all duration-200"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>

            {/* LOGOUT */}
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 md:px-6 py-2 rounded-lg font-semibold text-xs md:text-base hover:shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              🚪
            </button>
          </div>
        </div>

        {/* PAGE CONTENT */}
        <div className="p-4 md:p-8 overflow-y-auto flex-1 bg-gradient-to-br from-transparent to-blue-50/30 dark:to-gray-800/30">{children}</div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-40"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}

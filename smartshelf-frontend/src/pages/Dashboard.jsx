 import { useEffect } from "react";
import { getExpiryNotifications, daysUntilExpiry } from "../utils/notifications";

export default function Dashboard() {
  const items = JSON.parse(localStorage.getItem("items") || "[]");

  const totalCategories = new Set(items.map((i) => i.category)).size;
  const recentItems = items.slice(-5).reverse();

  // Get notification categories
  const notifications = getExpiryNotifications(items);
  const expiringWithin3Days = notifications.expiringWithin3Days;
  const expiringToday = notifications.expiringToday;
  const expired = notifications.expired;
  const lowStockItems = items.filter((item) => item.quantity < 5);

  // Auto Log Checker
  const checkAutoLogs = () => {
    const items = JSON.parse(localStorage.getItem("items")) || [];
    const logs = JSON.parse(localStorage.getItem("activityLog")) || [];

    const today = new Date().toDateString(); // prevent duplicate logs in 1 day

    items.forEach((item) => {
      const expDate = new Date(item.expiry);
      const now = new Date();

      // Log expired
      if (
        expDate < now &&
        !logs.some(
          (log) =>
            log.itemName === item.name &&
            log.action === "Expired item" &&
            log.date === today
        )
      ) {
        logs.push({
          id: Date.now() + Math.random(),   // FIXED HERE
          action: "Expired item",
          itemName: item.name,
          timestamp: new Date().toLocaleString(),
          date: today,
        });
      }

      // Log low stock
      if (
        item.quantity < 5 &&
        !logs.some(
          (log) =>
            log.itemName === item.name &&
            log.action === "Low stock" &&
            log.date === today
        )
      ) {
        logs.push({
          id: Date.now() + Math.random(),   // FIXED
          action: "Low stock",
          itemName: item.name,
          timestamp: new Date().toLocaleString(),
          date: today,
        });
      }
    });

    localStorage.setItem("activityLog", JSON.stringify(logs));
  };

  // Run auto log when Dashboard loads
  useEffect(() => {
    checkAutoLogs();
  }, []);

  // For visible expired & low-stock display
  const today = new Date();

  const expiredItems = items.filter((item) => {
    if (!item.expiry) return false;
    return new Date(item.expiry) < today;
  });

   return (
  <>
    <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-6 md:mb-8">📊 Dashboard</h1>

    {/* EXPIRING TODAY - CRITICAL ALERT */}
    {expiringToday.length > 0 && (
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-5 md:p-7 rounded-lg shadow-2xl mb-4 md:mb-6 border-l-4 border-white animate-pulse">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl md:text-4xl animate-bounce">🔴</span>
          <h2 className="text-xl md:text-2xl font-bold">CRITICAL: Items Expiring TODAY!</h2>
        </div>
        <div className="bg-black/20 rounded-lg p-4 mb-4">
          <ul className="space-y-2">
            {expiringToday.map((item) => (
              <li key={item.id} className="flex justify-between items-center text-sm md:text-base">
                <span className="font-semibold">{item.name}</span>
                <span className="text-yellow-200">📅 {item.expiry}</span>
              </li>
            ))}
          </ul>
        </div>
        <button
          className="bg-white text-red-600 font-bold px-4 md:px-6 py-2 rounded-lg text-sm md:text-base hover:bg-red-50 transition-all duration-200"
          onClick={() => (window.location.href = "/items")}
        >
          ⚡ Take Action Now
        </button>
      </div>
    )}

    {/* EXPIRING WITHIN 3 DAYS - HIGH PRIORITY */}
    {expiringWithin3Days.length > 0 && expiringToday.length === 0 && (
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 md:p-6 rounded-lg shadow-xl mb-4 md:mb-6 border-l-4 border-orange-200">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl md:text-3xl">⚠️</span>
          <h2 className="text-lg md:text-xl font-bold">Warning: Items Expiring Within 3 Days</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {expiringWithin3Days.map((item) => {
            const days = daysUntilExpiry(item.expiry);
            return (
              <div key={item.id} className="bg-black/20 rounded-lg p-3">
                <p className="font-semibold text-sm md:text-base">{item.name}</p>
                <p className="text-xs md:text-sm text-orange-100">
                  📅 {item.expiry} ({days} {days === 1 ? 'day' : 'days'} left)
                </p>
              </div>
            );
          })}
        </div>
        <button
          className="mt-4 bg-white text-orange-600 font-bold px-4 md:px-6 py-2 rounded-lg text-sm md:text-base hover:bg-orange-50 transition-all duration-200 w-full md:w-auto"
          onClick={() => (window.location.href = "/items")}
        >
          View All Items
        </button>
      </div>
    )}

    {/* GENERAL ALERTS - Expired + Low Stock */}
    {(expired.length > 0 || lowStockItems.length > 0) && (
      <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-4 md:p-6 rounded-lg shadow-lg mb-6 md:mb-8 border-l-4 border-red-700">
        <h2 className="text-lg md:text-xl font-bold mb-3">🚨 Attention Required</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-4">
          {expired.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-2xl md:text-3xl">❌</span>
              <span className="font-semibold text-sm md:text-base">{expired.length} item(s) expired</span>
            </div>
          )}

          {lowStockItems.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-2xl md:text-3xl">📦</span>
              <span className="font-semibold text-sm md:text-base">{lowStockItems.length} item(s) low stock</span>
            </div>
          )}
        </div>

        <button
          className="bg-white text-red-600 font-bold px-4 md:px-6 py-2 rounded-lg text-sm md:text-base hover:shadow-lg transition-all duration-200 hover:bg-red-50"
          onClick={() => (window.location.href = "/items")}
        >
          View Details →
        </button>
      </div>
    )}

    {/* Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 shadow-lg p-6 md:p-8 rounded-lg border-l-4 border-blue-600 hover:shadow-xl transition-shadow duration-200">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-gray-600 dark:text-gray-400 text-xs md:text-sm font-semibold uppercase">Total Items</h2>
            <p className="text-3xl md:text-4xl font-bold mt-2 text-blue-700 dark:text-blue-300">{items.length}</p>
          </div>
          <span className="text-4xl md:text-5xl">📦</span>
        </div>
      </div>

      <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 shadow-lg p-6 md:p-8 rounded-lg border-l-4 border-green-600 hover:shadow-xl transition-shadow duration-200">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-gray-600 dark:text-gray-400 text-xs md:text-sm font-semibold uppercase">Categories</h2>
            <p className="text-3xl md:text-4xl font-bold mt-2 text-green-700 dark:text-green-300">{totalCategories}</p>
          </div>
          <span className="text-4xl md:text-5xl">📂</span>
        </div>
      </div>

      <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-800 shadow-lg p-6 md:p-8 rounded-lg border-l-4 border-orange-600 hover:shadow-xl transition-shadow duration-200">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-gray-600 dark:text-gray-400 text-xs md:text-sm font-semibold uppercase">Expiring Soon (3 days)</h2>
            <p className="text-3xl md:text-4xl font-bold mt-2 text-orange-700 dark:text-orange-300">{expiringWithin3Days.length}</p>
          </div>
          <span className="text-4xl md:text-5xl">⏰</span>
        </div>
      </div>
    </div>


      {/* Expired Items */}
      <div className="bg-white dark:bg-gray-800 dark:text-gray-200 shadow-lg rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 mb-6 md:mb-8">
        <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 border-b-2 border-red-300 dark:border-red-700 p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold text-red-700 dark:text-red-400">
            ❌ Expired Items ({expired.length})
          </h2>
        </div>

        <div className="p-4 md:p-6">
          {expired.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8 text-base md:text-lg">✅ No expired items!</p>
          ) : (
            <ul className="space-y-2 md:space-y-3">
              {expired.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between p-3 md:p-4 border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20 rounded dark:border-red-600 text-sm md:text-base"
                >
                  <span className="font-semibold text-gray-800 dark:text-gray-100">{item.name}</span>
                  <span className="text-red-600 dark:text-red-400 font-bold">{item.expiry}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Expiring Within 3 Days */}
      <div className="bg-white dark:bg-gray-800 dark:text-gray-200 shadow-lg rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 mb-6 md:mb-8">
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 border-b-2 border-orange-300 dark:border-orange-700 p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold text-orange-700 dark:text-orange-400">
            ⏰ Expiring Within 3 Days ({expiringWithin3Days.length})
          </h2>
        </div>

        <div className="p-4 md:p-6">
          {expiringWithin3Days.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8 text-base md:text-lg">✅ No items expiring soon!</p>
          ) : (
            <ul className="space-y-2 md:space-y-3">
              {expiringWithin3Days.map((item) => {
                const days = daysUntilExpiry(item.expiry);
                const dayText = days === 0 ? "TODAY" : `${days} day${days > 1 ? "s" : ""}`;
                return (
                  <li
                    key={item.id}
                    className="flex justify-between p-3 md:p-4 border-l-4 border-orange-500 bg-orange-50 dark:bg-orange-900/20 rounded dark:border-orange-600 text-sm md:text-base"
                  >
                    <span className="font-semibold text-gray-800 dark:text-gray-100">{item.name}</span>
                    <span className="text-orange-600 dark:text-orange-400 font-bold">{item.expiry} ({dayText})</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Low Stock Items */}
      <div className="bg-white dark:bg-gray-800 dark:text-gray-200 shadow-lg rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 mb-6 md:mb-8">
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/30 border-b-2 border-yellow-300 dark:border-yellow-700 p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold text-yellow-700 dark:text-yellow-400">
            ⚠️ Low Stock Items (Qty &lt; 5)
          </h2>
        </div>

        <div className="p-4 md:p-6">
          {lowStockItems.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8 text-base md:text-lg">✅ All stocked well!</p>
          ) : (
            <ul className="space-y-2 md:space-y-3">
              {lowStockItems.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between p-3 md:p-4 border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 rounded dark:border-yellow-600 text-sm md:text-base"
                >
                  <span className="font-semibold text-gray-800 dark:text-gray-100">{item.name}</span>
                  <span className="text-yellow-600 dark:text-yellow-400 font-bold">Qty: {item.quantity}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Recently Added */}
      <div className="bg-white dark:bg-gray-800 dark:text-gray-200 shadow-lg rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 mb-6 md:mb-8">
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 border-b-2 border-purple-300 dark:border-purple-700 p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold text-purple-700 dark:text-purple-400">
            ⭐ Recently Added Items
          </h2>
        </div>

        <div className="p-4 md:p-6">
          {recentItems.length > 0 ? (
            <ul className="space-y-2 md:space-y-3">
              {recentItems.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between p-3 md:p-4 border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-900/20 rounded cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-all duration-200 dark:border-purple-600 text-sm md:text-base"
                  onClick={() => (window.location.href = "/items")}
                >
                  <span className="font-semibold text-gray-800 dark:text-gray-100">{item.name}</span>
                  <span className="text-gray-500 dark:text-gray-400 text-xs md:text-sm">{item.added}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8 text-base md:text-lg">No items yet! 🚀</p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-lg p-6 md:p-8 rounded-lg text-center border-t-4 border-blue-600">
        <h3 className="text-xl md:text-2xl font-bold mb-2">🎉 SmartShelf Dashboard</h3>
        <p className="text-sm md:text-base text-blue-50">Manage inventory efficiently. Never miss an expiry date!</p>
      </div>
    </>
  );
}

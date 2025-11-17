import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { logActivity } from "../utils/logActivity";


export default function EditItem() {
  const { id } = useParams(); // get ID from URL
  const [item, setItem] = useState(null);
  const [success, setSuccess] = useState("");

  // Protect the page (only logged-in users)
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("loggedIn");
    if (!isLoggedIn) {
      window.location.href = "/";
    }
  }, []);

  // Load the selected item
  useEffect(() => {
    const savedItems = JSON.parse(localStorage.getItem("items")) || [];
    const found = savedItems.find((i) => i.id === Number(id));
    setItem(found);
  }, [id]);

  const handleSave = (e) => {
    e.preventDefault();
    setSuccess("");

    const savedItems = JSON.parse(localStorage.getItem("items")) || [];

    // replace updated item
    const updatedList = savedItems.map((i) =>
      i.id === Number(id) ? item : i
    );

    localStorage.setItem("items", JSON.stringify(updatedList));

    // update activity log
    logActivity("Updated item", item.name);
 

    setSuccess("Item updated successfully!");
  };

  if (!item) return <div className="p-4 md:p-6 text-center"><p className="text-gray-600 dark:text-gray-400 text-base md:text-lg">⏳ Loading...</p></div>;

  return (
    <div className="max-w-2xl mx-auto px-4">
      <div className="flex items-center gap-2 mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">✏️ Edit Item</h1>
      </div>

      {success && (
        <div className="bg-green-100 dark:bg-green-900 border-l-4 border-green-600 text-green-700 dark:text-green-300 p-3 md:p-4 rounded-lg mb-6 font-semibold text-sm md:text-base">
          ✅ {success}
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white dark:bg-gray-800 dark:text-gray-200 shadow-lg rounded-lg p-4 md:p-8 border border-gray-200 dark:border-gray-700 space-y-5 md:space-y-6">

        {/* Item Name */}
        <div>
          <label className="block text-xs md:text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">📝 Item Name</label>
          <input
            type="text"
            className="w-full p-2 md:p-3 border-2 border-gray-300 rounded-lg text-sm md:text-base dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:border-blue-500 transition-all duration-200"
            value={item.name}
            onChange={(e) => setItem({ ...item, name: e.target.value })}
            placeholder="Item name"
          />
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-xs md:text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">📊 Quantity</label>
          <input
            type="text"
            className="w-full p-2 md:p-3 border-2 border-gray-300 rounded-lg text-sm md:text-base dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:border-blue-500 transition-all duration-200"
            value={item.quantity}
            onChange={(e) => setItem({ ...item, quantity: e.target.value })}
            placeholder="Quantity"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs md:text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">📂 Category</label>
          <input
            type="text"
            className="w-full p-2 md:p-3 border-2 border-gray-300 rounded-lg text-sm md:text-base dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:border-blue-500 transition-all duration-200"
            value={item.category}
            onChange={(e) => setItem({ ...item, category: e.target.value })}
            placeholder="Category"
          />
        </div>

        {/* Expiry Date */}
        <div>
          <label className="block text-xs md:text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">📅 Expiry Date</label>
          <input
            type="date"
            className="w-full p-2 md:p-3 border-2 border-gray-300 rounded-lg text-sm md:text-base dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:border-blue-500 transition-all duration-200"
            value={item.expiry || ""}
            onChange={(e) => setItem({ ...item, expiry: e.target.value })}
            placeholder="Expiry date"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs md:text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">📝 Notes</label>
          <textarea
            className="w-full p-2 md:p-3 border-2 border-gray-300 rounded-lg text-sm md:text-base dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:border-blue-500 transition-all duration-200 resize-vertical min-h-24 md:min-h-28"
            value={item.notes || ""}
            onChange={(e) => setItem({ ...item, notes: e.target.value })}
            placeholder="Add notes..."
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row gap-3 md:gap-4 pt-4">
          <button
            type="submit"
            className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-bold text-base md:text-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105 order-1 md:order-none"
          >
            💾 Save Changes
          </button>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex-1 px-4 md:px-6 py-2 md:py-3 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg font-bold text-base md:text-lg hover:shadow-lg transition-all duration-200"
          >
            ❌ Cancel
          </button>
        </div>

      </form>
    </div>
  );
}

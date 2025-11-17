import { useState, useEffect } from "react";
import { logActivity } from "../utils/logActivity";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [newColor, setNewColor] = useState("#3B82F6");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState("#3B82F6");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Load categories on mount
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () => {
    const saved = JSON.parse(localStorage.getItem("categories")) || [
      "Food",
      "Grocery",
      "Household",
      "Beverages",
      "Snacks",
      "Personal Care",
      "Cleaning",
      "Other",
    ];

    const categoryColors =
      JSON.parse(localStorage.getItem("categoryColors")) || {};

    // Ensure all categories have colors
    const updated = saved.map((cat) => ({
      name: cat,
      color: categoryColors[cat] || "#3B82F6",
    }));

    setCategories(updated);
  };

  // Add new category
  const handleAddCategory = (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!newCategory.trim()) {
      setError("Please enter a category name");
      return;
    }

    if (categories.some((c) => c.name.toLowerCase() === newCategory.toLowerCase())) {
      setError("This category already exists");
      return;
    }

    const updated = [
      ...categories,
      { name: newCategory, color: newColor },
    ];

    setCategories(updated);

    // Save to localStorage
    const categoryNames = updated.map((c) => c.name);
    const colors = {};
    updated.forEach((c) => {
      colors[c.name] = c.color;
    });

    localStorage.setItem("categories", JSON.stringify(categoryNames));
    localStorage.setItem("categoryColors", JSON.stringify(colors));

    logActivity("Added category", newCategory);

    setMessage(`✅ Category "${newCategory}" added successfully!`);
    setNewCategory("");
    setNewColor("#3B82F6");

    setTimeout(() => setMessage(""), 3000);
  };

  // Edit category
  const handleEditCategory = (oldName) => {
    setEditingId(oldName);
    setEditName(oldName);
    const cat = categories.find((c) => c.name === oldName);
    setEditColor(cat?.color || "#3B82F6");
  };

  const handleSaveEdit = () => {
    setMessage("");
    setError("");

    if (!editName.trim()) {
      setError("Please enter a category name");
      return;
    }

    const isDuplicate = categories.some(
      (c) =>
        c.name.toLowerCase() === editName.toLowerCase() && c.name !== editingId
    );

    if (isDuplicate) {
      setError("This category already exists");
      return;
    }

    const updated = categories.map((c) =>
      c.name === editingId ? { name: editName, color: editColor } : c
    );

    setCategories(updated);

    // Update localStorage
    const categoryNames = updated.map((c) => c.name);
    const colors = {};
    updated.forEach((c) => {
      colors[c.name] = c.color;
    });

    localStorage.setItem("categories", JSON.stringify(categoryNames));
    localStorage.setItem("categoryColors", JSON.stringify(colors));

    // Update items with new category name
    const items = JSON.parse(localStorage.getItem("items")) || [];
    const updatedItems = items.map((item) =>
      item.category === editingId ? { ...item, category: editName } : item
    );
    localStorage.setItem("items", JSON.stringify(updatedItems));

    logActivity("Updated category", editName);

    setMessage(`✅ Category updated successfully!`);
    setEditingId(null);

    setTimeout(() => setMessage(""), 3000);
  };

  // Delete category
  const handleDeleteCategory = (name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    setMessage("");
    setError("");

    const updated = categories.filter((c) => c.name !== name);
    setCategories(updated);

    // Update localStorage
    const categoryNames = updated.map((c) => c.name);
    const colors = JSON.parse(localStorage.getItem("categoryColors")) || {};
    delete colors[name];

    localStorage.setItem("categories", JSON.stringify(categoryNames));
    localStorage.setItem("categoryColors", JSON.stringify(colors));

    // Update items - reset category of items using this category
    const items = JSON.parse(localStorage.getItem("items")) || [];
    const updatedItems = items.map((item) =>
      item.category === name ? { ...item, category: "Other" } : item
    );
    localStorage.setItem("items", JSON.stringify(updatedItems));

    logActivity("Deleted category", name);

    setMessage(`✅ Category "${name}" deleted successfully!`);

    setTimeout(() => setMessage(""), 3000);
  };

  // Reset to default categories
  const handleResetCategories = () => {
    if (
      !window.confirm(
        "Reset to default categories? This will not delete your items."
      )
    )
      return;

    const defaults = [
      { name: "Food", color: "#EF4444" },
      { name: "Grocery", color: "#F59E0B" },
      { name: "Household", color: "#8B5CF6" },
      { name: "Beverages", color: "#3B82F6" },
      { name: "Snacks", color: "#EC4899" },
      { name: "Personal Care", color: "#10B981" },
      { name: "Cleaning", color: "#06B6D4" },
      { name: "Other", color: "#6B7280" },
    ];

    setCategories(defaults);

    const categoryNames = defaults.map((c) => c.name);
    const colors = {};
    defaults.forEach((c) => {
      colors[c.name] = c.color;
    });

    localStorage.setItem("categories", JSON.stringify(categoryNames));
    localStorage.setItem("categoryColors", JSON.stringify(colors));

    logActivity("Reset categories", "to defaults");

    setMessage("✅ Categories reset to defaults!");

    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-8">
      <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-6 md:mb-8">
        📂 Manage Categories
      </h1>

      {message && (
        <div className="bg-green-100 dark:bg-green-900 border-l-4 border-green-600 text-green-700 dark:text-green-300 p-3 md:p-4 rounded-lg mb-6 font-semibold text-sm md:text-base">
          {message}
        </div>
      )}

      {error && (
        <div className="bg-red-100 dark:bg-red-900 border-l-4 border-red-600 text-red-700 dark:text-red-300 p-3 md:p-4 rounded-lg mb-6 font-semibold text-sm md:text-base">
          ❌ {error}
        </div>
      )}

      {/* Add New Category Form */}
      <div className="bg-white dark:bg-gray-800 dark:text-gray-200 shadow-lg rounded-lg p-4 md:p-6 mb-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl md:text-2xl font-bold mb-4">➕ Add New Category</h2>

        <form onSubmit={handleAddCategory} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs md:text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Category Name
              </label>
              <input
                type="text"
                placeholder="e.g., Dairy, Electronics..."
                className="w-full p-2 md:p-3 border-2 border-gray-300 rounded-lg text-sm md:text-base dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:border-blue-500 transition-all duration-200"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs md:text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Select Color
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  className="w-14 h-10 border-2 border-gray-300 rounded-lg cursor-pointer dark:border-gray-600"
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                />
                <div
                  className="w-8 h-8 rounded-lg border-2 border-gray-300"
                  style={{ backgroundColor: newColor }}
                  title="Color preview"
                ></div>
              </div>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-2 md:py-3 rounded-lg font-bold text-sm md:text-base hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                Add Category
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Categories List */}
      <div className="bg-white dark:bg-gray-800 dark:text-gray-200 shadow-lg rounded-lg p-4 md:p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl md:text-2xl font-bold mb-4">📋 Your Categories ({categories.length})</h2>

        {categories.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400 text-center py-8">
            No categories found. Create one to get started! 🚀
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <div
                key={category.name}
                className="bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-lg transition-all duration-200"
              >
                {editingId === category.name ? (
                  // Edit Mode
                  <div className="space-y-3">
                    <input
                      type="text"
                      className="w-full p-2 border-2 border-blue-500 rounded-lg text-sm dark:bg-gray-700 dark:text-white focus:outline-none"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      autoFocus
                    />
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        className="w-10 h-8 border-2 border-gray-300 rounded-lg cursor-pointer dark:border-gray-600"
                        value={editColor}
                        onChange={(e) => setEditColor(e.target.value)}
                      />
                      <div
                        className="w-6 h-6 rounded-lg border-2 border-gray-300"
                        style={{ backgroundColor: editColor }}
                      ></div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveEdit}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-semibold text-sm transition-all"
                      >
                        ✅ Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-2 rounded-lg font-semibold text-sm transition-all"
                      >
                        ❌ Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-6 h-6 rounded-full border-2 border-gray-300"
                        style={{ backgroundColor: category.color }}
                        title="Category color"
                      ></div>
                      <h3 className="font-bold text-base md:text-lg">
                        {category.name}
                      </h3>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditCategory(category.name)}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold text-xs md:text-sm transition-all"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.name)}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-semibold text-xs md:text-sm transition-all"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {categories.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-300 dark:border-gray-600">
            <button
              onClick={handleResetCategories}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 md:py-3 rounded-lg font-bold text-sm md:text-base transition-all duration-200"
            >
              🔄 Reset to Default Categories
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

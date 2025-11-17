 import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logActivity } from "../utils/logActivity";   // <-- IMPORTANT

export default function Items() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const navigate = useNavigate();

  // Sorting states
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  // Load items
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("items")) || [];
    setItems(saved);
  }, []);

  // Dynamic categories
  const categories =
    JSON.parse(localStorage.getItem("categories")) || [
      "Food",
      "Grocery",
      "Household",
      "Beverages",
      "Snacks",
      "Personal Care",
      "Cleaning",
      "Other",
    ];

  // EXPORT CSV
  const exportCSV = () => {
    if (items.length === 0) {
      alert("No items to export");
      return;
    }

    const headers = ["Name", "Quantity", "Category", "Added", "Expiry", "Notes"];
    const rows = items.map((i) => [
      i.name,
      i.quantity,
      i.category,
      i.added,
      i.expiry,
      i.notes || "",
    ]);

    let csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "smartshelf_items.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();

    // Log export
    logActivity("Exported CSV", `${items.length} items`);
  };

  // IMPORT CSV
  const handleImportCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const rows = text.split("\n").map((row) => row.split(","));

      const importedItems = rows.slice(1).map((row) => ({
        id: Date.now() + Math.random(),
        name: row[0]?.trim(),
        quantity: row[1]?.trim(),
        category: row[2]?.trim(),
        added: row[3]?.trim(),
        expiry: row[4]?.trim(),
        notes: row[5]?.trim() || "",
      }));

      const clean = importedItems.filter((i) => i.name);

      const oldItems = JSON.parse(localStorage.getItem("items")) || [];
      const updated = [...oldItems, ...clean];

      localStorage.setItem("items", JSON.stringify(updated));
      setItems(updated);

      // Log import
      logActivity("Imported items", `${clean.length} items`);
    };

    reader.readAsText(file);
  };

  // DELETE ITEM
  const handleDelete = (id, itemName) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    const updated = items.filter((i) => i.id !== id);
    setItems(updated);
    localStorage.setItem("items", JSON.stringify(updated));

    // Log delete
    logActivity("Deleted item", itemName);
  };

  // SORT FUNCTION
  const sortItems = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // FILTER + SORT
  let filteredItems = items
    .filter((i) => i.name.toLowerCase().includes(search.toLowerCase()))
    .filter((i) =>
      categoryFilter === "All" ? true : i.category === categoryFilter
    );

  if (sortField) {
    filteredItems = [...filteredItems].sort((a, b) => {
      let x = a[sortField];
      let y = b[sortField];

      if (sortField === "quantity") {
        x = Number(x);
        y = Number(y);
      }

      if (sortField === "added" || sortField === "expiry") {
        x = new Date(x);
        y = new Date(y);
      }

      if (x < y) return sortOrder === "asc" ? -1 : 1;
      if (x > y) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 md:mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Your Items</h1>
        <div className="flex gap-2 flex-wrap">
          <input
            type="file"
            accept=".csv"
            id="csvInput"
            className="hidden"
            onChange={handleImportCSV}
          />
          <button
            onClick={() => document.getElementById("csvInput").click()}
            className="px-3 md:px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-semibold text-xs md:text-sm"
          >
            📥 Import
          </button>

          <button
            onClick={exportCSV}
            className="px-3 md:px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-semibold text-xs md:text-sm"
          >
            📤 Export
          </button>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-6">

        <input
          type="text"
          placeholder="🔍 Search items..."
          className="w-full p-2 md:p-3 border-2 border-gray-300 rounded-lg text-sm md:text-base dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:border-blue-500 transition-all duration-200"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="w-full p-2 md:p-3 border-2 border-gray-300 rounded-lg text-sm md:text-base dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:border-blue-500 transition-all duration-200 font-semibold"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="All">📂 All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white dark:bg-gray-800 dark:text-gray-200 shadow-lg rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-700 dark:to-gray-700 border-b-2 dark:border-gray-600">

                <th className="py-4 px-6 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 font-bold" onClick={() => sortItems("name")}>
                  📌 Name
                </th>

                <th className="py-4 px-6 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 font-bold" onClick={() => sortItems("quantity")}>
                  📊 Qty
                </th>

                <th className="py-4 px-6 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 font-bold" onClick={() => sortItems("category")}>
                  📂 Category
                </th>

                <th className="py-4 px-6 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 font-bold" onClick={() => sortItems("added")}>
                  📅 Added
                </th>

                <th className="py-4 px-6 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 font-bold" onClick={() => sortItems("expiry")}>
                  ⏰ Expiry
                </th>

                <th className="py-4 px-6 font-bold">📝 Notes</th>

                <th className="py-4 px-6 text-center font-bold">⚙️ Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredItems.map((i) => (
                <tr
                  key={i.id}
                  className={`border-b dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-150 text-xs md:text-sm ${
                    new Date(i.expiry) < new Date() ? "bg-red-100 dark:bg-red-900/30" : ""
                  }`}
                >
                  <td className="py-4 px-6 font-medium">{i.name}</td>
                  <td className="py-4 px-6 font-semibold text-blue-600 dark:text-blue-400">{i.quantity}</td>
                  <td className="py-4 px-6 bg-gray-50 dark:bg-gray-700/30 rounded"><span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">{i.category}</span></td>
                  <td className="py-4 px-6 text-gray-600 dark:text-gray-400">{i.added}</td>
                  <td className="py-4 px-6 font-semibold text-orange-600 dark:text-orange-400">{i.expiry}</td>
                  <td className="py-4 px-6 text-gray-600 dark:text-gray-400 text-xs max-w-xs truncate" title={i.notes || "No notes"}>{i.notes ? i.notes : "-"}</td>

                  <td className="py-4 px-6 text-center flex justify-center gap-3">
                    <button
                      onClick={() => navigate(`/edit-item/${i.id}`)}
                      className="text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100 font-semibold hover:underline transition-all duration-200 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-lg text-xs"
                    >
                      ✏️ Edit
                    </button>

                    <button
                      onClick={() => handleDelete(i.id, i.name)}
                      className="text-red-600 dark:text-red-300 hover:text-red-800 dark:hover:text-red-100 font-semibold hover:underline transition-all duration-200 bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-lg text-xs"
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}

              {filteredItems.length === 0 && (
                <tr>
                  <td className="py-8 text-center text-gray-500 dark:text-gray-400 font-semibold" colSpan="7">
                    No matching items found. 🔍
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {filteredItems.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center border border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400 font-semibold">No matching items found. 🔍</p>
          </div>
        ) : (
          filteredItems.map((i) => (
            <div
              key={i.id}
              className={`bg-white dark:bg-gray-800 dark:text-gray-200 shadow-md rounded-lg p-4 border-l-4 transition-all duration-150 ${
                new Date(i.expiry) < new Date() ? "border-red-500 bg-red-50 dark:bg-red-900/20" : "border-blue-500"
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-base text-gray-900 dark:text-gray-100">{i.name}</h3>
                  <span className="inline-block mt-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">{i.category}</span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-600 dark:text-blue-400 text-lg">{i.quantity}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Qty</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                <div className="bg-gray-50 dark:bg-gray-700/30 p-2 rounded">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Added</p>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">{i.added}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/30 p-2 rounded">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Expiry</p>
                  <p className="font-semibold text-orange-600 dark:text-orange-400">{i.expiry}</p>
                </div>
              </div>

              {i.notes && (
                <div className="mb-3 bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded border-l-2 border-yellow-500">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">📝 Notes</p>
                  <p className="text-sm text-gray-800 dark:text-gray-300 break-words">{i.notes}</p>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/edit-item/${i.id}`)}
                  className="flex-1 text-blue-600 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 py-2 rounded-lg font-semibold text-sm transition-all"
                >
                  ✏️ Edit
                </button>

                <button
                  onClick={() => handleDelete(i.id, i.name)}
                  className="flex-1 text-red-600 dark:text-red-300 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 py-2 rounded-lg font-semibold text-sm transition-all"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

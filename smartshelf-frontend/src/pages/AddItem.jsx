import { useState } from "react";
import { logActivity } from "../utils/logActivity";
import { useNavigate } from "react-router-dom";


export default function AddItem() {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [expiry, setExpiry] = useState("");
  const [notes, setNotes] = useState("");
  const navigate = useNavigate();


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

  const handleAdd = (e) => {
    e.preventDefault();

    if (!name || !quantity || !category || !expiry) {
      alert("Please fill all fields");
      return;
    }

    const newItem = {
      id: Date.now(),
      name,
      quantity,
      category,
      added: new Date().toLocaleDateString(),
      expiry,
      notes,
    };

    const oldItems = JSON.parse(localStorage.getItem("items")) || [];
    oldItems.push(newItem);
    localStorage.setItem("items", JSON.stringify(oldItems));
      // Log Activity
    logActivity("Added item", name);


    setName("");
    setQuantity("");
    setCategory("");
    setExpiry("");
    setNotes("");

    alert("Item added successfully!");
    navigate("/items");
  };
   

  return (
    <>
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-6 md:mb-8">➕ Add New Item</h1>

        <form
          className="bg-white dark:bg-gray-800 dark:text-gray-200 shadow-lg rounded-lg p-4 md:p-8 border border-gray-200 dark:border-gray-700"
          onSubmit={handleAdd}
        >
          {/* Item Name */}
          <div className="mb-5 md:mb-6">
            <label className="block text-xs md:text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">📝 Item Name</label>
            <input
              type="text"
              placeholder="e.g., Milk, Rice, Soap..."
              className="w-full p-2 md:p-3 border-2 border-gray-300 rounded-lg text-sm md:text-base dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:border-blue-500 transition-all duration-200"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Quantity */}
          <div className="mb-5 md:mb-6">
            <label className="block text-xs md:text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">📊 Quantity</label>
            <input
              type="text"
              placeholder="e.g., 5, 10 kg, 2 liters..."
              className="w-full p-2 md:p-3 border-2 border-gray-300 rounded-lg text-sm md:text-base dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:border-blue-500 transition-all duration-200"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          {/* Category */}
          <div className="mb-5 md:mb-6">
            <label className="block text-xs md:text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">📂 Category</label>
            <select
              className="w-full p-2 md:p-3 border-2 border-gray-300 rounded-lg text-sm md:text-base dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:border-blue-500 transition-all duration-200 font-semibold"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Expiry Date */}
          <div className="mb-5 md:mb-6">
            <label className="block text-xs md:text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">📅 Expiry Date</label>
            <input
              type="date"
              className="w-full p-2 md:p-3 border-2 border-gray-300 rounded-lg text-sm md:text-base dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:border-blue-500 transition-all duration-200 font-semibold"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
            />
          </div>

          {/* Notes */}
          <div className="mb-6 md:mb-8">
            <label className="block text-xs md:text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">📝 Notes (Optional)</label>
            <textarea
              placeholder="e.g., Store in fridge, keep away from sunlight..."
              className="w-full p-2 md:p-3 border-2 border-gray-300 rounded-lg text-sm md:text-base dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:border-blue-500 transition-all duration-200 resize-vertical min-h-24 md:min-h-28"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-2 md:py-3 rounded-lg font-bold text-base md:text-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            ✅ Add Item to Shelf
          </button>
        </form>
      </div>
    </>
  );
}

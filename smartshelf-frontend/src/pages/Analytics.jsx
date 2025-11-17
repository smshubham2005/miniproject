// src/pages/Analytics.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/**
 * Premium Analytics.jsx
 * - Animations, filters, exports (PNG/PDF), color-coded categories
 * - Designed for Tailwind dark/light theme
 */

const DEFAULT_COLORS = [
  "#3b82f6",
  "#f97316",
  "#10b981",
  "#ef4444",
  "#6366f1",
  "#f43f5e",
  "#06b6d4",
  "#8b5cf6",
  "#f59e0b",
  "#84cc16",
];

function useDarkMode() {
  // Simple detector from body class (your app toggles 'dark')
  const [isDark, setIsDark] = useState(
    typeof document !== "undefined" && document.body.classList.contains("dark")
  );
  useEffect(() => {
    const obs = new MutationObserver(() =>
      setIsDark(document.body.classList.contains("dark"))
    );
    obs.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);
  return isDark;
}

// Custom tooltip that respects dark mode
function CustomTooltip({ active, payload, label }) {
  const isDark = document.body.classList.contains("dark");
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div
      className={`p-2 rounded shadow ${
        isDark ? "bg-gray-800 text-gray-100 border border-gray-700" : "bg-white text-gray-900"
      }`}
      style={{ minWidth: 120 }}
    >
      <div className="font-semibold text-sm mb-1">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="text-sm">
          <span className="inline-block w-3 h-3 mr-2" style={{ background: p.color }} />
          {p.name}: <span className="font-semibold">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function Analytics() {
  const containerRef = useRef(null);
  const isDark = useDarkMode();

  // Raw items from localStorage
  const items = useMemo(
    () => JSON.parse(localStorage.getItem("items") || "[]"),
    []
  );

  // UI state
  const [timeframe, setTimeframe] = useState("7"); // "7", "30", "all"
  const [granularity, setGranularity] = useState("daily"); // daily | weekly | monthly
  const [categoryColors, setCategoryColors] = useState({});
  const [autoColors] = useState(DEFAULT_COLORS);

  // Build normalized categories and assign colors
  const { categoryCount, categoryData, colorsMap } = useMemo(() => {
    const cCount = {};
    items.forEach((it) => {
      if (!it.category) return;
      const normalized = it.category.trim().toLowerCase();
      const proper = normalized.charAt(0).toUpperCase() + normalized.slice(1);
      cCount[proper] = (cCount[proper] || 0) + 1;
    });
    const keys = Object.keys(cCount).sort((a, b) => cCount[b] - cCount[a]);
    const map = {};
    keys.forEach((k, i) => (map[k] = autoColors[i % autoColors.length]));
    const data = keys.map((k) => ({ name: k, count: cCount[k], color: map[k] }));
    return { categoryCount: cCount, categoryData: data, colorsMap: map };
  }, [items, autoColors]);

  // Persist color map (so charts keep same colors across re-renders)
  useEffect(() => {
    setCategoryColors(colorsMap);
  }, [colorsMap]);

  // Derived counts
  const lowStock = items.filter((it) => Number(it.quantity) < 5).length;
  const expired = items.filter((it) => it.expiry && new Date(it.expiry) < new Date()).length;

  // Helpers for date parsing (robust for different added formats)
  const parseDate = (d) => {
    if (!d) return null;
    // try ISO parse
    const iso = new Date(d);
    if (!isNaN(iso)) return iso;
    // try locale string fallback
    const parsed = Date.parse(d);
    return isNaN(parsed) ? null : new Date(parsed);
  };

  // Build timeline data depending on timeframe + granularity
  const timelineData = useMemo(() => {
    const now = new Date();
    let cutoff = new Date(0);
    if (timeframe === "7") {
      cutoff = new Date();
      cutoff.setDate(now.getDate() - 6); // last 7 days inclusive
    } else if (timeframe === "30") {
      cutoff = new Date();
      cutoff.setDate(now.getDate() - 29);
    } // else 'all' keep as epoch

    const bucket = {}; // key -> count
    items.forEach((it) => {
      const dt = parseDate(it.added) || parseDate(it.dateAdded) || null;
      if (!dt) return;
      if (timeframe !== "all" && dt < cutoff) return;

      let key;
      if (granularity === "daily") {
        key = dt.toLocaleDateString();
      } else if (granularity === "weekly") {
        // week label Year-W<weeknum>
        const first = new Date(dt.getFullYear(), 0, 1);
        const week = Math.ceil(((dt - first) / 86400000 + first.getDay() + 1) / 7);
        key = `${dt.getFullYear()}-W${week}`;
      } else { // monthly
        key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`;
      }
      bucket[key] = (bucket[key] || 0) + 1;
    });

    // Turn into sorted array
    const entries = Object.keys(bucket)
      .sort((a, b) => {
        // Try parsing back to date for accurate sort
        const da = new Date(a);
        const db = new Date(b);
        if (!isNaN(da) && !isNaN(db)) return da - db;
        return a.localeCompare(b);
      })
      .map((k) => ({ date: k, count: bucket[k] }));

    // If timeframe is small and daily + no entries, seed the last N days with zeros so chart looks consistent
    if (granularity === "daily" && (timeframe === "7" || timeframe === "30")) {
      const days = timeframe === "7" ? 7 : 30;
      const arr = [];
      for (let i = days - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const label = d.toLocaleDateString();
        const found = entries.find((e) => e.date === label);
        arr.push({ date: label, count: found ? found.count : 0 });
      }
      return arr;
    }

    return entries;
  }, [items, timeframe, granularity]);

  // Export helpers
  const exportAsImage = async (filename = "analytics.png") => {
    if (!containerRef.current) return;
    const node = containerRef.current;
    const canvas = await html2canvas(node, { scale: 2, useCORS: true });
    const data = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = data;
    link.download = filename;
    link.click();
  };

  const exportAsPDF = async (filename = "analytics.pdf") => {
    if (!containerRef.current) return;
    const node = containerRef.current;
    const canvas = await html2canvas(node, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [canvas.width, canvas.height],
    });
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(filename);
  };

  // Download a single chart area by id (if you want separate buttons)
  const downloadChartById = async (elementId, filename) => {
    const el = document.getElementById(elementId);
    if (!el) return;
    const canvas = await html2canvas(el, { scale: 2, useCORS: true });
    const data = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = data;
    link.download = filename;
    link.click();
  };

  // Hover / subtle animation classes
  const cardBase =
    "bg-white dark:bg-gray-800 shadow hover:shadow-lg transition-shadow rounded-lg p-6";

  return (
    <div ref={containerRef} className="p-6">
      <div className="flex items-start justify-between mb-6">
        <h1 className="text-2xl font-semibold">Analytics Dashboard</h1>

        <div className="flex gap-3 items-center">
           <select
  value={timeframe}
  onChange={(e) => setTimeframe(e.target.value)}
  className="
    p-2 rounded 
    border border-gray-300 
    bg-white text-gray-900
    dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100
    cursor-pointer
  "
>

            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="all">All time</option>
          </select>

           <select
  value={granularity}
  onChange={(e) => setGranularity(e.target.value)}
  className="
    p-2 rounded 
    border border-gray-300 
    bg-white text-gray-900
    dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100
    cursor-pointer
  "
>

            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>

          <button
            onClick={() => exportAsImage("analytics.png")}
            className="px-3 py-2 rounded bg-gradient-to-r from-indigo-500 to-pink-500 text-white shadow"
          >
            Download PNG
          </button>

          <button
            onClick={() => exportAsPDF("analytics.pdf")}
            className="px-3 py-2 rounded bg-gradient-to-r from-yellow-500 to-red-500 text-white shadow"
          >
            Export PDF
          </button>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className={cardBase}>
          <h2 className="text-gray-600 dark:text-gray-400 text-sm">Total Items</h2>
          <p className="text-3xl font-semibold mt-2">{items.length}</p>
        </div>

        <div className={cardBase}>
          <h2 className="text-gray-600 dark:text-gray-400 text-sm">Categories</h2>
          <p className="text-3xl font-semibold mt-2">{Object.keys(categoryCount).length}</p>
        </div>

        <div className={cardBase}>
          <h2 className="text-gray-600 dark:text-gray-400 text-sm">Low Stock</h2>
          <p className="text-3xl font-semibold mt-2">{lowStock}</p>
        </div>

        <div className={cardBase}>
          <h2 className="text-gray-600 dark:text-gray-400 text-sm">Expired</h2>
          <p className="text-3xl font-semibold mt-2">{expired}</p>
        </div>
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Bar chart */}
        <div className={cardBase}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Items by Category</h3>
            <div className="flex items-center gap-2">
              <div className="text-sm text-gray-500 dark:text-gray-400">Legend:</div>
              <div className="flex gap-2">
                {categoryData.slice(0, 5).map((c) => (
                  <div key={c.name} className="flex items-center text-sm">
                    <span className="w-3 h-3 inline-block mr-2 rounded" style={{ background: c.color }} />
                    {c.name}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ width: "100%", height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {categoryData.map((entry) => (
                    <Cell key={entry.name} fill={categoryColors[entry.name] || "#3b82f6"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Pie charts */}
        <div className={cardBase}>
          <h3 className="text-lg font-semibold mb-3">Stock Status</h3>

          <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-8">
            <div className="flex flex-col items-center">
              <div className="mb-2 text-sm font-medium">Low Stock</div>
              <div id="chart-lowstock" style={{ width: 220, height: 220 }}>
                <PieChart width={220} height={220}>
                  <Pie
                    data={[
                      { name: "Low Stock", value: lowStock },
                      { name: "Others", value: Math.max(0, items.length - lowStock) },
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    isAnimationActive
                  >
                    <Cell fill="#fbbf24" />
                    <Cell fill={isDark ? "#374151" : "#d1d5db"} />
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="mb-2 text-sm font-medium">Expired</div>
              <div id="chart-expired" style={{ width: 220, height: 220 }}>
                <PieChart width={220} height={220}>
                  <Pie
                    data={[
                      { name: "Expired", value: expired },
                      { name: "Good", value: Math.max(0, items.length - expired) },
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    isAnimationActive
                  >
                    <Cell fill="#ef4444" />
                    <Cell fill={isDark ? "#374151" : "#d1d5db"} />
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </div>
            </div>
          </div>

          <div className="mt-4 flex gap-2 justify-center">
            <button
              onClick={() => downloadChartById("chart-lowstock", "lowstock.png")}
              className="px-3 py-2 rounded bg-indigo-600 text-white"
            >
              Download Low Stock
            </button>
            <button
              onClick={() => downloadChartById("chart-expired", "expired.png")}
              className="px-3 py-2 rounded bg-red-600 text-white"
            >
              Download Expired
            </button>
          </div>
        </div>

        {/* Full width: line trend */}
        <div className={`${cardBase} lg:col-span-2`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Recently Added Trend</h3>
            <div className="text-sm text-gray-500 dark:text-gray-400">Granularity: {granularity}</div>
          </div>

          <div style={{ width: "100%", height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  isAnimationActive
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

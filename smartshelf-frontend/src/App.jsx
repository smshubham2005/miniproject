 import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Items from "./pages/Items";
import AddItem from "./pages/AddItem";
import EditItem from "./pages/EditItem";
import Activity from "./pages/Activity";
import Categories from "./pages/Categories";
import DashboardLayout from "./layouts/DashboardLayout";
import Analytics from "./pages/Analytics";
import ChatBot from "./components/ChatBot";

function App() {

  // DARK MODE STATE (INSIDE COMPONENT, WHERE IT BELONGS)
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  // APPLY THEME
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <BrowserRouter>
      <ChatBot />
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* DASHBOARD ROUTES */}
        <Route
          path="/dashboard"
          element={
            <DashboardLayout darkMode={darkMode} setDarkMode={setDarkMode}>
              <Dashboard />
            </DashboardLayout>
          }
        />

        <Route
          path="/items"
          element={
            <DashboardLayout darkMode={darkMode} setDarkMode={setDarkMode}>
              <Items />
            </DashboardLayout>
          }
        />

        <Route
          path="/add-item"
          element={
            <DashboardLayout darkMode={darkMode} setDarkMode={setDarkMode}>
              <AddItem />
            </DashboardLayout>
          }
        />

        <Route
          path="/edit-item/:id"
          element={
            <DashboardLayout darkMode={darkMode} setDarkMode={setDarkMode}>
              <EditItem />
            </DashboardLayout>
          }
        />

        <Route
          path="/activity"
          element={
            <DashboardLayout darkMode={darkMode} setDarkMode={setDarkMode}>
              <Activity />
            </DashboardLayout>
          }
        />
        <Route
          path="/analytics"
          element={
            <DashboardLayout darkMode={darkMode} setDarkMode={setDarkMode}>
              <Analytics />
            </DashboardLayout>
          }
        />

        <Route
          path="/categories"
          element={
            <DashboardLayout darkMode={darkMode} setDarkMode={setDarkMode}>
              <Categories />
            </DashboardLayout>
          }
        />

         


      </Routes>
    </BrowserRouter>
  );
}

export default App;

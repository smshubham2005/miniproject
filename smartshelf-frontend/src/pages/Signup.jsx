 import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Please fill all fields.");
      return;
    }

    // If phone provided, basic validation (digits only, 7-15 digits)
    if (phone) {
      const cleaned = phone.replace(/[^0-9]/g, "");
      if (!/^\d{7,15}$/.test(cleaned)) {
        setError("Please enter a valid phone number (digits only)");
        return;
      }
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    // Save user (single) and append to users array for multi-user support
    const newUser = { email, password, phone };
    localStorage.setItem("user", JSON.stringify(newUser));

    const users = JSON.parse(localStorage.getItem("users")) || [];
    // Prevent duplicate by email
    const exists = users.some((u) => u.email === email || (phone && u.phone === phone));
    if (!exists) {
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
    }

    setSuccess("Account created successfully!");

    setTimeout(() => {
      navigate("/");
    }, 800);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 relative overflow-hidden p-4">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
      
      <form className="bg-white/95 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-2xl w-full sm:w-96 max-w-sm relative z-10" onSubmit={handleSignup}>
        <h1 className="text-2xl md:text-3xl font-semibold text-center mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Create Account</h1>

        {error && <p className="text-red-600 text-xs md:text-sm mb-2 text-center font-semibold">{error}</p>}
        {success && <p className="text-green-600 text-xs md:text-sm mb-2 text-center font-semibold">{success}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 md:p-3 mb-3 md:mb-4 border rounded-lg text-sm md:text-base dark:bg-gray-100"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="text"
          placeholder="Phone (optional)"
          className="w-full p-2 md:p-3 mb-3 md:mb-4 border rounded-lg text-sm md:text-base dark:bg-gray-100"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 md:p-3 mb-4 md:mb-6 border rounded-lg text-sm md:text-base dark:bg-gray-100"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 md:py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 text-sm md:text-base">Sign Up</button>

        <p className="text-xs md:text-sm text-center mt-3 md:mt-4">
          Already have an account?
          <Link to="/" className="text-blue-600 ml-1 font-semibold hover:underline">Login</Link>
        </p>
      </form>
    </div>
  );
}

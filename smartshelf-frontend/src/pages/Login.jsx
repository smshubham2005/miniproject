 import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser) {
      setError("No account found. Please create one.");
      return;
    }

    if (email === storedUser.email && password === storedUser.password) {
      setSuccess("Login successful!");
      localStorage.setItem("loggedIn", "true");

      setTimeout(() => {
        navigate("/dashboard");
      }, 700);
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-cyan-400 to-teal-500 relative overflow-hidden p-4">
      {/* Decorative Elements */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
      
      <form className="bg-white/95 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-2xl w-full sm:w-96 max-w-sm relative z-10" onSubmit={handleLogin}>
        <h1 className="text-2xl md:text-3xl font-semibold text-center mb-6 bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">SmartShelf Login</h1>

        {error && <p className="text-red-600 text-xs md:text-sm mb-2 text-center font-semibold">{error}</p>}
        {success && <p className="text-green-600 text-xs md:text-sm mb-2 text-center font-semibold">{success}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 md:p-3 mb-3 md:mb-4 border rounded-lg text-sm md:text-base"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 md:p-3 mb-4 md:mb-6 border rounded-lg text-sm md:text-base"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white py-2 md:py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 text-sm md:text-base">Login</button>

        <p className="text-xs md:text-sm text-center mt-2 md:mt-3">
          <Link to="/forgot-password" className="text-blue-600 font-semibold hover:underline">Forgot Password?</Link>
        </p>

        <p className="text-xs md:text-sm text-center mt-3 md:mt-4">
          Don't have an account?
          <Link to="/signup" className="text-blue-600 ml-1 font-semibold hover:underline">Sign up</Link>
        </p>
      </form>
    </div>
  );
}

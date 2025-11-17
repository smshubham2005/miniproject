import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState(""); // can be email or phone
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Password
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Mock OTP generation
  const generateOTP = (contactValue, contactType) => {
    const mockOTP = Math.floor(100000 + Math.random() * 900000).toString();
    localStorage.setItem("resetOTP", mockOTP);
    localStorage.setItem("resetContact", contactValue);
    localStorage.setItem("resetContactType", contactType);
    return mockOTP;
  };

  // Step 1: Send Email
  const handleSendEmail = (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    const value = contact?.trim() || email?.trim();

    if (!value) {
      setError("Please enter your email address or phone number");
      return;
    }

    // Determine whether input is email or phone
    const isEmail = /@/.test(value);
    const contactType = isEmail ? "email" : "phone";

    if (isEmail) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        setError("Please enter a valid email address");
        return;
      }
    } else {
      // Basic phone validation: digits only, 7-15 length
      const cleaned = value.replace(/[^0-9]/g, "");
      if (!/^\d{7,15}$/.test(cleaned)) {
        setError("Please enter a valid phone number (digits only)");
        return;
      }
    }

    // Mock: Check if user exists (support both single 'user' and 'users' array)
    const storedSingle = JSON.parse(localStorage.getItem("user"));
    const users = JSON.parse(localStorage.getItem("users")) || [];

    let userExists = false;
    if (contactType === "email") {
      if (storedSingle && storedSingle.email === value) userExists = true;
      if (users.some((u) => u.email === value)) userExists = true;
    } else {
      if (storedSingle && storedSingle.phone === value) userExists = true;
      if (users.some((u) => u.phone === value)) userExists = true;
    }

    if (!userExists) {
      setError("No account found with this contact (email or phone)");
      return;
    }

    // Generate and send OTP (mock)
    const mockOTP = generateOTP(value, contactType);
    if (contactType === "email") {
      console.log(`Mock OTP sent to email ${value}: ${mockOTP}`);
    } else {
      console.log(`Mock OTP sent to phone ${value}: ${mockOTP}`);
    }

    setMessage("✅ OTP sent to your contact! (Demo: Check console for mock OTP)");
    setStep(2);
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!otp) {
      setError("Please enter the OTP");
      return;
    }

    const storedOTP = localStorage.getItem("resetOTP");

    if (otp !== storedOTP) {
      setError("Invalid OTP. Please try again");
      return;
    }

    setMessage("✅ OTP verified successfully!");
    setStep(3);
  };

  // Step 3: Reset Password
  const handleResetPassword = (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!newPassword || !confirmPassword) {
      setError("Please fill all fields");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Update user password (support single 'user' or 'users' array)
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const storedSingle = JSON.parse(localStorage.getItem("user"));
    const storedContact = localStorage.getItem("resetContact");
    const storedContactType = localStorage.getItem("resetContactType");

    if (storedContactType === "email") {
      const updatedUsers = users.map((u) =>
        u.email === storedContact ? { ...u, password: newPassword } : u
      );
      localStorage.setItem("users", JSON.stringify(updatedUsers));

      if (storedSingle && storedSingle.email === storedContact) {
        localStorage.setItem(
          "user",
          JSON.stringify({ ...storedSingle, password: newPassword })
        );
      }
    } else if (storedContactType === "phone") {
      const updatedUsers = users.map((u) =>
        u.phone === storedContact ? { ...u, password: newPassword } : u
      );
      localStorage.setItem("users", JSON.stringify(updatedUsers));

      if (storedSingle && storedSingle.phone === storedContact) {
        localStorage.setItem(
          "user",
          JSON.stringify({ ...storedSingle, password: newPassword })
        );
      }
    }

    // Clear reset data
    localStorage.removeItem("resetOTP");
    localStorage.removeItem("resetContact");
    localStorage.removeItem("resetContactType");

    setMessage("✅ Password reset successfully!");

    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-cyan-400 to-teal-400 flex items-center justify-center px-4 py-8">
        <div className="w-full sm:w-96 max-w-sm">
          {/* Animated Background Card */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-3xl blur-3xl opacity-20"
            style={{
              animation: "pulse 4s ease-in-out infinite",
            }}
          ></div>

          {/* Main Form Card */}
          <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20">
            <h1 className="text-3xl font-bold text-white mb-2 text-center">
              🔐 Reset Password
            </h1>
            <p className="text-white/70 text-center mb-8">
              {step === 1
                ? "Enter your email or phone to reset your password"
                : step === 2
                ? "Enter the OTP sent to your contact"
                : "Create your new password"}
            </p>

            {/* Step 1: Email */}
            {step === 1 && (
              <form onSubmit={handleSendEmail} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    📧 Email or Phone
                  </label>
                  <input
                    type="text"
                    placeholder="you@email.com or 9876543210"
                    className="w-full px-4 py-3 bg-white/20 text-white placeholder-white/50 border-2 border-white/30 rounded-lg focus:outline-none focus:border-white/60 transition-all duration-300 backdrop-blur-sm"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                  />
                </div>

                {error && (
                  <div className="bg-red-500/20 border border-red-400/50 text-red-200 px-4 py-3 rounded-lg text-sm">
                    ❌ {error}
                  </div>
                )}

                {message && (
                  <div className="bg-green-500/20 border border-green-400/50 text-green-200 px-4 py-3 rounded-lg text-sm">
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-white to-white/80 text-blue-600 py-3 rounded-lg font-bold text-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  Send Reset OTP
                </button>
              </form>
            )}

            {/* Step 2: OTP */}
            {step === 2 && (
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    🔑 Enter OTP
                  </label>
                  <input
                    type="text"
                    placeholder="000000"
                    maxLength="6"
                    className="w-full px-4 py-3 bg-white/20 text-white text-center text-2xl tracking-widest placeholder-white/50 border-2 border-white/30 rounded-lg focus:outline-none focus:border-white/60 transition-all duration-300 backdrop-blur-sm font-mono"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  />
                  <p className="text-xs text-white/50 text-center mt-2">
                    📧 Check your contact for the OTP (Demo OTP shown in console)
                  </p>
                </div>

                {error && (
                  <div className="bg-red-500/20 border border-red-400/50 text-red-200 px-4 py-3 rounded-lg text-sm">
                    ❌ {error}
                  </div>
                )}

                {message && (
                  <div className="bg-green-500/20 border border-green-400/50 text-green-200 px-4 py-3 rounded-lg text-sm">
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-white to-white/80 text-blue-600 py-3 rounded-lg font-bold text-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  Verify OTP
                </button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full bg-white/10 text-white py-3 rounded-lg font-semibold hover:bg-white/20 transition-all duration-200"
                >
                  Back
                </button>
              </form>
            )}

            {/* Step 3: New Password */}
            {step === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    🔐 New Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    className="w-full px-4 py-3 bg-white/20 text-white placeholder-white/50 border-2 border-white/30 rounded-lg focus:outline-none focus:border-white/60 transition-all duration-300 backdrop-blur-sm"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    🔐 Confirm Password
                  </label>
                  <input
                    type="password"
                    placeholder="Confirm password"
                    className="w-full px-4 py-3 bg-white/20 text-white placeholder-white/50 border-2 border-white/30 rounded-lg focus:outline-none focus:border-white/60 transition-all duration-300 backdrop-blur-sm"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                {error && (
                  <div className="bg-red-500/20 border border-red-400/50 text-red-200 px-4 py-3 rounded-lg text-sm">
                    ❌ {error}
                  </div>
                )}

                {message && (
                  <div className="bg-green-500/20 border border-green-400/50 text-green-200 px-4 py-3 rounded-lg text-sm">
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-white to-white/80 text-blue-600 py-3 rounded-lg font-bold text-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  Reset Password
                </button>
              </form>
            )}

            {/* Footer Links */}
            <div className="mt-6 text-center space-y-3">
              <Link
                to="/"
                className="block text-white/80 hover:text-white transition-colors duration-200"
              >
                ← Back to Login
              </Link>

              <p className="text-white/60 text-sm">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-white font-semibold hover:underline"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </div>

          {/* Decorative Elements */}
          <style>{`
            @keyframes pulse {
              0%, 100% { opacity: 0.2; }
              50% { opacity: 0.4; }
            }
          `}</style>
        </div>
      </div>
    </>
  );
}

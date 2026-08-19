import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, AlertCircle, ArrowRight } from "lucide-react";
import authBg from "../../assets/images/auth_bg.png";

const AdminSignin: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("https://api.gavify.media/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid credentials");
      }

      // Save token in localStorage
      localStorage.setItem("adminToken", data.token);
      navigate("/admin/dashboard");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-screen flex items-center justify-center bg-[#06102F] overflow-hidden font-sans">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center pointer-events-none"
        style={{ backgroundImage: `url(${authBg})` }}
      />
      {/* Decorative gradient glowing spheres */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#0086F0]/20 rounded-full blur-[120px] pointer-events-none animate-pulse duration-[6s]" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-[#7C5CFF]/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Main glass card */}
      <div 
        className="relative z-10 w-full max-w-md p-10 rounded-3xl border border-white/15 bg-white/[0.06] backdrop-blur-xl shadow-2xl transition-all duration-300 hover:border-white/25"
        style={{ boxShadow: "0 20px 50px rgba(0, 0, 0, 0.7)" }}
      >
        <div className="flex flex-col items-center mb-8 text-center">
          {/* Neon Logo / Branding Container */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#0086F0] to-[#5ACFFE] flex items-center justify-center shadow-lg shadow-[#0086F0]/30 mb-4">
            <Lock className="w-8 h-8 text-white stroke-[2.2]" />
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Admin Portal</h2>
          <p className="text-zinc-400 text-sm mt-2">Sign in to manage BroEditz content</p>
        </div>

        {error && (
          <div className="flex items-center gap-3 p-4 mb-6 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-sm animate-shake">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          {/* Email input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider pl-1">Email Address</label>
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-[#5ACFFE] transition-colors duration-200">
                <Mail className="w-5 h-5" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@broeditz.com"
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-[#0086F0]/80 focus:ring-1 focus:ring-[#0086F0]/50 transition-all duration-200 text-[15px]"
              />
            </div>
          </div>

          {/* Password input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider pl-1">Password</label>
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-[#5ACFFE] transition-colors duration-200">
                <Lock className="w-5 h-5" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-[#0086F0]/80 focus:ring-1 focus:ring-[#0086F0]/50 transition-all duration-200 text-[15px]"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-[#0086F0] to-[#5ACFFE] hover:from-[#0073ce] hover:to-[#4ab9f0] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 group shadow-lg shadow-[#0086F0]/20 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? "Authenticating..." : "Sign In"}
            {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />}
          </button>
        </form>

        <div className="text-center mt-6 flex flex-col gap-2">
          <button
            onClick={() => navigate("/admin/signup")}
            className="text-xs text-[#5ACFFE] hover:text-white transition-colors cursor-pointer"
          >
            Don't have an account? Sign up
          </button>
          <button
            onClick={() => navigate("/")}
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
          >
            Return to public site
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSignin;

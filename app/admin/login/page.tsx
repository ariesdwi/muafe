"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await login(email, password);
      router.push("/admin");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login gagal. Periksa email & password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8F2] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl text-[#2C2C2C]">
            MUA<span className="text-[#B76E79]">.</span>Studio
          </h1>
          <p className="text-[#B76E79] text-sm mt-1 tracking-widest uppercase">Admin Panel</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-[#F7D9D9] p-8">
          <h2 className="font-serif text-2xl text-[#2C2C2C] mb-6">Masuk</h2>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#2C2C2C] mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full px-4 py-3 rounded-xl border border-[#F7D9D9] bg-[#FFF8F2] text-[#2C2C2C] focus:outline-none focus:border-[#B76E79] focus:ring-2 focus:ring-[#B76E79]/20 transition"
                placeholder="admin@muastudio.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2C2C2C] mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-[#F7D9D9] bg-[#FFF8F2] text-[#2C2C2C] focus:outline-none focus:border-[#B76E79] focus:ring-2 focus:ring-[#B76E79]/20 transition"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B76E79]/70 hover:text-[#B76E79] transition"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-[#B76E79] text-white font-medium hover:bg-[#a35f69] transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 size={18} className="animate-spin" />}
              {isLoading ? "Memproses..." : "Masuk"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-[#2C2C2C]/40 mt-6">
          &copy; {new Date().getFullYear()} MUA.Studio
        </p>
      </div>
    </div>
  );
}

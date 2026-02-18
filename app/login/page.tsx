"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import AOS from "aos";
import "aos/dist/aos.css";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    AOS.init({ duration: 700 });
  }, []);

  const handleSubmit = async () => {
    setLoading(true);

    const ok = await login(email, password);

    setLoading(false);

    if (ok) {
      toast.success("Muvaffaqiyatli tizimga kirdingiz");
      router.push("/dashboard"); // ← redirect
    } else {
      toast.error("Email yoki parol noto‘g‘ri");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div
        data-aos="zoom-in"
        className="bg-[#111] p-8 rounded-2xl w-[380px] text-white shadow-xl"
      >
        <h2 className="text-2xl font-bold text-center mb-2">
          Xush kelibsiz 👋
        </h2>

        <p className="text-gray-400 text-center mb-6">
          Hisobingizga kirish uchun email va parolni kiriting
        </p>

        <label>Email</label>
        <input
          type="email"
          className="w-full p-3 mb-4 rounded bg-[#1b1b1b] border border-gray-700"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email kiriting"
          disabled={loading}
        />

        <label>Parol</label>
        <input
          type="password"
          className="w-full p-3 mb-4 rounded bg-[#1b1b1b] border border-gray-700"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Parol kiriting"
          disabled={loading}
        />

        <button
          onClick={handleSubmit}
          disabled={loading || !email || !password}
          className={`w-full py-3 rounded-lg font-semibold ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-white text-black hover:bg-gray-200"
          }`}
        >
          {loading ? "Yuklanmoqda..." : "Kirish"}
        </button>
      </div>
    </div>
  );
}

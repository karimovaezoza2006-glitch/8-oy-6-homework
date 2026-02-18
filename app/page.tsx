"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import "aos/dist/aos.css";
import toast from "react-hot-toast";



export default function Login() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);

    if (ok) {
      toast.success("Muvaffaqiyatli tizimga kirdingiz");
      router.push("/");
    } else {
      toast.error("Email yoki parol noto‘g‘ri");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-[#111] p-8 rounded-2xl w-[380px] text-white shadow-xl">
        <h2 className="text-2xl font-bold text-center mb-2">
          Xush kelibsiz 👋
        </h2>

        <input
          className="w-full p-3 mb-4 rounded bg-[#1b1b1b]"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-3 mb-4 rounded bg-[#1b1b1b]"
          placeholder="Parol"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="w-full py-3 rounded bg-white text-black"
        >
          {loading ? "Yuklanmoqda..." : "Kirish"}
        </button>
      </div>
    </div>
  );
}

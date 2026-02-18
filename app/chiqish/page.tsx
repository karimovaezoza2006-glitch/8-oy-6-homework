"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/context/ProfileContext";

export default function ProfilePage() {
  const router = useRouter();
  const { logout } = useAuth();
  const { profile } = useProfile();

  const handleLogout = () => {
    logout(); // agar contextda logout bo‘lsa
    router.replace("/login");
  };

  return (
    <div className="max-w-xl text-white">
      <h1 className="text-2xl font-bold mb-6">Profil</h1>

      <div className="bg-gray-900 p-6 rounded-xl shadow space-y-4 border border-gray-800">
        <div>
          <p className="text-gray-400 text-sm">Ism</p>
          <p className="font-semibold">
            {profile.firstName} {profile.lastName}
          </p>
        </div>

        <div>
          <p className="text-gray-400 text-sm">Lavozim</p>
          <p className="font-semibold capitalize">{profile.role}</p>
        </div>

        <div>
          <p className="text-gray-400 text-sm">Email</p>
          <p className="font-semibold">{profile.email}</p>
        </div>
      </div>

      {/* CHIQISH */}
      <button
        onClick={handleLogout}
        className="mt-6 flex items-center gap-2 bg-red-600 hover:bg-red-700 px-5 py-3 rounded-lg transition"
      >
        <LogOut size={18} />
        Chiqish
      </button>
    </div>
  );
}

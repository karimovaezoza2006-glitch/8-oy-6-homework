"use client";

import Image from "next/image";
import { useProfile } from "@/context/ProfileContext";
import { useAuth } from "@/context/AuthContext";

export default function Topbar() {
  const { profile } = useProfile();
  const { logout } = useAuth();

  if (!profile) return null;

  return (
    <header className="h-14 border-b border-gray-800 flex justify-between items-xenter px-6 bg-black">
      <span className="font-bold text-white">Dashboard</span>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-sm font-semibold text-white">
              {profile.firstName} {profile.lastName}
            </p>
            <p className="text-xs text-gray-400 capitalize">{profile.role}</p>
          </div>

          {profile.avatar ? (
            <Image
              src={profile.avatar}
              alt="avatar"
              width={32}
              height={32}
              className="rounded-full object-cover border border-gray-600"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm font-bold text-white">
              {profile.firstName?.[0]}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

"use client";

import React, { useMemo } from "react";
import { useProfile } from "../context/ProfileContext";
import { usePathname } from "next/navigation";
import { FiSun, FiBell, FiUser, FiSearch } from "react-icons/fi";
import { ModeToggle } from "./ModeToggle";

/* ================= ROUTE MAP ================= */

const routeMap: Record<string, string> = {
  asosiy: "Asosiy",
  managerlar: "Managerlar",
  adminlar: "Adminlar",
  ustozlar: "Ustozlar",
  studentlar: "Studentlar",
  guruhlar: "Guruhlar",
  kurslar: "Kurslar",
  payment: "Payment",
  profile: "Profile",
  sozlamalar: "Sozlamalar",
};

export default function Topbar() {
  const { profile } = useProfile();
  const pathname = usePathname();

  /* ================= CURRENT PAGE ================= */

  const currentPage = useMemo(() => {
    const segments = pathname.split("/");
    const lastSegment = segments[segments.length - 1];
    return routeMap[lastSegment] || "Dashboard";
  }, [pathname]);

  const displayImage = profile?.image;

  return (
    <div className="w-full px-4 md:px-8 py-4 bg-slate-950">
      <div className="w-full bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-3xl px-6 py-4 flex items-center justify-between shadow-2xl">
        {/* LEFT */}
        <div className="flex flex-col">
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mb-1">
            Dashboard / <span className="text-indigo-400">{currentPage}</span>
          </p>
          <h1 className="text-xl font-black text-white tracking-tight">
            {currentPage}
          </h1>
        </div>

        {/* SEARCH */}
        <div className="hidden md:flex items-center bg-slate-800/40 border border-white/5 rounded-2xl px-4 py-2 w-64">
          <FiSearch size={18} className="text-slate-500" />
          <input
            type="text"
            placeholder="Qidiruv..."
            className="bg-transparent outline-none text-sm text-white ml-3 w-full"
          />
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-6">
          <button className="relative p-2.5 rounded-2xl bg-slate-800/40 border border-white/5">
            <FiBell size={20} className="text-slate-400" />
          </button>

        
            <ModeToggle/>
          <div className="flex items-center gap-4 bg-slate-800/30 pl-4 pr-2 py-2 rounded-2xl border border-white/5">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-white">
                {profile?.first_name} {profile?.last_name}
              </p>
              <p className="text-xs text-slate-400">
                {profile?.role ?? "Manager"}
              </p>
            </div>

            <div className="w-10 h-10 rounded-xl overflow-hidden bg-indigo-600/20 flex items-center justify-center">
              {displayImage ? (
                <img
                  src={displayImage}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <FiUser className="text-indigo-400" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

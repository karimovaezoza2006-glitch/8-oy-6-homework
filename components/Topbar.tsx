"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useProfile } from "@/context/ProfileContext";
import { Moon, Sun, Bell } from "lucide-react";

export default function Topbar() {
  const { profile } = useProfile();
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");

    if (storedTheme === "light") {
      document.documentElement.classList.remove("dark");
      setDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
  }, []);

  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }

    setDarkMode(!darkMode);
  };

  if (!profile) return null;

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center px-8 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl sticky top-0 z-40 transition-colors">
      {/* LEFT */}
      <div>
        <h1 className="text-lg font-semibold text-slate-800 dark:text-white">
          Dashboard
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Admin boshqaruv paneli
        </p>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-6">
        {/* Notification Icon */}
        <button className="relative p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition">
          <Bell className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition"
        >
          {darkMode ? (
            <Sun className="w-5 h-5 text-yellow-400" />
          ) : (
            <Moon className="w-5 h-5 text-slate-700" />
          )}
        </button>

        {/* Profile Section */}
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-800 dark:text-white">
              {profile.firstName} {profile.lastName}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
              {profile.role}
            </p>
          </div>

          {profile.avatar ? (
            <Image
              src={profile.avatar}
              alt="avatar"
              width={36}
              height={36}
              className="rounded-full object-cover border border-slate-300 dark:border-slate-700"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 flex items-center justify-center text-white font-semibold shadow-md">
              {profile.firstName?.[0]}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

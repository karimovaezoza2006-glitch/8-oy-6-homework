"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  FiHome,
  FiUsers,
  FiUser,
  FiBook,
  FiLayers,
  FiDollarSign,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
} from "react-icons/fi";

const menu = [
  { name: "Asosiy", path: "/dashboard/asosiy", icon: <FiHome /> },
  { name: "Managerlar", path: "/dashboard/managerlar", icon: <FiUsers /> },
  { name: "Adminlar", path: "/dashboard/adminlar", icon: <FiUser /> },
  { name: "Ustozlar", path: "/dashboard/ustozlar", icon: <FiUser /> },
  { name: "Studentlar", path: "/dashboard/studentlar", icon: <FiUsers /> },
  { name: "Guruhlar", path: "/dashboard/guruhlar", icon: <FiLayers /> },
  { name: "Kurslar", path: "/dashboard/kurslar", icon: <FiBook /> },
  { name: "Payment", path: "/dashboard/payment", icon: <FiDollarSign /> },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const [openConfirm, setOpenConfirm] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);

  const linkClass = (path: string) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-xl transition ${
      pathname === path
        ? "bg-indigo-600/20 text-white"
        : "text-slate-400 hover:bg-slate-800 hover:text-white"
    }`;

  const confirmLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <>

      <div className="lg:hidden flex items-start justify-center p-4 pt-15 bg-[#0f172a] border-b border-slate-800">
        
        <button onClick={() => setOpenSidebar(true)}>
          <FiMenu className="text-white text-xl size={16}" />
        </button>
      </div>

   
      {openSidebar && (
        <div
          onClick={() => setOpenSidebar(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

     
      <aside
        className={`fixed lg:static top-0 left-0 h-full w-72 bg-[#0f172a] border-r border-slate-800 p-5 flex flex-col shadow-2xl z-50 transform transition-transform duration-300
        ${openSidebar ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
      
        <div className="lg:hidden flex justify-end mb-4">
          <button onClick={() => setOpenSidebar(false)}>
            <FiX className="text-white text-xl" />
          </button>
        </div>

      
        <div className="mb-8">
          <div className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-blue-500 bg-clip-text text-transparent">
            Admin CRM
          </div>
          <p className="text-slate-400 text-xs mt-1">Boshqaruv paneli</p>
        </div>

        
        <nav className="space-y-2">
          {menu.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setOpenSidebar(false)}
              className={linkClass(item.path)}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

   
        <div className="mt-auto pt-6 border-t border-slate-800">
          <div className="p-4 bg-slate-800/60 rounded-2xl mb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold text-lg">
                A
              </div>
              <p className="text-sm font-semibold text-white">Admin</p>
            </div>

            <div className="space-y-2">
              <Link
                href="/dashboard/profile"
                onClick={() => setOpenSidebar(false)}
                className="flex items-center gap-3 text-sm text-slate-300 hover:text-white hover:bg-slate-700 px-3 py-2 rounded-lg transition"
              >
                <FiUser />
                Profile
              </Link>

              <Link
                href="/dashboard/sozlamalar"
                onClick={() => setOpenSidebar(false)}
                className="flex items-center gap-3 text-sm text-slate-300 hover:text-white hover:bg-slate-700 px-3 py-2 rounded-lg transition"
              >
                <FiSettings />
                Sozlamalar
              </Link>

              <button
                onClick={() => {
                  setOpenSidebar(false);
                  setOpenConfirm(true);
                }}
                className="w-full flex items-center gap-3 text-sm text-red-400 hover:bg-red-500/10 px-3 py-2 rounded-lg transition"
              >
                <FiLogOut />
                Chiqish
              </button>
            </div>
          </div>
        </div>
      </aside>

      
      {openConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[60]">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-sm shadow-2xl">
            <h2 className="text-lg font-semibold mb-3 text-white">
              Tizimdan chiqish
            </h2>

            <p className="text-sm text-slate-400 mb-6">
              Rostdan ham tizimdan chiqmoqchimisiz?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setOpenConfirm(false)}
                className="px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition text-sm text-white"
              >
                Bekor
              </button>

              <button
                onClick={confirmLogout}
                className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition text-sm text-white"
              >
                Ha, chiqaman
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

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

const otherMenu = [
  { name: "Sozlamalar", path: "/dashboard/sozlamalar", icon: <FiSettings /> },
  { name: "Profile", path: "/dashboard/profile", icon: <FiUser /> },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const [openConfirm, setOpenConfirm] = useState(false);

  const linkClass = (path: string) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
      pathname === path ? "bg-gray-800" : "hover:bg-gray-800"
    }`;

  const confirmLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <>
      <aside className="w-64 bg-[#0b0b0b] border-r border-gray-800 p-4 flex flex-col">
        <h1 className="text-xl font-bold mb-6">Admin CRM</h1>

        <p className="text-gray-400 mb-2 text-sm">Menu</p>
        <nav className="space-y-1">
          {menu.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={linkClass(item.path)}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-6">
          <p className="text-gray-400 mb-2 text-sm">Boshqalar</p>
          <nav className="space-y-1">
            {otherMenu.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={linkClass(item.path)}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Logout button */}
        <div className="mt-auto pt-4 border-t border-gray-800">
          <button
            onClick={() => setOpenConfirm(true)}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition"
          >
            <FiLogOut />
            Chiqish
          </button>
        </div>
      </aside>

      {/* ================= CONFIRM MODAL ================= */}
      {openConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 text-white p-6 rounded-xl w-full max-w-sm shadow-2xl animate-fadeIn">
            <h2 className="text-lg font-bold mb-4">Tizimdan chiqish</h2>

            <p className="text-sm text-gray-400 mb-6">
              Rostdan ham tizimdan chiqmoqchimisiz?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setOpenConfirm(false)}
                className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition"
              >
                Bekor
              </button>

              <button
                onClick={confirmLogout}
                className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition"
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

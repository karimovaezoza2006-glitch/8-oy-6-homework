"use client";

import { Users, GraduationCap, UserCheck, Wallet } from "lucide-react";

export default function AsosiyPage() {
  const stats = [
    {
      title: "Studentlar",
      value: 124,
      icon: <Users size={22} />,
      color: "bg-blue-500/10 text-blue-500",
    },
    {
      title: "Ustozlar",
      value: 18,
      icon: <GraduationCap size={22} />,
      color: "bg-emerald-500/10 text-emerald-500",
    },
    {
      title: "Managerlar",
      value: 6,
      icon: <UserCheck size={22} />,
      color: "bg-purple-500/10 text-purple-500",
    },
    {
      title: "Daromad",
      value: "2 100 000 so‘m",
      icon: <Wallet size={22} />,
      color: "bg-amber-500/10 text-amber-500",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-4 sm:px-6 lg:px-10 py-8 space-y-10">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Asosiy Panel</h1>
        <p className="text-slate-400 text-sm mt-1">
          CRM boshqaruv tizimi umumiy statistikasi
        </p>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}
              >
                {item.icon}
              </div>
            </div>

            <h3 className="text-slate-400 text-sm">{item.title}</h3>
            <p className="text-2xl font-bold mt-1">{item.value}</p>
          </div>
        ))}
      </div>

      {/* QUICK ACTIONS */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Tezkor Harakatlar</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button className="bg-emerald-600 hover:bg-emerald-500 py-3 rounded-xl transition font-medium">
            + Student qo‘shish
          </button>

          <button className="bg-blue-600 hover:bg-blue-500 py-3 rounded-xl transition font-medium">
            + Ustoz qo‘shish
          </button>

          <button className="bg-purple-600 hover:bg-purple-500 py-3 rounded-xl transition font-medium">
            + Manager qo‘shish
          </button>
        </div>
      </div>

      {/* RECENT ACTIVITY */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <h2 className="text-lg font-semibold mb-6">So‘nggi Faoliyat</h2>

        <div className="space-y-4">
          <div className="flex justify-between border-b border-slate-800 pb-3">
            <span className="text-slate-300">Yangi student qo‘shildi</span>
            <span className="text-slate-500 text-sm">2 daqiqa oldin</span>
          </div>

          <div className="flex justify-between border-b border-slate-800 pb-3">
            <span className="text-slate-300">To‘lov amalga oshirildi</span>
            <span className="text-slate-500 text-sm">15 daqiqa oldin</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-300">Ustoz biriktirildi</span>
            <span className="text-slate-500 text-sm">1 soat oldin</span>
          </div>
        </div>
      </div>
    </div>
  );
}

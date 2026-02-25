"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Trash2, Plus } from "lucide-react";

const STORAGE_KEY = "crm_payments";

interface Payment {
  id: number;
  student: string;
  group: string;
  amount: number;
  method: "naqd" | "karta" | "click";
  status: "tolangan" | "kutilmoqda";
  month: string;
  date: string;
  createdAt: string;
}

export default function PaymentPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    student: "",
    group: "",
    amount: "",
    method: "naqd" as "naqd" | "karta" | "click",
    status: "tolangan" as "tolangan" | "kutilmoqda",
    month: "",
    date: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setPayments(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payments));
  }, [payments]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newPayment: Payment = {
      id: Date.now(),
      student: form.student,
      group: form.group,
      amount: Number(form.amount),
      method: form.method,
      status: form.status,
      month: form.month,
      date: form.date,
      createdAt: new Date().toISOString(),
    };

    setPayments((prev) => [...prev, newPayment]);
    setOpenModal(false);

    setForm({
      student: "",
      group: "",
      amount: "",
      method: "naqd",
      status: "tolangan",
      month: "",
      date: "",
    });
  };

  const handleDelete = (id: number) => {
    if (!confirm("To‘lovni o‘chirmoqchimisiz?")) return;
    setPayments((prev) => prev.filter((p) => p.id !== id));
  };

  const filteredPayments = useMemo(() => {
    return payments.filter((p) =>
      p.student.toLowerCase().includes(search.toLowerCase()),
    );
  }, [payments, search]);

  const totalRevenue = payments
    .filter((p) => p.status === "tolangan")
    .reduce((sum, p) => sum + p.amount, 0);

  const paidCount = payments.filter((p) => p.status === "tolangan").length;
  const pendingCount = payments.filter((p) => p.status === "kutilmoqda").length;

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 relative overflow-hidden">
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 px-4 sm:px-6 md:px-8 py-6 md:py-8">
        {/* HEADER */}
        <div className="mb-10 md:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-400 to-blue-500 bg-clip-text text-transparent">
            To‘lovlar
          </h1>
          <p className="text-slate-400 mt-3 text-base md:text-lg">
            Talabalar to‘lovlarini boshqarish va monitoring qilish
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-10 md:mb-12">
          <GradientStat
            title="Jami tushum"
            value={`${totalRevenue.toLocaleString()} so‘m`}
            color="indigo"
          />
          <GradientStat title="To‘langan" value={paidCount} color="emerald" />
          <GradientStat title="Kutilmoqda" value={pendingCount} color="amber" />
        </div>

        {/* SEARCH + BUTTON */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
          <input
            placeholder="Talaba bo‘yicha qidirish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-auto bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <button
            onClick={() => setOpenModal(true)}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-blue-500 px-6 py-3 rounded-xl font-medium shadow-lg hover:opacity-90 transition"
          >
            <Plus size={18} />
            Yangi to‘lov
          </button>
        </div>

        {/* TABLE */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto shadow-xl">
          <table className="w-full min-w-[600px] text-sm">
            <thead className="bg-slate-800 text-slate-300">
              <tr>
                <th className="p-4 text-left">Talaba</th>
                <th className="p-4 text-left">Guruh</th>
                <th className="p-4 text-left">Miqdor</th>
                <th className="p-4 text-left">Holat</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((p) => (
                <tr
                  key={p.id}
                  className="border-t border-slate-800 hover:bg-slate-800/60 transition"
                >
                  <td className="p-4">{p.student}</td>
                  <td className="p-4">{p.group}</td>
                  <td className="p-4">{p.amount.toLocaleString()} so‘m</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        p.status === "tolangan"
                          ? "bg-emerald-600"
                          : "bg-amber-600"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredPayments.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-slate-400">
                    Ma’lumot topilmadi
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {openModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-[#111827] border border-slate-800 rounded-2xl w-full max-w-2xl p-6 sm:p-8 shadow-2xl">
            <h2 className="text-xl sm:text-2xl font-semibold mb-6 sm:mb-8">
              Yangi to‘lov qo‘shish
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                placeholder="Talaba ismi bilan qidiring..."
                value={form.student}
                onChange={(e) => setForm({ ...form, student: e.target.value })}
                className="w-full bg-[#0f172a] border border-slate-700 rounded-xl px-4 py-3"
                required
              />

              <input
                placeholder="Guruh nomi bilan qidiring..."
                value={form.group}
                onChange={(e) => setForm({ ...form, group: e.target.value })}
                className="w-full bg-[#0f172a] border border-slate-700 rounded-xl px-4 py-3"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="number"
                  placeholder="To‘lov miqdori"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className="bg-[#0f172a] border border-slate-700 rounded-xl px-4 py-3"
                  required
                />
                <input
                  type="month"
                  value={form.month}
                  onChange={(e) => setForm({ ...form, month: e.target.value })}
                  className="bg-[#0f172a] border border-slate-700 rounded-xl px-4 py-3"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <select
                  value={form.method}
                  onChange={(e) =>
                    setForm({ ...form, method: e.target.value as any })
                  }
                  className="bg-[#0f172a] border border-slate-700 rounded-xl px-4 py-3"
                >
                  <option value="naqd">Naqd</option>
                  <option value="karta">Karta</option>
                  <option value="click">Click</option>
                </select>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="bg-[#0f172a] border border-slate-700 rounded-xl px-4 py-3"
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setOpenModal(false)}
                  className="w-full sm:w-auto px-6 py-2 rounded-xl border border-slate-600 hover:bg-slate-800"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700"
                >
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function GradientStat({
  title,
  value,
  color,
}: {
  title: string;
  value: any;
  color: "indigo" | "emerald" | "amber";
}) {
  const colors = {
    indigo: "from-indigo-600 to-blue-500",
    emerald: "from-emerald-600 to-green-500",
    amber: "from-amber-500 to-orange-500",
  };

  return (
    <div
      className={`bg-gradient-to-r ${colors[color]} rounded-2xl p-6 shadow-lg`}
    >
      <p className="text-white/80 text-sm">{title}</p>
      <h3 className="text-2xl sm:text-3xl font-bold text-white mt-2">
        {value}
      </h3>
    </div>
  );
}

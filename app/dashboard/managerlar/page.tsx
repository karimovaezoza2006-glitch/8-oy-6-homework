"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

/* ================= TYPES ================= */

type Manager = {
  id?: number;
  _id?: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  work_date: string;
};

export default function ManagersPage() {
  const { token } = useAuth();

  const [managers, setManagers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(true);

  const [openInfo, setOpenInfo] = useState(false);
  const [selectedManager, setSelectedManager] = useState<Manager | null>(null);

  const [openAddModal, setOpenAddModal] = useState(false);
  const [adding, setAdding] = useState(false);

  const [newManager, setNewManager] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    work_date: "",
    role: "manager",
  });

  /* ================= FETCH ================= */

  const fetchManagers = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        "https://admin-crm.onrender.com/api/staff/all-managers",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setManagers(res.data.data || []);
    } catch (error) {
      console.error("Managerlarni olishda xato:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchManagers();
  }, [token]);

  /* ================= DELETE ================= */

  const handleDelete = async (manager: Manager) => {
    const managerId = manager.id ?? manager._id;
    if (!managerId) return;

    if (!window.confirm("Managerni o‘chirmoqchimisiz?")) return;

    try {
      await axios.delete(
        `https://admin-crm.onrender.com/api/staff/delete/${managerId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setManagers((prev) => prev.filter((m) => (m.id ?? m._id) !== managerId));
    } catch (error) {
      console.error("O‘chirishda xato:", error);
    }
  };

  /* ================= ADD ================= */

  const handleAddManager = async () => {
    const { first_name, last_name, email, password, work_date } = newManager;

    if (!first_name || !last_name || !email || !password || !work_date) {
      alert("Iltimos barcha maydonlarni to‘ldiring");
      return;
    }

    try {
      setAdding(true);

      const res = await axios.post(
        "https://admin-crm.onrender.com/api/staff/create-manager",
        newManager,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setManagers((prev) => [...prev, res.data.data]);

      setNewManager({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        work_date: "",
        role: "manager",
      });

      setOpenAddModal(false);
    } catch (error) {
      console.error("Manager qo‘shishda xato:", error);
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-slate-300 text-lg">
        Yuklanmoqda...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 px-4 sm:px-6 lg:px-10 py-10">
      {/* ================= HEADER ================= */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-wide text-white">
          Managerlar ro‘yxati
        </h1>

        <button
          onClick={() => setOpenAddModal(true)}
          className="bg-emerald-600 hover:bg-emerald-500 transition-all duration-300 px-6 py-2.5 rounded-xl shadow-lg shadow-emerald-900/30 font-medium"
        >
          Yangi Manager qo‘shish
        </button>
      </div>

      {/* ================= TABLE ================= */}

      <div className="overflow-x-auto rounded-2xl bg-slate-900/60 backdrop-blur-lg border border-slate-700 shadow-2xl">
        <table className="min-w-full">
          <thead className="bg-slate-800/70 text-slate-300 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-4 text-left font-semibold">Ism</th>
              <th className="px-6 py-4 text-left font-semibold">Familiya</th>
              <th className="px-6 py-4 text-left font-semibold">Email</th>
              <th className="px-6 py-4 text-left font-semibold">Role</th>
              <th className="px-6 py-4 text-left font-semibold">Amallar</th>
            </tr>
          </thead>

          <tbody>
            {managers.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-8 text-center text-slate-400"
                >
                  Ma’lumot topilmadi
                </td>
              </tr>
            ) : (
              managers.map((manager, index) => {
                const uniqueKey = manager.id ?? manager._id ?? index;

                return (
                  <tr
                    key={uniqueKey}
                    className="border-t border-slate-800 hover:bg-slate-800/60 transition-all duration-200"
                  >
                    <td className="px-6 py-4">{manager.first_name}</td>
                    <td className="px-6 py-4">{manager.last_name}</td>
                    <td className="px-6 py-4">{manager.email}</td>
                    <td className="px-6 py-4 capitalize">{manager.role}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => {
                          setSelectedManager(manager);
                          setOpenInfo(true);
                        }}
                        className="hover:text-emerald-400 transition-colors text-lg"
                      >
                        ⋮
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ================= INFO MODAL ================= */}

      {openInfo && selectedManager && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 px-4">
          <div className="bg-slate-900 border border-slate-700 p-8 rounded-2xl w-full max-w-md shadow-2xl shadow-black/40">
            <h2 className="text-xl font-semibold mb-6 text-white">
              Manager ma’lumotlari
            </h2>

            <div className="space-y-3 text-slate-300">
              <p>
                <b>Ism:</b> {selectedManager.first_name}
              </p>
              <p>
                <b>Familiya:</b> {selectedManager.last_name}
              </p>
              <p>
                <b>Email:</b> {selectedManager.email}
              </p>
              <p>
                <b>Role:</b> {selectedManager.role}
              </p>
              <p>
                <b>Ish sanasi:</b> {selectedManager.work_date}
              </p>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => {
                  setOpenInfo(false);
                  setSelectedManager(null);
                }}
                className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg transition-all"
              >
                Yopish
              </button>

              <button
                onClick={() => {
                  handleDelete(selectedManager);
                  setOpenInfo(false);
                }}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-500 rounded-lg transition-all"
              >
                O‘chirish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= ADD MODAL ================= */}

      {openAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 px-4">
          <div className="bg-slate-900 border border-slate-700 p-8 rounded-2xl w-full max-w-lg shadow-2xl shadow-black/40">
            <h2 className="text-xl font-semibold mb-6 text-white">
              Yangi Manager qo‘shish
            </h2>

            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              {[
                "first_name",
                "last_name",
                "email",
                "password",
                "work_date",
              ].map((field) => (
                <input
                  key={field}
                  type={
                    field === "password"
                      ? "password"
                      : field === "work_date"
                        ? "date"
                        : "text"
                  }
                  placeholder={field}
                  value={(newManager as any)[field]}
                  onChange={(e) =>
                    setNewManager({
                      ...newManager,
                      [field]: e.target.value,
                    })
                  }
                  className="px-4 py-3 rounded-lg bg-slate-800 border border-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 outline-none transition-all text-sm"
                />
              ))}
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setOpenAddModal(false)}
                className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg transition-all"
              >
                Bekor qilish
              </button>

              <button
                onClick={handleAddManager}
                disabled={adding}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-lg shadow-emerald-900/30 disabled:opacity-50 transition-all"
              >
                {adding ? "Qo‘shilmoqda..." : "Qo‘shish"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

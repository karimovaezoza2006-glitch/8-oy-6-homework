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
    return <div className="p-6 text-white">Yuklanmoqda...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Managerlar ro‘yxati</h1>

        <button
          onClick={() => setOpenAddModal(true)}
          className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
        >
          Yangi Manager qo‘shish
        </button>
      </div>

      {/* ================= TABLE ================= */}

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-700">
          <thead className="bg-gray-900">
            <tr>
              <th className="p-3 text-left">Ism</th>
              <th className="p-3 text-left">Familiya</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Amallar</th>
            </tr>
          </thead>

          <tbody>
            {managers.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-400">
                  Ma’lumot topilmadi
                </td>
              </tr>
            ) : (
              managers.map((manager, index) => {
                const uniqueKey = manager.id ?? manager._id ?? index;

                return (
                  <tr
                    key={uniqueKey}
                    className="border-t border-gray-800 hover:bg-gray-900"
                  >
                    <td className="p-3">{manager.first_name}</td>
                    <td className="p-3">{manager.last_name}</td>
                    <td className="p-3">{manager.email}</td>
                    <td className="p-3">{manager.role}</td>
                    <td className="p-3">
                      <button
                        onClick={() => {
                          setSelectedManager(manager);
                          setOpenInfo(true);
                        }}
                        className="hover:text-gray-300"
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 text-white p-6 rounded-xl w-full max-w-md shadow-2xl">
            <h2 className="text-lg font-bold mb-4">Manager ma’lumotlari</h2>

            <div className="space-y-2">
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

            <div className="flex justify-between mt-6">
              <button
                onClick={() => {
                  setOpenInfo(false);
                  setSelectedManager(null);
                }}
                className="px-4 py-2 bg-gray-700 rounded"
              >
                Yopish
              </button>

              <button
                onClick={() => {
                  handleDelete(selectedManager);
                  setOpenInfo(false);
                }}
                className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
              >
                O‘chirish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= ADD MODAL ================= */}

      {openAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 text-white p-6 rounded-xl w-full max-w-lg shadow-2xl">
            <h2 className="text-lg font-bold mb-4">Yangi Manager qo‘shish</h2>

            <div className="flex flex-col gap-3 mb-4">
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
                  className="p-2 rounded bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-green-500 outline-none"
                />
              ))}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setOpenAddModal(false)}
                className="px-4 py-2 bg-gray-700 rounded"
              >
                Bekor qilish
              </button>

              <button
                onClick={handleAddManager}
                className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
                disabled={adding}
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

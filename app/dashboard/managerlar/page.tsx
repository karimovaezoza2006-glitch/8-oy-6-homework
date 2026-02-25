"use client";

import { useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";



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
  const queryClient = useQueryClient();

  const [openInfo, setOpenInfo] = useState(false);
  const [selectedManager, setSelectedManager] = useState<Manager | null>(null);
  const [openAddModal, setOpenAddModal] = useState(false);

  const [newManager, setNewManager] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    work_date: "",
    role: "manager",
  });



  const { data: managers = [], isLoading } = useQuery({
    queryKey: ["managers"],
    queryFn: async () => {
      const res = await axios.get(
        "https://admin-crm.onrender.com/api/staff/all-managers",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return res.data.data || [];
    },
    enabled: !!token,
  });


  const deleteMutation = useMutation({
    mutationFn: async (managerId: string | number) => {
      return axios.delete(
        `https://admin-crm.onrender.com/api/staff/delete/${managerId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["managers"] });
    },
  });

  const handleDelete = (manager: Manager) => {
    const managerId = manager.id ?? manager._id;
    if (!managerId) return;
    if (!window.confirm("Managerni o‘chirmoqchimisiz?")) return;
    deleteMutation.mutate(managerId);
  };


  const addMutation = useMutation({
    mutationFn: async () => {
      return axios.post(
        "https://admin-crm.onrender.com/api/staff/create-manager",
        newManager,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["managers"] });
      setNewManager({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        work_date: "",
        role: "manager",
      });
      setOpenAddModal(false);
    },
  });

  const handleAddManager = () => {
    const { first_name, last_name, email, password, work_date } = newManager;
    if (!first_name || !last_name || !email || !password || !work_date) {
      alert("Iltimos barcha maydonlarni to‘ldiring");
      return;
    }
    addMutation.mutate();
  };



  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-slate-300 text-lg">
        Yuklanmoqda...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 px-4 sm:px-6 lg:px-12 py-8">
      <div className="max-w-6xl mx-auto">
  
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-8">
          <h1 className="text-xl sm:text-2xl font-semibold text-white">
            Managerlar ro‘yxati
          </h1>

          <button
            onClick={() => setOpenAddModal(true)}
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 px-5 py-2.5 rounded-xl shadow-lg font-medium transition"
          >
            Yangi Manager qo‘shish
          </button>
        </div>

   
        <div className="hidden md:block overflow-x-auto rounded-2xl bg-slate-900 border border-slate-700 shadow-xl">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-800 text-slate-300 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-6 py-4 text-left">Ism</th>
                <th className="px-6 py-4 text-left">Familiya</th>
                <th className="px-6 py-4 text-left">Email</th>
                <th className="px-6 py-4 text-left">Role</th>
                <th className="px-6 py-4 text-left">Amallar</th>
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
                managers.map((manager: Manager, index: number) => {
                  const key = manager.id ?? manager._id ?? index;
                  return (
                    <tr
                      key={key}
                      className="border-t border-slate-800 hover:bg-slate-800/50 transition"
                    >
                      <td className="px-6 py-4">{manager.first_name}</td>
                      <td className="px-6 py-4">{manager.last_name}</td>
                      <td className="px-6 py-4 text-slate-400">
                        {manager.email}
                      </td>
                      <td className="px-6 py-4 capitalize">{manager.role}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => {
                            setSelectedManager(manager);
                            setOpenInfo(true);
                          }}
                          className="hover:text-emerald-400 text-lg"
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


        <div className="md:hidden space-y-4">
          {managers.length === 0 ? (
            <div className="text-center text-slate-400 py-10">
              Ma’lumot topilmadi
            </div>
          ) : (
            managers.map((manager: Manager, index: number) => {
              const key = manager.id ?? manager._id ?? index;
              return (
                <div
                  key={key}
                  className="bg-slate-900 border border-slate-700 rounded-xl p-4 shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-white">
                        {manager.first_name} {manager.last_name}
                      </h3>
                      <p className="text-sm text-slate-400 break-all">
                        {manager.email}
                      </p>
                      <p className="text-xs text-slate-500 mt-1 capitalize">
                        {manager.role}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedManager(manager);
                        setOpenInfo(true);
                      }}
                      className="text-lg text-slate-400"
                    >
                      ⋮
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>


      {openInfo && selectedManager && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-md">
            <h2 className="text-lg font-semibold mb-5 text-white">
              Manager ma’lumotlari
            </h2>

            <div className="space-y-2 text-sm text-slate-300">
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

            <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6">
              <button
                onClick={() => {
                  setOpenInfo(false);
                  setSelectedManager(null);
                }}
                className="px-4 py-2 bg-slate-700 rounded-lg"
              >
                Yopish
              </button>

              <button
                onClick={() => {
                  handleDelete(selectedManager);
                  setOpenInfo(false);
                }}
                className="px-4 py-2 bg-red-600 rounded-lg"
              >
                O‘chirish
              </button>
            </div>
          </div>
        </div>
      )}

    
      {openAddModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-lg">
            <h2 className="text-lg font-semibold mb-6 text-white">
              Yangi Manager qo‘shish
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
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
                    setNewManager({ ...newManager, [field]: e.target.value })
                  }
                  className="px-4 py-3 rounded-lg bg-slate-800 border border-slate-600 text-sm"
                />
              ))}
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={() => setOpenAddModal(false)}
                className="px-4 py-2 bg-slate-700 rounded-lg"
              >
                Bekor
              </button>

              <button
                onClick={handleAddManager}
                disabled={addMutation.isPending}
                className="px-5 py-2 bg-emerald-600 rounded-lg disabled:opacity-50"
              >
                {addMutation.isPending ? "Qo‘shilmoqda..." : "Qo‘shish"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

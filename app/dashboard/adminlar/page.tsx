"use client";

import { useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

type Admin = {
  id?: number;
  _id?: string;
  first_name?: string;
  last_name?: string;
  email: string;
  role: string;
  status?: string;
};

export default function AdminsPage() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [open, setOpen] = useState(false);

  const [newAdmin, setNewAdmin] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });



  const { data: admins = [], isLoading } = useQuery({
    queryKey: ["admins"],
    queryFn: async () => {
      const res = await axios.get(
        "https://admin-crm.onrender.com/api/staff/all-admins",
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return res.data.data || [];
    },
    enabled: !!token,
  });



  const filteredAdmins = admins.filter((admin: Admin) => {
    const fullName =
      `${admin.first_name || ""} ${admin.last_name || ""}`.toLowerCase();

    const matchesSearch = fullName.includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ? true : admin.status === statusFilter;

    return matchesSearch && matchesStatus;
  });



  const addMutation = useMutation({
    mutationFn: async () => {
      return axios.post(
        "https://admin-crm.onrender.com/api/staff/create-admin",
        newAdmin,
        { headers: { Authorization: `Bearer ${token}` } },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      setOpen(false);
      setNewAdmin({ first_name: "", last_name: "", email: "" });
    },
  });

  const handleAddAdmin = () => {
    if (!newAdmin.first_name || !newAdmin.last_name || !newAdmin.email) {
      alert("Barcha maydonlarni to‘ldiring");
      return;
    }
    addMutation.mutate();
  };



  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-slate-400">
        Yuklanmoqda...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 px-4 sm:px-6 lg:px-12 py-8">
      <div className="max-w-6xl mx-auto">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-white">
              Adminlar ro‘yxati
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Administratorlarni boshqarish
            </p>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 transition px-5 py-2.5 rounded-lg shadow-md text-sm font-medium"
          >
            + Admin qo‘shish
          </button>
        </div>

  
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Ism bo‘yicha qidirish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-72 px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-52 px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm"
          >
            <option value="All">Barchasi</option>
            <option value="faol">Faol</option>
            <option value="ta'tilda">Ta'tilda</option>
            <option value="ishdan bo'shatilgan">Ishdan bo‘shatilgan</option>
          </select>
        </div>

 
        <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-700 bg-slate-900 shadow-lg">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-800 text-slate-300 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-6 py-3 text-left">Ism</th>
                <th className="px-6 py-3 text-left">Familiya</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Rol</th>
                <th className="px-6 py-3 text-left">Holat</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdmins.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-slate-500"
                  >
                    Ma’lumot topilmadi
                  </td>
                </tr>
              ) : (
                filteredAdmins.map((admin: Admin, index: number) => {
                  const uniqueKey = admin.id ?? admin._id ?? index;

                  const statusColor =
                    admin.status === "faol"
                      ? "bg-emerald-500/15 text-emerald-400"
                      : admin.status === "ta'tilda"
                        ? "bg-yellow-500/15 text-yellow-400"
                        : admin.status === "ishdan bo'shatilgan"
                          ? "bg-red-500/15 text-red-400"
                          : "bg-slate-700 text-slate-300";

                  return (
                    <tr
                      key={uniqueKey}
                      className="border-t border-slate-800 hover:bg-slate-800/40 transition"
                    >
                      <td className="px-6 py-3">{admin.first_name || "-"}</td>
                      <td className="px-6 py-3">{admin.last_name || "-"}</td>
                      <td className="px-6 py-3 text-slate-400">
                        {admin.email}
                      </td>
                      <td className="px-6 py-3">{admin.role}</td>
                      <td className="px-6 py-3">
                        <span
                          className={`px-3 py-1 text-xs rounded-full ${statusColor}`}
                        >
                          {admin.status || "-"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

     
        <div className="md:hidden space-y-4">
          {filteredAdmins.length === 0 ? (
            <div className="text-center text-slate-500 py-10">
              Ma’lumot topilmadi
            </div>
          ) : (
            filteredAdmins.map((admin: Admin, index: number) => {
              const uniqueKey = admin.id ?? admin._id ?? index;

              return (
                <div
                  key={uniqueKey}
                  className="bg-slate-900 border border-slate-700 rounded-xl p-4 shadow"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-white">
                      {admin.first_name} {admin.last_name}
                    </h3>
                    <span className="text-xs text-slate-400">{admin.role}</span>
                  </div>

                  <p className="text-sm text-slate-400 break-all">
                    {admin.email}
                  </p>

                  <div className="mt-3">
                    <span className="text-xs bg-slate-800 px-3 py-1 rounded-full">
                      {admin.status || "-"}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>


      {open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl w-full max-w-md shadow-2xl">
            <h2 className="text-lg font-semibold mb-5 text-white">
              Yangi Admin qo‘shish
            </h2>

            <div className="space-y-4">
              <input
                className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-600 text-sm"
                placeholder="Ism"
                value={newAdmin.first_name}
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, first_name: e.target.value })
                }
              />

              <input
                className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-600 text-sm"
                placeholder="Familiya"
                value={newAdmin.last_name}
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, last_name: e.target.value })
                }
              />

              <input
                className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-600 text-sm"
                placeholder="Email"
                value={newAdmin.email}
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, email: e.target.value })
                }
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 bg-slate-700 rounded-lg text-sm"
              >
                Bekor
              </button>

              <button
                onClick={handleAddAdmin}
                disabled={addMutation.isPending}
                className="px-5 py-2 bg-emerald-600 rounded-lg text-sm disabled:opacity-50"
              >
                {addMutation.isPending ? "Saqlanmoqda..." : "Saqlash"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

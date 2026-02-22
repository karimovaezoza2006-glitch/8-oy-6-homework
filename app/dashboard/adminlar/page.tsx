"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

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

  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [open, setOpen] = useState(false);

  const [newAdmin, setNewAdmin] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });

  const fetchAdmins = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        "https://admin-crm.onrender.com/api/staff/all-admins",
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setAdmins(res.data.data || []);
    } catch (error) {
      console.error("Adminlarni olishda xato:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchAdmins();
  }, [token]);

  const filteredAdmins = admins.filter((admin) => {
    const fullName =
      `${admin.first_name || ""} ${admin.last_name || ""}`.toLowerCase();
    const matchesSearch = fullName.includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "All" ? true : admin.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddAdmin = async () => {
    if (!newAdmin.first_name || !newAdmin.last_name || !newAdmin.email) {
      alert("Barcha maydonlarni to‘ldiring");
      return;
    }

    try {
      await axios.post(
        "https://admin-crm.onrender.com/api/staff/create-admin",
        newAdmin,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      await fetchAdmins();
      setOpen(false);
      setNewAdmin({ first_name: "", last_name: "", email: "" });
    } catch (error) {
      console.error("Admin qo‘shishda xato:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-slate-400">
        Yuklanmoqda...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 px-6 lg:px-12 py-10">
      <div className="max-w-6xl mx-auto">
      
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-white">
              Adminlar ro‘yxati
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Administratorlarni boshqarish
            </p>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-500 transition px-5 py-2.5 rounded-lg shadow-md shadow-emerald-900/30 text-sm font-medium"
          >
            + Admin qo‘shish
          </button>
        </div>

        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Ism bo‘yicha qidirish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-72 px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm transition"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-52 px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm transition"
          >
            <option value="All">Barchasi</option>
            <option value="faol">Faol</option>
            <option value="ta'tilda">Ta'tilda</option>
            <option value="ishdan bo'shatilgan">Ishdan bo‘shatilgan</option>
          </select>
        </div>

    
        <div className="overflow-x-auto rounded-xl border border-slate-700 bg-slate-900 shadow-lg">
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
                filteredAdmins.map((admin, index) => {
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
                      <td className="px-6 py-3 font-medium">
                        {admin.first_name || "-"}
                      </td>
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
      </div>

    
      {open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl w-full max-w-md shadow-2xl">
            <h2 className="text-lg font-semibold mb-5 text-white">
              Yangi Admin qo‘shish
            </h2>

            <div className="space-y-4">
              <input
                className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm"
                placeholder="Ism"
                value={newAdmin.first_name}
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, first_name: e.target.value })
                }
              />

              <input
                className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm"
                placeholder="Familiya"
                value={newAdmin.last_name}
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, last_name: e.target.value })
                }
              />

              <input
                className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm"
                placeholder="Email"
                value={newAdmin.email}
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, email: e.target.value })
                }
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm"
              >
                Bekor
              </button>

              <button
                onClick={handleAddAdmin}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm shadow-md shadow-emerald-900/30"
              >
                Saqlash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

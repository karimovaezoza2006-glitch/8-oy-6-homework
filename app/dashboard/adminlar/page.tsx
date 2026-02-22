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
        {
          headers: { Authorization: `Bearer ${token}` },
        },
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
    const fullName = `${admin.first_name || ""} ${
      admin.last_name || ""
    }`.toLowerCase();

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
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      await fetchAdmins();
      setOpen(false);
      setNewAdmin({
        first_name: "",
        last_name: "",
        email: "",
      });
    } catch (error) {
      console.error("Admin qo‘shishda xato:", error);
    }
  };

  if (loading) {
    return <div className="p-6 text-white">Yuklanmoqda...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-bold mb-6">Adminlar ro‘yxati</h1>

      {/* FILTER */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex gap-3 flex-wrap">
          <input
            type="text"
            placeholder="Ism bo‘yicha qidirish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-gray-800 px-3 py-2 rounded outline-none"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-800 px-3 py-2 rounded outline-none"
          >
            <option value="All">Barchasi</option>
            <option value="faol">Faol</option>
            <option value="ta'tilda">Ta'tilda</option>
            <option value="ishdan bo'shatilgan">Ishdan bo‘shatilgan</option>
          </select>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200"
        >
          + Admin qo‘shish
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-700">
          <thead className="bg-gray-900">
            <tr>
              <th className="p-3 text-left">Ism</th>
              <th className="p-3 text-left">Familiya</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Rol</th>
              <th className="p-3 text-left">Holat</th>
            </tr>
          </thead>

          <tbody>
            {filteredAdmins.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-400">
                  Ma’lumot topilmadi
                </td>
              </tr>
            ) : (
              filteredAdmins.map((admin, index) => {
                const uniqueKey = admin.id ?? admin._id ?? index;

                return (
                  <tr
                    key={uniqueKey}
                    className="border-t border-gray-800 hover:bg-gray-900"
                  >
                    <td className="p-3">{admin.first_name || "-"}</td>
                    <td className="p-3">{admin.last_name || "-"}</td>
                    <td className="p-3">{admin.email}</td>
                    <td className="p-3">{admin.role}</td>
                    <td className="p-3 capitalize">{admin.status || "-"}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ADD MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 text-white p-6 rounded-xl w-full max-w-md shadow-2xl">
            <h2 className="text-lg font-bold mb-4">Admin qo‘shish</h2>

            <input
              className="bg-gray-800 p-2 w-full mb-3 rounded"
              placeholder="Ism"
              value={newAdmin.first_name}
              onChange={(e) =>
                setNewAdmin({
                  ...newAdmin,
                  first_name: e.target.value,
                })
              }
            />

            <input
              className="bg-gray-800 p-2 w-full mb-3 rounded"
              placeholder="Familiya"
              value={newAdmin.last_name}
              onChange={(e) =>
                setNewAdmin({
                  ...newAdmin,
                  last_name: e.target.value,
                })
              }
            />

            <input
              className="bg-gray-800 p-2 w-full mb-4 rounded"
              placeholder="Email"
              value={newAdmin.email}
              onChange={(e) =>
                setNewAdmin({
                  ...newAdmin,
                  email: e.target.value,
                })
              }
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 bg-gray-700 rounded"
              >
                Bekor
              </button>

              <button
                onClick={handleAddAdmin}
                className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
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

"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

type Teacher = {
  id?: number;
  _id?: string;
  first_name?: string;
  last_name?: string;
  email: string;
  status?: string;
};

export default function TeachersPage() {
  const { token } = useAuth();

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [openInfo, setOpenInfo] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  /* ================= FETCH WITH SEARCH ================= */

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          "https://admin-crm.onrender.com/api/teacher/get-all-teachers",
          {
            params: search ? { search } : {},
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setTeachers(res.data.data || []);
      } catch (error) {
        console.error("Ustozlarni olishda xato:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchTeachers();
  }, [token, search]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-slate-400">
        Yuklanmoqda...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 p-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-4">Ustozlar</h1>

        <input
          type="text"
          placeholder="Ism yoki familiya bo‘yicha qidirish..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 w-full md:w-1/3 focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-sm">
          <thead className="bg-slate-800 text-slate-300">
            <tr>
              <th className="p-4 text-left">Ism</th>
              <th className="p-4 text-left">Familiya</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Holat</th>
            </tr>
          </thead>
          <tbody>
            {teachers.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-6 text-center text-slate-400">
                  Ma’lumot topilmadi
                </td>
              </tr>
            ) : (
              teachers.map((teacher, index) => (
                <tr
                  key={teacher.id ?? teacher._id ?? index}
                  className="border-t border-slate-800 hover:bg-slate-800/50 transition"
                >
                  <td className="p-4">{teacher.first_name}</td>
                  <td className="p-4">{teacher.last_name}</td>
                  <td className="p-4">{teacher.email}</td>
                  <td className="p-4 capitalize">{teacher.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

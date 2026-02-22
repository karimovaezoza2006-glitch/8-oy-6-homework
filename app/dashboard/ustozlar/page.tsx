"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

/* ================= TYPES ================= */

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

  const [openInfo, setOpenInfo] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  /* ================= FETCH ================= */

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          "https://admin-crm.onrender.com/api/teacher/get-all-teachers",
          {
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
  }, [token]);

  /* ================= DELETE ================= */

  const handleDelete = async (teacher: Teacher) => {
    const teacherId = teacher.id ?? teacher._id;
    if (!teacherId) return;

    if (!window.confirm("Ustozni o‘chirmoqchimisiz?")) return;

    try {
      await axios.delete(
        `https://admin-crm.onrender.com/api/teacher/delete/${teacherId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setTeachers((prev) => prev.filter((t) => (t.id ?? t._id) !== teacherId));
    } catch (error) {
      console.error("O‘chirishda xato:", error);
    }
  };

  /* ================= LOADING ================= */

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
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-white">
            Ustozlar ro‘yxati
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Barcha ustozlarni boshqarish
          </p>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto rounded-xl border border-slate-700 bg-slate-900 shadow-lg">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-800 text-slate-300 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-6 py-3 text-left">Ism</th>
                <th className="px-6 py-3 text-left">Familiya</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Holat</th>
                <th className="px-6 py-3 text-left">Amallar</th>
              </tr>
            </thead>

            <tbody>
              {teachers.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-slate-500"
                  >
                    Ma’lumot topilmadi
                  </td>
                </tr>
              ) : (
                teachers.map((teacher, index) => {
                  const uniqueKey = teacher.id ?? teacher._id ?? index;

                  const statusColor =
                    teacher.status === "faol"
                      ? "bg-emerald-500/15 text-emerald-400"
                      : teacher.status === "ta'tilda"
                        ? "bg-yellow-500/15 text-yellow-400"
                        : teacher.status === "ishdan bo'shatilgan"
                          ? "bg-red-500/15 text-red-400"
                          : "bg-slate-700 text-slate-300";

                  return (
                    <tr
                      key={uniqueKey}
                      className="border-t border-slate-800 hover:bg-slate-800/40 transition"
                    >
                      <td className="px-6 py-3 font-medium">
                        {teacher.first_name || "-"}
                      </td>
                      <td className="px-6 py-3">{teacher.last_name || "-"}</td>
                      <td className="px-6 py-3 text-slate-400">
                        {teacher.email}
                      </td>
                      <td className="px-6 py-3">
                        <span
                          className={`px-3 py-1 text-xs rounded-full ${statusColor}`}
                        >
                          {teacher.status || "-"}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <button
                          onClick={() => {
                            setSelectedTeacher(teacher);
                            setOpenInfo(true);
                          }}
                          className="text-slate-400 hover:text-white transition"
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
      </div>

      {/* INFO MODAL */}
      {openInfo && selectedTeacher && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl w-full max-w-md shadow-2xl">
            <h2 className="text-lg font-semibold mb-5 text-white">
              Ustoz ma’lumotlari
            </h2>

            <div className="space-y-3 text-sm text-slate-300">
              <p>
                <b>Ism:</b> {selectedTeacher.first_name}
              </p>
              <p>
                <b>Familiya:</b> {selectedTeacher.last_name}
              </p>
              <p>
                <b>Email:</b> {selectedTeacher.email}
              </p>
              <p>
                <b>Holat:</b> {selectedTeacher.status}
              </p>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setOpenInfo(false);
                  setSelectedTeacher(null);
                }}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm"
              >
                Yopish
              </button>

              <button
                onClick={() => {
                  handleDelete(selectedTeacher);
                  setOpenInfo(false);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-sm"
              >
                O‘chirish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

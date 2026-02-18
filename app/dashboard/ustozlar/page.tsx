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
    return <div className="p-6 text-white">Yuklanmoqda...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-bold mb-6">Ustozlar ro‘yxati</h1>

      {/* ================= TABLE ================= */}

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-700">
          <thead className="bg-gray-900">
            <tr>
              <th className="p-3 text-left">Ism</th>
              <th className="p-3 text-left">Familiya</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Holat</th>
              <th className="p-3 text-left">Amallar</th>
            </tr>
          </thead>

          <tbody>
            {teachers.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-400">
                  Ma’lumot topilmadi
                </td>
              </tr>
            ) : (
              teachers.map((teacher, index) => {
                const uniqueKey = teacher.id ?? teacher._id ?? index;

                return (
                  <tr
                    key={uniqueKey}
                    className="border-t border-gray-800 hover:bg-gray-900"
                  >
                    <td className="p-3">{teacher.first_name || "-"}</td>
                    <td className="p-3">{teacher.last_name || "-"}</td>
                    <td className="p-3">{teacher.email}</td>
                    <td className="p-3 capitalize">{teacher.status || "-"}</td>

                    <td className="p-3">
                      <button
                        onClick={() => {
                          setSelectedTeacher(teacher);
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

      {openInfo && selectedTeacher && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 text-white p-6 rounded-xl w-full max-w-md shadow-2xl">
            <h2 className="text-lg font-bold mb-4">Ustoz ma’lumotlari</h2>

            <div className="space-y-2">
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

            <div className="flex justify-between mt-6">
              <button
                onClick={() => {
                  setOpenInfo(false);
                  setSelectedTeacher(null);
                }}
                className="px-4 py-2 bg-gray-700 rounded"
              >
                Yopish
              </button>

              <button
                onClick={() => {
                  handleDelete(selectedTeacher);
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
    </div>
  );
}

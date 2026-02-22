"use client";

import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

type Student = {
  id?: number;
  _id?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  course?: number;
  status?: string;
};

export default function StudentsPage() {
  const { token } = useAuth();

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const [openInfo, setOpenInfo] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);

        const params: any = {};
        if (search) params.search = search;
        if (status !== "all") params.status = status;

        const res = await axios.get(
          "https://admin-crm.onrender.com/api/student/get-all-students",
          {
            params,
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        setStudents(res.data.data || []);
      } catch (error) {
        console.error("Studentlarni olishda xato:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchStudents();
  }, [token, search, status]);

  const handleDelete = async (student: Student) => {
    const studentId = student.id ?? student._id;
    if (!studentId) return;
    if (!window.confirm("Studentni o‘chirmoqchimisiz?")) return;

    try {
      await axios.delete(
        `https://admin-crm.onrender.com/api/student/delete/${studentId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setStudents((prev) => prev.filter((s) => (s.id ?? s._id) !== studentId));
    } catch (error) {
      console.error("O‘chirishda xato:", error);
    }
  };



  const stats = useMemo(() => {
    return {
      total: students.length,
      active: students.filter((s) => s.status === "faol").length,
      tatil: students.filter((s) => s.status === "tatilda").length,
      finished: students.filter((s) => s.status === "yakunlandi").length,
    };
  }, [students]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-slate-400">
        Yuklanmoqda...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-8">
      {/* HEADER */}
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-3xl font-semibold">Studentlar</h1>
          <p className="text-slate-400 text-sm mt-1">
            Talabalarni boshqarish paneli
          </p>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        <StatCard title="Jami" value={stats.total} color="blue" />
        <StatCard title="Faol" value={stats.active} color="green" />
        <StatCard title="Ta'tilda" value={stats.tatil} color="amber" />
        <StatCard title="Yakunlandi" value={stats.finished} color="red" />
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Ism bo‘yicha qidirish..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
        >
          <option value="all">Barchasi</option>
          <option value="faol">Faol</option>
          <option value="tatilda">Ta’til’da</option>
          <option value="yakunlandi">Yakunlandi</option>
        </select>
      </div>

      {/* TABLE CARD */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-800 text-slate-400">
            <tr>
              <th className="p-4 text-left">Ism</th>
              <th className="p-4 text-left">Familiya</th>
              <th className="p-4 text-left">Telefon</th>
              <th className="p-4 text-left">Guruhlar</th>
              <th className="p-4 text-left">Holat</th>
              <th className="p-4"></th>
            </tr>
          </thead>

          <tbody>
            {students.map((student, index) => {
              const uniqueKey = student.id ?? student._id ?? index;

              const statusStyle =
                student.status === "faol"
                  ? "bg-emerald-500/20 text-emerald-400"
                  : student.status === "tatilda"
                    ? "bg-amber-500/20 text-amber-400"
                    : student.status === "yakunlandi"
                      ? "bg-red-500/20 text-red-400"
                      : "bg-slate-700 text-slate-300";

              return (
                <tr
                  key={uniqueKey}
                  className="border-t border-slate-800 hover:bg-slate-800/60 transition hover:scale-[1.01]"
                >
                  <td className="p-4 font-medium">{student.first_name}</td>
                  <td className="p-4">{student.last_name}</td>
                  <td className="p-4 text-slate-400">{student.phone}</td>
                  <td className="p-4 text-slate-400">{student.course || 0}</td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle}`}
                    >
                      {student.status}
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedStudent(student);
                        setOpenInfo(true);
                      }}
                      className="text-slate-400 hover:text-white"
                    >
                      ⋮
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {openInfo && selectedStudent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white text-black p-6 rounded-2xl w-full max-w-md shadow-2xl">
            <h2 className="text-lg font-semibold mb-4">Student ma’lumotlari</h2>

            <div className="space-y-2 text-sm">
              <p>
                <b>Ism:</b> {selectedStudent.first_name}
              </p>
              <p>
                <b>Familiya:</b> {selectedStudent.last_name}
              </p>
              <p>
                <b>Telefon:</b> {selectedStudent.phone}
              </p>
              <p>
                <b>Holat:</b> {selectedStudent.status}
              </p>
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={() => {
                  setOpenInfo(false);
                  setSelectedStudent(null);
                }}
                className="px-4 py-2 bg-slate-200 rounded-lg"
              >
                Yopish
              </button>

              <button
                onClick={() => {
                  handleDelete(selectedStudent);
                  setOpenInfo(false);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
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



function StatCard({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: "blue" | "green" | "amber" | "red";
}) {
  const colors = {
    blue: "from-indigo-600 to-blue-500",
    green: "from-emerald-600 to-green-500",
    amber: "from-amber-500 to-orange-500",
    red: "from-red-600 to-rose-500",
  };

  return (
    <div
      className={`bg-gradient-to-r ${colors[color]} rounded-2xl p-6 shadow-lg`}
    >
      <p className="text-white/80 text-sm">{title}</p>
      <h3 className="text-3xl font-bold mt-2 text-white">{value}</h3>
    </div>
  );
}

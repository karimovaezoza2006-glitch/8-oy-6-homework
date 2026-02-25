"use client";

import { useState, useMemo } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const [openInfo, setOpenInfo] = useState(false);
  const [selectedStudent, setSelectedStudent] =
    useState<Student | null>(null);

  /* ================= FETCH ================= */

  const { data: studentsData, isLoading } = useQuery({
    queryKey: ["students", search, status],
    queryFn: async () => {
      const params: any = {};
      if (search) params.search = search;
      if (status !== "all") params.status = status;

      const res = await axios.get(
        "https://admin-crm.onrender.com/api/student/get-all-students",
        {
          params,
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return res.data.data || [];
    },
    enabled: !!token,
  });

  const students: Student[] = studentsData ?? [];

  /* ================= DELETE ================= */

  const deleteMutation = useMutation({
    mutationFn: async (studentId: string | number) => {
      return axios.delete(
        `https://admin-crm.onrender.com/api/student/delete/${studentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });

  const handleDelete = (student: Student) => {
    const id = student.id ?? student._id;
    if (!id) return;
    if (!window.confirm("Studentni o‘chirmoqchimisiz?")) return;
    deleteMutation.mutate(id);
  };

  /* ================= FIXED STATS ================= */

  const stats = useMemo(() => {
    const safeStudents = students ?? [];

    return {
      total: safeStudents.length,

      active: safeStudents.filter(
        (s) => s.status?.toLowerCase() === "faol"
      ).length,

      tatil: safeStudents.filter((s) => {
        const st = s.status?.toLowerCase();
        return st === "tatilda" || st === "ta'tilda";
      }).length,

      finished: safeStudents.filter(
        (s) => s.status?.toLowerCase() === "yakunlandi"
      ).length,
    };
  }, [students]);

  /* ================= LOADING ================= */

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-slate-400">
        Yuklanmoqda...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-4 sm:px-6 lg:px-12 py-8">

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold">
          Studentlar
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Talabalarni boshqarish paneli
        </p>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <StatCard title="Jami" value={stats.total} color="blue" />
        <StatCard title="Faol" value={stats.active} color="green" />
        <StatCard title="Ta'tilda" value={stats.tatil} color="amber" />
        <StatCard title="Yakunlandi" value={stats.finished} color="red" />
      </div>

      {/* TABLE */}
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
              const key = student.id ?? student._id ?? index;

              return (
                <tr key={key} className="border-t border-slate-800">
                  <td className="p-4">{student.first_name}</td>
                  <td className="p-4">{student.last_name}</td>
                  <td className="p-4 text-slate-400">{student.phone}</td>
                  <td className="p-4 text-slate-400">
                    {student.course || 0}
                  </td>
                  <td className="p-4">{student.status}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedStudent(student);
                        setOpenInfo(true);
                      }}
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
    </div>
  );
}

/* ================= STAT CARD ================= */

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
    <div className={`bg-gradient-to-r ${colors[color]} rounded-2xl p-5 shadow-lg`}>
      <p className="text-white/80 text-sm">{title}</p>
      <h3 className="text-2xl font-bold mt-2 text-white">
        {value}
      </h3>
    </div>
  );
} 
"use client";

import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { Clock, Users, Pencil, Trash2, Plus, X } from "lucide-react";

type Course = {
  _id?: string;
  name?: { name?: string };
  price?: number;
  description?: string;
  duration?: string;
};

export default function CoursesPage() {
  const { token } = useAuth();

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCreate, setOpenCreate] = useState(false);

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    duration: "",
  });

  const fetchCourses = async () => {
    try {
      const res = await axios.get(
        "https://admin-crm.onrender.com/api/course/get-courses",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache",
          },
        },
      );

      setCourses(res.data.data || []);
    } catch (err) {
      console.error("Fetch xato:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchCourses();
  }, [token]);

  const totalCourses = courses.length;

  const totalRevenue = useMemo(() => {
    return courses.reduce((acc, c) => acc + (c.price || 0), 0);
  }, [courses]);

  // Demo uchun: har kursda 15 student deb hisobladik
  const totalStudents = totalCourses * 15;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post(
        "https://admin-crm.onrender.com/api/course/create",
        {
          name: { name: form.name },
          price: Number(form.price),
          description: form.description,
          duration: form.duration,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setOpenCreate(false);
      setForm({
        name: "",
        price: "",
        description: "",
        duration: "",
      });

      fetchCourses();
    } catch (err: any) {
      console.log(err.response?.data);
      alert("Kurs qo‘shilmadi");
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;

    try {
      await axios.delete(
        `https://admin-crm.onrender.com/api/course/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setCourses((prev) => prev.filter((c) => c._id !== id));
    } catch {
      alert("O‘chirishda xato");
    }
  };

  if (loading) {
    return <div className="p-6 text-slate-400">Yuklanmoqda...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0f172a] relative overflow-hidden">
      {/* Subtle Premium Glow */}
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 text-slate-100 p-8">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold">Kurslar</h1>
            <p className="text-slate-400 text-sm mt-1">
              Barcha kurslar boshqaruvi
            </p>
          </div>

          <button
            onClick={() => setOpenCreate(true)}
            className="flex items-center gap-2 bg-indigo-600 px-5 py-2 rounded-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/20"
          >
            <Plus size={18} />
            Kurs Qo‘shish
          </button>
        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <p className="text-slate-400 text-sm">Jami kurslar</p>
            <h3 className="text-2xl font-semibold mt-2">{totalCourses}</h3>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <p className="text-slate-400 text-sm">Jami studentlar</p>
            <h3 className="text-2xl font-semibold mt-2">{totalStudents}</h3>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <p className="text-slate-400 text-sm">Umumiy summa</p>
            <h3 className="text-2xl font-semibold mt-2">
              {totalRevenue.toLocaleString()} UZS
            </h3>
          </div>
        </div>

        {/* COURSES GRID */}
        <div className="flex flex-wrap gap-8">
          {courses.length === 0 ? (
            <p className="text-slate-400">Kurs topilmadi</p>
          ) : (
            courses.map((course, index) => (
              <div
                key={course._id ?? index}
                className="bg-slate-800 border border-slate-700 rounded-2xl p-8 w-full max-w-md hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/10 transition"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-semibold">
                      {course.name?.name}
                    </h2>
                    <p className="text-slate-400 mt-1">{course.description}</p>
                  </div>

                  <span className="bg-slate-700 text-white text-sm px-4 py-1 rounded-full">
                    {course.price?.toLocaleString()} UZS
                  </span>
                </div>

                <div className="flex flex-col gap-3 mt-6 text-slate-400">
                  <div className="flex items-center gap-3">
                    <Clock size={18} />
                    {course.duration}
                  </div>

                  <div className="flex items-center gap-3">
                    <Users size={18} />
                    15 students
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <button className="flex items-center gap-2 px-4 py-2 border border-slate-600 rounded-lg hover:bg-slate-700 transition">
                    <Pencil size={16} />
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(course._id)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition"
                  >
                    <Trash2 size={16} />
                    O‘chirish
                  </button>

                  <button className="px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition">
                    Muzlatish
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* MODAL */}
      {openCreate && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <form
            onSubmit={handleCreate}
            className="bg-slate-800 border border-slate-700 rounded-2xl p-8 w-full max-w-lg shadow-2xl relative text-slate-100"
          >
            <button
              type="button"
              onClick={() => setOpenCreate(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-bold mb-6">Yangi Kurs Qo‘shish</h2>

            <input
              type="text"
              placeholder="Kurs nomi"
              className="w-full bg-[#0f172a] border border-slate-600 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />

            <input
              type="number"
              placeholder="Narxi"
              className="w-full bg-[#0f172a] border border-slate-600 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />

            <input
              type="text"
              placeholder="Davomiyligi"
              className="w-full bg-[#0f172a] border border-slate-600 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
            />

            <textarea
              placeholder="Tavsif"
              className="w-full bg-[#0f172a] border border-slate-600 rounded-lg p-3 mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <button
              type="submit"
              className="w-full bg-indigo-600 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Yaratish
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

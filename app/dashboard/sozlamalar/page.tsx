"use client";

import React, { useEffect, useState } from "react";

const STORAGE_KEY = "crm_courses";

interface Course {
  id: number;
  name: string;
  price: number | string;
  duration: string;
  status: "faol" | "nofaol";
  description: string;
  createdAt: string;
}

export default function CourseSettingsPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [openModal, setOpenModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    price: "",
    duration: "",
    status: "faol" as "faol" | "nofaol",
    description: "",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        setCourses(JSON.parse(saved));
      } else {
        const defaultCourses: Course[] = [
          {
            id: 1,
            name: "Frontend dasturlash",
            price: 1800000,
            duration: "6 oy",
            status: "faol",
            description: "HTML, CSS, JS, React",
            createdAt: new Date().toISOString(),
          },
          {
            id: 2,
            name: "Backend dasturlash",
            price: 2200000,
            duration: "7 oy",
            status: "faol",
            description: "Node.js, Express, MongoDB",
            createdAt: new Date().toISOString(),
          },
        ];
        setCourses(defaultCourses);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultCourses));
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
    }
  }, [courses]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setCourses((prev) => [
      ...prev,
      {
        id: Date.now(),
        ...form,
        createdAt: new Date().toISOString(),
      },
    ]);

    setForm({
      name: "",
      price: "",
      duration: "",
      status: "faol",
      description: "",
    });

    setOpenModal(false);
  };

  const total = courses.length;
  const active = courses.filter((c) => c.status === "faol").length;
  const inactive = total - active;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 text-white px-4 sm:px-6 md:px-10 py-6 md:py-10">

      <div className="mb-8 md:mb-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
          ⚙️ Sozlamalar
        </h1>
        <p className="text-gray-400 text-sm sm:text-base">
          Tizim kurslarini boshqarish va umumiy sozlamalarni nazorat qilish
        </p>
      </div>

 
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 mb-8 md:mb-10">
        <StatCard title="Jami kurslar" value={total} color="blue" />
        <StatCard title="Faol kurslar" value={active} color="green" />
        <StatCard title="Nofaol kurslar" value={inactive} color="red" />
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
       
        <div className="bg-gray-900/70 backdrop-blur-lg border border-gray-800 rounded-2xl p-5 sm:p-6 shadow-xl">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">
            📚 Kurs boshqaruvi
          </h2>

          <div className="space-y-4">
            <SettingItem
              title="Yangi kurs qo‘shish"
              desc="Tizimga yangi kurs yaratish"
              action={() => setOpenModal(true)}
              button="Qo‘shish"
            />

            <SettingItem
              title="Faol kurslar"
              desc="Hozirda faol bo‘lgan kurslar"
              value={active}
            />

            <SettingItem
              title="Nofaol kurslar"
              desc="Vaqtincha o‘chirilgan kurslar"
              value={inactive}
            />
          </div>
        </div>

 
        <div className="bg-gray-900/70 backdrop-blur-lg border border-gray-800 rounded-2xl p-5 sm:p-6 shadow-xl">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">
            🛠 Tizim sozlamalari
          </h2>

          <div className="space-y-5">
            <ToggleItem label="Bildirishnomalarni yoqish" />
            <ToggleItem label="Avtomatik saqlash" />
            <ToggleItem label="Qorong‘i rejim (Dark Mode)" />
          </div>
        </div>
      </div>


      {openModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white text-black p-5 sm:p-6 rounded-2xl w-full max-w-md"
          >
            <h2 className="text-lg sm:text-xl font-bold mb-4">
              Yangi kurs qo‘shish
            </h2>

            <input
              className="w-full border p-2 mb-3 rounded"
              placeholder="Kurs nomi"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />

            <input
              type="number"
              className="w-full border p-2 mb-3 rounded"
              placeholder="Narx"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />

            <input
              className="w-full border p-2 mb-3 rounded"
              placeholder="Davomiylik"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
              required
            />

            <div className="flex flex-col sm:flex-row justify-between gap-4 mt-4">
              <button
                type="button"
                onClick={() => setOpenModal(false)}
                className="text-gray-600 w-full sm:w-auto"
              >
                Bekor qilish
              </button>

              <button
                type="submit"
                className="bg-black text-white px-5 py-2 rounded-lg w-full sm:w-auto"
              >
                Saqlash
              </button>
            </div>
          </form>
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
  color: "blue" | "green" | "red";
}) {
  const colors = {
    blue: "from-blue-600 to-blue-400",
    green: "from-green-600 to-green-400",
    red: "from-red-600 to-red-400",
  };

  return (
    <div
      className={`bg-gradient-to-br ${colors[color]} rounded-2xl p-5 sm:p-6 shadow-xl`}
    >
      <p className="text-sm opacity-80">{title}</p>
      <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-2">
        {value}
      </h3>
    </div>
  );
}

function SettingItem({
  title,
  desc,
  value,
  action,
  button,
}: {
  title: string;
  desc: string;
  value?: number;
  action?: () => void;
  button?: string;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-gray-800 p-4 rounded-xl hover:bg-gray-700 transition">
      <div>
        <p className="font-semibold">{title}</p>
        <p className="text-sm text-gray-400">{desc}</p>
      </div>

      {value !== undefined && (
        <span className="text-lg font-bold">{value}</span>
      )}

      {action && (
        <button
          onClick={action}
          className="bg-white text-black px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition w-full sm:w-auto"
        >
          {button}
        </button>
      )}
    </div>
  );
}

function ToggleItem({ label }: { label: string }) {
  const [enabled, setEnabled] = useState(false);

  return (
    <div className="flex justify-between items-center bg-gray-800 p-4 rounded-xl">
      <span className="text-sm sm:text-base">{label}</span>
      <button
        onClick={() => setEnabled(!enabled)}
        className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
          enabled ? "bg-green-500" : "bg-gray-600"
        }`}
      >
        <div
          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
            enabled ? "translate-x-6" : ""
          }`}
        />
      </button>
    </div>
  );
}

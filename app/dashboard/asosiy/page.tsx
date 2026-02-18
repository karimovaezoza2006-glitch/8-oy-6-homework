"use client";

import { useState } from "react";
import { Users, BookOpen, Wallet, Plus, Minus, Trash2 } from "lucide-react";

type Course = {
  id: number;
  name: string;
  percent: number;
};

type Payment = {
  id: number;
  name: string;
  amount: number;
};

export default function AsosiyPage() {
  const [students] = useState(1245);

  const [courses, setCourses] = useState<Course[]>([
    { id: 1, name: "Frontend React", percent: 70 },
    { id: 2, name: "Backend Node.js", percent: 55 },
  ]);

  const [payments, setPayments] = useState<Payment[]>([
    { id: 1, name: "Aliyev Jamshid", amount: 1200000 },
    { id: 2, name: "Karimova Dilnoza", amount: 900000 },
  ]);

  const [newCourse, setNewCourse] = useState("");

  const income = payments.reduce((a, b) => a + b.amount, 0);

  const addCourse = () => {
    if (!newCourse) return;
    setCourses([...courses, { id: Date.now(), name: newCourse, percent: 0 }]);
    setNewCourse("");
  };

  const removeCourse = (id: number) =>
    setCourses(courses.filter((c) => c.id !== id));

  const changeProgress = (id: number, value: number) =>
    setCourses(
      courses.map((c) =>
        c.id === id
          ? { ...c, percent: Math.min(100, Math.max(0, c.percent + value)) }
          : c,
      ),
    );

  return (
    <div className="space-y-12">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
        🎓 O‘quv Markazi Dashboard
      </h1>

      {/* ===== STATS ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard
          title="O‘quvchilar"
          value={students}
          icon={<Users size={26} />}
          gradient="from-blue-500 to-blue-700"
        />
        <StatCard
          title="Kurslar"
          value={courses.length}
          icon={<BookOpen size={26} />}
          gradient="from-violet-500 to-purple-700"
        />
        <StatCard
          title="Daromad"
          value={`${income.toLocaleString()} so‘m`}
          icon={<Wallet size={26} />}
          gradient="from-emerald-500 to-green-700"
        />
      </div>

      {/* ===== COURSES ===== */}
      <GlassSection title="📚 Kurslar">
        <div className="flex gap-3 mb-6">
          <input
            value={newCourse}
            onChange={(e) => setNewCourse(e.target.value)}
            placeholder="Yangi kurs nomi"
            className="flex-1 px-4 py-2 rounded-xl bg-white/70 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addCourse}
            className="px-5 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Qo‘shish
          </button>
        </div>

        {courses.map((c) => (
          <div
            key={c.id}
            className="p-5 rounded-xl bg-white/70 dark:bg-gray-900 backdrop-blur border border-gray-200 dark:border-gray-700 mb-4 hover:shadow-lg transition"
          >
            <div className="flex justify-between mb-3">
              <span className="font-semibold">{c.name}</span>
              <button onClick={() => removeCourse(c.id)}>
                <Trash2 className="text-red-500" size={18} />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => changeProgress(c.id, -5)}
                className="p-1 rounded-full bg-gray-200 dark:bg-gray-700"
              >
                <Minus size={16} />
              </button>

              <div className="flex-1 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-3 bg-gradient-to-r from-blue-500 to-violet-600 rounded-full transition-all duration-500"
                  style={{ width: `${c.percent}%` }}
                />
              </div>

              <button
                onClick={() => changeProgress(c.id, 5)}
                className="p-1 rounded-full bg-gray-200 dark:bg-gray-700"
              >
                <Plus size={16} />
              </button>

              <span className="text-sm font-medium">{c.percent}%</span>
            </div>
          </div>
        ))}
      </GlassSection>

      {/* ===== PAYMENTS ===== */}
      <GlassSection title="💳 So‘nggi To‘lovlar">
        {payments.map((p) => (
          <div
            key={p.id}
            className="flex justify-between items-center p-4 rounded-xl bg-white/70 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 mb-3 hover:shadow-lg transition"
          >
            <span className="font-medium">{p.name}</span>
            <span className="text-emerald-600 font-semibold">
              {p.amount.toLocaleString()} so‘m
            </span>
          </div>
        ))}
      </GlassSection>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function StatCard({
  title,
  value,
  icon,
  gradient,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  gradient: string;
}) {
  return (
    <div
      className={`p-6 rounded-2xl text-white shadow-lg bg-gradient-to-r ${gradient}`}
    >
      <div className="flex justify-between items-center mb-4">{icon}</div>
      <p className="text-sm opacity-80">{title}</p>
      <h3 className="text-3xl font-bold">{value}</h3>
    </div>
  );
}

function GlassSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="p-6 rounded-2xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-lg border border-gray-200 dark:border-gray-700 shadow-xl">
      <h2 className="font-semibold text-lg mb-6">{title}</h2>
      {children}
    </div>
  );
}

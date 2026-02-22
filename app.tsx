import React, { useState, useEffect, useMemo } from "react";
import {
  Users,
  BookOpen,
  Wallet,
  Plus,
  Minus,
  Trash2,
  LayoutDashboard,
  TrendingUp,
  Search,
  Bell,
  Sparkles,
  ArrowRight,
  UserPlus,
  CreditCard,
} from "lucide-react";
import { StatCard } from "./components/StatCard";
import { Course, Payment } from "./types";
import { getAIInsights } from "./services/geminiService";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function App() {
  /* ================= STATES ================= */
  const [students, setStudents] = useState(1245);
  const [courses, setCourses] = useState<Course[]>([
    { id: 1, name: "Frontend React Mastery", percent: 85, students: 450 },
    { id: 2, name: "Fullstack Node.js", percent: 62, students: 320 },
    { id: 3, name: "UI/UX Design Essentials", percent: 45, students: 280 },
    { id: 4, name: "Python for Data Science", percent: 92, students: 195 },
  ]);

  const [payments, setPayments] = useState<Payment[]>([
    { id: 1, name: "Aliyev Jamshid", amount: 1200000, date: "2023-10-24" },
    { id: 2, name: "Karimova Dilnoza", amount: 900000, date: "2023-10-24" },
    { id: 3, name: "Sobirov Omon", amount: 1500000, date: "2023-10-23" },
    { id: 4, name: "Toshmatova Laylo", amount: 1200000, date: "2023-10-22" },
  ]);

  const [newCourseName, setNewCourseName] = useState("");
  const [paymentForm, setPaymentForm] = useState({ name: "", amount: "" });
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);

  /* ================= CALCULATIONS ================= */
  const totalIncome = useMemo(
    () => payments.reduce((a, b) => a + b.amount, 0),
    [payments],
  );

  const chartData = useMemo(() => {
    return courses.map((c) => ({
      name: c.name.split(" ")[0],
      value: c.percent,
      full: c.name,
    }));
  }, [courses]);

  /* ================= AI INSIGHTS ================= */
  const fetchInsight = async () => {
    setIsLoadingInsight(true);
    const insight = await getAIInsights(courses, payments);
    setAiInsight(insight);
    setIsLoadingInsight(false);
  };

  useEffect(() => {
    fetchInsight();
  }, []);

  /* ================= FUNCTIONS ================= */
  const addCourse = () => {
    if (!newCourseName.trim()) return;
    const newCourse: Course = {
      id: Date.now(),
      name: newCourseName,
      percent: 0,
      students: 0,
    };
    setCourses([newCourse, ...courses]);
    setNewCourseName("");
  };

  const deleteCourse = (id: number) => {
    setCourses(courses.filter((c) => c.id !== id));
  };

  const updateProgress = (id: number, delta: number) => {
    setCourses(
      courses.map((c) =>
        c.id === id
          ? { ...c, percent: Math.min(100, Math.max(0, c.percent + delta)) }
          : c,
      ),
    );
  };

  const addPayment = () => {
    if (!paymentForm.name || !paymentForm.amount) return;
    const payment: Payment = {
      id: Date.now(),
      name: paymentForm.name,
      amount: Number(paymentForm.amount),
      date: new Date().toISOString().split("T")[0],
    };
    setPayments([payment, ...payments]);
    setPaymentForm({ name: "", amount: "" });
  };

  const deletePayment = (id: number) => {
    setPayments(payments.filter((p) => p.id !== id));
  };

  /* ================= UI COMPONENTS ================= */
  return (
    <div className="min-h-screen flex bg-slate-50/50">
      {/* SIDEBAR */}
      <aside className="hidden lg:flex w-72 flex-col bg-white border-r border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <TrendingUp size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">
            EduPulse <span className="text-indigo-600">Pro</span>
          </h1>
        </div>

        <nav className="space-y-2 flex-1">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" active />
          <SidebarItem icon={Users} label="O'quvchilar" />
          <SidebarItem icon={BookOpen} label="Kurslar" />
          <SidebarItem icon={Wallet} label="Moliya" />
        </nav>

        <div className="mt-auto pt-6">
          <div className="bg-slate-900 rounded-2xl p-5 text-white relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-xs font-medium text-slate-400 mb-1 uppercase">
                Sizning Rejangiz
              </p>
              <h4 className="font-bold text-lg mb-4">Enterprise Plus</h4>
              <button className="w-full bg-indigo-500 hover:bg-indigo-400 py-2 rounded-xl text-sm font-semibold transition-colors">
                Yangilash
              </button>
            </div>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-indigo-500/20 rounded-full blur-2xl"></div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full">
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-1 tracking-tight">
              Dashboard
            </h2>
            <p className="text-slate-500 font-medium">
              Xush kelibsiz! Markazingizda bugun nima gaplar?
            </p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Qidiruv..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm"
              />
            </div>
            <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 relative shadow-sm">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="O'quvchilar"
            value={students.toLocaleString()}
            icon={Users}
            trend="+12%"
            color="blue"
          />
          <StatCard
            title="Faol Kurslar"
            value={courses.length}
            icon={BookOpen}
            color="violet"
          />
          <StatCard
            title="Umumiy Daromad"
            value={`${totalIncome.toLocaleString()} so'm`}
            icon={Wallet}
            trend="+8.4%"
            color="emerald"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* PROGRESS CHART */}
          <div className="lg:col-span-2 glass-card rounded-2xl p-6 shadow-sm border border-slate-200/60">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <TrendingUp size={20} className="text-indigo-600" />
                Kurslardagi O'zlashtirish
              </h3>
              <select className="bg-slate-100 border-none text-xs font-bold rounded-lg px-2 py-1 outline-none text-slate-600">
                <option>Haftalik</option>
                <option>Oylik</option>
              </select>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontSize: 12 }}
                  />
                  <YAxis hide />
                  <Tooltip
                    cursor={{ fill: "#f8fafc" }}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                    }}
                    labelStyle={{ fontWeight: "bold", color: "#1e293b" }}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index % 2 === 0 ? "#4f46e5" : "#8b5cf6"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI INSIGHT BOX */}
          <div className="bg-indigo-600 rounded-3xl p-8 text-white flex flex-col justify-between shadow-xl shadow-indigo-200 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-20 transform group-hover:rotate-12 transition-transform duration-500">
              <Sparkles size={120} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6 bg-white/20 w-fit px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm">
                <Sparkles size={14} /> AI TAHLILCHI
              </div>
              <h4 className="text-2xl font-bold mb-4 leading-tight">
                Markazingiz qanday ketmoqda?
              </h4>

              {isLoadingInsight ? (
                <div className="space-y-3">
                  <div className="h-4 bg-white/20 rounded animate-pulse w-full"></div>
                  <div className="h-4 bg-white/20 rounded animate-pulse w-3/4"></div>
                  <div className="h-4 bg-white/20 rounded animate-pulse w-1/2"></div>
                </div>
              ) : (
                <p className="text-indigo-100 text-lg leading-relaxed font-medium italic">
                  "{aiInsight || "Ma'lumotlar tahlil qilinmoqda..."}"
                </p>
              )}
            </div>
            <button
              onClick={fetchInsight}
              className="relative z-10 mt-8 flex items-center gap-2 font-bold text-sm bg-white text-indigo-600 px-6 py-3 rounded-xl hover:bg-indigo-50 transition-colors"
            >
              Yangilash <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* COURSES LIST */}
          <section className="glass-card rounded-2xl p-6 shadow-sm border border-slate-200/60">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <BookOpen size={20} className="text-indigo-600" />
                Kurslarni Boshqarish
              </h3>
              <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
                {courses.length} TA KURS
              </span>
            </div>

            <div className="flex gap-2 mb-6">
              <div className="relative flex-1">
                <BookOpen
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  value={newCourseName}
                  onChange={(e) => setNewCourseName(e.target.value)}
                  placeholder="Yangi kurs nomi..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all"
                />
              </div>
              <button
                onClick={addCourse}
                className="bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
              >
                <Plus size={20} />
              </button>
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="group p-4 bg-white border border-slate-100 rounded-xl hover:border-indigo-200 hover:shadow-sm transition-all"
                >
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <h5 className="font-bold text-slate-800">
                        {course.name}
                      </h5>
                      <p className="text-xs text-slate-400 font-semibold uppercase">
                        {course.students} o'quvchi
                      </p>
                    </div>
                    <button
                      onClick={() => deleteCourse(course.id)}
                      className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => updateProgress(course.id, -5)}
                      className="p-1 hover:bg-slate-100 rounded-md text-slate-400 transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${course.percent}%` }}
                      ></div>
                    </div>
                    <button
                      onClick={() => updateProgress(course.id, 5)}
                      className="p-1 hover:bg-slate-100 rounded-md text-slate-400 transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                    <span className="text-xs font-extrabold text-indigo-600 w-8 text-right">
                      {course.percent}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* PAYMENTS LIST */}
          <section className="glass-card rounded-2xl p-6 shadow-sm border border-slate-200/60">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <CreditCard size={20} className="text-emerald-600" />
                To'lovlar Tarixi
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 mb-6">
              <div className="sm:col-span-2 relative">
                <UserPlus
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  placeholder="Ism..."
                  value={paymentForm.name}
                  onChange={(e) =>
                    setPaymentForm({ ...paymentForm, name: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm transition-all"
                />
              </div>
              <div className="sm:col-span-2 relative">
                <Wallet
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  type="number"
                  placeholder="Summa..."
                  value={paymentForm.amount}
                  onChange={(e) =>
                    setPaymentForm({ ...paymentForm, amount: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm transition-all"
                />
              </div>
              <button
                onClick={addPayment}
                className="bg-emerald-600 text-white font-bold text-sm px-4 py-2 rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
              >
                Qo'shish
              </button>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-4 bg-slate-50 border border-transparent rounded-2xl hover:border-emerald-200 hover:bg-emerald-50/30 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm">
                      {payment.name.charAt(0)}
                    </div>
                    <div>
                      <h6 className="font-bold text-slate-800">
                        {payment.name}
                      </h6>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">
                        {payment.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-slate-700">
                      +{payment.amount.toLocaleString()}{" "}
                      <span className="text-[10px]">SO'M</span>
                    </span>
                    <button
                      onClick={() => deletePayment(payment.id)}
                      className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-white rounded-lg transition-colors opacity-0 group-hover:opacity-100 shadow-sm"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

/* SIDEBAR ITEM HELPER */
function SidebarItem({
  icon: Icon,
  label,
  active = false,
}: {
  icon: any;
  label: string;
  active?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all duration-200 group ${active ? "bg-indigo-50 text-indigo-600" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}
    >
      <Icon
        size={20}
        className={`${active ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"}`}
      />
      <span className="font-semibold text-sm">{label}</span>
      {active && (
        <div className="ml-auto w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>
      )}
    </div>
  );
}

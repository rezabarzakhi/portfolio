import { BarChart3, Eye, TrendingUp } from "lucide-react";
import { AdminPageHeader } from "@/components/admin-page-header";
import { getViewStats } from "@/lib/stats";

export const dynamic = "force-dynamic";

const dayNames: Record<string, string> = {
  Sun: "یکشنبه",
  Mon: "دوشنبه",
  Tue: "سه‌شنبه",
  Wed: "چهارشنبه",
  Thu: "پنجشنبه",
  Fri: "جمعه",
  Sat: "شنبه",
};

export default async function StatsAdminPage() {
  const stats = await getViewStats();
  const max = Math.max(1, ...Object.values(stats.daily));
  const bars = Object.entries(stats.daily).map(([day, count]) => {
    const date = new Date(`${day}T00:00:00Z`);
    const label = dayNames[date.toLocaleDateString("en-US", { weekday: "short" })] ?? "—";
    return { label, count, pct: Math.round((count / max) * 100) };
  });

  return <main className="grid gap-7"><AdminPageHeader title="آمار بازدید" description="نمای کلی ترافیک وب‌سایت" />
    <div className="grid gap-4 sm:grid-cols-2"><div className="surface rounded-2xl p-6"><Eye className="mb-4 text-[#9db2bf]" size={24} /><strong className="block text-3xl">{stats.total.toLocaleString("fa-IR")}</strong><span className="mt-2 block text-sm text-gray-500">کل بازدیدها</span></div><div className="surface rounded-2xl p-6"><TrendingUp className="mb-4 text-[#9db2bf]" size={24} /><strong className="block text-3xl">{stats.today.toLocaleString("fa-IR")}</strong><span className="mt-2 block text-sm text-gray-500">بازدید امروز</span></div></div>

    <section className="surface rounded-2xl p-6"><div className="mb-6 flex items-center gap-2"><BarChart3 size={18} className="text-[#9db2bf]" /><h2 className="text-lg font-black">بازدید ۷ روز اخیر</h2></div><div className="flex h-40 items-end gap-2">{bars.map((bar) => <div key={bar.label} className="flex flex-1 flex-col items-center gap-2"><div className="flex w-full flex-1 items-end"><div className="w-full rounded-t-lg bg-[#526d82]/70 transition-all" style={{ height: `${Math.max(bar.pct, 2)}%` }} title={`${bar.count}`} /></div><span className="text-[11px] text-gray-500">{bar.label}</span></div>)}</div></section>

    <section className="surface rounded-2xl p-6"><div className="mb-5 flex items-center gap-2"><Eye size={18} className="text-[#9db2bf]" /><h2 className="text-lg font-black">پربازدیدترین صفحات</h2></div>{stats.byPath.length ? <div className="divide-y divide-white/10">{stats.byPath.map((item, index) => <div key={item.path} className="flex items-center justify-between gap-3 py-3"><span className="truncate text-sm text-gray-300"><span className="me-2 text-gray-600">{index + 1}.</span>{item.path}</span><span className="rounded-full bg-[#526d82]/20 px-3 py-1 text-xs text-[#9db2bf]">{item.count.toLocaleString("fa-IR")}</span></div>)}</div> : <p className="text-gray-500">هنوز بازدیدی ثبت نشده است.</p>}</section>
  </main>;
}
import Link from "next/link";
import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import { auth } from "@/auth";
import { logoutAction } from "@/app/admin/actions";
import { AdminNavigation } from "@/components/admin-navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  return <div className="min-h-screen"><header className="border-b border-white/10 bg-[#1a2332]/80 backdrop-blur-md"><div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6"><div className="flex items-center gap-5"><Link href="/admin" className="font-black">&lt;<span className="text-[#9db2bf]">RB</span>/&gt;</Link><span className="text-sm text-gray-500">مدیریت محتوا</span></div><div className="flex items-center gap-3"><Link href="/fa" target="_blank" className="button-secondary min-h-10 text-xs">مشاهده سایت</Link><form action={logoutAction}><button className="grid size-10 place-items-center rounded-lg border border-white/10 text-gray-400 hover:text-white" title="خروج"><LogOut size={17} /></button></form></div></div></header><div className="mx-auto grid max-w-7xl lg:grid-cols-[15rem_1fr] lg:gap-8 lg:px-6"><aside className="border-b border-white/10 lg:border-e lg:border-b-0 lg:py-8 lg:pe-5"><AdminNavigation /></aside><div className="min-w-0 px-4 py-10 sm:px-6 lg:px-0">{children}</div></div></div>;
}

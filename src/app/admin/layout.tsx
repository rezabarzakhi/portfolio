import { Vazirmatn } from "next/font/google";
import { ToastContainer } from "@/components/toast";
import "../globals.css";

const vazirmatn = Vazirmatn({ variable: "--font-vazirmatn", subsets: ["arabic", "latin"], display: "swap" });

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="fa" dir="rtl" className={vazirmatn.variable}><body className="bg-[#1a2332]">{children}<ToastContainer /></body></html>;
}

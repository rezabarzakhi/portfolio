import { Vazirmatn } from "next/font/google";
import "../globals.css";

const vazirmatn = Vazirmatn({ variable: "--font-vazirmatn", subsets: ["arabic", "latin"], display: "swap" });

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="fa" dir="rtl" className={vazirmatn.variable}><body className="bg-[#030712]">{children}</body></html>;
}

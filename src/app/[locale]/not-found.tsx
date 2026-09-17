import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <section className="ambient-section grid min-h-screen place-items-center px-4 pt-20">
      <div className="container-shell text-center">
        <p className="eyebrow">404</p>
        <h1 className="display-title mt-4">صفحه پیدا نشد</h1>
        <p className="mx-auto mt-6 max-w-xl leading-8 text-gray-400">
          صفحه‌ای که دنبال آن بودید وجود ندارد، حذف شده یا آدرس آن تغییر کرده است.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link href="/fa" className="button-primary"><Home size={18} />بازگشت به خانه</Link>
        </div>
        <div className="mx-auto mt-12 flex max-w-md items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-right">
          <Search size={18} className="shrink-0 text-gray-400" />
          <p className="text-sm text-gray-400">ممکن است به دنبال بخش‌های آثار، مقاله‌ها یا دربارهٔ من باشید.</p>
        </div>
      </div>
    </section>
  );
}
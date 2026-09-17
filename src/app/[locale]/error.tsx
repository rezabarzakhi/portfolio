"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCw } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <section className="ambient-section grid min-h-screen place-items-center px-4 pt-20">
      <div className="container-shell text-center">
        <AlertTriangle size={44} className="mx-auto text-amber-400" />
        <h1 className="display-title mt-6">مشکلی پیش آمد</h1>
        <p className="mx-auto mt-5 max-w-xl leading-8 text-gray-400">
          هنگام بارگذاری صفحه خطایی رخ داد. لطفاً دوباره تلاش کنید.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <button type="button" onClick={reset} className="button-primary">
            <RotateCw size={18} />تلاش مجدد
          </button>
        </div>
      </div>
    </section>
  );
}
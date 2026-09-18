"use client";

import { useEffect, useState } from "react";

type ToastItem = { id: number; type: "success" | "error"; message: string; long?: boolean };

let globalId = 0;
let listeners: Array<(items: ToastItem[]) => void> = [];
let items: ToastItem[] = [];

function notify(type: "success" | "error", message: string, options?: { long?: boolean }) {
  const id = ++globalId;
  items = [...items, { id, type, message, long: options?.long }];
  listeners.forEach((l) => l(items));
  setTimeout(() => {
    items = items.filter((i) => i.id !== id);
    listeners.forEach((l) => l(items));
  }, options?.long ? 6000 : 3000);
}

export const toast = {
  success: (msg: string) => notify("success", msg),
  error: (msg: string, options?: { long?: boolean }) => notify("error", msg, options),
};

export function ToastContainer() {
  const [list, setList] = useState<ToastItem[]>([]);

  useEffect(() => {
    listeners.push(setList);
    return () => {
      listeners = listeners.filter((l) => l !== setList);
    };
  }, []);

  return (
    <>
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {list.filter((t) => t.type === "success").map((t) => t.message).join(" ")}
      </div>
      <div className="sr-only" role="alert" aria-live="assertive" aria-atomic="true">
        {list.filter((t) => t.type === "error").map((t) => t.message).join(" ")}
      </div>
      {list.length > 0 && (
        <div className="toast-container" aria-hidden="true">
          {list.map((t) => (
            <div key={t.id} className={`toast toast-${t.type} ${t.long ? "toast-long" : ""}`}>
              {t.message}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

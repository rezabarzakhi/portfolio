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

  if (!list.length) return null;

  return (
    <div className="toast-container">
      {list.map((t) => (
        <div key={t.id} className={`toast toast-${t.type} ${t.long ? "toast-long" : ""}`} role={t.type === "error" ? "alert" : "status"}>
          {t.message}
        </div>
      ))}
    </div>
  );
}

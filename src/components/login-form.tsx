"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/admin/actions";

export function LoginForm() {
  const [error, action, pending] = useActionState(loginAction, undefined);
  return (
    <form action={action} className="surface w-full max-w-md rounded-2xl p-7 sm:p-9">
      <div className="mb-8"><p className="mb-2 text-sm font-bold text-[#9db2bf]">پنل مدیریت</p><h1 className="text-3xl font-black">ورود مدیر</h1></div>
      <label><span className="form-label">نام کاربری یا ایمیل</span><input className="form-field" name="identifier" type="text" required autoComplete="username" /></label>
      <label className="mt-5 block"><span className="form-label">گذرواژه</span><input className="form-field" name="password" type="password" required minLength={8} autoComplete="current-password" /></label>
      {error && <p className="mt-4 text-sm text-red-400" role="alert">{error}</p>}
      <button className="button-primary mt-7 w-full" disabled={pending}>{pending ? "در حال بررسی" : "ورود"}</button>
    </form>
  );
}

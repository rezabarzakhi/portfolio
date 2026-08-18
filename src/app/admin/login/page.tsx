import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { LoginForm } from "@/components/login-form";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/admin");
  return <main className="grid min-h-screen place-items-center px-4"><LoginForm /></main>;
}

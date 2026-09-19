import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const path = typeof body?.path === "string" ? body.path.slice(0, 200) : "/";
    const locale = typeof body?.locale === "string" ? body.locale : "fa";
    const referrer = typeof body?.referrer === "string" ? body.referrer.slice(0, 300) : "";
    await prisma.pageView.create({ data: { path, locale, referrer } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
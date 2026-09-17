import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const start = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    const dbMs = Date.now() - start;
    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      db: { status: "ok", responseMs: dbMs },
    });
  } catch {
    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        db: { status: "error" },
      },
      { status: 503 }
    );
  }
}

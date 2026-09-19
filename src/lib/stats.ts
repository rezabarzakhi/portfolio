import { prisma } from "@/lib/prisma";

export async function trackPageView(path: string, locale: string, referrer: string) {
  if (!process.env.DATABASE_URL) return;
  try {
    await prisma.pageView.create({ data: { path, locale, referrer } });
  } catch {
    // tracking must never break page rendering
  }
}

export async function getViewStats() {
  const [total, today, byPath, last7Days] = await Promise.all([
    prisma.pageView.count(),
    prisma.pageView.count({ where: { createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } } }),
    prisma.pageView.groupBy({
      by: ["path"],
      _count: { _all: true },
      orderBy: { _count: { path: "desc" } },
      take: 10,
    }),
    prisma.pageView.groupBy({
      by: ["createdAt"],
      where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
      _count: { _all: true },
    }),
  ]);

  const daily: Record<string, number> = {};
  for (let i = 6; i >= 0; i -= 1) {
    const day = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const key = day.toISOString().slice(0, 10);
    daily[key] = 0;
  }
  for (const group of last7Days) {
    const key = group.createdAt.toISOString().slice(0, 10);
    if (key in daily) daily[key] = group._count._all;
  }

  return {
    total,
    today,
    byPath: byPath.map((item) => ({ path: item.path, count: item._count._all })),
    daily,
  };
}
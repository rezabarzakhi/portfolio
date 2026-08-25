import { Download } from "lucide-react";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/page-hero";
import { dictionary, getPublicContent, isLocale } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function ResumePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { setting, experiences, skills } = await getPublicContent();
  const t = dictionary[locale];
  return <><PageHero eyebrow={t.nav.resume} title={t.experience} description={t.resumeIntro} /><section className="section-space"><div className="container-shell grid gap-14 lg:grid-cols-[1fr_0.45fr]"><div><h2 className="mb-8 text-2xl font-bold">{t.experience}</h2><div className="border-s border-white/10 ps-7">{experiences.map((item) => <article key={item.id} className="relative mb-10 last:mb-0"><span className="absolute top-2 -start-[2.05rem] size-3 rounded-full border-2 border-[#1a2332] bg-gray-400" /><p className="mb-2 text-sm text-gray-300">{locale === "fa" ? item.periodFa : item.periodEn}</p><h3 className="text-xl font-bold">{locale === "fa" ? item.titleFa : item.titleEn}</h3><p className="mt-1 text-sm text-gray-500">{locale === "fa" ? item.organizationFa : item.organizationEn}</p><p className="mt-4 leading-8 text-gray-400">{locale === "fa" ? item.descriptionFa : item.descriptionEn}</p></article>)}</div></div><aside><div className="surface rounded-2xl p-6"><h2 className="mb-5 text-xl font-bold">{t.skillsLabel}</h2><div className="flex flex-wrap gap-2">{skills.map((skill) => <span key={skill.id} className="rounded-full bg-white/5 px-3 py-2 text-sm text-gray-300">{skill.name}</span>)}</div>{setting.resumeUrl && <a href={setting.resumeUrl} download className="button-primary mt-7 w-full"><Download size={17} />{t.downloadResume}</a>}</div></aside></div></section></>;
}

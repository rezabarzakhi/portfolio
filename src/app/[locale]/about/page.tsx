import Image from "next/image";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/page-hero";
import { dictionary, getPublicContent, isLocale } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { setting, skills } = await getPublicContent();
  const t = dictionary[locale];
  const about = locale === "fa" ? setting.aboutFa : setting.aboutEn;
  return (
    <>
      <PageHero eyebrow={t.aboutLabel} title={t.aboutTitle} description={locale === "fa" ? setting.introFa : setting.introEn} />
      <section className="section-space"><div className="container-shell grid gap-14 lg:grid-cols-[0.7fr_1fr]">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl"><Image src={setting.aboutImage} alt={t.aboutLabel} fill className="object-cover" sizes="40vw" /></div>
        <div><div className="prose-content"><p>{about}</p></div><h2 className="mt-12 text-2xl font-bold">{t.skillsTitle}</h2><div className="mt-6 flex flex-wrap gap-3">{skills.map((skill) => <span key={skill.id} className="surface rounded-full px-4 py-2 text-sm text-gray-300">{skill.name}</span>)}</div></div>
      </div></section>
    </>
  );
}

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Download, Mail, MapPin } from "lucide-react";
import { notFound } from "next/navigation";
import { ContactForm } from "@/components/contact-form";
import { PostCard, ProjectCard } from "@/components/content-cards";
import { SectionHeading } from "@/components/section-heading";
import { SocialLinks } from "@/components/site-footer";
import { dictionary, getPublicContent, isLocale } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { setting, skills, projects, posts } = await getPublicContent();
  const t = dictionary[locale];
  const name = locale === "fa" ? setting.nameFa : setting.nameEn;
  const role = locale === "fa" ? setting.roleFa : setting.roleEn;
  const intro = locale === "fa" ? setting.introFa : setting.introEn;
  const about = locale === "fa" ? setting.aboutFa : setting.aboutEn;
  const location = locale === "fa" ? setting.locationFa : setting.locationEn;
  const availability = locale === "fa" ? setting.availabilityFa : setting.availabilityEn;
  const Arrow = locale === "fa" ? ArrowLeft : ArrowRight;

  return (
    <>
      <section className="grid-lines pt-36 pb-20 sm:pt-44 sm:pb-24">
        <div className="container-shell grid items-center gap-16 lg:grid-cols-[1fr_0.65fr]">
          <div>
            <h1 className="display-title">{t.heroEyebrow}</h1>
            <p className="mt-5 text-xl font-semibold text-gray-200">{role}</p>
            <p className="mt-7 max-w-2xl text-lg leading-9 text-gray-400">{intro}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={`/${locale}/projects`} className="button-primary">{t.seeProjects}<Arrow size={18} /></Link>
              <Link href={`/${locale}/contact`} className="button-secondary">{t.contactMe}</Link>
              {setting.resumeUrl && <a href={setting.resumeUrl} className="button-secondary" download><Download size={17} />{t.downloadResume}</a>}
            </div>
            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-gray-400">
              <span className="inline-flex items-center gap-2"><MapPin size={17} className="text-gray-300" />{location}</span>
              <span className="inline-flex items-center gap-2"><span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_14px_#34d399]" />{availability}</span>
            </div>
            <div className="mt-6"><SocialLinks setting={setting} /></div>
          </div>
          <div className="relative mx-auto h-80 w-[16.25rem] max-w-full">
            <div className="absolute inset-0 translate-x-[2.8rem] translate-y-[2.8rem] bg-[#374151]" />
            <div className="image-frame relative h-80 w-[16.25rem] max-w-full overflow-hidden border-8 bg-gray-900 shadow-2xl">
              <Image src={setting.heroImage} alt={name} fill priority sizes="(max-width: 1024px) 80vw, 35vw" className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section className="section-alt section-space border-y border-white/5">
        <div className="container-shell grid items-center gap-14 lg:grid-cols-[0.72fr_1fr]">
          <div className="relative mx-auto h-80 w-[16.25rem] max-w-full bg-[#374151] before:absolute before:inset-0 before:translate-x-[2.8rem] before:translate-y-[2.8rem] before:bg-[#374151]">
            <Image src={setting.aboutImage} alt={t.aboutLabel} fill sizes="(max-width: 1024px) 100vw, 40vw" className="image-frame relative z-10 border-8 object-cover" />
          </div>
          <div>
            <SectionHeading eyebrow={t.aboutLabel} title={t.aboutTitle} />
            <p className="mt-7 max-w-2xl text-lg leading-9 text-gray-400">{about}</p>
            <Link href={`/${locale}/about`} className="mt-7 inline-flex items-center gap-2 font-bold text-gray-200 hover:text-white">{t.nav.about}<Arrow size={18} /></Link>
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="container-shell">
          <SectionHeading eyebrow={t.skillsLabel} title={t.skillsTitle} />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {skills.map((skill, index) => (
              <div key={skill.id} className="surface rounded-xl p-5">
                <div className="mb-4 flex items-center justify-between"><span className="font-bold">{skill.name}</span><span className="text-xs text-gray-600">0{index + 1}</span></div>
                <div className="h-1 overflow-hidden rounded-full bg-gray-800"><div className="h-full rounded-full bg-gray-500" style={{ width: `${skill.level}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-alt section-space border-y border-white/5">
        <div className="container-shell">
          <div className="flex flex-wrap items-end justify-between gap-6"><SectionHeading eyebrow={t.projectsLabel} title={t.projectsTitle} /><Link href={`/${locale}/projects`} className="button-secondary">{t.allProjects}<Arrow size={17} /></Link></div>
          <div className="mt-12 grid gap-7">{projects.slice(0, 4).map((project) => <ProjectCard key={project.id} project={project} locale={locale} />)}</div>
        </div>
      </section>

      <section className="section-space">
        <div className="container-shell">
          <div className="flex flex-wrap items-end justify-between gap-6"><SectionHeading eyebrow={t.blogLabel} title={t.blogTitle} /><Link href={`/${locale}/blog`} className="button-secondary">{t.allPosts}<Arrow size={17} /></Link></div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{posts.slice(0, 3).map((post) => <PostCard key={post.id} post={post} locale={locale} />)}</div>
        </div>
      </section>

      <section className="section-alt section-space border-t border-white/5">
        <div className="container-shell grid gap-12 lg:grid-cols-[0.7fr_1fr]">
          <div><SectionHeading eyebrow={t.contactLabel} title={t.contactTitle} /><p className="mt-5 leading-8 text-gray-400">{t.contactDescription}</p><a href={`mailto:${setting.email}`} className="mt-7 inline-flex items-center gap-2 text-gray-200 hover:text-white"><Mail size={18} />{setting.email}</a></div>
          <ContactForm locale={locale} />
        </div>
      </section>
    </>
  );
}

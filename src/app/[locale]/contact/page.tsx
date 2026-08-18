import { Mail, MapPin, Phone } from "lucide-react";
import { notFound } from "next/navigation";
import { ContactForm } from "@/components/contact-form";
import { PageHero } from "@/components/page-hero";
import { SocialLinks } from "@/components/site-footer";
import { dictionary, getPublicContent, isLocale } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { setting } = await getPublicContent();
  const t = dictionary[locale];
  const location = locale === "fa" ? setting.locationFa : setting.locationEn;
  return <><PageHero eyebrow={t.contactLabel} title={t.contactTitle} description={t.contactDescription} /><section className="section-space"><div className="container-shell grid gap-10 lg:grid-cols-[0.6fr_1fr]"><div className="space-y-5"><a href={`mailto:${setting.email}`} className="surface flex items-center gap-4 rounded-xl p-5"><Mail className="text-gray-300" />{setting.email}</a><a href={`tel:${setting.phone}`} className="surface flex items-center gap-4 rounded-xl p-5"><Phone className="text-gray-300" />{setting.phone}</a><div className="surface flex items-center gap-4 rounded-xl p-5"><MapPin className="text-gray-300" />{location}</div><SocialLinks setting={setting} /></div><ContactForm locale={locale} /></div></section></>;
}

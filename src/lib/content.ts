import type { Experience, Post, Project, SiteSetting, Skill } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const locales = ["fa", "en"] as const;
export type Locale = (typeof locales)[number];

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

const timestamps = { createdAt: new Date("2026-01-01"), updatedAt: new Date("2026-01-01") };

export const defaultSetting: SiteSetting = {
  id: "main",
  nameFa: "رضا برزخی",
  nameEn: "Reza Barzakhi",
  roleFa: "طراح وب و توسعه‌دهنده فرانت‌اند",
  roleEn: "Web designer and front-end developer",
  introFa: "طراح سایت با وردپرس و توسعه‌دهنده فرانت‌اند هستم. روی ساخت تجربه‌های سریع، حرفه‌ای و کاربرپسند تمرکز دارم و در کنار توسعه وب، ریاضی نیز تدریس می‌کنم.",
  introEn: "I am a WordPress web designer and front-end developer focused on fast, professional and user-friendly digital experiences. I also teach mathematics.",
  aboutFa: "آشنایی من با وردپرس از سال ۱۳۹۱ آغاز شد و از سال ۱۴۰۰ به‌صورت جدی با ری‌اکت کار می‌کنم. تجربه من در طراحی، توسعه و بهینه‌سازی باعث شده بتوانم مسئله‌های کسب‌وکار را به راهکارهای روشن و قابل استفاده تبدیل کنم.",
  aboutEn: "I started working with WordPress in 2012 and have worked seriously with React since 2021. My experience in design, development and optimization helps me turn business problems into clear, usable solutions.",
  locationFa: "مشهد، ایران",
  locationEn: "Mashhad, Iran",
  email: "reza.barzakhi@gmail.com",
  phone: "09159106742",
  availabilityFa: "آماده همکاری در پروژه‌های جدید",
  availabilityEn: "Available for new projects",
  heroImage: "https://www.rezabarzakhi.ir/wp-content/uploads/2025/12/me.jpg",
  aboutImage: "https://www.rezabarzakhi.ir/wp-content/uploads/2026/01/IMG_20210922_160307_463-1638x2048.jpg",
  resumeUrl: null,
  githubUrl: "https://github.com/rezabarzakhi",
  instagramUrl: "https://www.instagram.com/rezabarzakhi/",
  telegramUrl: "https://t.me/Rezabrzkhi",
  twitterUrl: "https://x.com/rezabarzakhi",
  seoDescriptionFa: "وب‌سایت شخصی رضا برزخی، طراح سایت، توسعه‌دهنده فرانت‌اند و مدرس ریاضی در مشهد.",
  seoDescriptionEn: "Portfolio of Reza Barzakhi, web designer, front-end developer and mathematics teacher based in Mashhad.",
  updatedAt: timestamps.updatedAt,
};

export const defaultSkills: Skill[] = [
  { id: "fallback-1", name: "Next.js", level: 82, sortOrder: 1, ...timestamps },
  { id: "fallback-2", name: "React", level: 88, sortOrder: 2, ...timestamps },
  { id: "fallback-3", name: "TypeScript", level: 80, sortOrder: 3, ...timestamps },
  { id: "fallback-4", name: "Tailwind CSS", level: 90, sortOrder: 4, ...timestamps },
  { id: "fallback-5", name: "WordPress", level: 94, sortOrder: 5, ...timestamps },
  { id: "fallback-6", name: "SEO", level: 78, sortOrder: 6, ...timestamps },
];

export const defaultProjects: Project[] = [
  {
    id: "fallback-project",
    slug: "smart-shop",
    titleFa: "فروشگاه هوشمند",
    titleEn: "Smart Shop",
    summaryFa: "یک فروشگاه تمرینی برای به‌کارگیری آموخته‌های توسعه فرانت‌اند در یک محصول واقعی.",
    summaryEn: "An experimental storefront built to apply front-end development skills in a realistic product.",
    contentFa: "این پروژه با تمرکز بر تجربه خرید روان، رابط واکنش‌گرا و معماری قابل توسعه ساخته شده است.",
    contentEn: "This project focuses on a smooth shopping experience, responsive interface and maintainable architecture.",
    imageUrl: "https://www.rezabarzakhi.ir/wp-content/uploads/2026/01/screencapture-smart-shop-demo-netlify-app-2025-09-29-23_57_09-815x1024.png",
    technologies: "React,Tailwind CSS,Git",
    liveUrl: null,
    repositoryUrl: "https://github.com/rezabarzakhi",
    completedAt: new Date("2025-09-29"),
    featured: true,
    published: true,
    ...timestamps,
  },
];

export const defaultPosts: Post[] = [
  {
    id: "fallback-post",
    slug: "building-better-user-interfaces",
    titleFa: "ساخت رابط‌های کاربری بهتر",
    titleEn: "Building better user interfaces",
    excerptFa: "چند اصل کاربردی برای ساخت رابط‌هایی که سریع، خوانا و قابل استفاده باشند.",
    excerptEn: "Practical principles for interfaces that are fast, readable and genuinely usable.",
    contentFa: "رابط خوب پیش از آنکه زیبا باشد، باید مسئله کاربر را حل کند. سلسله‌مراتب روشن، فاصله‌گذاری منظم و بازخورد مناسب سه پایه یک تجربه قابل اعتماد هستند.\n\nدر هر صفحه باید مشخص باشد مهم‌ترین اقدام چیست. رنگ، اندازه و جایگاه عناصر باید کاربر را به همان اقدام هدایت کنند، بدون آنکه صفحه شلوغ شود.",
    contentEn: "A good interface must solve the user's problem before it tries to look impressive. Clear hierarchy, consistent spacing and useful feedback are the foundations of a dependable experience.\n\nEvery page should have an obvious primary action. Color, scale and placement should guide users toward it without making the interface noisy.",
    categoryFa: "توسعه وب",
    categoryEn: "Web development",
    tags: "رابط کاربری,توسعه وب,UI,Web Development",
    imageUrl: "https://www.rezabarzakhi.ir/wp-content/uploads/2026/01/photo_2024-06-10_10-43-01.jpg",
    imageAltFa: "طراحی رابط کاربری بهتر",
    imageAltEn: "Building a better user interface",
    seoTitleFa: "ساخت رابط‌های کاربری بهتر",
    seoTitleEn: "Building better user interfaces",
    seoDescriptionFa: "اصول کاربردی طراحی و ساخت رابط کاربری سریع و قابل استفاده.",
    seoDescriptionEn: "Practical principles for designing fast and usable interfaces.",
    canonicalUrl: null,
    featured: true,
    allowIndex: true,
    published: true,
    publishedAt: new Date("2026-01-01"),
    ...timestamps,
  },
];

export const defaultExperiences: Experience[] = [
  {
    id: "fallback-experience-1",
    titleFa: "طراح و توسعه‌دهنده وب",
    titleEn: "Web designer and developer",
    organizationFa: "همکاری آزاد",
    organizationEn: "Freelance",
    periodFa: "۱۳۹۱ تاکنون",
    periodEn: "2012 - Present",
    descriptionFa: "طراحی و توسعه وب‌سایت‌های حرفه‌ای با تمرکز بر عملکرد، تجربه کاربری و بهینه‌سازی.",
    descriptionEn: "Designing and developing professional websites with a focus on performance, user experience and optimization.",
    sortOrder: 1,
    ...timestamps,
  },
  {
    id: "fallback-experience-2",
    titleFa: "مدرس ریاضی",
    titleEn: "Mathematics teacher",
    organizationFa: "آموزش",
    organizationEn: "Education",
    periodFa: "در حال فعالیت",
    periodEn: "Present",
    descriptionFa: "آموزش مفاهیم ریاضی با رویکرد حل مسئله و تقویت نگاه تحلیلی.",
    descriptionEn: "Teaching mathematics through problem solving and analytical thinking.",
    sortOrder: 2,
    ...timestamps,
  },
];

export async function getPublicContent() {
  if (!process.env.DATABASE_URL) {
    return {
      setting: defaultSetting,
      skills: defaultSkills,
      projects: defaultProjects,
      posts: defaultPosts,
      experiences: defaultExperiences,
    };
  }

  try {
    const [setting, skills, projects, posts, experiences] = await Promise.all([
      prisma.siteSetting.findUnique({ where: { id: "main" } }),
      prisma.skill.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.project.findMany({ where: { published: true }, orderBy: { createdAt: "desc" } }),
      prisma.post.findMany({ where: { published: true }, orderBy: { publishedAt: "desc" } }),
      prisma.experience.findMany({ orderBy: { sortOrder: "asc" } }),
    ]);

    return {
      setting: setting ?? defaultSetting,
      skills: skills.length ? skills : defaultSkills,
      projects: projects.length ? projects : defaultProjects,
      posts: posts.length ? posts : defaultPosts,
      experiences: experiences.length ? experiences : defaultExperiences,
    };
  } catch {
    return {
      setting: defaultSetting,
      skills: defaultSkills,
      projects: defaultProjects,
      posts: defaultPosts,
      experiences: defaultExperiences,
    };
  }
}

export const dictionary = {
  fa: {
    direction: "rtl",
    languageName: "English",
    nav: { home: "خانه", about: "درباره من", projects: "نمونه‌کارها", blog: "وبلاگ", resume: "رزومه", contact: "تماس" },
    heroEyebrow: "سلام، من رضا هستم",
    seeProjects: "مشاهده نمونه‌کارها",
    contactMe: "شروع همکاری",
    downloadResume: "دریافت رزومه",
    aboutLabel: "درباره من",
    aboutTitle: "طراحی دقیق، توسعه هدفمند",
    skillsLabel: "مهارت‌ها",
    skillsTitle: "ابزارهایی برای تبدیل ایده به محصول",
    projectsLabel: "نمونه‌کارها",
    projectsTitle: "چند تجربه منتخب",
    allProjects: "همه نمونه‌کارها",
    projectDetails: "مشاهده جزئیات",
    blogLabel: "یادداشت‌ها",
    blogTitle: "آموخته‌ها و تجربه‌ها",
    allPosts: "همه مقاله‌ها",
    readMore: "ادامه مطلب",
    contactLabel: "تماس",
    contactTitle: "برای ساخت پروژه بعدی گفت‌وگو کنیم",
    contactDescription: "اگر برای طراحی، توسعه یا بهینه‌سازی وب‌سایت خود به کمک نیاز دارید، پیام بفرستید.",
    name: "نام",
    email: "رایانامه",
    subject: "موضوع",
    message: "پیام",
    send: "ارسال پیام",
    sending: "در حال ارسال",
    sent: "پیام شما با موفقیت ارسال شد.",
    failed: "ارسال پیام انجام نشد. دوباره تلاش کنید.",
    noItems: "هنوز محتوایی منتشر نشده است.",
    live: "نسخه زنده",
    source: "مخزن کد",
    experience: "تجربه حرفه‌ای",
    resumeIntro: "مروری بر تجربه، مهارت‌ها و مسیر حرفه‌ای من.",
    back: "بازگشت",
    footer: "طراحی و توسعه توسط رضا برزخی",
  },
  en: {
    direction: "ltr",
    languageName: "فارسی",
    nav: { home: "Home", about: "About", projects: "Projects", blog: "Blog", resume: "Resume", contact: "Contact" },
    heroEyebrow: "Hello, I am Reza",
    seeProjects: "Explore my work",
    contactMe: "Start a project",
    downloadResume: "Download resume",
    aboutLabel: "About me",
    aboutTitle: "Thoughtful design, purposeful development",
    skillsLabel: "Capabilities",
    skillsTitle: "Tools that turn ideas into products",
    projectsLabel: "Selected work",
    projectsTitle: "A few recent projects",
    allProjects: "All projects",
    projectDetails: "View case study",
    blogLabel: "Journal",
    blogTitle: "Lessons and observations",
    allPosts: "All articles",
    readMore: "Read article",
    contactLabel: "Contact",
    contactTitle: "Let us discuss your next project",
    contactDescription: "Send me a note if you need help designing, building or improving your website.",
    name: "Name",
    email: "Email",
    subject: "Subject",
    message: "Message",
    send: "Send message",
    sending: "Sending",
    sent: "Your message was sent successfully.",
    failed: "The message could not be sent. Please try again.",
    noItems: "Nothing has been published yet.",
    live: "Live website",
    source: "Source code",
    experience: "Professional experience",
    resumeIntro: "An overview of my experience, skills and professional journey.",
    back: "Go back",
    footer: "Designed and developed by Reza Barzakhi",
  },
} as const;

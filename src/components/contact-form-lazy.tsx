"use client";

import dynamic from "next/dynamic";

export const ContactFormLazy = dynamic(() => import("@/components/contact-form").then((mod) => mod.ContactForm), {
  ssr: false,
  loading: () => <div className="skeleton h-72 rounded-2xl" aria-hidden="true" />,
});

export function PageHero({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <section className="grid-lines border-b border-white/5 pt-40 pb-20 sm:pt-48 sm:pb-28">
      <div className="container-shell">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="display-title">{title}</h1>
        {description && <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-400">{description}</p>}
      </div>
    </section>
  );
}

export function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`skeleton ${className}`} aria-hidden="true" />;
}

export function HomePageSkeleton() {
  return (
    <>
      <section className="ambient-section pt-36 pb-20 sm:pt-44 sm:pb-24">
        <div className="container-shell grid items-center gap-16 lg:grid-cols-[1fr_0.65fr]">
          <div>
            <SkeletonBlock className="h-10 w-64 max-w-full" />
            <SkeletonBlock className="mt-5 h-7 w-80 max-w-full" />
            <SkeletonBlock className="mt-7 h-4 w-full max-w-2xl" />
            <SkeletonBlock className="mt-3 h-4 w-3/4 max-w-xl" />
            <div className="mt-8 flex flex-wrap gap-3">
              <SkeletonBlock className="h-11 w-36" />
              <SkeletonBlock className="h-11 w-32" />
              <SkeletonBlock className="h-11 w-40" />
            </div>
            <div className="mt-9 flex flex-wrap gap-4">
              <SkeletonBlock className="h-5 w-40" />
              <SkeletonBlock className="h-5 w-32" />
            </div>
          </div>
          <SkeletonBlock className="aspect-[4/5] w-full max-w-sm justify-self-center rounded-2xl" />
        </div>
      </section>
      <section className="section-space">
        <div className="container-shell">
          <SkeletonBlock className="h-12 w-56" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <SkeletonBlock className="h-20 rounded-xl" />
            <SkeletonBlock className="h-20 rounded-xl" />
            <SkeletonBlock className="h-20 rounded-xl" />
            <SkeletonBlock className="h-20 rounded-xl" />
            <SkeletonBlock className="h-20 rounded-xl" />
            <SkeletonBlock className="h-20 rounded-xl" />
          </div>
        </div>
      </section>
    </>
  );
}

export function CardsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-7">
      {Array.from({ length: count }, (_, i) => (
        <SkeletonBlock key={i} className="h-40 rounded-2xl" />
      ))}
    </div>
  );
}

export function GridCardsSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, i) => (
        <SkeletonBlock key={i} className="h-64 rounded-2xl" />
      ))}
    </div>
  );
}
export function AdminPageHeader({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
      <div><h1 className="text-3xl font-black">{title}</h1><p className="mt-2 text-sm leading-7 text-gray-500">{description}</p></div>
      {action}
    </div>
  );
}

import type { ReactNode } from "react";

export default function PageHero({
  icon,
  title,
  subtitle,
  from = "#0ea5e9",
  to = "#0284c7",
}: {
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  from?: string;
  to?: string;
}) {
  return (
    <div
      className="relative overflow-hidden"
      style={{ background: `linear-gradient(120deg, ${from}, ${to})` }}
    >
      <div className="absolute -right-10 -top-10 w-52 h-52 rounded-full bg-white/10" />
      <div className="absolute right-24 bottom-0 w-24 h-24 rounded-full bg-white/10" />
      <div className="container-page py-12 relative">
        <div className="flex items-center gap-3 mb-2">
          {icon && (
            <span className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center text-white shrink-0">
              {icon}
            </span>
          )}
          <h1 className="font-display text-2xl sm:text-3xl text-white">{title}</h1>
        </div>
        {subtitle && <p className="text-white/80 text-sm">{subtitle}</p>}
      </div>
    </div>
  );
}

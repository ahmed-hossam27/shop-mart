import type { ReactNode } from "react";

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl border border-line p-3">
          <div className="skeleton aspect-square rounded-lg" />
          <div className="skeleton h-3 w-1/3 mt-3 rounded" />
          <div className="skeleton h-4 w-4/5 mt-2 rounded" />
          <div className="skeleton h-8 w-full mt-3 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  subtitle,
  action,
}: {
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center text-center py-24 px-6">
      {icon && <div className="text-ink-soft mb-4">{icon}</div>}
      <h3 className="font-display text-2xl mb-2">{title}</h3>
      {subtitle && <p className="text-ink-soft max-w-sm mb-6">{subtitle}</p>}
      {action}
    </div>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-8">
      {eyebrow && <p className="text-sm text-primary mb-2">{eyebrow}</p>}
      <h2 className="font-display text-3xl md:text-4xl">{title}</h2>
      {subtitle && <p className="text-ink-soft mt-2 max-w-xl">{subtitle}</p>}
    </div>
  );
}

export function BarHeading({ title, highlight }: { title: string; highlight?: string }) {
  const idx = highlight ? title.indexOf(highlight) : -1;
  return (
    <div className="flex items-center gap-3">
      <span className="w-1 h-7 rounded-full bg-primary shrink-0" />
      <h2 className="font-display text-2xl sm:text-3xl">
        {idx === -1 ? (
          title
        ) : (
          <>
            {title.slice(0, idx)}
            <span className="text-primary">{highlight}</span>
            {title.slice(idx + (highlight?.length ?? 0))}
          </>
        )}
      </h2>
    </div>
  );
}

export function ErrorNote({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-danger/30 bg-danger/5 text-danger px-4 py-3 text-sm">
      {message}
    </div>
  );
}

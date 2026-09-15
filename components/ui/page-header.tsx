import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  children?: ReactNode;
}) {
  return (
    <header className="border-b border-line">
      <div className="shell pb-16 pt-32 md:pb-24 md:pt-40">
        <div className="max-w-3xl">
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <h1 className="mt-4 text-h2">{title}</h1>
          {lead ? (
            <p className="mt-5 max-w-xl text-lead text-ink-soft">{lead}</p>
          ) : null}
          {children}
        </div>
      </div>
    </header>
  );
}

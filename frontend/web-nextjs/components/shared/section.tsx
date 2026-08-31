import { Card } from "@/components/ui/core";

export function SectionHeader({
  eyebrow,
  title,
  description,
  action
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-700">{eyebrow}</p>}
        <h2 className="mt-1 text-lg font-extrabold tracking-tight text-slate-900">{title}</h2>
        {description && <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function Section({
  title,
  description,
  action,
  children,
  className = ""
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={`p-5 ${className}`}>
      <SectionHeader title={title} description={description} action={action} />
      <div className="mt-5">{children}</div>
    </Card>
  );
}

import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { Card } from "./core";
import { cn } from "@/lib/utils";

export function MetricCard({
  label,
  value,
  detail,
  trend,
  tone = "brand",
  icon
}: {
  label: string;
  value: string;
  detail?: string;
  trend?: "up" | "down" | "flat";
  tone?: "brand" | "blue" | "purple" | "amber" | "emerald";
  icon?: React.ReactNode;
}) {
  const toneMap = {
    brand: "bg-brand-50 text-brand-700 ring-brand-100",
    blue: "bg-blue-50 text-blue-700 ring-blue-100",
    purple: "bg-violet-50 text-violet-700 ring-violet-100",
    amber: "bg-amber-50 text-amber-700 ring-amber-100",
    emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100"
  };
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">{label}</p>
          <p className="mt-2 truncate text-2xl font-extrabold tracking-tight text-slate-900">{value}</p>
          {detail && (
            <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
              {trend === "up" ? <ArrowUpRight className="h-3.5 w-3.5 text-emerald-600" /> : trend === "down" ? <ArrowDownRight className="h-3.5 w-3.5 text-red-500" /> : trend === "flat" ? <Minus className="h-3.5 w-3.5" /> : null}
              <span>{detail}</span>
            </div>
          )}
        </div>
        {icon && <div className={cn("rounded-xl p-2.5 ring-1", toneMap[tone])}>{icon}</div>}
      </div>
    </Card>
  );
}

export function ProgressBar({ value, label, suffix = "%" }: { value: number; label?: string; suffix?: string }) {
  return (
    <div>
      {label && <div className="mb-1.5 flex justify-between text-xs font-medium text-slate-600"><span>{label}</span><span>{value}{suffix}</span></div>}
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-brand-500" style={{ width: `${Math.max(0, Math.min(value, 100))}%` }} />
      </div>
    </div>
  );
}

export function MiniLineChart({
  values,
  label = "Trend",
  height = 140
}: {
  values: number[];
  label?: string;
  height?: number;
}) {
  const width = 520;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = Math.max(max - min, 1);
  const points = values.map((value, index) => {
    const x = (index / Math.max(values.length - 1, 1)) * width;
    const y = height - 16 - ((value - min) / span) * (height - 36);
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="img" aria-label={label}>
        {[0.25, 0.5, 0.75].map((p) => <line key={p} x1="0" x2={width} y1={height * p} y2={height * p} stroke="rgb(226 232 240)" strokeDasharray="4 5" />)}
        <polyline fill="none" stroke="rgb(15 148 136)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" points={points} />
        {values.map((value, index) => {
          const [x, y] = points.split(" ")[index].split(",").map(Number);
          return <circle key={`${value}-${index}`} cx={x} cy={y} r="3.5" fill="white" stroke="rgb(15 148 136)" strokeWidth="2.5" />;
        })}
      </svg>
    </div>
  );
}

"use client";

import { X } from "lucide-react";
import { Dialog as RadixDialog } from "radix-ui";
import { cn } from "@/lib/utils";

export function Card({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mp-card", className)}>{children}</div>;
}

export function Badge({
  children,
  tone = "neutral",
  className
}: {
  children: React.ReactNode;
  tone?: "neutral" | "success" | "warning" | "danger" | "info" | "brand";
  className?: string;
}) {
  const tones = {
    neutral: "border-slate-200 bg-slate-50 text-slate-600",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    warning: "border-amber-200 bg-amber-50 text-amber-700",
    danger: "border-red-200 bg-red-50 text-red-700",
    info: "border-blue-200 bg-blue-50 text-blue-700",
    brand: "border-brand-200 bg-brand-50 text-brand-700"
  };
  return <span className={cn("inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold", tones[tone], className)}>{children}</span>;
}

/** Shared accessible modal; Radix manages focus trapping, focus return and Escape handling. */
export function Modal({open,onClose,title,description,children,footer,width="max-w-xl"}: {
  open:boolean; onClose:()=>void; title:string;description?:string;children:React.ReactNode;footer?:React.ReactNode;width?:string;
}) {
  return <RadixDialog.Root open={open} onOpenChange={value=>{if(!value)onClose();}}>
    <RadixDialog.Portal>
      <RadixDialog.Overlay className="fixed inset-0 z-[80] bg-slate-950/50 backdrop-blur-sm" />
      <RadixDialog.Content className={cn("fixed left-1/2 top-1/2 z-[81] w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl focus:outline-none",width)}>
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4"><div><RadixDialog.Title className="text-lg font-bold text-slate-900">{title}</RadixDialog.Title>{description ? <RadixDialog.Description className="mt-1 text-sm text-slate-600">{description}</RadixDialog.Description>:<RadixDialog.Description className="sr-only">{title}</RadixDialog.Description>}</div><RadixDialog.Close asChild><button type="button" className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-blue-600" aria-label="Close dialog"><X className="h-4 w-4"/></button></RadixDialog.Close></div>
        <div className="max-h-[70vh] overflow-y-auto p-5">{children}</div>
        {footer&&<div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 bg-slate-50 px-5 py-4">{footer}</div>}
      </RadixDialog.Content>
    </RadixDialog.Portal>
  </RadixDialog.Root>;
}

export function Toggle({
  checked,
  onChange,
  label
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)} className="inline-flex items-center gap-3 text-sm font-medium text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
      <span className={cn("relative h-6 w-11 rounded-full transition", checked ? "bg-brand-600" : "bg-slate-300")}>
        <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all", checked ? "left-[22px]" : "left-0.5")} />
      </span>
      {label}
    </button>
  );
}

"use client";

import { BellRing, CheckCheck, ShieldAlert, Sparkles, WalletCards, X, PackageCheck } from "lucide-react";
import { useAppStore } from "@/components/providers/app-store";
import { cn } from "@/lib/utils";

const iconMap = {
  order: PackageCheck,
  wallet: WalletCards,
  price: Sparkles,
  security: ShieldAlert,
  system: BellRing
};

export function NotificationPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { notifications, markAllRead } = useAppStore();
  if (!open) return null;
  return (
    <div className="absolute right-4 top-[64px] z-[60] w-[min(390px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
      <div className="flex items-center justify-between border-b border-slate-100 p-4">
        <div>
          <p className="font-bold text-slate-900">Notifications</p>
          <p className="text-xs text-slate-500">Push, SMS and operational alerts</p>
        </div>
        <div className="flex gap-1">
          <button onClick={markAllRead} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Mark all read"><CheckCheck className="h-4 w-4" /></button>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Close"><X className="h-4 w-4" /></button>
        </div>
      </div>
      <div className="max-h-[440px] overflow-y-auto p-2">
        {notifications.map((item) => {
          const Icon = iconMap[item.type];
          return (
            <div key={item.id} className={cn("flex gap-3 rounded-xl p-3", !item.read && "bg-brand-50/60")}>
              <div className="mt-0.5 rounded-xl bg-white p-2 text-brand-700 ring-1 ring-slate-200"><Icon className="h-4 w-4" /></div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start gap-2">
                  <p className="flex-1 text-sm font-semibold text-slate-800">{item.title}</p>
                  {!item.read && <span className="mt-1.5 h-2 w-2 rounded-full bg-brand-500" />}
                </div>
                <p className="mt-0.5 text-xs leading-5 text-slate-500">{item.body}</p>
                <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-slate-400">{item.createdAt}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

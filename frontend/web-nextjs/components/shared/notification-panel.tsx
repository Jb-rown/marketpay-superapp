"use client";

import { useEffect, useRef, useState } from "react";
import { BellRing, CheckCheck, ShieldAlert, Sparkles, WalletCards, X, PackageCheck, Settings2 } from "lucide-react";
import { useAppStore } from "@/components/providers/app-store";
import { cn } from "@/lib/utils";

const icons = {order: PackageCheck,wallet: WalletCards,price: Sparkles,security: ShieldAlert,system: BellRing};
export function NotificationPanel({open,onClose}:{open:boolean;onClose:()=>void}) {
  const {notifications,markAllRead,markRead,pushNotificationsEnabled,setPushNotificationsEnabled} = useAppStore();
  const [filter,setFilter] = useState<"all"|"unread">("all");
  const [preferences,setPreferences] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(()=>{
    if(!open)return;
    const handler=(event:KeyboardEvent)=>{if(event.key==="Escape")onClose();};
    window.addEventListener("keydown",handler);
    requestAnimationFrame(()=>ref.current?.focus());
    return()=>window.removeEventListener("keydown",handler);
  },[open,onClose]);
  if(!open)return null;
  const visible = filter==="unread"?notifications.filter(item=>!item.read):notifications;
  return <div ref={ref} tabIndex={-1} role="dialog" aria-label="Notification center" className="absolute right-2 top-[64px] z-[60] w-[min(420px,calc(100vw-1rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl outline-none sm:right-4">
    <div className="flex items-start justify-between gap-2 border-b border-slate-100 p-4"><div><h2 className="font-bold text-slate-900">Notifications</h2><p className="text-xs text-slate-600">Order, payment and market updates</p></div><div className="flex gap-1">
      <button type="button" onClick={()=>setPreferences(x=>!x)} className="rounded-lg p-2 hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-blue-600" aria-label="Notification preferences" aria-expanded={preferences}><Settings2 className="h-4 w-4"/></button>
      <button type="button" onClick={markAllRead} disabled={!notifications.some(n=>!n.read)} className="rounded-lg p-2 hover:bg-slate-100 disabled:opacity-40" aria-label="Mark all notifications as read"><CheckCheck className="h-4 w-4"/></button>
      <button type="button" onClick={onClose} className="rounded-lg p-2 hover:bg-slate-100" aria-label="Close notifications"><X className="h-4 w-4"/></button>
    </div></div>
    {preferences&&<div className="border-b border-slate-100 bg-blue-50 p-4"><label className="flex cursor-pointer items-center justify-between gap-2 text-sm font-semibold text-slate-800"><span>Allow notification updates</span><input type="checkbox" checked={pushNotificationsEnabled} onChange={e=>setPushNotificationsEnabled(e.target.checked)} className="h-4 w-4 accent-blue-600"/></label><p className="mt-1 text-xs text-slate-600">This preference controls demonstration updates. Browser push requires separate permission and a live notification service.</p></div>}
    <div className="flex gap-2 border-b border-slate-100 p-3" role="group" aria-label="Filter notifications">{(["all","unread"] as const).map(item=><button type="button" key={item} onClick={()=>setFilter(item)} aria-pressed={filter===item} className={cn("rounded-lg px-3 py-1.5 text-xs font-semibold",filter===item?"bg-blue-600 text-white":"bg-slate-100 text-slate-700 hover:bg-slate-200")}>{item==="all"?"All":"Unread"} {item==="unread"&&`(${notifications.filter(n=>!n.read).length})`}</button>)}</div>
    <div className="max-h-[min(60vh,440px)] overflow-y-auto p-2">{visible.length===0?<p className="p-8 text-center text-sm text-slate-600" role="status">You’re all caught up. No unread notifications.</p>:visible.map(item=>{const Icon=icons[item.type];return <div key={item.id} className={cn("flex gap-3 rounded-xl p-3",!item.read&&"bg-blue-50")}><div className="mt-0.5 h-fit rounded-xl bg-white p-2 text-blue-700 ring-1 ring-slate-200"><Icon className="h-4 w-4"/></div><div className="min-w-0 flex-1"><div className="flex items-start gap-2"><h3 className="flex-1 text-sm font-semibold text-slate-900">{item.title}</h3>{!item.read&&<span className="mt-1.5 h-2 w-2 rounded-full bg-blue-600" aria-label="Unread"/>}</div><p className="mt-1 text-xs leading-5 text-slate-600">{item.body}</p><p className="mt-1 text-xs text-slate-500">{item.createdAt}</p>{!item.read&&<button type="button" onClick={()=>markRead(item.id)} className="mt-2 rounded text-xs font-semibold text-blue-700 underline underline-offset-2 hover:text-blue-900">Mark as read</button>}</div></div>})}</div>
  </div>;
}

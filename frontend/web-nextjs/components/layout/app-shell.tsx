"use client";

import Link from "next/link";
import { ClipboardCheck } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity, BadgeCheck, BadgePercent, Bell, BellRing, Bike, Boxes, ChartNoAxesCombined, CloudOff,
  ChevronDown, ClipboardList, DatabaseZap, FileDown, FileUp, LayoutDashboard, LineChart,
  HardDriveDownload, ListChecks, LogOut, MapPinned, Menu, Navigation, PackageCheck, Scale, ScanFace, Search,
  ShieldAlert, ShoppingCart, SlidersHorizontal, Sparkles, Star, Store, TriangleAlert, Truck,
  UserRound, Users, UsersRound, WalletCards, Warehouse, X
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { CommandSearch } from "@/components/shared/command-search";
import { navigation, roleDescriptions, roleLabels } from "@/lib/navigation";
import type { Role } from "@/lib/types";
import { cn, initials } from "@/lib/utils";
import { useAppStore } from "@/components/providers/app-store";
import { NotificationPanel } from "@/components/shared/notification-panel";

const icons = {
  Activity, BadgeCheck, BadgePercent, BellRing, Bike, Boxes, ChartNoAxesCombined, ClipboardList,
  CloudOff, DatabaseZap, FileDown, FileUp, HardDriveDownload, LayoutDashboard, LineChart, ListChecks, MapPinned, Navigation,
  PackageCheck, Scale, ScanFace, ShieldAlert, ShoppingCart, SlidersHorizontal, Sparkles, Star,
  Store, TriangleAlert, Truck, UserRound, Users, UsersRound, WalletCards, Warehouse
};

export function AppShell({
  role,
  children,
  title,
  description
}: {
  role: Role;
  children: React.ReactNode;
  title: string;
  description: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const mobileNavRef=useRef<HTMLElement>(null);
  const mobileToggleRef=useRef<HTMLButtonElement>(null);
  const closeNotifications=useCallback(()=>setNotificationsOpen(false),[]);
  useEffect(()=>{
    if(!mobileOpen)return;
    const previous=document.body.style.overflow;
    document.body.style.overflow="hidden";
    mobileNavRef.current?.focus();
    const handleKey=(e:KeyboardEvent)=>{
      if(e.key==="Escape")setMobileOpen(false);
      if(e.key!=="Tab")return;
      const nodes=Array.from(mobileNavRef.current?.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled])')||[]).filter(node=>node.offsetParent!==null);
      if(!nodes.length){e.preventDefault();return;}
      const first=nodes[0],last=nodes[nodes.length-1];
      if(e.shiftKey&&(document.activeElement===first||document.activeElement===mobileNavRef.current)){e.preventDefault();last.focus();}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
    };
    window.addEventListener("keydown",handleKey);
    return ()=>{document.body.style.overflow=previous;window.removeEventListener("keydown",handleKey);mobileToggleRef.current?.focus();};
  },[mobileOpen]);
  useEffect(()=>{setNotificationsOpen(false);setMobileOpen(false);},[pathname]);
  const { cartCount, unreadCount } = useAppStore();

  const currentUser = role === "government" ? "Mercy N. — Food Analyst" : role === "admin" ? "Platform Administrator" : role === "rider" ? "David Mwangi" : role === "vendor" ? "Wakulima Fresh" : role === "wholesaler" ? "Eastern Grain Co." : "Peter Otieno";

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-[72px] items-center gap-3 border-b border-white/10 px-5">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-500 font-black text-white shadow-lg shadow-brand-900/20">MP</div>
        <div>
          <p className="font-extrabold tracking-tight text-white">MarketPay</p>
          <p className="text-[11px] text-slate-300">Food. Finance. Intelligence.</p>
        </div>
      </div>

      <div className="p-3">
        <button type="button" aria-expanded={roleOpen} aria-label="Choose workspace" onClick={() => setRoleOpen((v) => !v)} className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-left transition hover:bg-white/10">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.16em] text-brand-300">Workspace</p>
              <p className="mt-1 text-sm font-semibold text-white">{roleLabels[role]}</p>
            </div>
            <ChevronDown className={cn("h-4 w-4 text-slate-300 transition", roleOpen && "rotate-180")} />
          </div>
        </button>
        {roleOpen && (
          <div className="mt-2 grid gap-1 rounded-xl border border-white/10 bg-slate-950/40 p-1.5">
            {(Object.keys(roleLabels) as Role[]).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => { setRoleOpen(false); setMobileOpen(false); router.push(`/${item}`); }}
                className={cn("rounded-lg px-3 py-2 text-left text-xs font-medium transition", item === role ? "bg-brand-500 text-white" : "text-slate-300 hover:bg-white/10 hover:text-white")}
              >
                {roleLabels[item]}
              </button>
            ))}
          </div>
        )}
      </div>

      <nav aria-label={`${roleLabels[role]} navigation`} className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
        {navigation[role].map((item) => {
          const Icon = icons[item.icon as keyof typeof icons] ?? LayoutDashboard;
          const exact = pathname === item.href;
          const active = exact || (item.href !== `/${role}` && pathname.startsWith(`${item.href}/`));
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              onClick={() => setMobileOpen(false)}
              className={cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition", active ? "bg-white text-navy-900 shadow-sm" : "text-slate-300 hover:bg-white/10 hover:text-white")}
            >
              <Icon className={cn("h-4 w-4", active ? "text-brand-600" : "text-slate-400")} />
              <span className="flex-1">{item.label}</span>
              {item.label === "Cart & Checkout" && cartCount > 0 && <span className="rounded-full bg-brand-500 px-2 py-0.5 text-[10px] font-bold text-white">{cartCount}</span>}
            </Link>
          );
        })}
      </nav>

      {process.env.NODE_ENV === "development" && <div className="px-3 pb-2"><Link href="/ui-review" onClick={()=>setMobileOpen(false)} className="flex items-center gap-3 rounded-xl border border-white/10 px-3 py-2.5 text-sm font-semibold text-blue-100 hover:bg-white/10"><ClipboardCheck className="h-4 w-4"/> UI compliance review</Link></div>}
      <div className="border-t border-white/10 p-3">
        <button type="button" onClick={() => router.push("/login")} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white">
          <LogOut className="h-4 w-4" /> {process.env.NODE_ENV === "development" ? "Return to sign in" : "Sign out"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/70">
      <a href="#main-content" className="sr-only fixed left-4 top-3 z-[130] rounded-lg bg-white px-4 py-2 font-semibold text-blue-900 focus:not-sr-only focus:ring-2 focus:ring-blue-600">Skip to main content</a>
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-[260px] bg-navy-900 lg:block">{sidebar}</aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden" role="presentation">
          <button className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} aria-label="Close navigation" />
          <aside ref={mobileNavRef} tabIndex={-1} role="dialog" aria-modal="true" aria-label="Mobile navigation" className="relative h-full w-[285px] max-w-[85vw] bg-navy-900 shadow-2xl outline-none">
            <button onClick={() => setMobileOpen(false)} className="absolute right-3 top-4 z-10 rounded-lg bg-white/10 p-2 text-white" aria-label="Close navigation">
              <X className="h-4 w-4" />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      <div className="lg:pl-[260px]">
        <header className="sticky top-0 z-40 flex h-[72px] items-center gap-3 border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-xl sm:px-6">
          <button ref={mobileToggleRef} type="button" onClick={() => setMobileOpen(true)} aria-expanded={mobileOpen} className="rounded-xl border border-slate-200 p-2 text-slate-600 lg:hidden" aria-label="Open navigation">
            <Menu className="h-5 w-5" />
          </button>
          <div className="min-w-0 flex-1 sm:max-w-md"><CommandSearch role={role} /></div>
          <div className="ml-auto flex items-center gap-2">
            <button type="button" onClick={() => setNotificationsOpen((v) => !v)} aria-expanded={notificationsOpen} aria-haspopup="dialog" className="relative rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 transition hover:bg-slate-50" aria-label="Notifications">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">{unreadCount}</span>}
            </button>
            <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white py-1.5 pl-2 pr-3 sm:flex">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-brand-100 text-xs font-extrabold text-brand-700">{initials(currentUser)}</div>
              <div className="max-w-[180px]">
                <p className="truncate text-xs font-bold text-slate-800">{currentUser}</p>
                <p className="truncate text-[10px] text-slate-500">{roleDescriptions[role]}</p>
              </div>
            </div>
          </div>
          <NotificationPanel open={notificationsOpen} onClose={closeNotifications} />
        </header>

        {process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_MARKETPAY_UI_PREVIEW !== "false" && (
          <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-xs font-semibold text-amber-900 sm:px-6" role="status">
            UI Preview Mode · Demonstration content only · No real authentication or payments
          </div>
        )}
        <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-[1600px] p-4 outline-none sm:p-6">
          <div className="mb-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="mp-chip border-brand-200 bg-brand-50 text-brand-700">{roleLabels[role]} workspace</span>
              {process.env.NODE_ENV === "development" && <span className="mp-chip">UI demo mode</span>}
            </div>
            <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">{title}</h1>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">{description}</p>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}

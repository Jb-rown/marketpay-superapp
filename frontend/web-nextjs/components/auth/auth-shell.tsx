"use client";

import Link from "next/link";
import { ShieldCheck, Sparkles, WalletCards } from "lucide-react";

export function AuthShell({ children, eyebrow, title, description }: { children: React.ReactNode; eyebrow: string; title: string; description: string }) {
  return (
    <main className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[1.05fr_.95fr]">
      <section className="relative hidden overflow-hidden bg-navy-900 p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(14,165,233,.22),transparent_28%),radial-gradient(circle_at_80%_75%,rgba(20,184,166,.22),transparent_30%)]" />
        <div className="relative">
          <Link href="/login" className="inline-flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-500 font-black">MP</span>
            <span><strong className="block text-xl">MarketPay</strong><span className="text-xs text-slate-300">Food. Finance. Intelligence.</span></span>
          </Link>
        </div>
        <div className="relative max-w-xl">
          <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[.18em] text-brand-200">Built for African markets</span>
          <h1 className="mt-5 text-4xl font-black leading-tight">Affordable food, trusted payments and market intelligence in one experience.</h1>
          <p className="mt-4 max-w-lg text-sm leading-7 text-slate-300">A role-aware interface for consumers, retailers, wholesalers, riders, government analysts and platform administrators.</p>
          <div className="mt-8 grid grid-cols-3 gap-3">
            <Feature icon={WalletCards} label="Escrow-backed commerce" />
            <Feature icon={Sparkles} label="AI price intelligence" />
            <Feature icon={ShieldCheck} label="KYC, MFA & RBAC" />
          </div>
        </div>
        <p className="relative text-xs text-slate-400">MarketPay Super App • UI prototype • Kenya v1.0</p>
      </section>
      <section className="flex min-h-screen items-center justify-center p-5 sm:p-8">
        <div className="w-full max-w-lg">
          <div className="mb-6 lg:hidden"><Link href="/login" className="inline-flex items-center gap-2 font-black text-navy-900"><span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-600 text-sm text-white">MP</span> MarketPay</Link></div>
          <p className="text-xs font-extrabold uppercase tracking-[.18em] text-brand-600">{eyebrow}</p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
          <div className="mt-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">{children}</div>
        </div>
      </section>
    </main>
  );
}

function Feature({ icon: Icon, label }: { icon: typeof WalletCards; label: string }) {
  return <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><Icon className="h-5 w-5 text-brand-300"/><p className="mt-3 text-xs font-semibold leading-5 text-slate-200">{label}</p></div>;
}

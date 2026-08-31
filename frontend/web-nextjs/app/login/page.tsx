"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Building2, Eye, EyeOff, Landmark, LockKeyhole, Store, Truck, UserRound } from "lucide-react";
import { useState } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import type { Role } from "@/lib/types";

const demos: Array<{ role: Role; label: string; icon: typeof UserRound }> = [
  { role: "consumer", label: "Consumer", icon: UserRound },
  { role: "vendor", label: "Retailer", icon: Store },
  { role: "wholesaler", label: "Wholesaler", icon: Building2 },
  { role: "rider", label: "Rider", icon: Truck },
  { role: "government", label: "Gov Analyst", icon: Landmark },
  { role: "admin", label: "Admin", icon: LockKeyhole }
];

export default function LoginPage() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [mfa, setMfa] = useState(false);
  return <AuthShell eyebrow="Secure sign in" title="Welcome back" description="Use your registered phone number and password. Elevated roles continue through multi-factor authentication.">
    <form onSubmit={(e)=>{e.preventDefault(); mfa ? router.push("/mfa") : router.push("/consumer")}} className="space-y-4">
      <label className="block"><span className="mp-label">Phone number</span><input className="mp-input" defaultValue="+254 712 345 678" placeholder="+254 7XX XXX XXX"/></label>
      <label className="block"><span className="mp-label">Password</span><div className="relative"><input type={show?"text":"password"} className="mp-input pr-10" defaultValue="MarketPay#2026"/><button type="button" onClick={()=>setShow(v=>!v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" aria-label="Toggle password visibility">{show?<EyeOff className="h-4 w-4"/>:<Eye className="h-4 w-4"/>}</button></div></label>
      <div className="flex items-center justify-between gap-3 text-sm"><label className="inline-flex items-center gap-2 text-slate-600"><input type="checkbox" className="h-4 w-4 rounded border-slate-300"/> Remember this device</label><Link href="/forgot-password" className="font-semibold text-brand-700 hover:text-brand-800">Forgot password?</Link></div>
      <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm"><input type="checkbox" checked={mfa} onChange={e=>setMfa(e.target.checked)} className="mt-0.5 h-4 w-4"/><span><strong className="block text-slate-800">Demo elevated-role MFA</strong><span className="text-xs text-slate-500">Enable to preview the second-factor flow after password verification.</span></span></label>
      <button className="mp-btn-primary w-full justify-center">Sign in securely <ArrowRight className="h-4 w-4"/></button>
    </form>
    <div className="my-5 flex items-center gap-3 text-xs text-slate-400"><span className="h-px flex-1 bg-slate-200"/>UI workspace preview<span className="h-px flex-1 bg-slate-200"/></div>
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{demos.map(({role,label,icon:Icon})=><button key={role} onClick={()=>router.push(`/${role}`)} className="rounded-xl border border-slate-200 p-3 text-left transition hover:border-brand-300 hover:bg-brand-50"><Icon className="h-4 w-4 text-brand-600"/><p className="mt-2 text-xs font-bold text-slate-800">{label}</p></button>)}</div>
    <p className="mt-5 text-center text-sm text-slate-500">New to MarketPay? <Link href="/register" className="font-bold text-brand-700">Create an account</Link></p>
  </AuthShell>;
}

"use client";

import { useState } from "react";
import {
  BadgeCheck, Bike, CheckCircle2, Clock3, MapPin, Navigation, Phone, ShieldCheck,
  Star, TimerReset, TrendingUp, WalletCards, XCircle
} from "lucide-react";
import { Card, Badge, Toggle } from "@/components/ui/core";
import { MetricCard, MiniLineChart, ProgressBar } from "@/components/ui/metrics";
import { SectionHeader } from "@/components/shared/section";
import { MapCard } from "@/components/shared/map-card";
import { Status } from "@/components/shared/status";
import { volumeSeries } from "@/lib/mock-data";
import { formatKES } from "@/lib/utils";

const assignments = [
  { id:"MP-ORD-1061", pickup:"Wakulima Fresh", drop:"Kilimani", distance:"4.8 km", fee:280, expires:74, status:"OFFERED" },
  { id:"MP-ORD-1060", pickup:"Fresh Basket", drop:"Hurlingham", distance:"3.2 km", fee:220, expires:0, status:"MISSED" },
  { id:"MP-ORD-1057", pickup:"Wakulima Fresh", drop:"Upper Hill", distance:"6.1 km", fee:340, expires:0, status:"ACCEPTED" }
];

export function RiderWorkspace({ section }: { section: string }) {
  if (section==="assignments") return <Assignments/>;
  if (section==="delivery") return <Delivery/>;
  if (section==="earnings") return <Earnings/>;
  if (section==="performance") return <Performance/>;
  if (section==="profile") return <Profile/>;
  return <Overview/>;
}

function Overview(){
  const [available,setAvailable]=useState(true);
  return <div className="space-y-6">
    <Card className="overflow-hidden border-0 bg-gradient-to-br from-navy-900 to-brand-800 p-6 text-white">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div><Badge className="border-white/15 bg-white/10 text-brand-100">Rider operations</Badge><h2 className="mt-3 text-2xl font-black">Good afternoon, David.</h2><p className="mt-1 text-sm text-slate-200">You are currently {available?"available for new delivery jobs":"offline"}.</p></div>
        <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur"><Toggle checked={available} onChange={setAvailable} label={available?"AVAILABLE":"OFFLINE"}/></div>
      </div>
    </Card>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard label="Today’s earnings" value="KES 2,460" detail="8 completed deliveries" trend="up" icon={<WalletCards className="h-5 w-5"/>}/>
      <MetricCard label="Active delivery" value="1" tone="blue" detail="ETA 18 min" icon={<Navigation className="h-5 w-5"/>}/>
      <MetricCard label="Acceptance rate" value="92%" tone="purple" icon={<CheckCircle2 className="h-5 w-5"/>}/>
      <MetricCard label="Rider rating" value="4.91" tone="amber" detail="384 ratings" icon={<Star className="h-5 w-5"/>}/>
    </div>
    <div className="grid gap-4 xl:grid-cols-[.85fr_1.15fr]">
      <Card className="p-5"><SectionHeader title="Incoming assignment"/><div className="mt-4 rounded-2xl border border-brand-200 bg-brand-50 p-4"><div className="flex items-start justify-between"><div><p className="font-mono text-xs font-bold text-brand-700">MP-ORD-1061</p><h3 className="mt-1 font-black">Wakulima Fresh → Kilimani</h3></div><Badge tone="warning"><Clock3 className="mr-1 h-3.5 w-3.5"/> 74 sec</Badge></div><div className="mt-4 grid grid-cols-3 gap-2 text-xs"><div><p className="text-slate-400">Distance</p><p className="mt-1 font-bold">4.8 km</p></div><div><p className="text-slate-400">Fee</p><p className="mt-1 font-bold">KES 280</p></div><div><p className="text-slate-400">Vehicle</p><p className="mt-1 font-bold">Motorbike</p></div></div><div className="mt-4 grid grid-cols-2 gap-2"><button className="mp-btn-primary"><CheckCircle2 className="h-4 w-4"/>Accept</button><button className="mp-btn-secondary"><XCircle className="h-4 w-4"/>Decline</button></div></div></Card>
      <MapCard/>
    </div>
  </div>
}

function Assignments(){
  return <div className="space-y-5"><SectionHeader title="Delivery assignments" description="New offers expire after the response window and automatically move to the next eligible rider."/>
    <div className="grid gap-4 lg:grid-cols-3">{assignments.map(a=><Card key={a.id} className="p-5"><div className="flex items-start justify-between"><Badge tone="info">{a.id}</Badge><Status value={a.status}/></div><h3 className="mt-4 font-black">{a.pickup}</h3><p className="mt-1 text-sm text-slate-500">to {a.drop}</p><div className="mt-4 grid grid-cols-2 gap-3 text-xs"><div><p className="text-slate-400">Distance</p><p className="mt-1 font-bold">{a.distance}</p></div><div><p className="text-slate-400">Delivery fee</p><p className="mt-1 font-bold">{formatKES(a.fee)}</p></div></div>{a.status==="OFFERED"&&<><div className="mt-4"><ProgressBar value={Math.round(a.expires/90*100)} label={`${a.expires} seconds remaining`}/></div><div className="mt-4 grid grid-cols-2 gap-2"><button className="mp-btn-primary">Accept</button><button className="mp-btn-secondary">Decline</button></div></>}</Card>)}</div>
  </div>
}

function Delivery(){
  return <div className="space-y-5">
    <SectionHeader title="Active delivery" description="Pickup, route, consumer contact, live GPS status and delivery confirmation are grouped in one operational view."/>
    <div className="grid gap-4 xl:grid-cols-[1.2fr_.8fr]"><MapCard title="MP-ORD-1057 · Active route" rider="David Mwangi" eta="18 min"/>
      <Card className="p-5"><div className="flex items-start justify-between"><div><p className="font-mono text-xs font-bold text-slate-400">MP-ORD-1057</p><h3 className="mt-1 text-lg font-black">Upper Hill delivery</h3></div><Status value="IN_DELIVERY"/></div>
      <div className="mt-5 space-y-4"><div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-400">Pickup</p><p className="mt-1 text-sm font-bold">Wakulima Fresh, Wakulima Market</p></div><div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-400">Customer</p><p className="mt-1 text-sm font-bold">Peter Otieno · Kilimani</p><button className="mt-2 text-xs font-bold text-brand-700"><Phone className="mr-1 inline h-3.5 w-3.5"/>Call customer</button></div><div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-800">Delivery requires the consumer’s confirmation code / OTP before completion.</div><button className="mp-btn-primary w-full">Enter delivery OTP</button></div></Card></div>
  </div>
}

function Earnings(){
  return <div className="space-y-5"><SectionHeader title="Earnings & settlements" description="Delivery fees remain pending until consumer confirmation or the auto-confirm window releases settlement."/>
    <div className="grid gap-4 sm:grid-cols-3"><MetricCard label="Available balance" value="KES 8,920" icon={<WalletCards className="h-5 w-5"/>}/><MetricCard label="Pending settlement" value="KES 340" tone="amber"/><MetricCard label="This month" value="KES 52,480" tone="emerald" detail="+8.2%" trend="up"/></div>
    <Card className="p-5"><SectionHeader title="Earnings trend"/><div className="mt-4"><MiniLineChart values={volumeSeries.map(v=>v*22)} label="Rider earnings" height={210}/></div></Card>
    <div className="mp-table-wrap"><table className="mp-table"><thead><tr><th>Order</th><th>Date</th><th>Distance</th><th>Vehicle</th><th>Status</th><th className="text-right">Fee</th></tr></thead><tbody>{[
      ["MP-ORD-1057","Today, 11:04","6.1 km","Motorbike","PENDING","KES 340"],
      ["MP-ORD-1054","Today, 09:22","4.2 km","Motorbike","SETTLED","KES 260"],
      ["MP-ORD-1051","Today, 08:18","7.8 km","Motorbike","SETTLED","KES 410"],
      ["MP-ORD-1049","Yesterday","3.6 km","Motorbike","SETTLED","KES 230"]
    ].map(r=><tr key={r[0]}>{r.slice(0,4).map((v,i)=><td key={i} className={i===0?"font-mono text-xs font-bold":""}>{v}</td>)}<td><Status value={r[4]}/></td><td className="text-right font-bold">{r[5]}</td></tr>)}</tbody></table></div>
  </div>
}

function Performance(){
  return <div className="space-y-5"><SectionHeader title="Rider performance" description="Operational indicators help riders understand assignment responsiveness, delivery quality and customer feedback."/>
    <div className="grid gap-4 sm:grid-cols-4"><MetricCard label="Rating" value="4.91"/><MetricCard label="Acceptance" value="92%" tone="blue"/><MetricCard label="On-time delivery" value="96%" tone="emerald"/><MetricCard label="Completed jobs" value="384" tone="purple"/></div>
    <div className="grid gap-4 lg:grid-cols-2"><Card className="p-5"><SectionHeader title="Performance score"/><div className="mt-5 space-y-4"><ProgressBar label="Customer rating" value={98}/><ProgressBar label="Acceptance rate" value={92}/><ProgressBar label="On-time delivery" value={96}/><ProgressBar label="Completion rate" value={99}/></div></Card><Card className="p-5"><SectionHeader title="Recent feedback"/><div className="mt-4 space-y-3">{["Fast and professional delivery.","Kept me updated and arrived on time.","Careful handling of fresh produce."].map((t,i)=><div key={i} className="rounded-xl bg-slate-50 p-3"><div className="flex gap-0.5">{Array.from({length:5}).map((_,j)=><Star key={j} className="h-3.5 w-3.5 fill-amber-400 text-amber-400"/>)}</div><p className="mt-2 text-sm text-slate-600">{t}</p></div>)}</div></Card></div>
  </div>
}

function Profile(){
  return <div className="grid gap-6 xl:grid-cols-[1fr_420px]"><Card className="p-5"><SectionHeader title="Rider profile & vehicle" description="Rider onboarding includes KYC, vehicle type and driving licence where applicable."/><div className="mt-5 grid gap-4 sm:grid-cols-2"><div><label className="mp-label">Full name</label><input className="mp-input" defaultValue="David Mwangi"/></div><div><label className="mp-label">Phone</label><input className="mp-input" defaultValue="+254 721 555 441"/></div><div><label className="mp-label">Vehicle type</label><select className="mp-select"><option>Motorbike</option><option>Bicycle</option><option>Foot delivery</option><option>Vehicle</option></select></div><div><label className="mp-label">License plate</label><input className="mp-input" defaultValue="KMFZ 218A"/></div><div className="sm:col-span-2"><label className="mp-label">Driving licence</label><div className="rounded-xl border border-slate-200 bg-slate-50 p-4"><p className="text-sm font-bold">driving_licence.pdf</p><p className="mt-1 text-xs text-emerald-700"><CheckCircle2 className="mr-1 inline h-3.5 w-3.5"/>Verified</p></div></div></div><button className="mp-btn-primary mt-5">Save profile</button></Card>
    <div className="space-y-4"><Card className="p-5"><div className="grid h-20 w-20 place-items-center rounded-2xl bg-brand-100 text-xl font-black text-brand-700">DM</div><h3 className="mt-4 text-xl font-black">David Mwangi</h3><p className="mt-1 text-sm text-slate-500">Rider · Motorbike</p><div className="mt-3 flex gap-2"><Badge tone="success">KYC APPROVED</Badge><Badge tone="brand">AVAILABLE</Badge></div></Card><Card className="p-5"><p className="text-sm font-black">Verification</p><div className="mt-4 space-y-3 text-sm"><div className="flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-emerald-600"/>Identity verified</div><div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-600"/>Driving licence verified</div><div className="flex items-center gap-2"><Bike className="h-4 w-4 text-emerald-600"/>Vehicle details current</div></div></Card></div>
  </div>
}

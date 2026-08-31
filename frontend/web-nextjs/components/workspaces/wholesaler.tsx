"use client";

import { useState } from "react";
import {
  BadgePercent, Boxes, CheckCircle2, Download, PackageCheck, Plus, Truck, UsersRound,
  Warehouse, ChartNoAxesCombined
} from "lucide-react";
import { Card, Badge, Modal } from "@/components/ui/core";
import { MetricCard, MiniLineChart, ProgressBar } from "@/components/ui/metrics";
import { SectionHeader } from "@/components/shared/section";
import { Status } from "@/components/shared/status";
import { formatKES } from "@/lib/utils";
import { volumeSeries } from "@/lib/mock-data";

const deals = [
  { id: "BD-201", product: "Dry Maize", unit: "kg", price: 74, retail: 82, min: 50, available: 2800, fill: 78, status: "ACTIVE" },
  { id: "BD-202", product: "Green Grams", unit: "kg", price: 149, retail: 164, min: 25, available: 1400, fill: 62, status: "ACTIVE" },
  { id: "BD-203", product: "Pishori Rice", unit: "kg", price: 171, retail: 188, min: 40, available: 920, fill: 91, status: "ACTIVE" }
];

const groupBuys = [
  { id: "GB-090", product: "Dry Maize", target: 500, pledged: 410, buyers: 18, closes: "6 hr", status: "OPEN" },
  { id: "GB-091", product: "Pishori Rice", target: 300, pledged: 264, buyers: 12, closes: "14 hr", status: "OPEN" },
  { id: "GB-086", product: "Green Grams", target: 250, pledged: 250, buyers: 9, closes: "Filled", status: "CONFIRMED" }
];

export function WholesalerWorkspace({ section }: { section: string }) {
  if (section === "deals") return <Deals />;
  if (section === "group-buys") return <GroupBuys />;
  if (section === "orders") return <Orders />;
  if (section === "analytics") return <Analytics />;
  return <Overview />;
}

function Overview() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Volume sold · 30d" value="18.4T" detail="+14.2%" trend="up" icon={<Warehouse className="h-5 w-5" />} />
        <MetricCard label="Wholesale revenue" value="KES 2.84M" tone="blue" icon={<ChartNoAxesCombined className="h-5 w-5" />} />
        <MetricCard label="Open bulk deals" value="7" tone="purple" icon={<BadgePercent className="h-5 w-5" />} />
        <MetricCard label="Group-buy participants" value="184" tone="emerald" icon={<UsersRound className="h-5 w-5" />} />
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.15fr_.85fr]">
        <Card className="p-5"><SectionHeader title="Volume trend" description="Daily completed wholesale volume." /><div className="mt-4"><MiniLineChart values={volumeSeries.map(v => v * 17)} label="Wholesale volume" height={200} /></div></Card>
        <Card className="p-5"><SectionHeader title="Deal fill rates" /><div className="mt-5 space-y-4">{deals.map((d) => <div key={d.id}><ProgressBar label={d.product} value={d.fill} /></div>)}</div></Card>
      </div>
      <Card className="p-5">
        <SectionHeader title="Active bulk deals" description="Minimum order quantities are enforced for direct and group-buy purchases." />
        <div className="mp-table-wrap mt-4"><table className="mp-table"><thead><tr><th>Deal</th><th>Product</th><th>Wholesale price</th><th>MOQ</th><th>Available</th><th>Fill</th></tr></thead><tbody>{deals.map(d => <tr key={d.id}><td className="font-mono text-xs font-bold">{d.id}</td><td className="font-bold">{d.product}</td><td>{formatKES(d.price)}/{d.unit}</td><td>{d.min} {d.unit}</td><td>{d.available.toLocaleString()} {d.unit}</td><td><Badge tone="brand">{d.fill}%</Badge></td></tr>)}</tbody></table></div>
      </Card>
    </div>
  );
}

function Deals() {
  const [open, setOpen] = useState(false);
  return (
    <div className="space-y-5">
      <SectionHeader title="Bulk deals" description="Publish wholesale offers with minimum order quantity, bulk pricing, inventory and time windows." action={<button className="mp-btn-primary" onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> New bulk deal</button>} />
      <div className="grid gap-4 lg:grid-cols-3">
        {deals.map(d => (
          <Card key={d.id} className="p-5">
            <div className="flex items-start justify-between gap-3"><Badge tone="brand">{d.id}</Badge><Status value={d.status} /></div>
            <h3 className="mt-4 text-lg font-black">{d.product}</h3>
            <p className="mt-1 text-sm text-slate-500">Minimum order {d.min} {d.unit}</p>
            <div className="mt-4 rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-400">Wholesale price</p><p className="mt-1 text-2xl font-black">{formatKES(d.price)}<span className="text-xs font-medium text-slate-400">/{d.unit}</span></p><p className="mt-1 text-xs text-emerald-700">Save {formatKES(d.retail-d.price)} vs current retail</p></div>
            <div className="mt-4"><ProgressBar label="Deal fill rate" value={d.fill} /></div>
          </Card>
        ))}
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title="Create bulk deal" description="UI-only deal setup form.">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2"><label className="mp-label">Product</label><select className="mp-select"><option>Dry Maize</option><option>Green Grams</option><option>Pishori Rice</option></select></div>
          <div><label className="mp-label">Wholesale price</label><input className="mp-input" type="number" /></div>
          <div><label className="mp-label">Minimum order quantity</label><input className="mp-input" type="number" /></div>
          <div><label className="mp-label">Available quantity</label><input className="mp-input" type="number" /></div>
          <div><label className="mp-label">Deal closes</label><input className="mp-input" type="datetime-local" /></div>
          <button className="mp-btn-primary sm:col-span-2" onClick={() => setOpen(false)}>Save deal</button>
        </div>
      </Modal>
    </div>
  );
}

function GroupBuys() {
  return (
    <div className="space-y-5">
      <SectionHeader title="Group-buy progress" description="Consumers can combine pledges to meet a wholesaler's minimum order requirement." />
      <div className="grid gap-4 lg:grid-cols-3">
        {groupBuys.map(g => {
          const pct = Math.min(100, Math.round((g.pledged/g.target)*100));
          return <Card key={g.id} className="p-5"><div className="flex items-start justify-between"><Badge tone="info">{g.id}</Badge><Status value={g.status} /></div><h3 className="mt-4 font-black">{g.product}</h3><p className="mt-1 text-xs text-slate-500">{g.buyers} participants · closes {g.closes}</p><div className="mt-5"><ProgressBar label={`${g.pledged} / ${g.target} kg pledged`} value={pct} /></div>{pct === 100 && <div className="mt-4 rounded-xl bg-emerald-50 p-3 text-xs font-semibold text-emerald-700"><CheckCircle2 className="mr-1 inline h-4 w-4" /> Minimum quantity reached.</div>}</Card>;
        })}
      </div>
    </div>
  );
}

function Orders() {
  const orders = [
    { id: "WO-4009", buyer: "Umoja Retailers Group", volume: "850 kg", total: 64500, status: "IN_FULFILMENT", shipments: 2 },
    { id: "WO-4008", buyer: "Kasarani Food Hub", volume: "520 kg", total: 78200, status: "READY_TO_DISPATCH", shipments: 1 },
    { id: "WO-4007", buyer: "Pamoja Group Buy", volume: "300 kg", total: 51300, status: "COMPLETED", shipments: 3 }
  ];
  return (
    <div className="space-y-5">
      <SectionHeader title="Bulk orders & sub-shipments" description="Large orders can be fulfilled across multiple tracked sub-shipments." />
      {orders.map(o => <Card key={o.id} className="p-5"><div className="flex flex-col gap-4 md:flex-row md:items-center"><div className="flex-1"><p className="font-mono text-xs font-bold text-slate-400">{o.id}</p><h3 className="mt-1 font-black">{o.buyer}</h3><p className="mt-1 text-xs text-slate-500">{o.volume} · {o.shipments} shipment{o.shipments>1?"s":""}</p></div><Status value={o.status} /><div className="md:w-36 md:text-right"><p className="font-black">{formatKES(o.total)}</p><button className="mt-1 text-xs font-bold text-brand-700">Manage shipments</button></div></div></Card>)}
    </div>
  );
}

function Analytics() {
  return (
    <div className="space-y-5">
      <SectionHeader title="Wholesale volume analytics" description="Top buyers, bulk-deal performance, inventory turnover and CSV export." action={<button className="mp-btn-secondary"><Download className="h-4 w-4" /> Export report</button>} />
      <div className="grid gap-4 sm:grid-cols-4">
        <MetricCard label="Total volume" value="18.4T" />
        <MetricCard label="Revenue" value="KES 2.84M" tone="blue" />
        <MetricCard label="Avg. fill rate" value="81.6%" tone="purple" />
        <MetricCard label="Inventory turnover" value="4.8x" tone="emerald" />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5"><SectionHeader title="Top buyers by volume" /><div className="mt-4 space-y-4">{[["Umoja Retailers Group",92],["Kasarani Food Hub",76],["Pamoja Group Buy",63],["City Caterers",48]].map(([name,pct]) => <ProgressBar key={String(name)} label={String(name)} value={Number(pct)} />)}</div></Card>
        <Card className="p-5"><SectionHeader title="Deal performance" /><div className="mt-4"><MiniLineChart values={volumeSeries} label="Deal performance" height={190} /></div></Card>
      </div>
    </div>
  );
}

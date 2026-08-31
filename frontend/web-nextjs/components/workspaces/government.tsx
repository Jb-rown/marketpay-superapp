"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Download, FileText, MapPinned, Search, Send, ShieldCheck, TrendingDown, TrendingUp } from "lucide-react";
import { marketRows, priceSeries } from "@/lib/mock-data";
import { formatKES } from "@/lib/utils";
import { Badge, Card, Modal } from "@/components/ui/core";
import { MetricCard, MiniLineChart } from "@/components/ui/metrics";
import { Section } from "@/components/shared/section";
import { Status } from "@/components/shared/status";

const alerts = [
  { id: "ALT-402", commodity: "Maize", region: "Eastern", severity: "WATCH", change: "+14.8%", driver: "Lower arrivals + dry conditions", created: "38 min ago" },
  { id: "ALT-401", commodity: "Tomatoes", region: "Nairobi", severity: "WARNING", change: "+22.3%", driver: "Transport disruption + market concentration", created: "2 hr ago" },
  { id: "ALT-397", commodity: "Beans", region: "North Rift", severity: "CRITICAL", change: "+31.2%", driver: "Supply shortfall + rainfall anomaly", created: "5 hr ago" },
  { id: "ALT-391", commodity: "Onions", region: "Central", severity: "WATCH", change: "+11.6%", driver: "Temporary wholesale supply gap", created: "Yesterday" }
];

const reports = [
  { name: "National Food Price Situation Brief", period: "Week 35, 2026", scope: "Kenya", status: "Ready" },
  { name: "Maize Market Coverage Report", period: "August 2026", scope: "National", status: "Ready" },
  { name: "Shortage Alerts & Escalations", period: "August 2026", scope: "All counties", status: "Ready" },
  { name: "Cabinet Food Security Snapshot", period: "Q3 2026", scope: "Kenya", status: "Draft" }
];

export function GovernmentWorkspace({ section }: { section: string }) {
  if (section === "prices") return <PriceMonitor />;
  if (section === "heatmap") return <MarketHeatmap />;
  if (section === "alerts") return <ShortageAlerts />;
  if (section === "reports") return <Reports />;
  return <Overview />;
}

function Overview() {
  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="National food index" value="112.8" detail="+3.7% month-on-month" icon={<TrendingUp className="h-5 w-5"/>} />
        <MetricCard label="Markets reporting" value="87%" detail="142 of 163 monitored" icon={<MapPinned className="h-5 w-5"/>} />
        <MetricCard label="Active shortage alerts" value="7" detail="1 critical • 2 warning" icon={<AlertTriangle className="h-5 w-5"/>} />
        <MetricCard label="Data freshness" value="18 min" detail="Last pipeline refresh" icon={<CheckCircle2 className="h-5 w-5"/>} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.45fr_.85fr]">
        <Section title="Food price trend" description="Read-only aggregated market price intelligence. No consumer PII or financial records are exposed.">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-900">Maize • national median</p>
              <p className="mt-1 text-xs text-slate-500">KES/kg • latest 12 reporting windows</p>
            </div>
            <Badge tone="warning">WATCH</Badge>
          </div>
          <div className="mt-5 h-44"><MiniLineChart values={priceSeries} /></div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-500">Current</p><p className="mt-1 font-extrabold">KES 82/kg</p></div>
            <div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-500">30-day high</p><p className="mt-1 font-extrabold">KES 94/kg</p></div>
            <div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-500">Coverage</p><p className="mt-1 font-extrabold">142 markets</p></div>
          </div>
        </Section>

        <Section title="Priority alerts" description="AI shortage signals requiring analyst attention.">
          <div className="space-y-3">
            {alerts.slice(0, 3).map((alert) => (
              <div key={alert.id} className="rounded-xl border border-slate-200 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div><p className="font-bold text-slate-900">{alert.commodity} • {alert.region}</p><p className="mt-1 text-xs text-slate-500">{alert.driver}</p></div>
                  <Badge tone={alert.severity === "CRITICAL" ? "danger" : alert.severity === "WARNING" ? "warning" : "info"}>{alert.severity}</Badge>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs"><span className="font-bold text-red-600">{alert.change}</span><span className="text-slate-400">{alert.created}</span></div>
              </div>
            ))}
          </div>
        </Section>
      </div>

      <Section title="Regional market snapshot" description="Comparable prices across monitored markets.">
        <MarketTable />
      </Section>
    </div>
  );
}

function PriceMonitor() {
  const [query, setQuery] = useState("");
  const [commodity, setCommodity] = useState("All commodities");
  const rows = useMemo(() => marketRows.filter((r) => r.market.toLowerCase().includes(query.toLowerCase())), [query]);
  return (
    <div className="space-y-5">
      <Card className="p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_220px_180px]">
          <label className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"/><input value={query} onChange={(e)=>setQuery(e.target.value)} className="mp-input pl-9" placeholder="Search market or region"/></label>
          <select value={commodity} onChange={(e)=>setCommodity(e.target.value)} className="mp-input"><option>All commodities</option><option>Maize</option><option>Rice</option><option>Tomatoes</option><option>Onions</option></select>
          <button className="mp-btn-primary"><Download className="h-4 w-4"/> Export CSV</button>
        </div>
      </Card>
      <div className="grid gap-5 xl:grid-cols-[1fr_1.5fr]">
        <Section title="Trend analysis" description={`${commodity} • aggregated price observations`}>
          <div className="h-52"><MiniLineChart values={[72,76,75,79,77,82,85,83,88,91,87,89]} /></div>
          <div className="mt-4 flex flex-wrap gap-2"><Badge tone="success"><TrendingDown className="mr-1 h-3 w-3"/> 2.1% vs yesterday</Badge><Badge tone="neutral">Confidence 92%</Badge><Badge tone="info">30-min refresh</Badge></div>
        </Section>
        <Section title="Market prices" description="Latest validated observations from active adapters.">
          <div className="overflow-x-auto"><table className="mp-table"><thead><tr><th>Market</th><th>Maize</th><th>Rice</th><th>Tomatoes</th><th>Onions</th><th>Signal</th></tr></thead><tbody>{rows.map((r)=><tr key={r.market}><td className="font-semibold">{r.market}</td><td>{formatKES(r.maize)}</td><td>{formatKES(r.rice)}</td><td>{formatKES(r.tomatoes)}</td><td>{formatKES(r.onions)}</td><td><Status value={r.signal}/></td></tr>)}</tbody></table></div>
        </Section>
      </div>
    </div>
  );
}

function MarketHeatmap() {
  const cells = [
    ["Nairobi", "Maize", 78, "Stable"], ["Nairobi", "Tomatoes", 92, "Warning"], ["Central", "Onions", 71, "Watch"], ["Eastern", "Maize", 84, "Watch"],
    ["North Rift", "Beans", 96, "Critical"], ["Coast", "Rice", 68, "Stable"], ["Western", "Maize", 74, "Stable"], ["Nyanza", "Vegetables", 80, "Watch"]
  ] as const;
  return (
    <div className="space-y-5">
      <Card className="overflow-hidden p-0">
        <div className="border-b border-slate-100 p-5"><h2 className="font-bold">Market coverage heatmap</h2><p className="mt-1 text-sm text-slate-500">Visual concentration of price pressure by region. Colors represent the current AI risk score.</p></div>
        <div className="grid min-h-[430px] place-items-center bg-[radial-gradient(circle_at_top_left,_#e0f2fe,_transparent_30%),radial-gradient(circle_at_bottom_right,_#ccfbf1,_transparent_35%)] p-6">
          <div className="grid w-full max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {cells.map(([region, commodity, score, signal]) => (
              <div key={`${region}-${commodity}`} className={`rounded-2xl border p-4 shadow-sm ${signal === "Critical" ? "border-red-300 bg-red-100" : signal === "Warning" ? "border-amber-300 bg-amber-100" : signal === "Watch" ? "border-blue-300 bg-blue-100" : "border-emerald-300 bg-emerald-100"}`}>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{region}</p><p className="mt-2 text-base font-extrabold text-slate-900">{commodity}</p><p className="mt-3 text-3xl font-black text-slate-900">{score}</p><p className="text-xs text-slate-600">pressure score / 100</p>
              </div>
            ))}
          </div>
        </div>
      </Card>
      <div className="grid gap-3 sm:grid-cols-4"><Card className="p-3"><Badge tone="success">Stable</Badge><p className="mt-2 text-xs text-slate-500">Normal variation.</p></Card><Card className="p-3"><Badge tone="info">Watch</Badge><p className="mt-2 text-xs text-slate-500">Monitor emerging pressure.</p></Card><Card className="p-3"><Badge tone="warning">Warning</Badge><p className="mt-2 text-xs text-slate-500">Analyst review recommended.</p></Card><Card className="p-3"><Badge tone="danger">Critical</Badge><p className="mt-2 text-xs text-slate-500">Escalation required.</p></Card></div>
    </div>
  );
}

function ShortageAlerts() {
  const [selected, setSelected] = useState<(typeof alerts)[number] | null>(null);
  const [ack, setAck] = useState<string[]>([]);
  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-3"><MetricCard label="Open alerts" value="7" detail="Across 5 regions" icon={<AlertTriangle className="h-5 w-5"/>}/><MetricCard label="Acknowledged" value="12" detail="This month" icon={<CheckCircle2 className="h-5 w-5"/>}/><MetricCard label="Escalated" value="3" detail="Ministry review" icon={<Send className="h-5 w-5"/>}/></div>
      <Section title="Shortage alert queue" description="Review model evidence, acknowledge findings and escalate significant risks.">
        <div className="space-y-3">{alerts.map((a)=><button key={a.id} onClick={()=>setSelected(a)} className="w-full rounded-xl border border-slate-200 p-4 text-left transition hover:border-brand-300 hover:bg-brand-50/30"><div className="flex flex-wrap items-start justify-between gap-3"><div><div className="flex items-center gap-2"><p className="font-bold text-slate-900">{a.commodity} • {a.region}</p>{ack.includes(a.id)&&<Badge tone="success">Acknowledged</Badge>}</div><p className="mt-1 text-sm text-slate-500">{a.driver}</p></div><div className="text-right"><Badge tone={a.severity==="CRITICAL"?"danger":a.severity==="WARNING"?"warning":"info"}>{a.severity}</Badge><p className="mt-2 text-sm font-extrabold text-red-600">{a.change}</p></div></div></button>)}</div>
      </Section>
      <Modal open={!!selected} onClose={()=>setSelected(null)} title={selected ? `${selected.commodity} shortage signal` : "Alert"} description="Root-cause evidence generated from aggregated market and external data." width="max-w-2xl" footer={<><button className="mp-btn-secondary" onClick={()=>setSelected(null)}>Close</button><button className="mp-btn-secondary" onClick={()=>{if(selected)setAck(v=>[...new Set([...v,selected.id])]);setSelected(null)}}><CheckCircle2 className="h-4 w-4"/> Acknowledge</button><button className="mp-btn-primary"><Send className="h-4 w-4"/> Escalate to Ministry</button></>}>
        {selected && <div className="space-y-4"><div className="grid gap-3 sm:grid-cols-3"><Card className="p-3"><p className="text-xs text-slate-500">Severity</p><p className="mt-1 font-bold">{selected.severity}</p></Card><Card className="p-3"><p className="text-xs text-slate-500">Price movement</p><p className="mt-1 font-bold text-red-600">{selected.change}</p></Card><Card className="p-3"><p className="text-xs text-slate-500">Model confidence</p><p className="mt-1 font-bold">91%</p></Card></div><div className="rounded-xl border border-slate-200 bg-slate-50 p-4"><p className="text-sm font-bold">Root-cause analysis</p><ul className="mt-3 space-y-2 text-sm text-slate-600"><li>• Wholesale arrivals are 18% below the 30-day baseline.</li><li>• Observed rainfall is below seasonal expectation in contributing production areas.</li><li>• Price dispersion across monitored markets increased during the last 48 hours.</li><li>• No single vendor or consumer data is included in this government view.</li></ul></div></div>}
      </Modal>
    </div>
  );
}

function Reports() {
  const [generated, setGenerated] = useState(false);
  return (
    <div className="grid gap-5 xl:grid-cols-[.8fr_1.2fr]">
      <Section title="Generate policy report" description="Create an aggregated PDF/CSV brief for policy and cabinet-level reporting.">
        <div className="space-y-4"><label className="block"><span className="mp-label">Report type</span><select className="mp-input"><option>Food Security Situation Brief</option><option>Market Price Trends</option><option>Shortage Alert Summary</option><option>Market Coverage</option></select></label><div className="grid grid-cols-2 gap-3"><label><span className="mp-label">From</span><input type="date" className="mp-input" defaultValue="2026-08-01"/></label><label><span className="mp-label">To</span><input type="date" className="mp-input" defaultValue="2026-08-31"/></label></div><label className="block"><span className="mp-label">Region</span><select className="mp-input"><option>National</option><option>Nairobi</option><option>Eastern</option><option>Central</option><option>North Rift</option></select></label><button onClick={()=>setGenerated(true)} className="mp-btn-primary w-full"><FileText className="h-4 w-4"/> Generate report</button>{generated&&<div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700"><CheckCircle2 className="mr-2 inline h-4 w-4"/> Report prepared in UI demo mode. Export controls are ready for the report API.</div>}</div>
      </Section>
      <Section title="Report library" description="Generated and scheduled government intelligence outputs.">
        <div className="overflow-x-auto"><table className="mp-table"><thead><tr><th>Report</th><th>Period</th><th>Scope</th><th>Status</th><th></th></tr></thead><tbody>{reports.map(r=><tr key={r.name}><td className="font-semibold">{r.name}</td><td>{r.period}</td><td>{r.scope}</td><td><Status value={r.status}/></td><td><button className="mp-btn-secondary !px-3 !py-2"><Download className="h-4 w-4"/> PDF</button></td></tr>)}</tbody></table></div>
      </Section>
    </div>
  );
}

function MarketTable() {
  return <div className="overflow-x-auto"><table className="mp-table"><thead><tr><th>Market</th><th>Maize</th><th>Rice</th><th>Tomatoes</th><th>Onions</th><th>Signal</th></tr></thead><tbody>{marketRows.map((r)=><tr key={r.market}><td className="font-semibold">{r.market}</td><td>{formatKES(r.maize)}</td><td>{formatKES(r.rice)}</td><td>{formatKES(r.tomatoes)}</td><td>{formatKES(r.onions)}</td><td><Status value={r.signal}/></td></tr>)}</tbody></table></div>;
}

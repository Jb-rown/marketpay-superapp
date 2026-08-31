"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle, BadgePercent, Boxes, CheckCircle2, ChevronRight, Download, FileSpreadsheet,
  FileUp, ImagePlus, PackageCheck, Plus, Search, ShoppingBag, Store, TrendingUp,
  UploadCloud, Warehouse
} from "lucide-react";
import { Card, Badge, Modal, Toggle } from "@/components/ui/core";
import { MetricCard, MiniLineChart, ProgressBar } from "@/components/ui/metrics";
import { SectionHeader } from "@/components/shared/section";
import { Status } from "@/components/shared/status";
import { products, vendorOrders, volumeSeries } from "@/lib/mock-data";
import { formatKES } from "@/lib/utils";

export function VendorWorkspace({ section }: { section: string }) {
  if (section === "products") return <Products />;
  if (section === "inventory") return <Inventory />;
  if (section === "orders") return <Orders />;
  if (section === "analytics") return <Analytics />;
  if (section === "storefront") return <Storefront />;
  if (section === "import") return <CsvImport />;
  return <Overview />;
}

function Overview() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Today's revenue" value="KES 48,260" detail="+12.8% vs yesterday" trend="up" icon={<TrendingUp className="h-5 w-5" />} />
        <MetricCard label="Orders today" value="28" detail="4 awaiting action" tone="blue" icon={<PackageCheck className="h-5 w-5" />} />
        <MetricCard label="Active products" value="42" detail="6 low stock" tone="purple" icon={<Boxes className="h-5 w-5" />} />
        <MetricCard label="Store rating" value="4.82" detail="386 verified reviews" tone="amber" icon={<Store className="h-5 w-5" />} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_.9fr]">
        <Card className="p-5">
          <SectionHeader title="Revenue & volume" description="Operational analytics for completed marketplace orders." />
          <div className="mt-4"><MiniLineChart values={volumeSeries} label="Vendor revenue trend" height={190} /></div>
        </Card>
        <Card className="p-5">
          <SectionHeader title="Inventory health" description="Low-stock items are highlighted for proactive replenishment." />
          <div className="mt-5 space-y-4">
            <ProgressBar label="Healthy stock" value={76} />
            <ProgressBar label="Low stock" value={14} />
            <ProgressBar label="Out of stock" value={10} />
          </div>
          <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            <AlertTriangle className="mr-1.5 inline h-4 w-4" /> 6 listings are at or below their low-stock threshold.
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <SectionHeader title="Live order queue" description="Accept, prepare and hand off orders to logistics." />
        <div className="mp-table-wrap mt-4">
          <table className="mp-table">
            <thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Age</th><th>Status</th><th className="text-right">Amount</th></tr></thead>
            <tbody>{vendorOrders.map((order) => <tr key={order.id}><td className="font-mono text-xs font-bold">{order.id}</td><td>{order.customer}</td><td>{order.items}</td><td>{order.age}</td><td><Status value={order.status} /></td><td className="text-right font-bold">{formatKES(order.amount)}</td></tr>)}</tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function Products() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const visible = useMemo(() => products.filter((p) => `${p.name} ${p.category}`.toLowerCase().includes(query.toLowerCase())), [query]);

  return (
    <div className="space-y-5">
      <SectionHeader title="Product listings" description="Create draft listings, review AI pricing guidance, then publish to the consumer marketplace." action={<button className="mp-btn-primary" onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> Add product</button>} />
      <Card className="p-4">
        <div className="relative max-w-md"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input className="mp-input pl-9" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products..." /></div>
      </Card>
      <div className="mp-table-wrap">
        <table className="mp-table">
          <thead><tr><th>Product</th><th>Category</th><th>Stock</th><th>My price</th><th>Market average</th><th>Pricing signal</th><th>Status</th></tr></thead>
          <tbody>{visible.map((p) => {
            const above = p.price > p.marketAverage * 1.15;
            return <tr key={p.id}><td><div className="font-bold text-slate-900">{p.name}</div><div className="text-xs text-slate-400">{p.id}</div></td><td>{p.category}</td><td>{p.stock} {p.unit}</td><td className="font-bold">KES {p.price}</td><td>KES {p.marketAverage}</td><td><Badge tone={above ? "warning" : "success"}>{above ? "Above market" : "Competitive"}</Badge></td><td><Status value={p.stock ? "ACTIVE" : "OUT_OF_STOCK"} /></td></tr>;
          })}</tbody>
        </table>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Create product listing" description="Valid frontend entries are saved as a DRAFT in the UI demo." width="max-w-2xl"
        footer={<><button className="mp-btn-secondary" onClick={() => setOpen(false)}>Cancel</button><button className="mp-btn-primary" onClick={() => setOpen(false)}>Save draft</button></>}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2"><label className="mp-label">Product name</label><input className="mp-input" placeholder="e.g. Dry Maize" /></div>
          <div><label className="mp-label">Category</label><select className="mp-select"><option>Grain</option><option>Vegetable</option><option>Fruit</option><option>Protein</option><option>Dairy</option><option>General</option></select></div>
          <div><label className="mp-label">Unit</label><select className="mp-select"><option>kg</option><option>litre</option><option>piece</option><option>crate</option><option>bag</option></select></div>
          <div><label className="mp-label">Price per unit</label><input className="mp-input" type="number" placeholder="0.00" /></div>
          <div><label className="mp-label">Quantity</label><input className="mp-input" type="number" placeholder="0" /></div>
          <div className="sm:col-span-2">
            <label className="mp-label">Product images · max 5</label>
            <div className="grid min-h-28 place-items-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-center"><div><ImagePlus className="mx-auto h-6 w-6 text-slate-400" /><p className="mt-2 text-xs font-semibold text-slate-600">Drop images or click to browse</p><p className="text-[10px] text-slate-400">Up to 5MB each</p></div></div>
          </div>
          <div className="sm:col-span-2 rounded-xl border border-brand-200 bg-brand-50 p-3">
            <p className="text-xs font-bold text-brand-900">AI pricing preview</p><p className="mt-1 text-xs text-brand-800">Market Average and Recommended Range appear after product and price entry.</p>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function Inventory() {
  const threshold = 100;
  return (
    <div className="space-y-5">
      <SectionHeader title="Inventory management" description="Stock changes from confirmed orders are reflected here, with configurable low-stock thresholds." />
      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard label="Units in stock" value="1,649" icon={<Warehouse className="h-5 w-5" />} />
        <MetricCard label="Low-stock listings" value="3" tone="amber" detail="Threshold ≤ 100" icon={<AlertTriangle className="h-5 w-5" />} />
        <MetricCard label="Out of stock" value="1" tone="purple" icon={<Boxes className="h-5 w-5" />} />
      </div>
      <div className="mp-table-wrap">
        <table className="mp-table">
          <thead><tr><th>Product</th><th>Available</th><th>Threshold</th><th>Health</th><th>Action</th></tr></thead>
          <tbody>{products.slice(0, 8).map((p) => <tr key={p.id}><td className="font-bold">{p.name}</td><td>{p.stock} {p.unit}</td><td>{threshold}</td><td><Status value={p.stock === 0 ? "OUT_OF_STOCK" : p.stock <= threshold ? "LOW_STOCK" : "HEALTHY"} /></td><td><button className="text-xs font-bold text-brand-700">Adjust stock</button></td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}

function Orders() {
  return (
    <div className="space-y-5">
      <SectionHeader title="Order management" description="Incoming orders can be accepted or rejected, prepared, and handed off to an assigned rider." />
      <div className="grid gap-4 lg:grid-cols-2">
        {vendorOrders.map((order) => (
          <Card key={order.id} className="p-5">
            <div className="flex items-start justify-between gap-3"><div><p className="font-mono text-xs font-bold text-slate-400">{order.id}</p><h3 className="mt-1 font-black text-slate-900">{order.customer}</h3></div><Status value={order.status} /></div>
            <div className="mt-4 grid grid-cols-3 gap-3 text-xs"><div><p className="text-slate-400">Items</p><p className="mt-1 font-bold">{order.items}</p></div><div><p className="text-slate-400">Age</p><p className="mt-1 font-bold">{order.age}</p></div><div><p className="text-slate-400">Total</p><p className="mt-1 font-bold">{formatKES(order.amount)}</p></div></div>
            <div className="mt-5 flex gap-2">{order.status === "NEW" ? <><button className="mp-btn-primary flex-1">Accept order</button><button className="mp-btn-secondary flex-1">Reject</button></> : <button className="mp-btn-secondary w-full">View fulfilment details <ChevronRight className="h-4 w-4" /></button>}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Analytics() {
  return (
    <div className="space-y-5">
      <SectionHeader title="Vendor analytics" description="Sales, fulfilment, product performance and customer rating signals." action={<button className="mp-btn-secondary"><Download className="h-4 w-4" /> Export CSV</button>} />
      <div className="grid gap-4 sm:grid-cols-4">
        <MetricCard label="30-day revenue" value="KES 1.28M" detail="+9.8%" trend="up" />
        <MetricCard label="Orders" value="742" tone="blue" />
        <MetricCard label="Avg. order value" value="KES 1,725" tone="purple" />
        <MetricCard label="Completion rate" value="96.4%" tone="emerald" />
      </div>
      <div className="grid gap-4 lg:grid-cols-[1.2fr_.8fr]">
        <Card className="p-5"><SectionHeader title="Revenue trend" /><div className="mt-4"><MiniLineChart values={volumeSeries.map((v) => v * 14)} label="Revenue trend" height={210} /></div></Card>
        <Card className="p-5"><SectionHeader title="Best sellers" /><div className="mt-4 space-y-4">{products.slice(0, 5).map((p, i) => <div key={p.id}><div className="mb-1 flex justify-between text-xs"><span className="font-semibold">{p.name}</span><span className="text-slate-500">{[92,81,74,63,51][i]}%</span></div><ProgressBar value={[92,81,74,63,51][i]} /></div>)}</div></Card>
      </div>
    </div>
  );
}

function Storefront() {
  const [published, setPublished] = useState(true);
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
      <Card className="p-5">
        <SectionHeader title="Storefront customization" description="Maintain business identity, description, logo and market location." />
        <div className="mt-5 space-y-4">
          <div><label className="mp-label">Store name</label><input className="mp-input" defaultValue="Wakulima Fresh" /></div>
          <div><label className="mp-label">Description</label><textarea className="mp-textarea" defaultValue="Fresh grains, vegetables and pantry staples sourced from trusted Kenyan growers." /></div>
          <div><label className="mp-label">Market location</label><input className="mp-input" defaultValue="Wakulima Market, Nairobi" /></div>
          <div><label className="mp-label">Logo</label><div className="grid min-h-24 place-items-center rounded-xl border border-dashed border-slate-300 bg-slate-50"><div className="text-center"><UploadCloud className="mx-auto h-5 w-5 text-slate-400" /><p className="mt-2 text-xs font-semibold">Upload store logo</p><p className="text-[10px] text-slate-400">Rendered as 200×200px</p></div></div></div>
          <Toggle checked={published} onChange={setPublished} label="Storefront visible to consumers" />
          <button className="mp-btn-primary">Save storefront</button>
        </div>
      </Card>
      <Card className="h-fit overflow-hidden">
        <div className="h-28 bg-gradient-to-br from-brand-700 to-navy-900" />
        <div className="-mt-10 p-5">
          <div className="grid h-20 w-20 place-items-center rounded-2xl border-4 border-white bg-brand-100 text-xl font-black text-brand-700 shadow">WF</div>
          <h3 className="mt-3 text-xl font-black">Wakulima Fresh</h3>
          <p className="mt-1 text-sm text-slate-500">Wakulima Market, Nairobi</p>
          <div className="mt-3 flex gap-2"><Badge tone="success">KYC VERIFIED</Badge><Badge tone="brand">4.82 rating</Badge></div>
          <p className="mt-4 text-sm leading-6 text-slate-600">Fresh grains, vegetables and pantry staples sourced from trusted Kenyan growers.</p>
        </div>
      </Card>
    </div>
  );
}

function CsvImport() {
  const [uploaded, setUploaded] = useState(false);
  return (
    <div className="space-y-5">
      <SectionHeader title="Bulk product import" description="Upload the product CSV template, review row-level validation, then create valid rows as DRAFT listings." action={<button className="mp-btn-secondary"><Download className="h-4 w-4" /> Download template</button>} />
      <Card className="p-6">
        <button onClick={() => setUploaded(true)} className="grid min-h-64 w-full place-items-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/70 text-center transition hover:border-brand-400 hover:bg-brand-50/40">
          <div><FileUp className="mx-auto h-10 w-10 text-brand-600" /><h3 className="mt-4 font-black">Drop your CSV here</h3><p className="mt-1 text-sm text-slate-500">or click to browse files</p><p className="mt-3 text-xs text-slate-400">Required columns: name, category, unit, price, quantity</p></div>
        </button>
      </Card>
      {uploaded && (
        <Card className="p-5">
          <div className="flex items-center gap-3"><div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-700"><CheckCircle2 className="h-5 w-5" /></div><div><p className="font-bold">Import validation complete</p><p className="text-xs text-slate-500">products_august.csv · 46 rows checked</p></div></div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3"><MetricCard label="Rows checked" value="46" /><MetricCard label="Valid" value="43" tone="emerald" /><MetricCard label="Failed" value="3" tone="amber" /></div>
          <div className="mt-4 mp-table-wrap"><table className="mp-table"><thead><tr><th>Row</th><th>Product</th><th>Issue</th></tr></thead><tbody><tr><td>12</td><td>Tomatoes</td><td><Badge tone="danger">Missing quantity</Badge></td></tr><tr><td>27</td><td>Cooking Oil</td><td><Badge tone="danger">Invalid category</Badge></td></tr><tr><td>41</td><td>Rice 5kg</td><td><Badge tone="danger">Price must be positive</Badge></td></tr></tbody></table></div>
        </Card>
      )}
    </div>
  );
}

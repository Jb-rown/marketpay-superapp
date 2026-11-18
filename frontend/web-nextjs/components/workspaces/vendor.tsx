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
import { useFeedback } from "@/components/shared/feedback";
import { downloadCsv } from "@/lib/download";
import { parseCsv } from "@/lib/csv";
import { useDemoState } from "@/hooks/use-demo-state";

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
  const [drafts, setDrafts] = useState<{id:string;name:string;category:string;unit:string;price:number;stock:number}[]>([]);
  const [form, setForm] = useState({name:"",category:"Grain",unit:"kg",price:0,stock:0});
  const [saved, setSaved] = useState(false);
  const [images,setImages]=useState<string[]>([]);
  const {notify}=useFeedback();
  const visible = useMemo(() => [...products,...drafts.map(d=>({...d,vendor:"Wakulima Fresh",market:"Wakulima",marketAverage:d.price,distanceKm:0,rating:0}))].filter((p) => `${p.name} ${p.category}`.toLowerCase().includes(query.toLowerCase())), [query,drafts]);
  const saveDraft = () => { if (!form.name.trim() || form.price <= 0 || form.stock < 0) return; setDrafts(old=>[{id:`DRAFT-${Date.now()}`,...form,name:form.name.trim()},...old]);setOpen(false);setSaved(true);setForm({name:"",category:"Grain",unit:"kg",price:0,stock:0}); };

  return (
    <div className="space-y-5">
      <SectionHeader title="Product listings" description="Create draft listings, review AI pricing guidance, then publish to the consumer marketplace." action={<button className="mp-btn-primary" onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> Add product</button>} />
      {saved && <p role="status" className="rounded-xl bg-green-50 p-3 text-sm text-green-800">Product draft added to the current session. No listing has been published.</p>}
      <Card className="p-4">
        <div className="relative max-w-md"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input className="mp-input pl-9" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products..." /></div>
      </Card>
      <div className="mp-table-wrap">
        <table className="mp-table">
          <thead><tr><th>Product</th><th>Category</th><th>Stock</th><th>My price</th><th>Market average</th><th>Pricing signal</th><th>Status</th></tr></thead>
          <tbody>{visible.map((p) => {
            const above = p.price > p.marketAverage * 1.15;
            return <tr key={p.id}><td><div className="font-bold text-slate-900">{p.name}</div><div className="text-xs text-slate-400">{p.id}</div></td><td>{p.category}</td><td>{p.stock} {p.unit}</td><td className="font-bold">KES {p.price}</td><td>KES {p.marketAverage}</td><td><Badge tone={above ? "warning" : "success"}>{above ? "Above market" : "Competitive"}</Badge></td><td><Status value={p.id.startsWith("DRAFT-") ? "DRAFT" : p.stock ? "ACTIVE" : "OUT_OF_STOCK"} /></td></tr>;
          })}</tbody>
        </table>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Create product listing" description="Valid frontend entries are saved as a DRAFT in the UI demo." width="max-w-2xl"
        footer={<><button className="mp-btn-secondary" onClick={() => setOpen(false)}>Cancel</button><button className="mp-btn-primary" disabled={!form.name.trim()||form.price<=0||form.stock<0} onClick={saveDraft}>Save draft</button></>}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2"><label className="mp-label">Product name</label><input className="mp-input" placeholder="e.g. Dry Maize" value={form.name} onChange={e=>setForm(v=>({...v,name:e.target.value}))}/></div>
          <div><label className="mp-label">Category</label><select className="mp-select" value={form.category} onChange={e=>setForm(v=>({...v,category:e.target.value}))}><option>Grain</option><option>Vegetable</option><option>Fruit</option><option>Protein</option><option>Dairy</option><option>General</option></select></div>
          <div><label className="mp-label">Unit</label><select className="mp-select" value={form.unit} onChange={e=>setForm(v=>({...v,unit:e.target.value}))}><option>kg</option><option>litre</option><option>piece</option><option>crate</option><option>bag</option></select></div>
          <div><label className="mp-label">Price per unit</label><input className="mp-input" type="number" min="0.01" step="0.01" placeholder="0.00" value={form.price||""} onChange={e=>setForm(v=>({...v,price:Number(e.target.value)}))}/></div>
          <div><label className="mp-label">Quantity</label><input className="mp-input" type="number" min="0" placeholder="0" value={form.stock} onChange={e=>setForm(v=>({...v,stock:Number(e.target.value)}))}/></div>
          <div className="sm:col-span-2">
            <label className="mp-label">Product images · max 5</label>
            <label htmlFor="product-images" className="block rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-center"><ImagePlus className="mx-auto h-6 w-6 text-slate-500"/><span className="mt-2 block text-xs font-semibold">Choose up to five product images</span><span className="block text-xs text-slate-600">PNG, JPG or WEBP, up to 5MB each (local preview)</span><input id="product-images" type="file" accept="image/png,image/jpeg,image/webp" multiple className="mt-3 block w-full text-xs" onChange={e=>{const files=Array.from(e.target.files||[]);if(files.length>5||files.some(file=>file.size>5*1024*1024)){notify("Choose at most five images, each under 5MB.","warning");return;}setImages(files.map(file=>file.name));}}/></label>{images.length>0&&<p role="status" className="mt-1 text-xs text-slate-600">Selected: {images.join(", ")} (not uploaded)</p>}
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
  const threshold=100;
  const [stock,setStock]=useDemoState<Record<string,number>>("vendor.stock",{});
  const [selected,setSelected]=useState<string|null>(null);
  const [value,setValue]=useState("");
  const {notify}=useFeedback();
  const items=products.slice(0,8);
  const current=(id:string,original:number)=>stock[id]??original;
  return <div className="space-y-5">
    <SectionHeader title="Inventory management" description="Adjust sample stock levels and preview low-stock warnings. Values are saved only in this browser." />
    <div className="grid gap-4 sm:grid-cols-3"><MetricCard label="Units in stock" value={String(items.reduce((sum,item)=>sum+current(item.id,item.stock),0))} icon={<Warehouse className="h-5 w-5"/>}/><MetricCard label="Low-stock listings" value={String(items.filter(item=>current(item.id,item.stock)>0&&current(item.id,item.stock)<=threshold).length)} tone="amber"/><MetricCard label="Out of stock" value={String(items.filter(item=>current(item.id,item.stock)===0).length)} tone="purple"/></div>
    <div className="mp-table-wrap"><table className="mp-table"><thead><tr><th>Product</th><th>Available</th><th>Threshold</th><th>Health</th><th>Action</th></tr></thead><tbody>{items.map(p=>{const count=current(p.id,p.stock);return <tr key={p.id}><td className="font-bold">{p.name}</td><td>{count} {p.unit}</td><td>{threshold}</td><td><Status value={count===0?"OUT_OF_STOCK":count<=threshold?"LOW_STOCK":"HEALTHY"}/></td><td><button onClick={()=>{setSelected(p.id);setValue(String(count));}} className="text-xs font-bold text-blue-700 underline underline-offset-2">Adjust stock</button></td></tr>;})}</tbody></table></div>
    <Modal open={selected!==null} onClose={()=>setSelected(null)} title="Adjust inventory" description="This updates the UI preview only, not your published stock." footer={<><button className="mp-btn-secondary" onClick={()=>setSelected(null)}>Cancel</button><button className="mp-btn-primary" disabled={!/^\d+$/.test(value)||Number(value)>1000000} onClick={()=>{if(selected!==null){setStock(previous=>({...previous,[selected]:Number(value)}));notify("Demo stock adjustment saved.","success");setSelected(null);}}}>Save stock</button></>}><label className="mp-label" htmlFor="inventory-quantity">Quantity available</label><input id="inventory-quantity" className="mp-input" type="number" min={0} step={1} max={1000000} value={value} onChange={e=>setValue(e.target.value)}/></Modal>
  </div>;
}

function Orders() {
  const [statuses,setStatuses]=useState<Record<string,string>>({});
  const [selected,setSelected]=useState<string|null>(null);
  const change=(id:string,status:string)=>setStatuses(prev=>({...prev,[id]:status}));
  return (
    <div className="space-y-5">
      <SectionHeader title="Order management" description="Incoming orders can be accepted or rejected, prepared, and handed off to an assigned rider." />
      <div className="grid gap-4 lg:grid-cols-2">
        {vendorOrders.map((order) => (
          <Card key={order.id} className="p-5">
            <div className="flex items-start justify-between gap-3"><div><p className="font-mono text-xs font-bold text-slate-400">{order.id}</p><h3 className="mt-1 font-black text-slate-900">{order.customer}</h3></div><Status value={statuses[order.id]||order.status} /></div>
            <div className="mt-4 grid grid-cols-3 gap-3 text-xs"><div><p className="text-slate-400">Items</p><p className="mt-1 font-bold">{order.items}</p></div><div><p className="text-slate-400">Age</p><p className="mt-1 font-bold">{order.age}</p></div><div><p className="text-slate-400">Total</p><p className="mt-1 font-bold">{formatKES(order.amount)}</p></div></div>
            <div className="mt-5 flex gap-2">{(statuses[order.id]||order.status) === "NEW" ? <><button className="mp-btn-primary flex-1" onClick={()=>change(order.id,"PREPARING")}>Accept order</button><button className="mp-btn-secondary flex-1" onClick={()=>change(order.id,"CANCELLED")}>Reject</button></> : (statuses[order.id]||order.status) === "PREPARING" ? <button className="mp-btn-primary w-full" onClick={()=>change(order.id,"RIDER_ASSIGNED")}>Ready for rider pickup</button> : <button className="mp-btn-secondary w-full" onClick={()=>setSelected(order.id)}>View fulfilment details <ChevronRight className="h-4 w-4" /></button>}</div>
          </Card>
        ))}
      </div>
      <Modal open={!!selected} onClose={()=>setSelected(null)} title={`Fulfilment ${selected||""}`} description="Order details in demonstration mode."><div className="space-y-3"><p className="text-sm">Current stage: <strong>{statuses[selected||""]||vendorOrders.find(o=>o.id===selected)?.status||"UNKNOWN"}</strong></p><p className="text-sm text-slate-500">Payments, assignment and dispatch events require the backend service.</p><button className="mp-btn-secondary w-full" onClick={()=>setSelected(null)}>Close details</button></div></Modal>
    </div>
  );
}

function Analytics() {
  return (
    <div className="space-y-5">
      <SectionHeader title="Vendor analytics" description="Sales, fulfilment, product performance and customer rating signals." action={<button onClick={()=>downloadCsv("MarketPay-demo-vendor-analytics.csv",["Metric","Value"],[["30-day revenue KES",1280000],["Orders",742],["Average order value KES",1725],["Completion rate %",96.4]])} className="mp-btn-secondary"><Download className="h-4 w-4" /> Export CSV</button>} />
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
  const [store,setStore]=useDemoState("vendor.storefront",{name:"Wakulima Fresh",description:"Fresh grains, vegetables and pantry staples sourced from trusted Kenyan growers.",market:"Wakulima Market, Nairobi"});
  const [logo,setLogo]=useState("");
  const {notify}=useFeedback();
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
      <Card className="p-5">
        <SectionHeader title="Storefront customization" description="Maintain business identity, description, logo and market location." />
        <div className="mt-5 space-y-4">
          <div><label className="mp-label">Store name</label><input className="mp-input" required value={store.name} onChange={e=>setStore(old=>({...old,name:e.target.value}))}/></div>
          <div><label className="mp-label">Description</label><textarea className="mp-textarea" value={store.description} onChange={e=>setStore(old=>({...old,description:e.target.value}))}/></div>
          <div><label className="mp-label">Market location</label><input className="mp-input" value={store.market} onChange={e=>setStore(old=>({...old,market:e.target.value}))}/></div>
          <div><label className="mp-label" htmlFor="store-logo">Store logo</label><input id="store-logo" type="file" accept="image/png,image/jpeg,image/webp" className="mp-input h-auto py-3" onChange={e=>{const file=e.target.files?.[0];if(file){if(file.size>5*1024*1024){notify("Logo must be less than 5MB.","warning");return;}setLogo(file.name);}}}/>{logo&&<p role="status" className="mt-1 text-xs text-slate-600">Selected: {logo} (not uploaded)</p>}</div>
          <Toggle checked={published} onChange={setPublished} label="Storefront visible to consumers" />
          <button disabled={!store.name.trim()||!store.market.trim()} onClick={()=>notify("Storefront preview saved in this browser. No public listing has changed.","success")} className="mp-btn-primary">Save storefront preview</button>
        </div>
      </Card>
      <Card className="h-fit overflow-hidden">
        <div className="h-28 bg-gradient-to-br from-brand-700 to-navy-900" />
        <div className="-mt-10 p-5">
          <div className="grid h-20 w-20 place-items-center rounded-2xl border-4 border-white bg-brand-100 text-xl font-black text-brand-700 shadow">WF</div>
          <h3 className="mt-3 text-xl font-black">{store.name}</h3>
          <p className="mt-1 text-sm text-slate-500">{store.market}</p>
          <div className="mt-3 flex gap-2"><Badge tone="success">KYC VERIFIED</Badge><Badge tone="brand">4.82 rating</Badge></div>
          <p className="mt-4 text-sm leading-6 text-slate-600">{store.description}</p>
        </div>
      </Card>
    </div>
  );
}

function CsvImport() {
  const [name,setName]=useState("");
  const [rows,setRows]=useState<{line:number;product:string;issue:string}[]>([]);
  const [validCount,setValidCount]=useState(0);
  const [parsed,setParsed]=useState(false);
  const {notify}=useFeedback();
  async function handleFile(file:File|null){
    if(!file)return;
    setName(file.name);setParsed(false);
    if(file.size>1024*1024){notify("Please select a CSV smaller than 1MB.","warning");return;}
    try {
      const data=parseCsv(await file.text());
      const head=(data.shift()||[]).map(x=>x.toLowerCase());
      const expected=["name","category","unit","price","quantity"];
      if(expected.some(h=>!head.includes(h)))throw new Error("Missing required columns. Use the downloadable template.");
      const categories=["grain","vegetable","fruit","protein","dairy","general"];
      const result=data.map((row,index)=>{
        const get=(header:string)=>row[head.indexOf(header)]?.trim()||"";
        const product=get("name"),price=Number(get("price")),quantity=Number(get("quantity"));
        const issue=!product?"Missing product name":!categories.includes(get("category").toLowerCase())?"Invalid category":!get("unit")?"Missing unit":!Number.isFinite(price)||price<=0?"Price must be positive":!/^\d+$/.test(get("quantity"))||quantity<0?"Quantity must be a whole number":"";
        return {line:index+2,product,issue};
      });
      setRows(result);setValidCount(result.filter(r=>!r.issue).length);setParsed(true);
      notify(`${result.length} CSV rows checked; ${result.filter(r=>!!r.issue).length} need attention.`,"info");
    }catch(error){setRows([]);setValidCount(0);notify(error instanceof Error?error.message:"Unable to read this CSV.","error");}
  }
  return <div className="space-y-5"><SectionHeader title="Bulk product import" description="Select a CSV to validate its rows locally. No products are published from this screen." action={<button onClick={()=>downloadCsv("MarketPay-product-import-template.csv",["name","category","unit","price","quantity"],[["Dry maize","Grain","kg",82,100]])} className="mp-btn-secondary"><Download className="h-4 w-4"/> Download template</button>}/>
    <Card className="p-6"><label htmlFor="catalog-file" className="block rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center"><FileUp className="mx-auto h-10 w-10 text-blue-700"/><span className="mt-3 block font-bold">Choose a product CSV</span><span className="mt-1 block text-sm text-slate-600">Required: name, category, unit, price, quantity (max 1MB)</span><input id="catalog-file" type="file" accept=".csv,text/csv" className="mt-4 max-w-full text-sm" onChange={e=>void handleFile(e.target.files?.[0]||null)}/></label></Card>
    {parsed&&<Card className="p-5"><p role="status" className="font-semibold">{name} · {rows.length} rows checked</p><div className="mt-4 grid gap-3 sm:grid-cols-3"><MetricCard label="Rows checked" value={String(rows.length)}/><MetricCard label="Valid" value={String(validCount)} tone="emerald"/><MetricCard label="Needs attention" value={String(rows.length-validCount)} tone="amber"/></div>
      <div className="mp-table-wrap mt-4"><table className="mp-table"><thead><tr><th>CSV row</th><th>Product</th><th>Validation</th></tr></thead><tbody>{rows.map(row=><tr key={row.line}><td>{row.line}</td><td>{row.product||"(Unnamed)"}</td><td><Badge tone={row.issue?"danger":"success"}>{row.issue||"Valid"}</Badge></td></tr>)}</tbody></table></div>
      <p className="mt-3 text-xs text-slate-600">Validation is local only; publishing requires a verified retailer account and the marketplace service.</p></Card>}
  </div>;
}

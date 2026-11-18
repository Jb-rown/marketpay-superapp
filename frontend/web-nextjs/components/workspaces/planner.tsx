"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Download, Plus, Trash2, ShoppingCart, Sparkles, WalletCards, AlertCircle } from "lucide-react";
import { products } from "@/lib/mock-data";
import { useAppStore } from "@/components/providers/app-store";
import { formatKES } from "@/lib/utils";

type PlanItem = { id: string; quantity: number };
const KEY = "marketpay.demo.shopping-plan.v1";
const suggestions = ["Grain", "Vegetable", "Fruit", "Protein", "Dairy"];

export function PlannerWorkspace() {
  const [items, setItems] = useState<PlanItem[]>([]);
  const [ready, setReady] = useState(false);
  const [budget, setBudget] = useState(3500);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [message, setMessage] = useState("");
  const { addToCart } = useAppStore();
  useEffect(() => {
    try { const saved = JSON.parse(localStorage.getItem(KEY) || "null"); if (saved && Array.isArray(saved.items)) { setItems(saved.items); setBudget(Number(saved.budget) || 3500); } } catch { /* optional demo persistence */ }
    setReady(true);
  }, []);
  useEffect(() => { if (ready) { try { localStorage.setItem(KEY, JSON.stringify({ items, budget })); } catch { /* storage unavailable */ } } }, [items, budget, ready]);
  const catalog = useMemo(() => products.filter(p => `${p.name} ${p.category} ${p.market}`.toLowerCase().includes(search.toLowerCase())), [search]);
  const rows = useMemo(() => items.flatMap(item => { const product = products.find(p => p.id === item.id); return product ? [{ ...product, quantity: item.quantity, total: product.price * item.quantity }] : []; }), [items]);
  const total = rows.reduce((sum, row) => sum + row.total, 0);
  const update = (id: string, quantity: number) => setItems(current => quantity <= 0 ? current.filter(i => i.id !== id) : current.map(i => i.id === id ? { ...i, quantity: Math.min(999, quantity) } : i));
  const add = (id: string) => { if (!id) return; setItems(current => { const existing = current.find(i => i.id === id); return existing ? current.map(i => i.id === id ? { ...i, quantity: i.quantity + 1 } : i) : [...current, { id, quantity: 1 }]; }); setMessage("Item added to your weekly list."); };
  const generate = () => { const next = suggestions.flatMap(category => { const product = products.filter(p => p.category === category).sort((a,b) => a.price - b.price)[0]; return product ? [{ id: product.id, quantity: 1 }] : []; }); setItems(next); setMessage("Suggested basket generated from sample catalogue prices. Review quantities before shopping."); };
  const exportCsv = () => { const content = ["Product,Market,Quantity,Unit price KES,Total KES", ...rows.map(r => [r.name,r.market,r.quantity,r.price,r.total].map(v => `"${String(v).replace(/"/g,'""')}"`).join(","))].join("\r\n"); const url = URL.createObjectURL(new Blob([content], { type: "text/csv;charset=utf-8" })); const a = document.createElement("a"); a.href = url; a.download = "marketpay-weekly-shopping-list.csv"; a.click(); URL.revokeObjectURL(url); };
  return <div className="space-y-6">
    <section className="rounded-2xl bg-gradient-to-r from-navy-900 to-brand-800 p-6 text-white sm:p-8"><div className="flex items-center gap-2 text-sm font-semibold text-emerald-100"><CalendarDays size={18}/> Weekly food planner</div><h2 className="mt-3 text-2xl font-extrabold sm:text-3xl">Plan a healthier basket within your budget.</h2><p className="mt-2 max-w-2xl text-sm text-slate-200">Compare catalogue prices, build a reusable shopping list and add the selected products to your cart. All figures are illustrative demo data.</p><button className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-slate-900 hover:bg-slate-100" onClick={generate}><Sparkles size={17}/> Suggest a weekly basket</button></section>
    <div className="grid gap-4 sm:grid-cols-3"><div className="mp-card p-5"><p className="text-sm text-slate-500">Weekly budget</p><div className="mt-2 flex items-center gap-2"><span className="text-sm font-semibold">KES</span><input aria-label="Weekly budget in Kenyan shillings" className="mp-input" type="number" min="1" value={budget} onChange={e => setBudget(Math.max(1,Number(e.target.value) || 1))}/></div></div><div className="mp-card p-5"><p className="text-sm text-slate-500">Estimated basket cost</p><p className="mt-3 text-2xl font-bold">{formatKES(total)}</p></div><div className="mp-card p-5"><p className="text-sm text-slate-500">Budget remaining</p><p className={`mt-3 text-2xl font-bold ${total > budget ? "text-red-700" : "text-green-700"}`}>{formatKES(budget - total)}</p></div></div>
    {total > budget && <p role="alert" className="flex items-center gap-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-900"><AlertCircle size={17}/> Your list exceeds your weekly budget. Reduce quantities or increase the budget.</p>}
    <section className="mp-card p-5"><h3 className="text-lg font-bold">Add food to your list</h3><div className="mt-4 grid gap-3 md:grid-cols-[1fr_1.5fr_auto]"><input className="mp-input" aria-label="Search available food" placeholder="Search foods or markets" value={search} onChange={e => setSearch(e.target.value)}/><select className="mp-select" aria-label="Choose a product" value={selectedId} onChange={e => setSelectedId(e.target.value)}><option value="">Choose a product</option>{catalog.map(p => <option key={p.id} value={p.id}>{p.name} — {formatKES(p.price)} / {p.unit}</option>)}</select><button className="mp-btn-primary" disabled={!selectedId} onClick={() => add(selectedId)}><Plus size={17}/> Add item</button></div></section>
    <section className="mp-card overflow-hidden"><div className="flex flex-wrap items-center justify-between gap-3 p-5"><div><h3 className="text-lg font-bold">Your weekly shopping list</h3><p className="text-sm text-slate-500">{rows.length} products · Edit quantities as needed</p></div><div className="flex flex-wrap gap-2"><button className="mp-btn-secondary" disabled={!rows.length} onClick={exportCsv}><Download size={16}/> Export CSV</button><button className="mp-btn-primary" disabled={!rows.length} onClick={() => { rows.forEach(r => { for (let i = 0; i < r.quantity; i++) addToCart(r); }); setMessage("Selected products added to cart. Check the cart for available stock and checkout."); }}><ShoppingCart size={16}/> Add to cart</button></div></div>{rows.length ? <div className="overflow-x-auto"><table className="mp-table"><thead><tr><th>Food</th><th>Market</th><th>Unit price</th><th>Quantity</th><th>Estimated total</th><th>Remove</th></tr></thead><tbody>{rows.map(r => <tr key={r.id}><td className="font-semibold">{r.name}</td><td>{r.market}</td><td>{formatKES(r.price)} / {r.unit}</td><td><input type="number" aria-label={`Quantity for ${r.name}`} min="1" max="999" className="mp-input w-24" value={r.quantity} onChange={e => update(r.id,Math.max(1,Number(e.target.value)||1))}/></td><td>{formatKES(r.total)}</td><td><button aria-label={`Remove ${r.name}`} className="rounded-lg p-2 text-red-700 hover:bg-red-50" onClick={() => update(r.id,0)}><Trash2 size={17}/></button></td></tr>)}</tbody></table></div> : <div className="p-10 text-center text-sm text-slate-500"><WalletCards className="mx-auto mb-3 text-slate-400"/> Your shopping list is empty. Add products or generate a suggested basket.</div>}</section>
    {message && <div role="status" className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-900">{message}</div>}
    <p className="text-xs text-slate-500">UI demonstration only: estimates use local catalogue samples, not live AI forecasts or verified inventory. No payment is initiated from this page.</p>
  </div>;
}

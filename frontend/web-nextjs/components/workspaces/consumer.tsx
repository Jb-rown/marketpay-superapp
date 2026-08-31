"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight, BellRing, CheckCircle2, ChevronRight, CircleDollarSign, Download, Filter,
  Heart, Info, Minus, PackageCheck, Plus, ReceiptText, Search, Send, ShieldCheck,
  ShoppingBag, ShoppingCart, Sparkles, Star, Store, TrendingDown, TrendingUp, Upload,
  UserRound, WalletCards
} from "lucide-react";
import { useAppStore } from "@/components/providers/app-store";
import { Card, Badge, Modal, Toggle } from "@/components/ui/core";
import { MetricCard, MiniLineChart, ProgressBar } from "@/components/ui/metrics";
import { SectionHeader } from "@/components/shared/section";
import { Status } from "@/components/shared/status";
import { MapCard } from "@/components/shared/map-card";
import { consumerOrders, marketRows, priceSeries, products, transactions } from "@/lib/mock-data";
import { formatKES } from "@/lib/utils";
import type { Product } from "@/lib/types";

export function ConsumerWorkspace({ section }: { section: string }) {
  if (section === "cart") return <CartPage />;
  if (section === "orders") return <OrdersPage />;
  if (section === "wallet") return <WalletPage />;
  if (section === "intelligence") return <IntelligencePage />;
  if (section === "profile") return <ProfilePage />;
  return <MarketplacePage />;
}

function MarketplacePage() {
  const { addToCart, cartCount } = useAppStore();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("recommended");
  const [selected, setSelected] = useState<Product | null>(null);
  const categories = ["All", "Grain", "Vegetable", "Fruit", "Protein", "Dairy", "General"];

  const visible = useMemo(() => {
    let next = products.filter((product) =>
      (category === "All" || product.category === category) &&
      `${product.name} ${product.vendor} ${product.market}`.toLowerCase().includes(query.toLowerCase())
    );
    if (sort === "low") next = [...next].sort((a, b) => a.price - b.price);
    if (sort === "near") next = [...next].sort((a, b) => a.distanceKm - b.distanceKm);
    return next;
  }, [query, category, sort]);

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-0 bg-gradient-to-br from-navy-900 via-navy-800 to-brand-800 text-white">
        <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.3fr_.7fr] lg:items-center">
          <div>
            <Badge className="border-white/15 bg-white/10 text-brand-100">AI-powered price intelligence</Badge>
            <h2 className="mt-4 max-w-2xl text-3xl font-black tracking-tight sm:text-4xl">Shop smarter across nearby food markets.</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-200">
              Compare live marketplace prices, get cheaper alternatives, and pay safely with escrow-backed MarketPay checkout.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <div className="mp-chip border-white/10 bg-white/10 text-white"><TrendingDown className="h-3.5 w-3.5 text-brand-300" /> Avg. savings 8.4%</div>
              <div className="mp-chip border-white/10 bg-white/10 text-white"><Store className="h-3.5 w-3.5 text-brand-300" /> 46 nearby vendors</div>
              <div className="mp-chip border-white/10 bg-white/10 text-white"><ShieldCheck className="h-3.5 w-3.5 text-brand-300" /> Escrow protected</div>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
            <p className="text-xs font-bold uppercase tracking-[.15em] text-brand-200">Price pulse · Nairobi</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {[
                ["Dry maize", "KES 82/kg", "↓ 7.9%"],
                ["Tomatoes", "KES 96/kg", "↑ 5.5%"],
                ["Red onions", "KES 118/kg", "↓ 10.6%"],
                ["Pishori rice", "KES 188/kg", "↓ 3.6%"]
              ].map(([label, value, change]) => (
                <div key={label} className="rounded-xl bg-white/10 p-3">
                  <p className="text-[11px] text-slate-300">{label}</p>
                  <p className="mt-1 text-sm font-bold">{value}</p>
                  <p className="mt-1 text-xs text-brand-200">{change}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard label="Wallet balance" value="KES 12,840.00" detail="KES 2,140 in escrow" icon={<WalletCards className="h-5 w-5" />} />
        <MetricCard label="Active order" value="18 min" detail="Rider 2.4 km away" tone="blue" icon={<PackageCheck className="h-5 w-5" />} />
        <MetricCard label="Cart" value={`${cartCount} item${cartCount === 1 ? "" : "s"}`} detail="Preserved for 24 hours" tone="purple" icon={<ShoppingCart className="h-5 w-5" />} />
      </div>

      <Card className="p-4">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} className="mp-input pl-9" placeholder="Search food, vendor or market..." />
          </div>
          <select className="mp-select lg:w-48" value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((item) => <option key={item}>{item}</option>)}
          </select>
          <select className="mp-select lg:w-48" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="recommended">Recommended</option>
            <option value="low">Price: low to high</option>
            <option value="near">Nearest first</option>
          </select>
        </div>
      </Card>

      <SectionHeader
        eyebrow="Marketplace"
        title={`${visible.length} products near you`}
        description="Products remain visible when out of stock, but unavailable items cannot be added to cart."
        action={<Link href="/consumer/cart" className="mp-btn-secondary"><ShoppingCart className="h-4 w-4" /> View cart ({cartCount})</Link>}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {visible.map((product) => {
          const savings = Math.round(((product.marketAverage - product.price) / product.marketAverage) * 100);
          return (
            <Card key={product.id} className="group overflow-hidden">
              <button className="w-full text-left" onClick={() => setSelected(product)}>
                <div className="relative h-40 overflow-hidden bg-gradient-to-br from-brand-50 via-white to-amber-50">
                  <div className="absolute inset-0 opacity-80" style={{ backgroundImage: "radial-gradient(circle at 30% 30%, rgba(20,184,166,.18), transparent 25%),radial-gradient(circle at 70% 70%, rgba(245,158,11,.15), transparent 25%)" }} />
                  <div className="absolute left-4 top-4"><Badge tone={product.stock ? "brand" : "danger"}>{product.stock ? `${product.stock} ${product.unit} available` : "OUT OF STOCK"}</Badge></div>
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                    <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white/90 text-xl font-black text-brand-700 shadow ring-1 ring-white">{product.name.slice(0, 2).toUpperCase()}</div>
                    <div className="rounded-xl bg-white/90 px-2.5 py-1.5 text-xs font-bold text-slate-700 shadow"><Star className="mr-1 inline h-3.5 w-3.5 fill-amber-400 text-amber-400" />{product.rating}</div>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{product.category} · {product.distanceKm} km</p>
                  <h3 className="mt-1 font-bold text-slate-900">{product.name}</h3>
                  <p className="mt-1 text-xs text-slate-500">{product.vendor} · {product.market}</p>
                  <div className="mt-3 flex items-end justify-between gap-3">
                    <div><p className="text-lg font-black text-slate-950">KES {product.price}<span className="text-xs font-medium text-slate-400">/{product.unit}</span></p><p className="text-[11px] text-slate-400">Market avg. KES {product.marketAverage}</p></div>
                    {savings > 5 && <Badge tone="success">{savings}% less</Badge>}
                  </div>
                </div>
              </button>
              <div className="border-t border-slate-100 p-3">
                <button disabled={!product.stock} onClick={() => addToCart(product)} className="mp-btn-primary w-full">
                  <ShoppingBag className="h-4 w-4" /> {product.stock ? "Add to cart" : "Unavailable"}
                </button>
              </div>
            </Card>
          );
        })}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name ?? ""} description={selected ? `${selected.vendor} · ${selected.market}` : ""} width="max-w-2xl">
        {selected && (
          <div className="space-y-5">
            {selected.marketAverage - selected.price > selected.marketAverage * .05 && (
              <div className="rounded-2xl border border-brand-200 bg-brand-50 p-4">
                <div className="flex gap-3"><Sparkles className="mt-0.5 h-5 w-5 text-brand-700" /><div><p className="font-bold text-brand-900">Good price found</p><p className="mt-1 text-sm text-brand-800">This listing is {formatKES(selected.marketAverage - selected.price)} cheaper per {selected.unit} than the current market average.</p></div></div>
              </div>
            )}
            <div className="grid gap-3 sm:grid-cols-3">
              <MetricCard label="Your price" value={formatKES(selected.price)} />
              <MetricCard label="Market average" value={formatKES(selected.marketAverage)} tone="blue" />
              <MetricCard label="Distance" value={`${selected.distanceKm} km`} tone="purple" />
            </div>
            {selected.nutrition ? (
              <div>
                <p className="text-sm font-bold text-slate-900">Nutrition per 100g / 100ml</p>
                <div className="mt-2 grid grid-cols-4 gap-2 text-center">
                  {Object.entries(selected.nutrition).map(([key, value]) => <div key={key} className="rounded-xl bg-slate-50 p-3"><p className="text-[10px] uppercase tracking-wider text-slate-400">{key}</p><p className="mt-1 text-sm font-bold">{value}</p></div>)}
                </div>
              </div>
            ) : <p className="rounded-xl bg-slate-50 p-3 text-sm text-slate-500">Nutritional info not provided by vendor.</p>}
            <button disabled={!selected.stock} onClick={() => { addToCart(selected); setSelected(null); }} className="mp-btn-primary w-full"><ShoppingCart className="h-4 w-4" /> Add to cart</button>
          </div>
        )}
      </Modal>
    </div>
  );
}

function CartPage() {
  const { cart, cartTotal, setQuantity, removeFromCart, clearCart } = useAppStore();
  const [method, setMethod] = useState<"wallet" | "mpesa">("wallet");
  const [placed, setPlaced] = useState(false);
  const delivery = cart.length ? 180 : 0;
  const total = cartTotal + delivery;

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
      <div className="space-y-4">
        <SectionHeader title="Shopping cart" description="Items are grouped by vendor at fulfilment and your cart remains available for up to 24 hours." />
        {cart.length === 0 ? (
          <Card className="grid min-h-72 place-items-center p-8 text-center">
            <div><ShoppingCart className="mx-auto h-10 w-10 text-slate-300" /><h3 className="mt-3 font-bold text-slate-900">Your cart is empty</h3><p className="mt-1 text-sm text-slate-500">Browse the marketplace and add food products to continue.</p><Link href="/consumer" className="mp-btn-primary mt-4"><Store className="h-4 w-4" /> Browse marketplace</Link></div>
          </Card>
        ) : (
          <div className="space-y-3">
            {cart.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-brand-50 font-black text-brand-700">{item.name.slice(0, 2).toUpperCase()}</div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-900">{item.name}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{item.vendor} · {item.market}</p>
                    <p className="mt-1 text-sm font-semibold">{formatKES(item.price)} / {item.unit}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="rounded-lg border border-slate-200 p-2" onClick={() => setQuantity(item.id, item.quantity - 1)}><Minus className="h-3.5 w-3.5" /></button>
                    <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                    <button className="rounded-lg border border-slate-200 p-2" onClick={() => setQuantity(item.id, item.quantity + 1)}><Plus className="h-3.5 w-3.5" /></button>
                  </div>
                  <div className="sm:w-28 sm:text-right">
                    <p className="font-black text-slate-900">{formatKES(item.price * item.quantity)}</p>
                    <button onClick={() => removeFromCart(item.id)} className="mt-1 text-xs font-semibold text-red-600 hover:underline">Remove</button>
                  </div>
                </div>
              </Card>
            ))}
            <button onClick={clearCart} className="text-xs font-semibold text-slate-500 hover:text-red-600">Clear cart</button>
          </div>
        )}
      </div>

      <Card className="h-fit p-5 xl:sticky xl:top-[92px]">
        <p className="text-sm font-extrabold text-slate-900">Order summary</p>
        <div className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between text-slate-500"><span>Items</span><span>{formatKES(cartTotal)}</span></div>
          <div className="flex justify-between text-slate-500"><span>Delivery fee</span><span>{formatKES(delivery)}</span></div>
          <div className="border-t border-slate-100 pt-3"><div className="flex justify-between text-base font-black text-slate-950"><span>Total</span><span>{formatKES(total)}</span></div></div>
        </div>
        <div className="mt-5">
          <p className="mp-label">Payment method</p>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => setMethod("wallet")} className={`rounded-xl border p-3 text-left transition ${method === "wallet" ? "border-brand-500 bg-brand-50 ring-2 ring-brand-500/10" : "border-slate-200"}`}><WalletCards className="h-4 w-4 text-brand-700" /><p className="mt-2 text-xs font-bold">Wallet</p><p className="text-[10px] text-slate-500">KES 12,840</p></button>
            <button onClick={() => setMethod("mpesa")} className={`rounded-xl border p-3 text-left transition ${method === "mpesa" ? "border-brand-500 bg-brand-50 ring-2 ring-brand-500/10" : "border-slate-200"}`}><CircleDollarSign className="h-4 w-4 text-brand-700" /><p className="mt-2 text-xs font-bold">M-Pesa</p><p className="text-[10px] text-slate-500">STK Push</p></button>
          </div>
        </div>
        <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-500"><ShieldCheck className="mr-1 inline h-4 w-4 text-brand-700" /> Payment is held in escrow until delivery is confirmed.</div>
        <button disabled={!cart.length} onClick={() => setPlaced(true)} className="mp-btn-primary mt-5 w-full">Place order · {formatKES(total)} <ArrowRight className="h-4 w-4" /></button>
        {placed && <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800"><CheckCircle2 className="mr-1.5 inline h-4 w-4" /> Demo checkout complete. Order moved to CONFIRMED.</div>}
      </Card>
    </div>
  );
}

function OrdersPage() {
  const [selected, setSelected] = useState(consumerOrders[0]);
  return (
    <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
      <div className="space-y-3">
        <SectionHeader title="Order history" description="Track active deliveries, view receipts, reorder completed items, or raise a dispute within the delivery window." />
        {consumerOrders.map((order) => (
          <button key={order.id} onClick={() => setSelected(order)} className={`w-full rounded-2xl border bg-white p-4 text-left shadow-sm transition ${selected.id === order.id ? "border-brand-400 ring-4 ring-brand-500/10" : "border-slate-200 hover:border-slate-300"}`}>
            <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold text-slate-400">{order.id}</p><p className="mt-1 font-bold text-slate-900">{order.vendor}</p></div><Status value={order.status} /></div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-xs"><div><p className="text-slate-400">Total</p><p className="mt-1 font-bold">{formatKES(order.total)}</p></div><div><p className="text-slate-400">Items</p><p className="mt-1 font-bold">{order.items}</p></div><div><p className="text-slate-400">ETA</p><p className="mt-1 font-bold">{order.eta}</p></div></div>
          </button>
        ))}
      </div>
      <div className="space-y-4">
        <Card className="p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Order detail</p><h2 className="mt-1 text-xl font-black text-slate-950">{selected.id}</h2><p className="mt-1 text-sm text-slate-500">{selected.vendor} · {selected.createdAt}</p></div>
            <Status value={selected.status} />
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <MetricCard label="Total" value={formatKES(selected.total)} />
            <MetricCard label="Items" value={String(selected.items)} tone="blue" />
            <MetricCard label="Rider" value={selected.rider?.split(" ")[0] ?? "Pending"} tone="purple" />
            <MetricCard label="ETA" value={selected.eta} tone="emerald" />
          </div>
        </Card>
        {selected.status === "IN_DELIVERY" && <MapCard rider={selected.rider} eta={selected.eta} />}
        <Card className="p-5">
          <p className="text-sm font-extrabold text-slate-900">Order lifecycle</p>
          <div className="mt-4 grid grid-cols-5 gap-2">
            {["CONFIRMED","PREPARING","IN DELIVERY","DELIVERED","COMPLETED"].map((step, index) => <div key={step} className="text-center"><div className={`mx-auto h-2 rounded-full ${index <= 2 && selected.status === "IN_DELIVERY" ? "bg-brand-500" : index === 0 ? "bg-brand-500" : "bg-slate-200"}`} /><p className="mt-2 text-[10px] font-semibold text-slate-500">{step}</p></div>)}
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <button className="mp-btn-secondary"><ReceiptText className="h-4 w-4" /> View receipt</button>
            {selected.status === "COMPLETED" && <button className="mp-btn-secondary"><ShoppingBag className="h-4 w-4" /> Reorder</button>}
            {selected.status === "IN_DELIVERY" && <button className="mp-btn-primary"><CheckCircle2 className="h-4 w-4" /> Confirm receipt</button>}
            {["DELIVERED","IN_DELIVERY"].includes(selected.status) && <button className="mp-btn-secondary text-red-600"><Info className="h-4 w-4" /> Raise dispute</button>}
          </div>
        </Card>
      </div>
    </div>
  );
}

function WalletPage() {
  const [action, setAction] = useState<"topup" | "send" | "withdraw" | null>(null);
  const [filter, setFilter] = useState("All");
  const filtered = transactions.filter((tx) => filter === "All" || tx.type === filter);
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard label="Available balance" value="KES 12,840.00" detail="Ready to spend" icon={<WalletCards className="h-5 w-5" />} />
        <MetricCard label="Escrow balance" value="KES 2,140.00" detail="1 active order" tone="blue" icon={<ShieldCheck className="h-5 w-5" />} />
        <MetricCard label="Daily limit remaining" value="KES 51,660" detail="of KES 70,000" tone="amber" icon={<CircleDollarSign className="h-5 w-5" />} />
      </div>

      <Card className="p-5">
        <SectionHeader title="Quick actions" description="M-Pesa top-up, peer-to-peer transfer and withdrawal flows are represented as frontend-only demos." />
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <button onClick={() => setAction("topup")} className="rounded-2xl border border-slate-200 p-4 text-left transition hover:border-brand-300 hover:bg-brand-50/50"><Plus className="h-5 w-5 text-brand-700" /><p className="mt-3 font-bold">Top up</p><p className="mt-1 text-xs text-slate-500">M-Pesa STK Push · KES 10–150,000</p></button>
          <button onClick={() => setAction("send")} className="rounded-2xl border border-slate-200 p-4 text-left transition hover:border-brand-300 hover:bg-brand-50/50"><Send className="h-5 w-5 text-brand-700" /><p className="mt-3 font-bold">Send money</p><p className="mt-1 text-xs text-slate-500">Transfer to another MarketPay user</p></button>
          <button onClick={() => setAction("withdraw")} className="rounded-2xl border border-slate-200 p-4 text-left transition hover:border-brand-300 hover:bg-brand-50/50"><TrendingDown className="h-5 w-5 text-brand-700" /><p className="mt-3 font-bold">Withdraw</p><p className="mt-1 text-xs text-slate-500">Send wallet funds to M-Pesa</p></button>
        </div>
      </Card>

      <div>
        <SectionHeader title="Transaction history" description="Reverse chronological wallet activity with type, amount, counterparty, date and reference." action={<button className="mp-btn-secondary"><Download className="h-4 w-4" /> Statement PDF</button>} />
        <div className="mt-4 flex flex-wrap gap-2">
          {["All","Top up","Transfer","Order payment","Escrow release","Withdrawal"].map((item) => <button key={item} onClick={() => setFilter(item)} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${filter === item ? "bg-navy-900 text-white" : "border border-slate-200 bg-white text-slate-600"}`}>{item}</button>)}
        </div>
        <div className="mp-table-wrap mt-3">
          <table className="mp-table"><thead><tr><th>Type</th><th>Counterparty</th><th>Date</th><th>Reference</th><th className="text-right">Amount</th></tr></thead><tbody>
            {filtered.map((tx) => <tr key={tx.id}><td><span className="font-semibold">{tx.type}</span></td><td>{tx.counterparty}</td><td>{tx.date}</td><td className="font-mono text-xs">{tx.reference}</td><td className={`text-right font-bold ${tx.direction === "in" ? "text-emerald-600" : "text-slate-900"}`}>{tx.direction === "in" ? "+" : "−"} {formatKES(tx.amount)}</td></tr>)}
          </tbody></table>
        </div>
      </div>

      <Modal open={!!action} onClose={() => setAction(null)} title={action === "topup" ? "Top up with M-Pesa" : action === "send" ? "Send money" : "Withdraw to M-Pesa"} description="Frontend interaction only — no API request is made.">
        <div className="space-y-4">
          {action === "send" && <div><label className="mp-label">Recipient phone</label><input className="mp-input" placeholder="+254 7XX XXX XXX" /></div>}
          <div><label className="mp-label">Amount (KES)</label><input className="mp-input" type="number" placeholder={action === "withdraw" ? "Minimum 50" : "0.00"} /></div>
          {action === "send" && <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-500">The confirmed recipient name would be displayed here before transfer.</div>}
          <button onClick={() => setAction(null)} className="mp-btn-primary w-full">{action === "topup" ? "Send STK Push" : action === "send" ? "Review transfer" : "Review withdrawal"}</button>
        </div>
      </Modal>
    </div>
  );
}

function IntelligencePage() {
  const [commodity, setCommodity] = useState("Dry maize");
  const [followed, setFollowed] = useState(true);
  return (
    <div className="space-y-6">
      <Card className="p-5">
        <SectionHeader eyebrow="AI Price Intelligence" title="Find the best market price" description="Compare commodity prices, track trend direction and configure threshold or target alerts." />
        <div className="mt-5 grid gap-3 md:grid-cols-[1fr_1fr_auto]">
          <div><label className="mp-label">Commodity</label><select className="mp-select" value={commodity} onChange={(e) => setCommodity(e.target.value)}><option>Dry maize</option><option>Pishori rice</option><option>Red onions</option><option>Tomatoes</option></select></div>
          <div><label className="mp-label">Location radius</label><select className="mp-select"><option>Within 5 km</option><option>Within 10 km</option><option>Within 25 km</option></select></div>
          <div className="self-end"><button className="mp-btn-primary h-11"><Sparkles className="h-4 w-4" /> Find cheapest</button></div>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_.8fr]">
        <Card className="p-5">
          <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wider text-slate-400">12-point price trend</p><h3 className="mt-1 text-lg font-black">{commodity}</h3></div><Badge tone="success"><TrendingDown className="mr-1 h-3.5 w-3.5" /> 8.4% below 30-day avg.</Badge></div>
          <div className="mt-4"><MiniLineChart values={priceSeries} label={`${commodity} price trend`} height={180} /></div>
          <div className="mt-3 grid grid-cols-3 gap-3"><MetricCard label="Current" value="KES 82" /><MetricCard label="30-day avg." value="KES 89" tone="blue" /><MetricCard label="Forecast" value="KES 80–86" tone="purple" /></div>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-extrabold">Price alert</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">Receive push and SMS when the condition is met.</p>
          <div className="mt-4 space-y-4">
            <Toggle checked={followed} onChange={setFollowed} label="Follow dry maize" />
            <div><label className="mp-label">Change threshold</label><select className="mp-select"><option>10% change</option><option>5% change</option><option>15% change</option></select></div>
            <div><label className="mp-label">Custom target</label><input className="mp-input" placeholder="Alert me below KES 80/kg" /></div>
            <button className="mp-btn-primary w-full"><BellRing className="h-4 w-4" /> Save alert</button>
          </div>
        </Card>
      </div>

      <div>
        <SectionHeader title="Nearby market comparison" description="Aggregated market intelligence. Lower prices are surfaced first." />
        <div className="mp-table-wrap mt-4"><table className="mp-table"><thead><tr><th>Market</th><th>Maize</th><th>Rice</th><th>Tomatoes</th><th>Onions</th><th>Signal</th></tr></thead><tbody>
          {marketRows.map((row) => <tr key={row.market}><td className="font-bold">{row.market}</td><td>KES {row.maize}</td><td>KES {row.rice}</td><td>KES {row.tomatoes}</td><td>KES {row.onions}</td><td><Status value={row.signal} /></td></tr>)}
        </tbody></table></div>
      </div>
    </div>
  );
}

function ProfilePage() {
  const { pushNotificationsEnabled, setPushNotificationsEnabled } = useAppStore();
  const [mfa, setMfa] = useState(false);
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
      <div className="space-y-5">
        <Card className="p-5">
          <SectionHeader title="Personal profile" description="Phone changes require re-verification before they are saved." action={<Badge tone="success">KYC VERIFIED</Badge>} />
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div><label className="mp-label">Full name</label><input className="mp-input" defaultValue="Peter Otieno" /></div>
            <div><label className="mp-label">Phone number</label><input className="mp-input" defaultValue="+254 712 345 678" /></div>
            <div><label className="mp-label">Email</label><input className="mp-input" defaultValue="peter.otieno@example.com" /></div>
            <div><label className="mp-label">Location</label><input className="mp-input" defaultValue="Kilimani, Nairobi" /></div>
          </div>
          <button className="mp-btn-primary mt-5">Save profile</button>
        </Card>
        <Card className="p-5">
          <SectionHeader title="Notification preferences" description="Order, wallet, security and price events use push notifications with SMS fallback." />
          <div className="mt-5 space-y-4">
            <Toggle checked={pushNotificationsEnabled} onChange={setPushNotificationsEnabled} label="Push notifications" />
            <Toggle checked={true} onChange={() => {}} label="SMS fallback" />
            <Toggle checked={true} onChange={() => {}} label="Price alerts" />
            <Toggle checked={false} onChange={() => {}} label="Low-bandwidth mode" />
            <Link href="/offline" className="mp-btn-secondary w-full justify-center">View offline / USSD access</Link>
          </div>
        </Card>
      </div>
      <div className="space-y-5">
        <Card className="p-5">
          <div className="grid h-20 w-20 place-items-center rounded-2xl bg-brand-100 text-2xl font-black text-brand-700">PO</div>
          <h3 className="mt-4 text-xl font-black">Peter Otieno</h3>
          <p className="mt-1 text-sm text-slate-500">Consumer · Nairobi, Kenya</p>
          <div className="mt-4 flex flex-wrap gap-2"><Badge tone="success">ACTIVE</Badge><Badge tone="brand">Wallet linked</Badge></div>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-extrabold">Security</p>
          <div className="mt-4 space-y-4">
            <Toggle checked={mfa} onChange={setMfa} label="Multi-factor authentication" />
            <div className="rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-500">Consumers can opt into MFA. Elevated roles require a second factor during login.</div>
            <button className="mp-btn-secondary w-full"><ShieldCheck className="h-4 w-4" /> Change password</button>
          </div>
        </Card>
        <Card className="border-red-200 p-5">
          <p className="text-sm font-extrabold text-red-700">Account deletion</p><p className="mt-1 text-xs leading-5 text-slate-500">A deletion request anonymizes personal data under the documented retention policy while retaining required transaction records.</p><button className="mt-4 text-xs font-bold text-red-600">Request account deletion</button>
        </Card>
      </div>
    </div>
  );
}

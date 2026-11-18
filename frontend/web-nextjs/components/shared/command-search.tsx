"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Command, Search, X } from "lucide-react";
import { navigation, roleLabels } from "@/lib/navigation";
import type { Role } from "@/lib/types";

/** Keyboard- and screen-reader-accessible route finder; navigation only, never searches private records. */
export function CommandSearch({ role }: { role: Role }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const searchRef = useRef<HTMLInputElement>(null);
  const dialogRef=useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const entries = useMemo(() => [
    ...navigation[role].map(x => ({...x, group: roleLabels[role]})),
    { label: "Switch workspace", href: `/${role}`, icon: "LayoutDashboard", group: "Quick access" },
  ].filter((item, index, all) => all.findIndex(other => other.href === item.href) === index), [role]);
  const filtered = useMemo(() => entries.filter(x => `${x.label} ${x.group} ${x.href}`.toLowerCase().includes(query.toLowerCase().trim())), [entries, query]);
  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") { event.preventDefault(); setOpen(x => !x); }
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, []);
  useEffect(()=>{
    if(!open)return;
    const onKeys=(event:KeyboardEvent)=>{
      if(event.key!=="Tab")return;
      const elements=Array.from(dialogRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]),input:not([disabled]),a[href]')||[]).filter(el=>el.offsetParent!==null);
      if(!elements.length)return;
      const first=elements[0],last=elements[elements.length-1];
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
    };
    window.addEventListener("keydown",onKeys);
    return()=>window.removeEventListener("keydown",onKeys);
  },[open]);
  useEffect(() => {
    if (open) { setQuery(""); setSelected(0); requestAnimationFrame(() => searchRef.current?.focus()); }
    else triggerRef.current?.focus();
  }, [open]);
  function navigate(href: string) { setOpen(false); router.push(href); }
  return <>
    <button ref={triggerRef} type="button" onClick={() => setOpen(true)} className="flex h-10 min-w-0 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-600 transition hover:border-blue-400 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600" aria-haspopup="dialog" aria-label="Search pages, shortcut Control K">
      <Search className="h-4 w-4 shrink-0" /><span className="hidden sm:inline">Find a page or feature</span><span className="sm:hidden">Search</span><kbd className="ml-auto hidden rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[11px] md:inline">Ctrl K</kbd>
    </button>
    {open && <div className="fixed inset-0 z-[100] flex items-start justify-center bg-slate-950/60 p-3 pt-[8vh] sm:pt-[14vh]" onMouseDown={e => { if (e.target === e.currentTarget) setOpen(false); }}>
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-label="Find a MarketPay page" className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center gap-3 border-b border-slate-200 p-3"><Search className="h-5 w-5 text-slate-500" /><input ref={searchRef} value={query} onChange={e => {setQuery(e.target.value); setSelected(0);}} onKeyDown={e => {
          if (e.key === "ArrowDown") {e.preventDefault(); setSelected(x => Math.min(x + 1, filtered.length - 1));}
          if (e.key === "ArrowUp") {e.preventDefault(); setSelected(x => Math.max(0, x - 1));}
          if (e.key === "Enter" && filtered[selected]) navigate(filtered[selected].href);
          if (e.key === "Tab" && !e.shiftKey && e.currentTarget === document.activeElement) { /* natural tab remains available */ }
        }} className="min-w-0 flex-1 bg-transparent py-2 text-sm text-slate-900 outline-none" aria-label="Search available pages" placeholder="Type a page name, e.g. orders or wallet" role="combobox" aria-expanded="true" aria-controls="marketpay-search-results" aria-activedescendant={filtered[selected] ? `marketpay-result-${selected}` : undefined} />
        <button className="rounded-lg p-2 hover:bg-slate-100" onClick={() => setOpen(false)} aria-label="Close search"><X className="h-4 w-4" /></button></div>
        <div id="marketpay-search-results" role="listbox" className="max-h-[min(65vh,420px)] overflow-y-auto p-2">
          {!filtered.length ? <p className="px-4 py-8 text-center text-sm text-slate-600" role="status">No matching pages. Try a shorter search.</p> : filtered.map((item,index) => <button id={`marketpay-result-${index}`} role="option" aria-selected={index===selected} key={item.href} onMouseEnter={() => setSelected(index)} onClick={() => navigate(item.href)} className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm ${index===selected ? "bg-blue-50 text-blue-900" : "text-slate-800 hover:bg-slate-50"}`}><span><span className="block font-semibold">{item.label}</span><span className="block text-xs text-slate-500">{item.group} · {item.href}</span></span><ArrowRight className="h-4 w-4" /></button>)}
        </div><div className="flex items-center gap-2 border-t border-slate-200 px-4 py-3 text-xs text-slate-500"><Command className="h-3.5 w-3.5"/> Use arrow keys and Enter to open a page · Esc to close</div>
      </div>
    </div>}
  </>;
}

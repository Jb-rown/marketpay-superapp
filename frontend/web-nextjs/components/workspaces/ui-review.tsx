"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Download, ExternalLink, RotateCcw, Search, ShieldCheck } from "lucide-react";
import { navigation, roleLabels } from "@/lib/navigation";
import type { Role } from "@/lib/types";
import { useFeedback } from "@/components/shared/feedback";

const criteria = [
  { key:"usability", label:"End-user usability",weight:20, hint:"Primary task is obvious; few unnecessary steps" },
  { key:"accessibility",label:"Accessibility (WCAG 2.2 AA)",weight:20,hint:"Keyboard, screen reader, focus, contrast and zoom checks" },
  { key:"navigation",label:"Navigation and discoverability",weight:15,hint:"Important pages and actions are easy to find" },
  { key:"responsive",label:"Responsive design",weight:10,hint:"320px, tablet, laptop and wide desktop" },
  { key:"visual",label:"Visual consistency",weight:10,hint:"Theme, spacing, typography and shadcn patterns" },
  { key:"feedback",label:"Interaction and feedback",weight:10,hint:"Every control works; success and failure states are clear" },
  { key:"clarity",label:"Simplicity and clarity",weight:10,hint:"Plain language, clear labels and appropriate density" },
  { key:"performance",label:"Performance",weight:5,hint:"Responsive interaction and appropriate loading states" },
] as const;
type Criterion = typeof criteria[number]["key"];
type Scores = Partial<Record<Criterion,number>>;
type Review = { scores:Scores; notes:string; tested:boolean };
const KEY = "marketpay.ui.review.v1";
const roles = Object.keys(roleLabels) as Role[];
const routes = [
  {role:"public",label:"Home redirect",href:"/"},
  {role:"public",label:"Login",href:"/login"},
  {role:"public",label:"Registration",href:"/register"},
  {role:"public",label:"Password recovery",href:"/forgot-password"},
  {role:"public",label:"Multi-factor authentication",href:"/mfa"},
  {role:"public",label:"Offline and USSD",href:"/offline"},
  {role:"public",label:"Offline access",href:"/offline"},
  ...roles.flatMap(role=>[ {role,label:`${roleLabels[role]} overview`,href:`/${role}`}, ...navigation[role].filter(n=>n.href!==`/${role}` && n.href!=="/offline").map(n=>({...n,role})) ])
].filter((item,index,array)=>array.findIndex(x=>x.href===item.href)===index);
function score(scores:Scores):number|null {
  if(criteria.some(c=>scores[c.key]===undefined))return null;
  return criteria.reduce((sum,c)=>sum+(scores[c.key]||0)/5*c.weight,0);
}
function csvCell(value:string|number){return `"${String(value).replace(/"/g,'""')}"`;}
export function UiReview() {
  const {notify}=useFeedback();
  const [reviews,setReviews]=useState<Record<string,Review>>({});
  const [hydrated,setHydrated]=useState(false);
  const [role,setRole]=useState("all");
  const [query,setQuery]=useState("");
  const [selected,setSelected]=useState("/consumer");
  useEffect(()=>{try{const value=localStorage.getItem(KEY);if(value)setReviews(JSON.parse(value));}catch{}finally{setHydrated(true);}},[]);
  useEffect(()=>{if(!hydrated)return;try{localStorage.setItem(KEY,JSON.stringify(reviews));}catch{}},[reviews,hydrated]);
  const visible=useMemo(()=>routes.filter(r=>(role==="all"||r.role===role)&&`${r.label} ${r.href}`.toLowerCase().includes(query.toLowerCase())),[role,query]);
  const current=reviews[selected]||{scores:{},notes:"",tested:false};
  const result=score(current.scores);
  const rated=routes.filter(r=>score(reviews[r.href]?.scores||{})!==null).length;
  function change(patch:Partial<Review>){setReviews(all=>({...all,[selected]:{...current,...patch}}));}
  function exportCsv(){
    const headers=["Role","Page","URL",...criteria.map(c=>`${c.label} (0–5)`),"Weighted score / 100","Test completed","Notes"];
    const rows=routes.map(r=>{const rev=reviews[r.href];return [r.role,r.label,r.href,...criteria.map(c=>rev?.scores[c.key]??""),score(rev?.scores||{})??"",rev?.tested?"Yes":"No",rev?.notes||""];});
    const csv=[headers,...rows].map(row=>row.map(csvCell).join(",")).join("\r\n");
    const file=new Blob(["\uFEFF",csv],{type:"text/csv;charset=utf-8"});const url=URL.createObjectURL(file);const a=document.createElement("a");a.href=url;a.download="MarketPay_UI_Compliance_Scorecard.csv";a.click();URL.revokeObjectURL(url);notify("Your scorecard CSV has been exported.","success");
  }
  return <div className="space-y-5">
    <div className="flex flex-wrap items-start justify-between gap-3"><div><h1 className="text-2xl font-bold text-slate-950">UI compliance review</h1><p className="mt-1 max-w-2xl text-sm text-slate-600">Review each page using the agreed weighted scorecard. Scores are entered by you, not automatically assumed from source code.</p></div><button onClick={exportCsv} className="mp-btn-primary"><Download className="h-4 w-4"/> Export CSV</button></div>
    <div className="grid gap-3 sm:grid-cols-3"><div className="mp-card p-4"><p className="text-sm text-slate-600">Pages in checklist</p><p className="mt-1 text-2xl font-bold">{routes.length}</p></div><div className="mp-card p-4"><p className="text-sm text-slate-600">Fully scored</p><p className="mt-1 text-2xl font-bold">{rated}</p></div><div className="mp-card p-4"><p className="text-sm text-slate-600">Workflow tested</p><p className="mt-1 text-2xl font-bold">{routes.filter(r=>reviews[r.href]?.tested).length}</p></div></div>
    <div className="grid gap-5 lg:grid-cols-[minmax(260px,340px)_minmax(0,1fr)]"><section className="mp-card overflow-hidden" aria-label="Pages to review"><div className="space-y-3 border-b border-slate-200 p-4"><label className="block text-sm font-semibold" htmlFor="review-role">Workspace</label><select id="review-role" className="mp-select" value={role} onChange={e=>setRole(e.target.value)}><option value="all">All workspaces</option><option value="public">Public pages</option>{roles.map(r=><option key={r} value={r}>{roleLabels[r]}</option>)}</select><label htmlFor="review-search" className="block text-sm font-semibold">Find a page</label><div className="relative"><Search className="absolute left-3 top-3 h-4 w-4 text-slate-500"/><input id="review-search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search pages" className="mp-input pl-9"/></div></div><div className="max-h-[600px] overflow-y-auto p-2">{visible.length===0?<p className="p-4 text-sm text-slate-600">No pages match this search.</p>:visible.map(r=><button key={r.href} onClick={()=>setSelected(r.href)} aria-pressed={selected===r.href} className={`mb-1 flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm ${selected===r.href?"bg-blue-50 text-blue-900 ring-1 ring-blue-200":"text-slate-800 hover:bg-slate-50"}`}><span className="min-w-0 flex-1"><span className="block font-semibold">{r.label}</span><span className="block truncate text-xs text-slate-500">{r.href}</span></span>{score(reviews[r.href]?.scores||{})!==null?<CheckCircle2 className="h-4 w-4 shrink-0 text-green-700"/>:null}</button>)}</div></section>
    <section className="mp-card p-4 sm:p-6"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wider text-blue-700">Page assessment</p><h2 className="mt-1 text-xl font-bold text-slate-950">{routes.find(r=>r.href===selected)?.label}</h2><p className="text-xs text-slate-600">{selected}</p></div><Link href={selected} target="_blank" rel="noopener noreferrer" className="mp-btn-secondary"><ExternalLink className="h-4 w-4"/> Open page</Link></div><div className="mt-5 rounded-xl bg-slate-50 p-4"><p className="text-sm text-slate-600">Weighted result</p><p className="text-3xl font-extrabold text-slate-900">{result===null?"Not scored":`${Math.round(result)} / 100`}</p><p className="mt-1 text-xs text-slate-600">Choose 0–5 for all eight criteria to calculate the score.</p></div>
    <div className="mt-5 space-y-4">{criteria.map(c=><fieldset key={c.key} className="border-b border-slate-100 pb-4"><legend className="w-full text-sm font-semibold text-slate-900">{c.label} <span className="font-normal text-slate-500">({c.weight}%)</span></legend><p className="mb-2 text-xs text-slate-600">{c.hint}</p><div className="flex flex-wrap gap-2">{[0,1,2,3,4,5].map(v=><label key={v} className={`flex h-10 min-w-10 cursor-pointer items-center justify-center rounded-lg border text-sm font-semibold ${current.scores[c.key]===v?"border-blue-700 bg-blue-600 text-white":"border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}><input className="sr-only" type="radio" name={`${selected}-${c.key}`} value={v} checked={current.scores[c.key]===v} onChange={()=>change({scores:{...current.scores,[c.key]:v}})}/>{v}</label>)}</div></fieldset>)}</div>
    <label htmlFor="review-notes" className="mt-5 block text-sm font-semibold text-slate-900">Issues, evidence and recommended fixes</label><textarea id="review-notes" rows={4} value={current.notes} onChange={e=>change({notes:e.target.value})} className="mp-textarea mt-2" placeholder="What needs attention? Include viewport, browser and steps to reproduce."/>
    <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm font-medium"><input type="checkbox" checked={current.tested} onChange={e=>change({tested:e.target.checked})} className="h-4 w-4 accent-blue-600"/> I have tested this page’s primary workflow</label><div className="mt-5 flex justify-end"><button onClick={()=>{change({scores:{},tested:false,notes:""});notify("This page’s review has been reset.","info");}} className="mp-btn-secondary"><RotateCcw className="h-4 w-4"/> Clear this review</button></div>
    </section></div><p className="flex items-start gap-2 text-sm text-slate-600"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0"/> A scored checklist is not an independent WCAG certification or production performance measurement. Validate with keyboard/screen reader testing, automated accessibility tooling, and real-device tests.</p>
  </div>;
}

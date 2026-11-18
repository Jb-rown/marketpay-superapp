"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, Info, LoaderCircle, TriangleAlert, X } from "lucide-react";

type Tone = "success" | "error" | "warning" | "info" | "loading";
type Toast = { id: number; tone: Tone; message: string };
type Context = { notify: (message: string, tone?: Tone) => void; dismiss: (id: number) => void };
const FeedbackContext = createContext<Context | null>(null);
let counter = 0;
const icons = { success: CheckCircle2, error: AlertCircle, warning: TriangleAlert, info: Info, loading: LoaderCircle };
const toneStyles = { success: "border-green-200 bg-green-50 text-green-900", error: "border-red-200 bg-red-50 text-red-900", warning: "border-amber-200 bg-amber-50 text-amber-900", info: "border-blue-200 bg-blue-50 text-blue-900", loading: "border-blue-200 bg-blue-50 text-blue-900" };
export function FeedbackProvider({children}:{children:React.ReactNode}) {
  const [toasts,setToasts] = useState<Toast[]>([]);
  const dismiss = useCallback((id:number)=>setToasts(list=>list.filter(t=>t.id!==id)),[]);
  const notify = useCallback((message:string,tone:Tone="info")=>setToasts(list=>[...list.filter(t=>t.message!==message).slice(-2),{id:++counter,message,tone}]),[]);
  const context = useMemo(()=>({notify,dismiss}),[notify,dismiss]);
  return <FeedbackContext.Provider value={context}>{children}<div className="pointer-events-none fixed bottom-4 right-4 z-[120] flex w-[min(380px,calc(100vw-2rem))] flex-col gap-2" aria-live="polite" aria-relevant="additions">
    {toasts.map(toast=><ToastItem key={toast.id} item={toast} dismiss={dismiss}/>)}
  </div></FeedbackContext.Provider>;
}
function ToastItem({item,dismiss}:{item:Toast;dismiss:(id:number)=>void}) {
  useEffect(()=>{if(item.tone==="loading")return; const t=setTimeout(()=>dismiss(item.id),item.tone==="error"?8000:4500);return()=>clearTimeout(t);},[item,dismiss]);
  const Icon=icons[item.tone];
  return <div role={item.tone==="error"?"alert":"status"} className={`pointer-events-auto flex items-start gap-3 rounded-xl border p-3 shadow-lg ${toneStyles[item.tone]}`}><Icon className={`mt-0.5 h-5 w-5 shrink-0 ${item.tone==="loading"?"animate-spin":""}`}/><p className="min-w-0 flex-1 text-sm">{item.message}</p><button onClick={()=>dismiss(item.id)} className="rounded p-1 hover:bg-black/5" aria-label="Dismiss message"><X className="h-4 w-4"/></button></div>;
}
export function useFeedback(){const ctx=useContext(FeedbackContext);if(!ctx)throw new Error("FeedbackProvider missing");return ctx;}

import { MapPin, Navigation } from "lucide-react";
import { Card } from "@/components/ui/core";

export function MapCard({
  title = "Live delivery route",
  rider = "David Mwangi",
  eta = "18 min"
}: {
  title?: string;
  rider?: string;
  eta?: string;
}) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-[300px] bg-[#edf6f3]">
        <div className="absolute inset-0 opacity-70" style={{
          backgroundImage: "linear-gradient(rgba(15,118,110,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(15,118,110,.08) 1px,transparent 1px)",
          backgroundSize: "34px 34px"
        }} />
        <div className="absolute left-[18%] top-[22%] h-3 w-3 rounded-full bg-slate-400 ring-4 ring-white" />
        <div className="absolute left-[22%] top-[28%] h-1 w-[46%] origin-left rotate-[18deg] rounded-full bg-brand-400/70" />
        <div className="absolute right-[23%] top-[51%] grid h-10 w-10 place-items-center rounded-full bg-brand-600 text-white shadow-lg ring-4 ring-white">
          <Navigation className="h-5 w-5" />
        </div>
        <div className="absolute bottom-[18%] right-[14%] grid h-10 w-10 place-items-center rounded-full bg-navy-900 text-white shadow-lg ring-4 ring-white">
          <MapPin className="h-5 w-5" />
        </div>
        <div className="absolute left-4 top-4 rounded-xl border border-white/80 bg-white/90 p-3 shadow-sm backdrop-blur">
          <p className="text-xs font-bold text-slate-900">{title}</p>
          <p className="mt-1 text-xs text-slate-500">{rider} · ETA {eta}</p>
        </div>
        <div className="absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-2 rounded-xl border border-white/80 bg-white/90 p-3 shadow-sm backdrop-blur">
          <div><p className="text-[10px] uppercase tracking-wider text-slate-400">Distance</p><p className="text-sm font-bold">2.4 km</p></div>
          <div><p className="text-[10px] uppercase tracking-wider text-slate-400">Updated</p><p className="text-sm font-bold">12 sec ago</p></div>
          <div><p className="text-[10px] uppercase tracking-wider text-slate-400">Status</p><p className="text-sm font-bold text-brand-700">En route</p></div>
        </div>
      </div>
    </Card>
  );
}

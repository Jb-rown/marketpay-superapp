import { Badge } from "@/components/ui/core";

export function Status({ value }: { value: string }) {
  const normalized = value.toUpperCase();
  const tone =
    ["UP", "ACTIVE", "AVAILABLE", "COMPLETED", "APPROVED", "STABLE", "RELEASED"].some((x) => normalized.includes(x)) ? "success" :
    ["NEW", "CONFIRMED", "PREPARING", "PENDING", "WATCH", "RIDER_ASSIGNED"].some((x) => normalized.includes(x)) ? "info" :
    ["DEGRADED", "ELEVATED", "LOW_STOCK", "NEEDS_MORE_INFO"].some((x) => normalized.includes(x)) ? "warning" :
    ["DOWN", "DISPUTED", "REJECTED", "BLOCKED", "FROZEN", "FLAGGED"].some((x) => normalized.includes(x)) ? "danger" : "neutral";
  return <Badge tone={tone}>{value.replaceAll("_", " ")}</Badge>;
}

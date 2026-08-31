import { AppShell } from "@/components/layout/app-shell";
import { AdminWorkspace } from "@/components/workspaces/admin";
import { ConsumerWorkspace } from "@/components/workspaces/consumer";
import { GovernmentWorkspace } from "@/components/workspaces/government";
import { RiderWorkspace } from "@/components/workspaces/rider";
import { VendorWorkspace } from "@/components/workspaces/vendor";
import { WholesalerWorkspace } from "@/components/workspaces/wholesaler";
import type { Role } from "@/lib/types";

const copy: Record<Role, Record<string, { title: string; description: string }>> = {
  consumer: {
    overview: { title: "Marketplace", description: "Find affordable food, compare market prices and buy securely with escrow-backed payments." },
    cart: { title: "Cart & Checkout", description: "Review items, delivery estimates and payment options before placing your order." },
    orders: { title: "Orders & Delivery", description: "Track order status, rider progress, delivery confirmation, receipts and disputes." },
    wallet: { title: "Wallet", description: "Manage your KES balance, M-Pesa top-ups, transfers, withdrawals and transaction history." },
    intelligence: { title: "Price Intelligence", description: "Use AI-powered market comparisons, cheaper alternatives and commodity price alerts." },
    profile: { title: "Profile & Security", description: "Manage your personal details, notification preferences and account security." }
  },
  vendor: {
    overview: { title: "Retailer Dashboard", description: "Run your MarketPay storefront, monitor sales and respond to operational priorities." },
    products: { title: "Products", description: "Create, price, publish and maintain marketplace product listings." },
    inventory: { title: "Inventory", description: "Track stock levels and act on low-stock warnings before products sell out." },
    orders: { title: "Orders", description: "Accept, prepare and hand off consumer orders for delivery." },
    analytics: { title: "Retail Analytics", description: "Review sales, revenue, product performance and market-facing pricing signals." },
    storefront: { title: "Storefront", description: "Maintain the public business profile consumers use to identify and trust your store." },
    import: { title: "Bulk Product Import", description: "Upload product catalogues by CSV with row-level validation feedback." }
  },
  wholesaler: {
    overview: { title: "Wholesaler Dashboard", description: "Manage high-volume trading, bulk demand and supply performance." },
    deals: { title: "Bulk Deals", description: "Create and monitor wholesale offers with minimum quantities and volume pricing." },
    "group-buys": { title: "Group Buys", description: "Track pooled demand as participants work toward wholesale minimum order quantities." },
    orders: { title: "Bulk Orders", description: "Coordinate large orders and multi-batch sub-shipments." },
    analytics: { title: "Volume Analytics", description: "Understand total volume, revenue, top buyers, deal fill rate and inventory turnover." }
  },
  rider: {
    overview: { title: "Rider Dashboard", description: "Control availability, receive assignments and monitor today's delivery workload." },
    assignments: { title: "Delivery Assignments", description: "Accept or decline delivery requests within the assignment response window." },
    delivery: { title: "Active Delivery", description: "Navigate the active route, update delivery progress and complete OTP confirmation." },
    earnings: { title: "Earnings & Settlements", description: "Track delivery fees credited after confirmed deliveries." },
    performance: { title: "Rider Performance", description: "Review ratings, acceptance, completion and service quality indicators." },
    profile: { title: "Profile & Vehicle", description: "Maintain rider identity, vehicle details, KYC and availability information." }
  },
  government: {
    overview: { title: "Food Security Overview", description: "Monitor aggregated food price trends, market coverage and shortage signals without consumer PII." },
    prices: { title: "Price Monitor", description: "Explore validated commodity price observations and trends across monitored markets." },
    heatmap: { title: "Market Heatmap", description: "See geographic concentration of price pressure and emerging food-security risks." },
    alerts: { title: "Shortage Alerts", description: "Review AI shortage signals, root causes, acknowledgements and escalation workflows." },
    reports: { title: "Reports & Policy Insights", description: "Generate aggregated food-security briefs and policy-ready reporting outputs." }
  },
  admin: {
    overview: { title: "Platform Administration", description: "Operate users, risk, KYC, disputes, data quality and system health from one control plane." },
    users: { title: "User Management", description: "Search user accounts, review activity and manage account access." },
    kyc: { title: "KYC Review", description: "Review identity documents, OCR results and merchant or rider verification submissions." },
    disputes: { title: "Dispute Resolution", description: "Resolve marketplace disputes while escrow remains protected." },
    fraud: { title: "Fraud & Risk", description: "Investigate transaction anomalies, blocked activity and wallet restrictions." },
    "data-pipeline": { title: "Data Pipeline", description: "Monitor ingestion adapters, deduplication and quarantined price observations." },
    monitoring: { title: "System Health", description: "View service availability, API latency, error rates, alerts and recent deployments." },
    backups: { title: "Backup & Disaster Recovery", description: "Review backup verification, retention and disaster-recovery test readiness." },
    config: { title: "Platform Configuration", description: "Maintain operational limits, fees, thresholds and timeouts without changing code." },
    audit: { title: "Audit Log", description: "Review privileged administrative actions with actor, target, time and outcome." }
  }
};

export function WorkspacePage({ role, section = "overview" }: { role: Role; section?: string }) {
  const meta = copy[role][section] ?? copy[role].overview;
  let body: React.ReactNode;

  if (role === "consumer") body = <ConsumerWorkspace section={section} />;
  else if (role === "vendor") body = <VendorWorkspace section={section} />;
  else if (role === "wholesaler") body = <WholesalerWorkspace section={section} />;
  else if (role === "rider") body = <RiderWorkspace section={section} />;
  else if (role === "government") body = <GovernmentWorkspace section={section} />;
  else body = <AdminWorkspace section={section} />;

  return <AppShell role={role} title={meta.title} description={meta.description}>{body}</AppShell>;
}

import type { NavItem, Role } from "./types";

export const roleLabels: Record<Role, string> = {
  consumer: "Consumer",
  vendor: "Retailer",
  wholesaler: "Wholesaler",
  rider: "Rider",
  government: "Gov Analyst",
  admin: "Admin"
};

export const roleDescriptions: Record<Role, string> = {
  consumer: "Marketplace, wallet and price intelligence",
  vendor: "Products, inventory, orders and storefront",
  wholesaler: "Bulk deals, group buys and volume analytics",
  rider: "Assignments, live deliveries and earnings",
  government: "Food security monitoring and policy insights",
  admin: "Users, risk, platform operations and configuration"
};

export const navigation: Record<Role, NavItem[]> = {
  consumer: [
    { label: "Marketplace", href: "/consumer", icon: "Store" },
    { label: "Cart & Checkout", href: "/consumer/cart", icon: "ShoppingCart" },
    { label: "Orders", href: "/consumer/orders", icon: "PackageCheck" },
    { label: "Wallet", href: "/consumer/wallet", icon: "WalletCards" },
    { label: "Price Intelligence", href: "/consumer/intelligence", icon: "Sparkles" },
    { label: "Profile & Security", href: "/consumer/profile", icon: "UserRound" },
    { label: "Offline Access", href: "/offline", icon: "CloudOff" }
  ],
  vendor: [
    { label: "Overview", href: "/vendor", icon: "LayoutDashboard" },
    { label: "Products", href: "/vendor/products", icon: "Boxes" },
    { label: "Inventory", href: "/vendor/inventory", icon: "Warehouse" },
    { label: "Orders", href: "/vendor/orders", icon: "ClipboardList" },
    { label: "Analytics", href: "/vendor/analytics", icon: "ChartNoAxesCombined" },
    { label: "Storefront", href: "/vendor/storefront", icon: "Store" },
    { label: "CSV Import", href: "/vendor/import", icon: "FileUp" }
  ],
  wholesaler: [
    { label: "Overview", href: "/wholesaler", icon: "LayoutDashboard" },
    { label: "Bulk Deals", href: "/wholesaler/deals", icon: "BadgePercent" },
    { label: "Group Buys", href: "/wholesaler/group-buys", icon: "UsersRound" },
    { label: "Bulk Orders", href: "/wholesaler/orders", icon: "Truck" },
    { label: "Volume Analytics", href: "/wholesaler/analytics", icon: "ChartNoAxesCombined" }
  ],
  rider: [
    { label: "Overview", href: "/rider", icon: "Bike" },
    { label: "Assignments", href: "/rider/assignments", icon: "BellRing" },
    { label: "Active Delivery", href: "/rider/delivery", icon: "Navigation" },
    { label: "Earnings", href: "/rider/earnings", icon: "WalletCards" },
    { label: "Performance", href: "/rider/performance", icon: "Star" },
    { label: "Profile & Vehicle", href: "/rider/profile", icon: "BadgeCheck" }
  ],
  government: [
    { label: "Overview", href: "/government", icon: "LayoutDashboard" },
    { label: "Price Monitor", href: "/government/prices", icon: "LineChart" },
    { label: "Market Heatmap", href: "/government/heatmap", icon: "MapPinned" },
    { label: "Shortage Alerts", href: "/government/alerts", icon: "TriangleAlert" },
    { label: "Reports", href: "/government/reports", icon: "FileDown" }
  ],
  admin: [
    { label: "Overview", href: "/admin", icon: "LayoutDashboard" },
    { label: "Users", href: "/admin/users", icon: "Users" },
    { label: "KYC Review", href: "/admin/kyc", icon: "ScanFace" },
    { label: "Disputes", href: "/admin/disputes", icon: "Scale" },
    { label: "Fraud & Risk", href: "/admin/fraud", icon: "ShieldAlert" },
    { label: "Data Pipeline", href: "/admin/data-pipeline", icon: "DatabaseZap" },
    { label: "System Health", href: "/admin/monitoring", icon: "Activity" },
    { label: "Backup & Recovery", href: "/admin/backups", icon: "HardDriveDownload" },
    { label: "Configuration", href: "/admin/config", icon: "SlidersHorizontal" },
    { label: "Audit Log", href: "/admin/audit", icon: "ListChecks" }
  ]
};

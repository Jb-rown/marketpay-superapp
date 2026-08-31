# UI Implementation Scope Matrix

This matrix maps the supplied product epics to the implemented frontend surface.

| Epic | Frontend surface |
|---|---|
| EP-01 Authentication & Identity | `/login`, `/register`, `/forgot-password`, `/mfa`, profile/security views, admin user/KYC management |
| EP-02 Wallet & Payments | Consumer wallet, top-up, send, withdraw, transaction history, checkout payment selection, escrow UI, rider settlement |
| EP-03 Consumer Marketplace | Marketplace, AI alternative cues, cart, checkout, order tracking, confirmation, dispute, nutrition, history/reorder/review UI |
| EP-04 Vendor & Retailer | Vendor dashboard, products, inventory, orders, analytics, storefront, CSV import |
| EP-05 Wholesaler & Bulk Buy | Bulk deals, group buys, bulk orders/sub-shipments, MOQ and volume analytics |
| EP-06 Logistics & Delivery | Rider onboarding/profile, assignments, active delivery, route/ETA, OTP completion, earnings/performance |
| EP-07 AI Price Intelligence | Consumer intelligence, vendor pricing indicators, government trend/heatmap/shortage intelligence |
| EP-08 Data Pipeline | Admin data-pipeline status, adapter metrics, deduplication/quarantine UI |
| EP-09 Government Dashboard | Overview, price monitor, heatmap, shortage alert workflow, reports |
| EP-10 Notifications & Alerts | Shared notification drawer, profile preferences, price/order/wallet/security examples |
| EP-11 Security & Compliance | MFA, KYC, RBAC-oriented role workspaces, fraud/risk UI, audit, account deletion copy |
| EP-12 Offline / USSD / SMS | `/offline`, USSD menu preview, SMS fallback, low-bandwidth preference |
| EP-13 DevOps & Admin | System health, deployment view, configuration, backup/DR, audit |
| EP-14 Future Expansion | Kept outside the production navigation; architecture is ready for additional route groups without changing the shell |

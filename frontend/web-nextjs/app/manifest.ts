import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MarketPay Super App",
    short_name: "MarketPay",
    description: "AI-powered fintech and food marketplace experience for African markets.",
    start_url: "/consumer",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#0f172a",
    lang: "en-KE"
  };
}

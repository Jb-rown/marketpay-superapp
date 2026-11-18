import type { Metadata } from "next";
import "./globals.css";
import { FeedbackProvider } from "@/components/shared/feedback";
import { AppStoreProvider } from "@/components/providers/app-store";

export const metadata: Metadata = {
  title: "MarketPay Super App",
  description: "AI-powered fintech and food marketplace for African markets"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <FeedbackProvider><AppStoreProvider>{children}</AppStoreProvider></FeedbackProvider>
      </body>
    </html>
  );
}

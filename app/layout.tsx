import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Tradeoff | Time, Money, and What Matters",
  description:
    "Tradeoff is a calm decision tool that helps working professionals weigh time, money, friction, and what reclaimed time could become.",
  applicationName: "Tradeoff",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  keywords: [
    "decision tool",
    "outsource or do it yourself",
    "opportunity cost",
    "deal search",
    "time vs money",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-canvas text-ink antialiased">{children}</body>
    </html>
  );
}

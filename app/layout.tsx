import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: `Points Grid${process.env.NODE_ENV === "development" ? " (Dev)" : ""}`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BookLeaf | Author Support Portal",
  description:
    "Manage books, track royalties, and connect with the BookLeaf support team.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
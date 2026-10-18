import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "HomeFix | Trusted Home Services",
  description: "Find trusted plumbers, electricians, cleaners, carpenters and other home professionals across India."
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}

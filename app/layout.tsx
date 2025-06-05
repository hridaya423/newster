import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme-context";

export const metadata: Metadata = {
  title: "Newster",
  description: "Find the latest news",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="transition-colors duration-300">
        <ThemeProvider>
        {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
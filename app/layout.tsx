import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "./components/Sidebar";

export const metadata: Metadata = {
  title: "Email Please",
  description: "Mäng, mis õpetab ära tundma pahatahtelisi kirju.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="antialiased flex flex-row"
      >
        <Sidebar />
        {children}
      </body>
    </html>
  );
}

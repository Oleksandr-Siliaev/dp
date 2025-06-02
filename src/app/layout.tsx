//app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from '@/components/Navbar'



export const metadata: Metadata = {
  title: "Psychology Tests",
  description: "web application for psychological tests",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  )
}

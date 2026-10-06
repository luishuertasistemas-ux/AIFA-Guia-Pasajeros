import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/LanguageContext";
import PwaBootstrap from "@/components/PwaBootstrap";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AIFA - Guía del Pasajero",
  applicationName: "AIFA - Guía del Pasajero",
  description: "Guía digital para orientarte y continuar tu viaje en el AIFA.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/aifa-192.svg", type: "image/svg+xml", sizes: "192x192" },
      { url: "/icons/aifa-512.svg", type: "image/svg+xml", sizes: "512x512" }
    ],
    apple: [{ url: "/icons/aifa-192.svg", type: "image/svg+xml" }]
  }
};

export const viewport: Viewport = {
  themeColor: "#0f172a"
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LanguageProvider>{children}</LanguageProvider>
        <PwaBootstrap />
      </body>
    </html>
  );
}

import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Sukses Makmur — Sistem POS Syariah",
  description: "Sistem Point of Sale Syariah untuk Toko Sukses Makmur. Berdagang dengan berkah, amanah, dan bebas riba.",
  keywords: "POS, Syariah, Sukses Makmur, Kasir, Toko, Halal",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}

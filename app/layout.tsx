import "./globals.css";
import { LanguageProvider } from "../lib/LanguageContext";
import { Playfair_Display, Montserrat, Lato } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair"
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat"
});

const lato = Lato({
  weight: ["300", "400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-lato"
});

export const metadata = {
  title: "AstroLearn — Vedic Remedies & Talismans",
  description: "Free remedies, yantras, and horoscopes engine"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${montserrat.variable} ${lato.variable} bg-[#F9F9FB] min-h-screen m-0 p-0 font-sans`}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}

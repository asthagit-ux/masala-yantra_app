import "./globals.css";
import { LanguageProvider } from "../lib/LanguageContext";

export const metadata = {
  title: "AstroLearn — Vedic Remedies & Talismans",
  description: "Free remedies, yantras, and horoscopes engine"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#EEEBE6] min-h-screen m-0 p-0">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}



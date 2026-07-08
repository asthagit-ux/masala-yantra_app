import "./globals.css";
import Link from "next/link";
import { LanguageProvider } from "../lib/LanguageContext";

export const metadata = {
  title: "Astro App Starter",
  description: "Free remedies, yantra and horoscope engine"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <header className="border-b border-ink/10">
            <nav className="max-w-3xl mx-auto flex gap-6 px-6 py-4 text-sm">
              <Link href="/" className="font-medium">Astro App</Link>
              <Link href="/remedies">Remedies</Link>
              <Link href="/masala-remedies">Masala</Link>
              <Link href="/horoscope">Horoscope</Link>
            </nav>
          </header>
          <main className="max-w-3xl mx-auto px-6 py-10">{children}</main>
        </LanguageProvider>
      </body>
    </html>
  );
}


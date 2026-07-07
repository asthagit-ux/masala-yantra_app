import Link from "next/link";
import { SIGNS } from "@/lib/matching";

export default function HoroscopeIndex() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Daily horoscope</h1>
      <p className="text-ink/70 text-sm">Pick a sign to see today's reading across love, career, health, and finance.</p>
      <div className="grid grid-cols-3 gap-3">
        {SIGNS.map((sign) => (
          <Link
            key={sign}
            href={`/horoscope/${sign}`}
            className="border border-ink/10 rounded-lg p-3 hover:border-saffron capitalize"
          >
            {sign}
          </Link>
        ))}
      </div>
    </div>
  );
}

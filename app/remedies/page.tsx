import Link from "next/link";
import { PLANETS, getRemedy } from "@/lib/matching";

export default function RemediesIndex() {
  const entries = PLANETS.map((id) => getRemedy(id));
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Remedies and yantra</h1>
      <p className="text-ink/70 text-sm">
        Traditional/cultural content, not medical or financial advice.
        Pick a graha to see its kitchen remedy and yantra.
      </p>
      <div className="grid grid-cols-3 gap-3">
        {entries.map((e) => (
          <Link
            key={e.id}
            href={`/remedies/${e.id}`}
            className="border border-ink/10 rounded-lg p-3 hover:border-saffron"
          >
            <p className="font-medium text-sm">{e.name}</p>
            <p className="text-xs text-ink/60">{e.en} · {e.day}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

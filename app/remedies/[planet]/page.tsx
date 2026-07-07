import { PLANETS, Planet, getRemedy, getDailyRemedyLine, getYantraSvg } from "@/lib/matching";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return PLANETS.map((planet) => ({ planet }));
}

export default function RemedyPage({ params }: { params: { planet: string } }) {
  if (!PLANETS.includes(params.planet as Planet)) return notFound();
  const planet = params.planet as Planet;
  const entry = getRemedy(planet);
  const todayLine = getDailyRemedyLine(planet);
  const svg = getYantraSvg(planet);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{entry.name} <span className="text-ink/50 font-normal">({entry.en})</span></h1>
        <p className="text-sm text-ink/60">{entry.governs}</p>
      </div>

      <div className="border border-ink/10 rounded-lg p-4">
        <p className="text-xs uppercase tracking-wide text-ink/50 mb-1">Today's remedy</p>
        <p>{todayLine}</p>
      </div>

      <div className="border border-ink/10 rounded-lg p-4">
        <p className="text-xs uppercase tracking-wide text-ink/50 mb-2">All remedy options</p>
        <ul className="list-disc list-inside space-y-1 text-sm">
          {entry.remedies.map((r, i) => <li key={i}>{r}</li>)}
        </ul>
      </div>

      <div className="border border-ink/10 rounded-lg p-4 flex items-center gap-4">
        <div className="w-24 h-24" dangerouslySetInnerHTML={{ __html: svg }} />
        <div>
          <p className="text-xs uppercase tracking-wide text-ink/50 mb-1">Suggested yantra</p>
          <p className="text-sm">{entry.yantraName}</p>
        </div>
      </div>

      <div className="border border-ink/10 rounded-lg p-4">
        <p className="text-xs uppercase tracking-wide text-ink/50 mb-2">Usually suggested when</p>
        <p className="text-sm text-ink/70">{entry.doshaTriggers.join(", ")}</p>
      </div>
    </div>
  );
}

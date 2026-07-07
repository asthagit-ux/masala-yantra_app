import { SIGNS, Sign, getDailyHoroscope } from "@/lib/matching";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return SIGNS.map((sign) => ({ sign }));
}

const areaLabels: Record<string, string> = {
  love: "Love",
  career: "Career",
  health: "Health",
  finance: "Finance"
};

export default function HoroscopePage({ params }: { params: { sign: string } }) {
  if (!SIGNS.includes(params.sign as Sign)) return notFound();
  const sign = params.sign as Sign;
  const today = getDailyHoroscope(sign);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold capitalize">{sign}</h1>
        <p className="text-sm text-ink/60">Ruled by {today.ruler} · {today.date}</p>
      </div>

      {(["love", "career", "health", "finance"] as const).map((area) => (
        <div key={area} className="border border-ink/10 rounded-lg p-4">
          <p className="text-xs uppercase tracking-wide text-ink/50 mb-1">{areaLabels[area]}</p>
          <p>{today[area]}</p>
        </div>
      ))}
    </div>
  );
}

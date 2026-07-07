import Link from "next/link";
import { getMasalaIndex } from "@/lib/matching";

export default function MasalaRemediesIndex() {
  const index = getMasalaIndex();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Masala Remedies</h1>
        <p className="text-sm text-ink/60 mt-1">{index.source}</p>
        <p className="text-xs text-ink/40 mt-1">{index.disclaimer}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {index.categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/masala-remedies/${cat.id}`}
            className="border border-ink/10 rounded-xl p-4 hover:border-saffron hover:bg-saffron/5 transition-colors"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{cat.icon}</span>
              <span className="font-medium text-sm">{cat.label}</span>
            </div>
            <p className="text-xs text-ink/60 mt-1">{cat.description}</p>
            <p className="text-xs text-ink/40 mt-2">{cat.count} remedies</p>
          </Link>
        ))}
      </div>

      <div className="border border-ink/10 rounded-lg p-3 text-center">
        <p className="text-xs text-ink/50">
          {index.totalRemedies}+ traditional masala remedies from Lal Kitab
        </p>
      </div>
    </div>
  );
}

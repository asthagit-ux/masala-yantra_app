import { getMasalaCategory, getMasalaIndex, MASALA_CATEGORY_IDS, MasalaCategoryId } from "@/lib/matching";
import { notFound } from "next/navigation";
import Link from "next/link";

export function generateStaticParams() {
  return MASALA_CATEGORY_IDS.map((category) => ({ category }));
}

export default function MasalaCategoryPage({ params }: { params: { category: string } }) {
  if (!MASALA_CATEGORY_IDS.includes(params.category as MasalaCategoryId)) return notFound();

  const category = getMasalaCategory(params.category);
  const index = getMasalaIndex();
  const categoryMeta = index.categories.find((c) => c.id === params.category);

  return (
    <div className="space-y-6">
      <div>
        <Link href="/masala-remedies" className="text-xs text-ink/50 hover:text-ink mb-2 block">
          ← All Masala Remedies
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-3xl">{category.icon}</span>
          <div>
            <h1 className="text-2xl font-semibold">{category.label}</h1>
            <p className="text-sm text-ink/60">{category.description}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {category.remedies.map((remedy, i) => (
          <div key={i} className="border border-ink/10 rounded-xl p-4 space-y-3">
            {/* Header */}
            <div>
              <h2 className="font-semibold text-base">{remedy.title}</h2>
              <p className="text-xs text-saffron font-medium mt-0.5">{remedy.purpose}</p>
              {remedy.timing && (
                <p className="text-xs text-ink/50 mt-1">⏱ {remedy.timing}</p>
              )}
              {remedy.planet && (
                <span className="inline-block mt-1 text-xs bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-full">
                  🪐 {remedy.planetName ?? remedy.planet}
                </span>
              )}
            </div>

            {/* Ingredients */}
            <div>
              <p className="text-xs uppercase tracking-wide text-ink/40 mb-1">Ingredients</p>
              <ul className="space-y-0.5">
                {remedy.ingredients.map((ing, j) => (
                  <li key={j} className="text-sm flex items-start gap-1.5">
                    <span className="text-saffron mt-0.5">•</span>
                    <span>{ing}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Process */}
            <div>
              <p className="text-xs uppercase tracking-wide text-ink/40 mb-1">Process</p>
              <ol className="space-y-1">
                {remedy.process.map((step, j) => (
                  <li key={j} className="text-sm flex items-start gap-2">
                    <span className="text-ink/40 text-xs font-mono mt-0.5 min-w-[1.2rem]">{j + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Mantra */}
            {remedy.mantra && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                <p className="text-xs uppercase tracking-wide text-amber-500/70 mb-1">Mantra</p>
                <p className="text-sm text-amber-200">{remedy.mantra}</p>
              </div>
            )}

            {/* Benefits */}
            {remedy.benefits && (
              <div>
                <p className="text-xs uppercase tracking-wide text-ink/40 mb-1">Benefits</p>
                {Array.isArray(remedy.benefits) ? (
                  <ul className="space-y-0.5">
                    {remedy.benefits.map((b, j) => (
                      <li key={j} className="text-sm text-green-300 flex items-start gap-1.5">
                        <span className="mt-0.5">✓</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-green-300">{remedy.benefits}</p>
                )}
              </div>
            )}

            {/* Notes */}
            {(remedy.note || (remedy.notes && remedy.notes.length > 0)) && (
              <div className="bg-ink/5 rounded-lg p-3">
                <p className="text-xs uppercase tracking-wide text-ink/40 mb-1">Note</p>
                {remedy.note && <p className="text-xs text-ink/60">{remedy.note}</p>}
                {remedy.notes && (
                  <ul className="space-y-1">
                    {remedy.notes.map((n, j) => (
                      <li key={j} className="text-xs text-ink/60">• {n}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Sample Intention */}
            {remedy.sampleIntention && (
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                <p className="text-xs uppercase tracking-wide text-purple-400/70 mb-1">Sample Intention</p>
                <p className="text-sm italic text-purple-200">&quot;{remedy.sampleIntention}&quot;</p>
              </div>
            )}

            {/* Who can do this */}
            {remedy.who && (
              <div>
                <p className="text-xs uppercase tracking-wide text-ink/40 mb-1">Who Can Do This</p>
                <p className="text-xs text-ink/60">{Array.isArray(remedy.who) ? remedy.who.join(", ") : remedy.who}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="text-xs text-center text-ink/30">
        Traditional & cultural content. Not medical or financial advice.
      </p>
    </div>
  );
}

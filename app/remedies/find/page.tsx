"use client";

import React, { useState } from "react";
import Link from "next/link";
import protectionData from "../../../content/masala-remedies/protection.json";
import wealthData from "../../../content/masala-remedies/wealth.json";
import loveData from "../../../content/masala-remedies/love-relationships.json";
import healthData from "../../../content/masala-remedies/health-wellbeing.json";
import planetaryData from "../../../content/masala-remedies/planetary.json";
import spiritualData from "../../../content/masala-remedies/spiritual-luck.json";
import problemsData from "../../../content/masala-remedies/problems.json";

// Type definitions
interface Remedy {
  title: string;
  purpose: string;
  timing?: string;
  ingredients: string[];
  process: string[];
  benefits?: string | string[];
  note?: string;
  notes?: string[];
  mantra?: string;
  who?: string | string[];
  when?: string[];
  sampleIntention?: string;
  frequency?: string;
  planet?: string;
  planetName?: string;
}

// Combine all remedies into a single searchable array by title
const allRemedies: Remedy[] = [
  ...(protectionData.remedies as Remedy[]),
  ...(wealthData.remedies as Remedy[]),
  ...(loveData.remedies as Remedy[]),
  ...(healthData.remedies as Remedy[]),
  ...(planetaryData.remedies as Remedy[]),
  ...(spiritualData.remedies as Remedy[])
];

const categories = [
  { id: "protection", title: "Protection & Cleansing", desc: "Shield your home, ward off evil eye, and clear negative energies.", icon: "🛡️" },
  { id: "wealth", title: "Wealth & Abundance", desc: "Attract money, pay off debts, clear blockages, and expand sales.", icon: "💰" },
  { id: "love-relationships", title: "Love & Relationships", desc: "Resolve disputes, remove marriage delays, and improve harmony.", icon: "❤️" },
  { id: "health-wellbeing", title: "Health & Wellbeing", desc: "Enhance physical strength, sleep peace, clear long illness, and recover.", icon: "🌿" },
  { id: "planetary", title: "Planetary Doshas", desc: "Pacify Shani, Rahu/Ketu, Pitra dosh, or boost planetary strength.", icon: "🪐" },
  { id: "spiritual-luck", title: "Spiritual & Good Luck", desc: "Wish fulfillment, winning situations, legal support, and charms.", icon: "✨" }
];

export default function MasalaFunnel() {
  const [step, setStep] = useState<number>(1);
  const [name, setName] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [selectedProblemId, setSelectedProblemId] = useState<string>("");
  const [matchingRemedies, setMatchingRemedies] = useState<Remedy[]>([]);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleCategorySelect = (catId: string) => {
    setCategory(catId);
    setStep(3);
  };

  const handleProblemSelect = (probId: string, titles: string[]) => {
    setSelectedProblemId(probId);
    // Find all remedies matching these exact titles
    const found = allRemedies.filter((r) => titles.includes(r.title));
    setMatchingRemedies(found);
    setCheckedIngredients({});
    setStep(4);
  };

  const handleToggleIngredient = (remedyIdx: number, ingIdx: number) => {
    const key = `${remedyIdx}-${ingIdx}`;
    setCheckedIngredients((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleReset = () => {
    setStep(1);
    setName("");
    setCategory("");
    setSelectedProblemId("");
    setMatchingRemedies([]);
    setCheckedIngredients({});
  };

  return (
    <div className="min-h-screen bg-[#EEEBE6] text-black font-sans flex flex-col justify-between pb-10">
      
      {/* AstroLearn Header */}
      <div className="py-4 bg-white sticky top-0 z-40 px-4 md:px-8 flex justify-center items-center shadow-sm border-b border-black/5">
        <header className="flex items-center justify-between w-full max-w-4xl mx-auto">
          <Link href="/" className="flex items-center gap-2.5 no-underline">
            <svg
              className="w-[36px] h-[36px] text-[#9A7026] fill-current animate-[spin_30s_linear_infinite]"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
            </svg>
            <h1 className="text-black font-semibold font-serif text-[24px] tracking-wide flex items-center gap-1">
              AstroLearn
            </h1>
          </Link>
          <div className="flex gap-4 items-center">
            <Link
              href="/yantra-funnel"
              className="text-xs font-bold text-white bg-[#0A2133] hover:bg-[#0A2133]/90 px-3.5 py-2 rounded transition-all"
            >
              Yantra Funnel
            </Link>
            <Link
              href="/remedies"
              className="text-xs font-semibold text-black hover:text-[#9A7026] hidden md:block"
            >
              Graha Remedies
            </Link>
          </div>
        </header>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow w-full max-w-2xl mx-auto px-4 py-8 md:py-12">
        <div className="bg-white border border-black/10 rounded-2xl p-6 md:p-10 shadow-md space-y-8">
          
          {/* Funnel Title */}
          <div className="text-center space-y-2">
            <p className="text-[#9A7026] font-bold uppercase tracking-wider text-xs font-mono">
              Vedic Kitchen Science
            </p>
            <h2 className="text-2xl md:text-3xl font-bold font-serif text-black">
              Lal Kitab Masala Remedies Recommender
            </h2>
            <p className="text-xs text-black/60 max-w-md mx-auto">
              Find convenient spice-based Vedic remedies to dissolve real-life problems.
            </p>
          </div>

          {/* Step 1: Details */}
          {step === 1 && (
            <form onSubmit={handleStep1} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-base font-semibold font-serif text-black pb-1 border-b border-black/10">
                  Step 1: Tell us your details
                </h3>
                
                <div className="space-y-1.5">
                  <label className="block text-xs uppercase font-bold text-black/60 tracking-wider">
                    Your Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#EEEBE6]/40 border border-black/10 rounded-lg px-4 py-3 text-black focus:outline-none focus:border-[#9A7026] transition-all font-medium placeholder-black/30 text-sm"
                  />
                  <p className="text-[10px] text-black/40">
                    Used to customize some intentions. Leave blank to be referred to as &quot;Native&quot;.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#0A2133] hover:bg-[#0A2133]/90 active:scale-[0.99] font-bold text-sm text-white rounded-lg transition-all"
              >
                Continue to Categories
              </button>
            </form>
          )}

          {/* Step 2: Categories */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-1 border-b border-black/10">
                <h3 className="text-base font-semibold font-serif text-black">
                  Step 2: Choose Life Area
                </h3>
                <button
                  onClick={() => setStep(1)}
                  className="text-xs text-[#9A7026] hover:underline font-bold"
                >
                  &larr; Back
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    className="text-left bg-[#EEEBE6]/20 hover:bg-[#EEEBE6]/50 border border-black/10 hover:border-[#9A7026]/40 rounded-xl p-4 transition-all duration-200 active:scale-[0.98] group space-y-1"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{cat.icon}</span>
                      <p className="font-bold text-black group-hover:text-[#9A7026] font-serif text-sm transition-colors">
                        {cat.title}
                      </p>
                    </div>
                    <p className="text-xs text-black/60 leading-relaxed pl-7">
                      {cat.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Problems */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-1 border-b border-black/10">
                <h3 className="text-base font-semibold font-serif text-black">
                  Step 3: What specific issue are you facing?
                </h3>
                <button
                  onClick={() => setStep(2)}
                  className="text-xs text-[#9A7026] hover:underline font-bold"
                >
                  &larr; Back
                </button>
              </div>

              <div className="space-y-3">
                {(problemsData as any)[category]?.problems?.map((prob: any) => (
                  <button
                    key={prob.id}
                    onClick={() => handleProblemSelect(prob.id, prob.remedyTitles)}
                    className="w-full text-left bg-[#EEEBE6]/20 hover:bg-[#EEEBE6]/50 border border-black/10 hover:border-[#9A7026]/40 rounded-xl p-4 text-xs font-semibold text-black hover:text-[#9A7026] transition-all leading-relaxed active:scale-[0.99] flex items-center justify-between"
                  >
                    <span>{prob.label}</span>
                    <span className="text-[#9A7026] text-sm">&rarr;</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Results */}
          {step === 4 && (
            <div className="space-y-8">
              
              {/* Results Header */}
              <div className="flex justify-between items-center pb-2 border-b border-black/10">
                <div className="text-left">
                  <span className="text-xs font-bold text-[#9A7026] uppercase tracking-wider">
                    Recommended Remedies
                  </span>
                  <h3 className="text-base font-bold text-black">
                    Multiple Options to Choose From
                  </h3>
                </div>
                <button
                  onClick={handleReset}
                  className="text-xs text-red-600 hover:underline font-bold"
                >
                  Reset Funnel &larr;
                </button>
              </div>

              {/* Remedies Cards */}
              <div className="space-y-6">
                {matchingRemedies.map((remedy, remIdx) => (
                  <div
                    key={remIdx}
                    className="border border-[#9A7026]/20 bg-amber-50/10 rounded-xl p-5 md:p-6 space-y-4 shadow-sm"
                  >
                    
                    {/* Title */}
                    <div className="pb-3 border-b border-black/5 flex flex-wrap justify-between items-start gap-2">
                      <div>
                        <h4 className="font-bold text-base md:text-lg text-black">
                          {remedy.title}
                        </h4>
                        <p className="text-xs text-[#9A7026] font-medium mt-0.5">
                          🎯 {remedy.purpose}
                        </p>
                      </div>
                      {remedy.timing && (
                        <span className="inline-block bg-[#0A2133] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                          ⏱ {remedy.timing}
                        </span>
                      )}
                    </div>

                    {/* Ingredients Checklist */}
                    <div className="space-y-2">
                      <p className="text-[10px] uppercase font-bold text-black/50 tracking-wider">
                        Check Ingredients at Home:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {remedy.ingredients.map((ing, ingIdx) => {
                          const isChecked = checkedIngredients[`${remIdx}-${ingIdx}`];
                          return (
                            <button
                              key={ingIdx}
                              onClick={() => handleToggleIngredient(remIdx, ingIdx)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                                isChecked
                                  ? "bg-green-100 border-green-300 text-green-800 line-through"
                                  : "bg-white border-black/10 text-black/80 hover:border-[#9A7026]/40"
                              }`}
                            >
                              <span>{isChecked ? "✓" : "☐"}</span>
                              <span>{ing}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Step-by-Step Instructions */}
                    <div className="space-y-2 pt-2">
                      <p className="text-[10px] uppercase font-bold text-black/50 tracking-wider">
                        Process Steps:
                      </p>
                      <ol className="space-y-2 pl-1.5">
                        {remedy.process.map((stepStr, stepIdx) => (
                          <li
                            key={stepIdx}
                            className="text-xs leading-relaxed flex items-start gap-2 text-black/80"
                          >
                            <span className="font-mono text-[#9A7026] font-bold min-w-[14px]">
                              0{stepIdx + 1}.
                            </span>
                            <span>{stepStr}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Optional Intention Chants */}
                    {remedy.sampleIntention && (
                      <div className="bg-[#EEEBE6]/50 border-l-4 border-[#9A7026] p-3 rounded-r-lg">
                        <p className="text-[9px] uppercase font-bold text-[#9A7026] tracking-wider mb-1">
                          Intention / Sankalpa Chant:
                        </p>
                        <p className="text-xs italic text-black/80 font-serif leading-relaxed">
                          &quot;{remedy.sampleIntention.replace("Rahul Sharma", name || "Native")}&quot;
                        </p>
                      </div>
                    )}

                    {/* Mantra */}
                    {remedy.mantra && (
                      <div className="bg-amber-100/40 border border-[#9A7026]/20 p-3 rounded-lg text-center">
                        <p className="text-[9px] uppercase font-bold text-[#9A7026] tracking-wider mb-1">
                          Mantra Chanting:
                        </p>
                        <p className="text-sm font-semibold text-black leading-relaxed font-serif">
                          {remedy.mantra}
                        </p>
                      </div>
                    )}

                    {/* Benefits */}
                    {remedy.benefits && (
                      <div className="pt-2 border-t border-black/5 text-xs">
                        <span className="font-bold text-green-700">Benefits: </span>
                        <span className="text-black/75">
                          {Array.isArray(remedy.benefits) ? remedy.benefits.join(", ") : remedy.benefits}
                        </span>
                      </div>
                    )}

                    {/* Warnings/Notes */}
                    {(remedy.note || (remedy.notes && remedy.notes.length > 0)) && (
                      <div className="bg-red-50/50 p-3 rounded-lg border border-red-200/40 text-[10px] text-red-900 leading-relaxed">
                        <p className="font-bold uppercase tracking-wider mb-1">⚠️ Important Guidance:</p>
                        {remedy.note && <p>{remedy.note}</p>}
                        {remedy.notes && (
                          <ul className="list-disc pl-4 space-y-0.5">
                            {remedy.notes.map((noteText, idx) => (
                              <li key={idx}>{noteText}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Disclaimer */}
      <footer className="w-full text-center max-w-4xl mx-auto px-4 mt-auto">
        <p className="text-[10px] text-black/40">
          Disclaimer: AstroLearn remedies and talismans are traditional Vedic practices, provided for educational and cultural purposes. Not medical or financial advice.
        </p>
      </footer>
    </div>
  );
}

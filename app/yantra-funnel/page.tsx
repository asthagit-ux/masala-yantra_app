"use client";

import React, { useState } from "react";
import Link from "next/link";
import YantraRenderer from "@/components/YantraRenderer";
import yantrasData from "../../content/yantras.json";

// Typed definitions
interface Yantra {
  id: string;
  number: number;
  name: string;
  category: string;
  description: string;
  benefits: string[];
  mantras: string[];
  preparation: {
    day: string;
    time: string;
    materials: string;
  };
  layout: {
    type: string;
    rows?: number;
    cols?: number;
    cells?: string[][];
    numbers?: string[];
    text1?: string;
    text2?: string;
    header?: string;
    label?: string;
    text?: string;
    seed1?: string;
    seed2?: string;
    destination?: string;
    number?: string;
    left?: string;
    right?: string;
    center?: string;
    top_numbers?: string[];
    mantra?: string;
    bottom_left?: string;
    bottom_right?: string;
    outer_numbers?: string[];
    points?: string[];
    outer?: string[];
    inner?: string[];
    labels?: string[][];
  };
}

const yantras = yantrasData as Yantra[];

const categories = [
  { id: "wealth", title: "Wealth & Prosperity", desc: "For business expansion, wealth accumulation, and good luck.", icon: "💰" },
  { id: "health", title: "Health & Healing", desc: "For chronic illness recovery, pain relief, and mental calm.", icon: "🌿" },
  { id: "studies", title: "Studies & Knowledge", desc: "For exam success, memory power, concentration, and focus.", icon: "🎓" },
  { id: "protection", title: "Protection & Ward Evil", desc: "For house protection, evil eye removal, travel safety, and nightmares.", icon: "🛡️" },
  { id: "marriage", title: "Marriage & Love Harmony", desc: "For delayed marriage, couple bonding, and marital peace.", icon: "❤️" },
  { id: "success", title: "Success & Manifestation", desc: "For court cases, fame, manifesting wishes, and spiritual occult power.", icon: "✨" }
];

const issueList: Record<string, { id: string; label: string; recommendedId: string }[]> = {
  wealth: [
    { id: "w-1", label: "I want to clear debt and expand my store/business.", recommendedId: "vyaapaar-vruddhi" },
    { id: "w-2", label: "I want to attract wealth through hard work and efforts.", recommendedId: "dhan-prapti" },
    { id: "w-3", label: "I want to accumulate money and secure savings in my vault/safe.", recommendedId: "increase-money" },
    { id: "w-4", label: "I need overall good fortune and luck in new projects.", recommendedId: "good-luck" },
    { id: "w-5", label: "I am trying to acquire a personal vehicle.", recommendedId: "vahan-prapti" },
    { id: "w-6", label: "I want general household abundance and business growth.", recommendedId: "kuber" }
  ],
  health: [
    { id: "h-1", label: "I want relief from chronic or acute diseases.", recommendedId: "rog-niwarak" },
    { id: "h-2", label: "I want to cure minor but persistent fever, cold, or flu.", recommendedId: "rog-nashak" },
    { id: "h-3", label: "I suffer from muscular, joint, or physical pains.", recommendedId: "remove-pain" },
    { id: "h-4", label: "I want to protect a pregnancy or prevent miscarriages.", recommendedId: "disease-pregnancy" },
    { id: "h-5", label: "I want to speed recovery of a family member.", recommendedId: "dhanwantri" },
    { id: "h-6", label: "I want absolute mental peace and temper control.", recommendedId: "mental-peace" },
    { id: "h-7", label: "I suffer from continuous physical/emotional grief.", recommendedId: "sarva-peeda-nashak" }
  ],
  studies: [
    { id: "s-1", label: "I want to overcome exam phobia and score well.", recommendedId: "success-exam" },
    { id: "s-2", label: "I want to improve memory, concentration, and deep learning.", recommendedId: "vidya-prapti" },
    { id: "s-3", label: "I want academic success under competitive pressure.", recommendedId: "ganesh-studies" },
    { id: "s-4", label: "I want to learn arts, music, or pursue high research.", recommendedId: "saraswati" },
    { id: "s-5", label: "I need concentration, focus, and body toxin cleaning.", recommendedId: "gayatri" }
  ],
  protection: [
    { id: "p-1", label: "I want to shield my home from negative blockages.", recommendedId: "house-protection" },
    { id: "p-2", label: "My child/family is suffering from sudden Nazar (Evil Eye).", recommendedId: "remove-nazar-dosh" },
    { id: "p-3", label: "I need strong protection from negative vibes (for adults).", recommendedId: "remove-evil-eye" },
    { id: "p-4", label: "I experience paranormal fears or nightmares.", recommendedId: "hanuman-yantra" },
    { id: "p-5", label: "I am going on an important or urgent journey.", recommendedId: "yatra-siddhi" },
    { id: "p-6", label: "I have persistent nightmares and want peaceful sleep.", recommendedId: "bad-dream-removal" },
    { id: "p-7", label: "I need protection from hidden enemies.", recommendedId: "shatru-nashak" }
  ],
  marriage: [
    { id: "m-1", label: "My marriage is experiencing delays or obstacles.", recommendedId: "marriage" },
    { id: "m-2", label: "We are recently married and want to build understanding.", recommendedId: "successful-marriage" },
    { id: "m-3", label: "I want to resolve family discord and ensure love life success.", recommendedId: "gauri-shankar" },
    { id: "m-4", label: "I want to remove obstacles in my married life.", recommendedId: "vishnu" }
  ],
  success: [
    { id: "c-1", label: "I want public recognition, name, and fame in my circle.", recommendedId: "name-fame" },
    { id: "c-2", label: "I want commercial success and client conversion skills.", recommendedId: "success-karya" },
    { id: "c-3", label: "I want a new job, promotion, and success in all areas.", recommendedId: "success" },
    { id: "c-4", label: "I am involved in legal disputes or court cases.", recommendedId: "success-court-cases" },
    { id: "c-5", label: "I want to manifest my goals and wishes.", recommendedId: "wish-manifestation" },
    { id: "c-6", label: "I want to attain pure occult and intuitive powers.", recommendedId: "occult-powers" },
    { id: "c-7", label: "I want to get general planetary protection.", recommendedId: "nav-grah-shanti" },
    { id: "c-8", label: "I want the blessings of Lord Shiva.", recommendedId: "shiv-panchakshar" }
  ]
};

const planetList = [
  { id: "surya", name: "Surya (Sun) — Confidence & Authority" },
  { id: "chandra", name: "Chandra (Moon) — Mental Calm & Peace" },
  { id: "mangal", name: "Mangal (Mars) — Courage & Strength" },
  { id: "budh", name: "Budh (Mercury) — Communication & Business" },
  { id: "guru", name: "Guru (Jupiter) — Wisdom, Fortune & Wealth" },
  { id: "shukra", name: "Shukra (Venus) — Love, Charm & Luxuries" },
  { id: "shani", name: "Shani (Saturn) — Discipline & Career Growth" },
  { id: "rahu", name: "Rahu — Remove Obstacles & Confusion" },
  { id: "ketu", name: "Ketu — Spiritual Freedom & Occult" }
];

const numerologyMap: Record<number, { name: string; yantraId: string }> = {
  1: { name: "Surya Yantra (Sun) - Confidence & Respect", yantraId: "surya" },
  2: { name: "Chandra Yantra (Moon) - Mental Calm & Focus", yantraId: "chandra" },
  3: { name: "Guru Yantra (Jupiter) - Wisdom & Finance", yantraId: "guru" },
  4: { name: "Rahu Yantra - Ward off Accidents & Confusion", yantraId: "rahu" },
  5: { name: "Budh Yantra (Mercury) - Intellect & Communication", yantraId: "budh" },
  6: { name: "Shukra Yantra (Venus) - Luxuries & Relationships", yantraId: "shukra" },
  7: { name: "Ketu Yantra - Success & Obstacle Removal", yantraId: "ketu" },
  8: { name: "Shani Yantra (Saturn) - Professional Success", yantraId: "shani" },
  9: { name: "Mangal Yantra (Mars) - Energy & Self-Confidence", yantraId: "mangal" }
};

export default function YantraFunnel() {
  const [step, setStep] = useState<number>(1);
  const [name, setName] = useState<string>("");
  const [planetSelectMode, setPlanetSelectMode] = useState<"dob" | "manual" | "none">("none");
  const [dob, setDob] = useState<string>("");
  const [selectedPlanet, setSelectedPlanet] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [selectedIssueId, setSelectedIssueId] = useState<string>("");
  const [primaryYantra, setPrimaryYantra] = useState<Yantra | null>(null);
  const [missingNumbers, setMissingNumbers] = useState<number[]>([]);
  const [currentYantra, setCurrentYantra] = useState<Yantra | null>(null);

  // Dynamic content inputs
  const [destination, setDestination] = useState<string>("");
  const [businessName, setBusinessName] = useState<string>("");

  // Step 1 Submission
  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (planetSelectMode === "dob" && dob) {
      const presentDigits = new Set<number>();
      const cleanDob = dob.replace(/[^0-9]/g, "");
      for (const char of cleanDob) {
        const num = parseInt(char);
        if (num >= 1 && num <= 9) {
          presentDigits.add(num);
        }
      }

      const missing: number[] = [];
      for (let i = 1; i <= 9; i++) {
        if (!presentDigits.has(i)) {
          missing.push(i);
        }
      }
      setMissingNumbers(missing);
      setSelectedPlanet(""); // Reset manual choice if DOB is selected
    } else if (planetSelectMode === "manual" && selectedPlanet) {
      setMissingNumbers([]);
      // Select the manual planetary yantra
    } else {
      setMissingNumbers([]);
    }

    setStep(2);
  };

  // Step 2 Selection
  const handleCategorySelect = (catId: string) => {
    setCategory(catId);
    setStep(3);
  };

  // Step 3 Selection
  const handleIssueSelect = (issueId: string, recommendedId: string) => {
    setSelectedIssueId(issueId);
    const found = yantras.find((y) => y.id === recommendedId);
    if (found) {
      setPrimaryYantra(found);
      setCurrentYantra(found);
    }
    setStep(4);
  };

  const handleReset = () => {
    setStep(1);
    setName("");
    setPlanetSelectMode("none");
    setDob("");
    setSelectedPlanet("");
    setCategory("");
    setSelectedIssueId("");
    setPrimaryYantra(null);
    setCurrentYantra(null);
    setMissingNumbers([]);
    setDestination("");
    setBusinessName("");
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
              href="/remedies/find"
              className="text-xs font-bold text-white bg-[#0A2133] hover:bg-[#0A2133]/90 px-3.5 py-2 rounded transition-all"
            >
              Remedies Funnel
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
              Vedic Geometry Talismans
            </p>
            <h2 className="text-2xl md:text-3xl font-bold font-serif text-black">
              Personalized Yantra Funnel
            </h2>
            <p className="text-xs text-black/60 max-w-md mx-auto">
              Generate and customize your unique Vedic yantra based on goals and planetary alignment.
            </p>
          </div>

          {/* Wizard Steps */}
          {step === 1 && (
            <form onSubmit={handleStep1} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-base font-semibold font-serif text-black pb-1 border-b border-black/10">
                  Step 1: Your Details
                </h3>

                <div className="space-y-1.5">
                  <label className="block text-xs uppercase font-bold text-black/60 tracking-wider">
                    Your Name (Required)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#EEEBE6]/40 border border-black/10 rounded-lg px-4 py-3 text-black focus:outline-none focus:border-[#9A7026] transition-all font-medium placeholder-black/30 text-sm"
                  />
                  <p className="text-[10px] text-black/40">
                    This name will be dynamically written inside name-based talismans.
                  </p>
                </div>

                {/* Planet Selector Mode Toggle */}
                <div className="space-y-2 pt-2">
                  <label className="block text-xs uppercase font-bold text-black/60 tracking-wider">
                    Planetary Alignment (Optional)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPlanetSelectMode("none")}
                      className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all ${
                        planetSelectMode === "none"
                          ? "bg-[#0A2133] text-white border-[#0A2133]"
                          : "bg-white border-black/10 text-black hover:border-[#9A7026]/40"
                      }`}
                    >
                      No Planet Focus
                    </button>
                    <button
                      type="button"
                      onClick={() => setPlanetSelectMode("dob")}
                      className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all ${
                        planetSelectMode === "dob"
                          ? "bg-[#0A2133] text-white border-[#0A2133]"
                          : "bg-white border-black/10 text-black hover:border-[#9A7026]/40"
                      }`}
                    >
                      DOB Planet Check
                    </button>
                    <button
                      type="button"
                      onClick={() => setPlanetSelectMode("manual")}
                      className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all ${
                        planetSelectMode === "manual"
                          ? "bg-[#0A2133] text-white border-[#0A2133]"
                          : "bg-white border-black/10 text-black hover:border-[#9A7026]/40"
                      }`}
                    >
                      Select Planet
                    </button>
                  </div>
                </div>

                {/* DOB-Based Check Panel */}
                {planetSelectMode === "dob" && (
                  <div className="space-y-1.5 p-4 bg-[#EEEBE6]/20 border border-black/10 rounded-xl transition-all">
                    <label className="block text-xs uppercase font-bold text-black/60 tracking-wider">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      required
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full bg-white border border-black/10 rounded-lg px-4 py-2.5 text-black focus:outline-none focus:border-[#9A7026] text-sm font-medium"
                    />
                    <p className="text-[10px] text-black/40">
                      We will analyze missing numbers in your Numeroscope to recommend planetary shields.
                    </p>
                  </div>
                )}

                {/* Manual Planet Selection List */}
                {planetSelectMode === "manual" && (
                  <div className="space-y-2 p-4 bg-[#EEEBE6]/20 border border-black/10 rounded-xl transition-all">
                    <label className="block text-xs uppercase font-bold text-black/60 tracking-wider">
                      Select Your Planet Focus
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[180px] overflow-y-auto pr-1">
                      {planetList.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setSelectedPlanet(p.id)}
                          className={`text-left px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                            selectedPlanet === p.id
                              ? "bg-[#9A7026]/10 border-[#9A7026] text-[#9A7026] font-bold"
                              : "bg-white border-black/10 text-black hover:border-black/30"
                          }`}
                        >
                          🪐 {p.name}
                        </button>
                      ))}
                    </div>
                    <p className="text-[10px] text-black/40">
                      Choose the weak planet from your horoscope chart or birth consult.
                    </p>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#0A2133] hover:bg-[#0A2133]/90 active:scale-[0.99] font-bold text-sm text-white rounded-lg transition-all"
              >
                Continue to Goals
              </button>
            </form>
          )}

          {/* Step 2: Categories */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-1 border-b border-black/10">
                <h3 className="text-base font-semibold font-serif text-black">
                  Step 2: What area of life needs help?
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

          {/* Step 3: Concerns */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-1 border-b border-black/10">
                <h3 className="text-base font-semibold font-serif text-black">
                  Step 3: Tell us your specific concern
                </h3>
                <button
                  onClick={() => setStep(2)}
                  className="text-xs text-[#9A7026] hover:underline font-bold"
                >
                  &larr; Back
                </button>
              </div>

              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                {issueList[category]?.map((issue) => (
                  <button
                    key={issue.id}
                    onClick={() => handleIssueSelect(issue.id, issue.recommendedId)}
                    className="w-full text-left bg-[#EEEBE6]/20 hover:bg-[#EEEBE6]/50 border border-black/10 hover:border-[#9A7026]/40 rounded-xl p-3.5 text-xs text-black hover:text-[#9A7026] transition-all font-semibold leading-relaxed active:scale-[0.99] flex items-center justify-between"
                  >
                    <span>{issue.label}</span>
                    <span className="text-[#9A7026] text-sm">&rarr;</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Results */}
          {step === 4 && currentYantra && (
            <div className="space-y-6">
              
              {/* Back Header */}
              <div className="flex justify-between items-center pb-2 border-b border-black/10">
                <h3 className="text-base font-bold font-serif text-[#9A7026]">
                  Your Recommended Talisman
                </h3>
                <button
                  onClick={handleReset}
                  className="text-xs text-red-600 hover:underline font-bold"
                >
                  Reset Funnel &larr;
                </button>
              </div>

              {/* DOB Numerology Recommendations Panel */}
              {planetSelectMode === "dob" && missingNumbers.length > 0 && (
                <div className="bg-[#EEEBE6]/30 border border-black/10 p-4 rounded-xl space-y-3 text-left">
                  <p className="text-xs font-bold text-[#9A7026] uppercase tracking-wider flex items-center gap-1.5">
                    🪐 DOB Numerology Insights
                  </p>
                  <p className="text-[11px] text-black/70 leading-relaxed">
                    Based on birth date <span className="font-semibold">{dob}</span>, your missing numbers in grid are:{" "}
                    <span className="font-bold text-[#9A7026]">{missingNumbers.join(", ")}</span>. You can toggle below to view their remedial yantras:
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      onClick={() => setCurrentYantra(primaryYantra)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wide transition-all border ${
                        currentYantra?.id === primaryYantra?.id
                          ? "bg-[#0A2133] text-white border-[#0A2133]"
                          : "bg-white text-black border-black/10 hover:border-[#9A7026]"
                      }`}
                    >
                      Goal: {primaryYantra?.name.split(" ")[0]} (Recommended)
                    </button>

                    {missingNumbers.map((num) => {
                      const mapped = numerologyMap[num];
                      if (!mapped) return null;
                      const linkedYantra = yantras.find((y) => y.id === mapped.yantraId);
                      if (!linkedYantra) return null;

                      return (
                        <button
                          key={num}
                          onClick={() => setCurrentYantra(linkedYantra)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wide transition-all border ${
                            currentYantra?.id === linkedYantra.id
                              ? "bg-[#0A2133] text-white border-[#0A2133]"
                              : "bg-white text-black border-black/10 hover:border-[#9A7026]"
                          }`}
                        >
                          Missing {num}: {linkedYantra.name.split(" ")[0]}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Manual Planet Recommendation Switcher */}
              {planetSelectMode === "manual" && selectedPlanet && (
                <div className="bg-[#EEEBE6]/30 border border-black/10 p-4 rounded-xl space-y-3 text-left">
                  <p className="text-xs font-bold text-[#9A7026] uppercase tracking-wider flex items-center gap-1.5">
                    🪐 Manual Planet Focus Talisman
                  </p>
                  <p className="text-[11px] text-black/70 leading-relaxed">
                    You have chosen the planet <span className="font-semibold capitalize">{selectedPlanet}</span>. You can toggle between your concern yantra and planetary focus yantra:
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      onClick={() => setCurrentYantra(primaryYantra)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wide transition-all border ${
                        currentYantra?.id === primaryYantra?.id
                          ? "bg-[#0A2133] text-white border-[#0A2133]"
                          : "bg-white text-black border-black/10 hover:border-[#9A7026]"
                      }`}
                    >
                      Goal Yantra: {primaryYantra?.name.split(" ")[0]}
                    </button>

                    {(() => {
                      const linkedYantra = yantras.find((y) => y.id === selectedPlanet);
                      if (!linkedYantra) return null;
                      return (
                        <button
                          onClick={() => setCurrentYantra(linkedYantra)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wide transition-all border ${
                            currentYantra?.id === linkedYantra.id
                              ? "bg-[#0A2133] text-white border-[#0A2133]"
                              : "bg-white text-black border-black/10 hover:border-[#9A7026]"
                          }`}
                        >
                          Planetary Yantra: {linkedYantra.name.split(" ")[0]}
                        </button>
                      );
                    })()}
                  </div>
                </div>
              )}

              {/* Custom Input Modifiers for Dynamic Rendering (Travel, Business Name, etc.) */}
              {(currentYantra.layout.type === "travel-arch" ||
                currentYantra.layout.type === "business-grid" ||
                currentYantra.layout.type === "court-yantra" ||
                currentYantra.layout.type === "house-protection") && (
                <div className="bg-[#EEEBE6]/20 border border-black/10 p-4 rounded-xl space-y-3 text-left">
                  <p className="text-[11px] font-bold text-[#9A7026] uppercase tracking-wider">
                    Customize Talisman Content
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {currentYantra.layout.type === "travel-arch" && (
                      <div className="space-y-1">
                        <label className="text-[10px] text-black/50 font-bold uppercase">Destination Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Kashi"
                          value={destination}
                          onChange={(e) => setDestination(e.target.value)}
                          className="w-full bg-white border border-black/10 rounded-lg px-3 py-2 text-black text-xs focus:outline-none focus:border-[#9A7026]"
                        />
                      </div>
                    )}

                    {currentYantra.layout.type === "business-grid" && (
                      <div className="space-y-1">
                        <label className="text-[10px] text-black/50 font-bold uppercase">Business Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Sharma Traders"
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          className="w-full bg-white border border-black/10 rounded-lg px-3 py-2 text-black text-xs focus:outline-none focus:border-[#9A7026]"
                        />
                      </div>
                    )}

                    <div className="space-y-1">
                      <label className="text-[10px] text-black/50 font-bold uppercase">Name on Talisman</label>
                      <input
                        type="text"
                        placeholder="e.g. Rahul Sharma"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-white border border-black/10 rounded-lg px-3 py-2 text-black text-xs focus:outline-none focus:border-[#9A7026]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Yantra Talisman Rendering Display */}
              <div className="border border-black/10 rounded-xl p-4 bg-white flex flex-col items-center">
                <YantraRenderer
                  yantra={currentYantra}
                  userName={name}
                  destinationName={destination}
                  businessName={businessName}
                />
              </div>

              {/* Yantra Details card */}
              <div className="bg-[#EEEBE6]/20 border border-black/10 rounded-xl p-5 space-y-4 text-left">
                <div>
                  <h4 className="font-bold text-black font-serif text-sm">
                    {currentYantra.name}
                  </h4>
                  <p className="text-xs text-black/70 leading-relaxed mt-1">
                    {currentYantra.description}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-black/50 tracking-wider">Benefits:</p>
                  <ul className="list-disc pl-4 text-xs text-black/80 space-y-0.5">
                    {currentYantra.benefits.map((b, idx) => <li key={idx}>{b}</li>)}
                  </ul>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-black/50 tracking-wider">Mantra Chants:</p>
                  {currentYantra.mantras.map((m, idx) => (
                    <p key={idx} className="text-xs italic text-black font-semibold font-serif bg-white p-2 rounded border border-black/5 text-center">
                      &quot;{m}&quot;
                    </p>
                  ))}
                </div>

                <div className="space-y-1 pt-1 border-t border-black/5 text-xs text-black/75">
                  <p><span className="font-bold">Day:</span> {currentYantra.preparation.day}</p>
                  <p><span className="font-bold">Time:</span> {currentYantra.preparation.time}</p>
                  <p className="leading-relaxed"><span className="font-bold">Materials:</span> {currentYantra.preparation.materials}</p>
                </div>
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

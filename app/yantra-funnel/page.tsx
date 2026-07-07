"use client";

import React, { useState } from "react";
import Link from "next/link";
import YantraRenderer from "@/components/YantraRenderer";
import yantrasData from "../../content/yantras.json";
import {
  calculateKundli,
  geocodeCity,
  getKundliYantraRecommendations,
  type KundliResult,
  type YantraRecommendation,
} from "../../lib/kundli";

// ─── Type definitions ─────────────────────────────────────────────────────────
interface Yantra {
  id: string;
  number: number;
  name: string;
  category: string;
  description: string;
  benefits: string[];
  mantras: string[];
  preparation: { day: string; time: string; materials: string };
  layout: {
    type: string;
    rows?: number; cols?: number; cells?: string[][];
    numbers?: string[]; text1?: string; text2?: string; header?: string;
    label?: string; text?: string; seed1?: string; seed2?: string;
    destination?: string; number?: string; left?: string; right?: string;
    center?: string; top_numbers?: string[]; mantra?: string;
    bottom_left?: string; bottom_right?: string; outer_numbers?: string[];
    points?: string[]; outer?: string[]; inner?: string[]; labels?: string[][];
  };
}

const yantras = yantrasData as Yantra[];

// ─── Data ─────────────────────────────────────────────────────────────────────
const categories = [
  { id: "wealth",     title: "Wealth & Prosperity",      desc: "Business expansion, wealth accumulation, good luck.",              icon: "💰" },
  { id: "health",     title: "Health & Healing",          desc: "Chronic illness recovery, pain relief, mental calm.",              icon: "🌿" },
  { id: "studies",    title: "Studies & Knowledge",       desc: "Exam success, memory power, concentration, focus.",               icon: "🎓" },
  { id: "protection", title: "Protection & Ward Evil",    desc: "House protection, evil eye removal, travel safety, nightmares.",  icon: "🛡️" },
  { id: "marriage",   title: "Marriage & Love Harmony",   desc: "Delayed marriage, couple bonding, marital peace.",                icon: "❤️" },
  { id: "success",    title: "Success & Manifestation",   desc: "Court cases, fame, manifesting wishes, spiritual occult power.", icon: "✨" },
];

const issueList: Record<string, { id: string; label: string; recommendedId: string }[]> = {
  wealth: [
    { id: "w-1", label: "I want to clear debt and expand my store/business.", recommendedId: "vyaapaar-vruddhi" },
    { id: "w-2", label: "I want to attract wealth through hard work and efforts.", recommendedId: "dhan-prapti" },
    { id: "w-3", label: "I want to accumulate money and secure savings in my vault/safe.", recommendedId: "increase-money" },
    { id: "w-4", label: "I need overall good fortune and luck in new projects.", recommendedId: "good-luck" },
    { id: "w-5", label: "I am trying to acquire a personal vehicle.", recommendedId: "vahan-prapti" },
    { id: "w-6", label: "I want general household abundance and business growth.", recommendedId: "kuber" },
  ],
  health: [
    { id: "h-1", label: "I want relief from chronic or acute diseases.", recommendedId: "rog-niwarak" },
    { id: "h-2", label: "I want to cure minor but persistent fever, cold, or flu.", recommendedId: "rog-nashak" },
    { id: "h-3", label: "I suffer from muscular, joint, or physical pains.", recommendedId: "remove-pain" },
    { id: "h-4", label: "I want to protect a pregnancy or prevent miscarriages.", recommendedId: "disease-pregnancy" },
    { id: "h-5", label: "I want to speed recovery of a family member.", recommendedId: "dhanwantri" },
    { id: "h-6", label: "I want absolute mental peace and temper control.", recommendedId: "mental-peace" },
    { id: "h-7", label: "I suffer from continuous physical/emotional grief.", recommendedId: "sarva-peeda-nashak" },
  ],
  studies: [
    { id: "s-1", label: "I want to overcome exam phobia and score well.", recommendedId: "success-exam" },
    { id: "s-2", label: "I want to improve memory, concentration, and deep learning.", recommendedId: "vidya-prapti" },
    { id: "s-3", label: "I want academic success under competitive pressure.", recommendedId: "ganesh-studies" },
    { id: "s-4", label: "I want to learn arts, music, or pursue high research.", recommendedId: "saraswati" },
    { id: "s-5", label: "I need concentration, focus, and body toxin cleaning.", recommendedId: "gayatri" },
  ],
  protection: [
    { id: "p-1", label: "I want to shield my home from negative blockages.", recommendedId: "house-protection" },
    { id: "p-2", label: "My child/family is suffering from sudden Nazar (Evil Eye).", recommendedId: "remove-nazar-dosh" },
    { id: "p-3", label: "I need strong protection from negative vibes (for adults).", recommendedId: "remove-evil-eye" },
    { id: "p-4", label: "I experience paranormal fears or nightmares.", recommendedId: "hanuman-yantra" },
    { id: "p-5", label: "I am going on an important or urgent journey.", recommendedId: "yatra-siddhi" },
    { id: "p-6", label: "I have persistent nightmares and want peaceful sleep.", recommendedId: "bad-dream-removal" },
    { id: "p-7", label: "I need protection from hidden enemies.", recommendedId: "shatru-nashak" },
  ],
  marriage: [
    { id: "m-1", label: "My marriage is experiencing delays or obstacles.", recommendedId: "marriage" },
    { id: "m-2", label: "We are recently married and want to build understanding.", recommendedId: "successful-marriage" },
    { id: "m-3", label: "I want to resolve family discord and ensure love life success.", recommendedId: "gauri-shankar" },
    { id: "m-4", label: "I want to remove obstacles in my married life.", recommendedId: "vishnu" },
  ],
  success: [
    { id: "c-1", label: "I want public recognition, name, and fame in my circle.", recommendedId: "name-fame" },
    { id: "c-2", label: "I want commercial success and client conversion skills.", recommendedId: "success-karya" },
    { id: "c-3", label: "I want a new job, promotion, and success in all areas.", recommendedId: "success" },
    { id: "c-4", label: "I am involved in legal disputes or court cases.", recommendedId: "success-court-cases" },
    { id: "c-5", label: "I want to manifest my goals and wishes.", recommendedId: "wish-manifestation" },
    { id: "c-6", label: "I want to attain pure occult and intuitive powers.", recommendedId: "occult-powers" },
    { id: "c-7", label: "I want to get general planetary protection.", recommendedId: "nav-grah-shanti" },
    { id: "c-8", label: "I want the blessings of Lord Shiva.", recommendedId: "shiv-panchakshar" },
  ],
};

const planetList = [
  { id: "surya",  name: "Surya (Sun) — Confidence & Authority" },
  { id: "chandra",name: "Chandra (Moon) — Mental Calm & Peace" },
  { id: "mangal", name: "Mangal (Mars) — Courage & Strength" },
  { id: "budh",   name: "Budh (Mercury) — Communication & Business" },
  { id: "guru",   name: "Guru (Jupiter) — Wisdom, Fortune & Wealth" },
  { id: "shukra", name: "Shukra (Venus) — Love, Charm & Luxuries" },
  { id: "shani",  name: "Shani (Saturn) — Discipline & Career Growth" },
  { id: "rahu",   name: "Rahu — Remove Obstacles & Confusion" },
  { id: "ketu",   name: "Ketu — Spiritual Freedom & Occult" },
];

const numerologyMap: Record<number, { name: string; yantraId: string }> = {
  1: { name: "Surya Yantra (Sun)", yantraId: "surya" },
  2: { name: "Chandra Yantra (Moon)", yantraId: "chandra" },
  3: { name: "Guru Yantra (Jupiter)", yantraId: "guru" },
  4: { name: "Rahu Yantra", yantraId: "rahu" },
  5: { name: "Budh Yantra (Mercury)", yantraId: "budh" },
  6: { name: "Shukra Yantra (Venus)", yantraId: "shukra" },
  7: { name: "Ketu Yantra", yantraId: "ketu" },
  8: { name: "Shani Yantra (Saturn)", yantraId: "shani" },
  9: { name: "Mangal Yantra (Mars)", yantraId: "mangal" },
};

// ─── Component ───────────────────────────────────────────────────────────────

type AppMode = "goal" | "kundli";

export default function YantraPage() {
  // Mode: which flow
  const [appMode, setAppMode] = useState<AppMode>("goal");

  // Common
  const [name, setName] = useState("");

  // ── Goal-based flow state ──────────────────────────────────────────────────
  const [goalStep, setGoalStep] = useState(1);
  const [planetSelectMode, setPlanetSelectMode] = useState<"none" | "dob" | "manual">("none");
  const [dob, setDob] = useState("");
  const [selectedPlanet, setSelectedPlanet] = useState("");
  const [missingNumbers, setMissingNumbers] = useState<number[]>([]);
  const [category, setCategory] = useState("");
  const [primaryYantra, setPrimaryYantra] = useState<Yantra | null>(null);
  const [currentYantra, setCurrentYantra] = useState<Yantra | null>(null);
  const [destination, setDestination] = useState("");
  const [businessName, setBusinessName] = useState("");

  // ── Kundli flow state ──────────────────────────────────────────────────────
  const [kundliStep, setKundliStep] = useState(1);
  const [birthDob, setBirthDob] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthCity, setBirthCity] = useState("");
  const [geocoding, setGeocoding] = useState(false);
  const [geocodeError, setGeocodeError] = useState("");
  const [kundliResult, setKundliResult] = useState<KundliResult | null>(null);
  const [kundliRecs, setKundliRecs] = useState<YantraRecommendation[]>([]);
  const [kundliActiveRec, setKundliActiveRec] = useState<string>("");
  const [kundliLoading, setKundliLoading] = useState(false);

  // ─── Handlers: Goal flow ──────────────────────────────────────────────────

  const handleGoalStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (planetSelectMode === "dob" && dob) {
      const digits = new Set<number>();
      for (const c of dob.replace(/[^0-9]/g, "")) {
        const n = parseInt(c);
        if (n >= 1 && n <= 9) digits.add(n);
      }
      const missing: number[] = [];
      for (let i = 1; i <= 9; i++) { if (!digits.has(i)) missing.push(i); }
      setMissingNumbers(missing);
    } else {
      setMissingNumbers([]);
    }
    setGoalStep(2);
  };

  const handleCategorySelect = (catId: string) => {
    setCategory(catId);
    setGoalStep(3);
  };

  const handleIssueSelect = (_issueId: string, recommendedId: string) => {
    const found = yantras.find((y) => y.id === recommendedId);
    if (found) { setPrimaryYantra(found); setCurrentYantra(found); }
    setGoalStep(4);
  };

  const resetGoal = () => {
    setGoalStep(1); setName(""); setPlanetSelectMode("none"); setDob("");
    setSelectedPlanet(""); setMissingNumbers([]); setCategory("");
    setPrimaryYantra(null); setCurrentYantra(null);
    setDestination(""); setBusinessName("");
  };

  // ─── Handlers: Kundli flow ────────────────────────────────────────────────

  const handleKundliSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeocodeError("");
    setKundliLoading(true);

    const location = await geocodeCity(birthCity);
    if (!location) {
      setGeocodeError("Could not find this city. Try a more specific name (e.g. 'Mumbai, India').");
      setKundliLoading(false);
      return;
    }

    try {
      const result = calculateKundli(birthDob, birthTime, location.lat, location.lng, location.displayName);
      const recs = getKundliYantraRecommendations(result);
      setKundliResult(result);
      setKundliRecs(recs);
      if (recs.length > 0) setKundliActiveRec(recs[0].planet);
      setKundliStep(2);
    } catch (err) {
      setGeocodeError("Calculation error. Please check birth details and try again.");
    }
    setKundliLoading(false);
  };

  const resetKundli = () => {
    setKundliStep(1); setBirthDob(""); setBirthTime(""); setBirthCity("");
    setKundliResult(null); setKundliRecs([]); setKundliActiveRec(""); setGeocodeError("");
  };

  // Active kundli yantra
  const activeKundliYantra = kundliRecs.length > 0
    ? yantras.find(y => y.id === kundliActiveRec) ?? null
    : null;

  // ─── Shared header ────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#EEEBE6] text-black font-sans flex flex-col justify-between pb-10">

      {/* AstroLearn Header */}
      <div className="py-4 bg-white sticky top-0 z-40 px-4 md:px-8 flex justify-center shadow-sm border-b border-black/5">
        <header className="flex items-center justify-between w-full max-w-4xl mx-auto">
          <Link href="/" className="flex items-center gap-2.5 no-underline">
            <svg className="w-9 h-9 text-[#9A7026] fill-current animate-[spin_30s_linear_infinite]" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
            </svg>
            <h1 className="text-black font-semibold font-serif text-2xl tracking-wide">AstroLearn</h1>
          </Link>
          <div className="flex gap-4 items-center">
            <Link href="/remedies/find" className="text-xs font-bold text-white bg-[#0A2133] hover:bg-[#0A2133]/90 px-3.5 py-2 rounded transition-all">
              Masala Remedies
            </Link>
            <Link href="/remedies" className="text-xs font-semibold text-black hover:text-[#9A7026] hidden md:block">
              Graha Remedies
            </Link>
          </div>
        </header>
      </div>

      {/* Main */}
      <div className="flex-grow w-full max-w-2xl mx-auto px-4 py-8 md:py-12">
        <div className="bg-white border border-black/10 rounded-2xl p-6 md:p-10 shadow-md space-y-8">

          {/* Title */}
          <div className="text-center space-y-2">
            <p className="text-[#9A7026] font-bold uppercase tracking-wider text-xs font-mono">Vedic Geometry Talismans</p>
            <h2 className="text-2xl md:text-3xl font-bold font-serif text-black">Personalized Yantra</h2>
            <p className="text-xs text-black/60 max-w-md mx-auto">
              Generate Vedic yantras based on your life goals — or get precise recommendations from your Kundli birth chart.
            </p>
          </div>

          {/* Mode Toggle — only show on Step 1 of each flow */}
          {(goalStep === 1 || kundliStep === 1) && (
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => { setAppMode("goal"); resetGoal(); }}
                className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all text-left space-y-0.5 ${
                  appMode === "goal"
                    ? "bg-[#0A2133] text-white border-[#0A2133]"
                    : "bg-white border-black/10 text-black hover:border-[#9A7026]/40"
                }`}
              >
                <div className="text-base">🎯</div>
                <div>By Goal / Concern</div>
                <div className={`text-[10px] font-normal ${appMode === "goal" ? "text-white/70" : "text-black/40"}`}>
                  Select your life area and concern
                </div>
              </button>
              <button
                onClick={() => { setAppMode("kundli"); resetKundli(); }}
                className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all text-left space-y-0.5 ${
                  appMode === "kundli"
                    ? "bg-[#9A7026] text-white border-[#9A7026]"
                    : "bg-white border-black/10 text-black hover:border-[#9A7026]/40"
                }`}
              >
                <div className="text-base">🔭</div>
                <div>By Kundli (Birth Chart)</div>
                <div className={`text-[10px] font-normal ${appMode === "kundli" ? "text-white/70" : "text-black/40"}`}>
                  Enter birth time & place for exact chart
                </div>
              </button>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              GOAL BASED FLOW
          ══════════════════════════════════════════════════════════════════ */}
          {appMode === "goal" && (
            <>
              {/* Goal Step 1: Details */}
              {goalStep === 1 && (
                <form onSubmit={handleGoalStep1} className="space-y-6">
                  <h3 className="text-base font-semibold font-serif text-black pb-1 border-b border-black/10">Step 1: Your Details</h3>

                  <div className="space-y-1.5">
                    <label className="block text-xs uppercase font-bold text-black/60 tracking-wider">Your Name (Required)</label>
                    <input
                      type="text" required placeholder="e.g. Rahul Sharma"
                      value={name} onChange={e => setName(e.target.value)}
                      className="w-full bg-[#EEEBE6]/40 border border-black/10 rounded-lg px-4 py-3 text-black focus:outline-none focus:border-[#9A7026] transition-all font-medium placeholder-black/30 text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs uppercase font-bold text-black/60 tracking-wider">Planetary Alignment (Optional)</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["none", "dob", "manual"] as const).map((mode) => (
                        <button key={mode} type="button" onClick={() => setPlanetSelectMode(mode)}
                          className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all ${
                            planetSelectMode === mode
                              ? "bg-[#0A2133] text-white border-[#0A2133]"
                              : "bg-white border-black/10 text-black hover:border-[#9A7026]/40"
                          }`}
                        >
                          {mode === "none" ? "No Focus" : mode === "dob" ? "DOB Check" : "Pick Planet"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {planetSelectMode === "dob" && (
                    <div className="p-4 bg-[#EEEBE6]/20 border border-black/10 rounded-xl space-y-1.5">
                      <label className="block text-xs uppercase font-bold text-black/60 tracking-wider">Date of Birth</label>
                      <input type="date" required value={dob} onChange={e => setDob(e.target.value)}
                        className="w-full bg-white border border-black/10 rounded-lg px-4 py-2.5 text-black focus:outline-none focus:border-[#9A7026] text-sm font-medium"
                      />
                      <p className="text-[10px] text-black/40">Calculates missing numbers in your numeroscope grid.</p>
                    </div>
                  )}

                  {planetSelectMode === "manual" && (
                    <div className="p-4 bg-[#EEEBE6]/20 border border-black/10 rounded-xl space-y-2">
                      <label className="block text-xs uppercase font-bold text-black/60 tracking-wider">Select Planet Focus</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[180px] overflow-y-auto pr-1">
                        {planetList.map((p) => (
                          <button key={p.id} type="button" onClick={() => setSelectedPlanet(p.id)}
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
                    </div>
                  )}

                  <button type="submit" className="w-full py-3.5 bg-[#0A2133] hover:bg-[#0A2133]/90 active:scale-[0.99] font-bold text-sm text-white rounded-lg transition-all">
                    Continue to Goals →
                  </button>
                </form>
              )}

              {/* Goal Step 2: Category */}
              {goalStep === 2 && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center pb-1 border-b border-black/10">
                    <h3 className="text-base font-semibold font-serif text-black">Step 2: Area of Life</h3>
                    <button onClick={() => setGoalStep(1)} className="text-xs text-[#9A7026] hover:underline font-bold">← Back</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {categories.map(cat => (
                      <button key={cat.id} onClick={() => handleCategorySelect(cat.id)}
                        className="text-left bg-[#EEEBE6]/20 hover:bg-[#EEEBE6]/50 border border-black/10 hover:border-[#9A7026]/40 rounded-xl p-4 transition-all duration-200 active:scale-[0.98] group space-y-1"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{cat.icon}</span>
                          <p className="font-bold text-black group-hover:text-[#9A7026] font-serif text-sm transition-colors">{cat.title}</p>
                        </div>
                        <p className="text-xs text-black/60 leading-relaxed pl-7">{cat.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Goal Step 3: Issue */}
              {goalStep === 3 && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center pb-1 border-b border-black/10">
                    <h3 className="text-base font-semibold font-serif text-black">Step 3: Specific Concern</h3>
                    <button onClick={() => setGoalStep(2)} className="text-xs text-[#9A7026] hover:underline font-bold">← Back</button>
                  </div>
                  <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                    {issueList[category]?.map(issue => (
                      <button key={issue.id} onClick={() => handleIssueSelect(issue.id, issue.recommendedId)}
                        className="w-full text-left bg-[#EEEBE6]/20 hover:bg-[#EEEBE6]/50 border border-black/10 hover:border-[#9A7026]/40 rounded-xl p-4 text-xs font-semibold text-black hover:text-[#9A7026] transition-all leading-relaxed active:scale-[0.99] flex items-center justify-between gap-2"
                      >
                        <span>{issue.label}</span>
                        <span className="text-[#9A7026] text-sm shrink-0">→</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Goal Step 4: Yantra Result */}
              {goalStep === 4 && currentYantra && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center pb-2 border-b border-black/10">
                    <h3 className="text-base font-bold font-serif text-[#9A7026]">Your Recommended Talisman</h3>
                    <button onClick={resetGoal} className="text-xs text-red-600 hover:underline font-bold">Start Over ←</button>
                  </div>

                  {/* DOB Numerology */}
                  {planetSelectMode === "dob" && missingNumbers.length > 0 && (
                    <div className="bg-[#EEEBE6]/30 border border-black/10 p-4 rounded-xl space-y-3">
                      <p className="text-xs font-bold text-[#9A7026] uppercase tracking-wider">🪐 Numeroscope Insights</p>
                      <p className="text-[11px] text-black/70">Missing grid numbers: <span className="font-bold text-[#9A7026]">{missingNumbers.join(", ")}</span></p>
                      <div className="flex flex-wrap gap-2">
                        <button onClick={() => setCurrentYantra(primaryYantra)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${currentYantra?.id === primaryYantra?.id ? "bg-[#0A2133] text-white border-[#0A2133]" : "bg-white text-black border-black/10 hover:border-[#9A7026]"}`}
                        >
                          Goal Yantra (Recommended)
                        </button>
                        {missingNumbers.map(num => {
                          const m = numerologyMap[num];
                          if (!m) return null;
                          const y = yantras.find(y => y.id === m.yantraId);
                          if (!y) return null;
                          return (
                            <button key={num} onClick={() => setCurrentYantra(y)}
                              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${currentYantra?.id === y.id ? "bg-[#0A2133] text-white border-[#0A2133]" : "bg-white text-black border-black/10 hover:border-[#9A7026]"}`}
                            >
                              Missing {num}: {y.name.split(" ")[0]}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Manual Planet Switcher */}
                  {planetSelectMode === "manual" && selectedPlanet && (() => {
                    const linked = yantras.find(y => y.id === selectedPlanet);
                    return (
                      <div className="bg-[#EEEBE6]/30 border border-black/10 p-4 rounded-xl space-y-3">
                        <p className="text-xs font-bold text-[#9A7026] uppercase tracking-wider">🪐 Planet Focus Toggle</p>
                        <div className="flex flex-wrap gap-2">
                          <button onClick={() => setCurrentYantra(primaryYantra)}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${currentYantra?.id === primaryYantra?.id ? "bg-[#0A2133] text-white border-[#0A2133]" : "bg-white text-black border-black/10 hover:border-[#9A7026]"}`}
                          >
                            Goal Yantra
                          </button>
                          {linked && (
                            <button onClick={() => setCurrentYantra(linked)}
                              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${currentYantra?.id === linked.id ? "bg-[#0A2133] text-white border-[#0A2133]" : "bg-white text-black border-black/10 hover:border-[#9A7026]"}`}
                            >
                              Planet: {linked.name.split(" ")[0]}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Custom input for dynamic yantras */}
                  {["travel-arch", "business-grid", "court-yantra", "house-protection"].includes(currentYantra.layout.type) && (
                    <div className="bg-[#EEEBE6]/20 border border-black/10 p-4 rounded-xl space-y-3">
                      <p className="text-[11px] font-bold text-[#9A7026] uppercase tracking-wider">Customize Talisman Content</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {currentYantra.layout.type === "travel-arch" && (
                          <div className="space-y-1">
                            <label className="text-[10px] text-black/50 font-bold uppercase">Destination Name</label>
                            <input type="text" placeholder="e.g. Kashi" value={destination} onChange={e => setDestination(e.target.value)}
                              className="w-full bg-white border border-black/10 rounded-lg px-3 py-2 text-black text-xs focus:outline-none focus:border-[#9A7026]" />
                          </div>
                        )}
                        {currentYantra.layout.type === "business-grid" && (
                          <div className="space-y-1">
                            <label className="text-[10px] text-black/50 font-bold uppercase">Business Name</label>
                            <input type="text" placeholder="e.g. Sharma Traders" value={businessName} onChange={e => setBusinessName(e.target.value)}
                              className="w-full bg-white border border-black/10 rounded-lg px-3 py-2 text-black text-xs focus:outline-none focus:border-[#9A7026]" />
                          </div>
                        )}
                        <div className="space-y-1">
                          <label className="text-[10px] text-black/50 font-bold uppercase">Name on Talisman</label>
                          <input type="text" placeholder="e.g. Rahul Sharma" value={name} onChange={e => setName(e.target.value)}
                            className="w-full bg-white border border-black/10 rounded-lg px-3 py-2 text-black text-xs focus:outline-none focus:border-[#9A7026]" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Yantra render */}
                  <div className="border border-black/10 rounded-xl p-4 bg-white flex flex-col items-center">
                    <YantraRenderer yantra={currentYantra} userName={name} destinationName={destination} businessName={businessName} />
                  </div>

                  {/* Yantra details */}
                  <div className="bg-[#EEEBE6]/20 border border-black/10 rounded-xl p-5 space-y-4">
                    <div>
                      <h4 className="font-bold text-black font-serif">{currentYantra.name}</h4>
                      <p className="text-xs text-black/70 mt-1 leading-relaxed">{currentYantra.description}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-black/50 tracking-wider">Benefits:</p>
                      <ul className="list-disc pl-4 text-xs text-black/80 space-y-0.5 mt-1">
                        {currentYantra.benefits.map((b, i) => <li key={i}>{b}</li>)}
                      </ul>
                    </div>
                    {currentYantra.mantras.map((m, i) => (
                      <p key={i} className="text-xs italic font-serif text-black text-center bg-white px-3 py-2 rounded border border-black/5">&quot;{m}&quot;</p>
                    ))}
                    <div className="text-xs text-black/75 space-y-0.5 pt-1 border-t border-black/5">
                      <p><span className="font-bold">Day:</span> {currentYantra.preparation.day}</p>
                      <p><span className="font-bold">Time:</span> {currentYantra.preparation.time}</p>
                      <p className="leading-relaxed"><span className="font-bold">Materials:</span> {currentYantra.preparation.materials}</p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              KUNDLI FLOW
          ══════════════════════════════════════════════════════════════════ */}
          {appMode === "kundli" && (
            <>
              {/* Kundli Step 1: Birth Details Form */}
              {kundliStep === 1 && (
                <form onSubmit={handleKundliSubmit} className="space-y-6">
                  <div className="pb-1 border-b border-black/10 space-y-1">
                    <h3 className="text-base font-semibold font-serif text-black">Enter Your Birth Details</h3>
                    <p className="text-[11px] text-black/50">Your Kundli (birth chart) will be calculated using Vedic Jyotish — Lahiri Ayanamsha, Whole Sign houses.</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs uppercase font-bold text-black/60 tracking-wider">Your Name</label>
                    <input type="text" placeholder="e.g. Rahul Sharma" value={name} onChange={e => setName(e.target.value)}
                      className="w-full bg-[#EEEBE6]/40 border border-black/10 rounded-lg px-4 py-3 text-black focus:outline-none focus:border-[#9A7026] text-sm font-medium placeholder-black/30"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs uppercase font-bold text-black/60 tracking-wider">Date of Birth *</label>
                      <input type="date" required value={birthDob} onChange={e => setBirthDob(e.target.value)}
                        className="w-full bg-[#EEEBE6]/40 border border-black/10 rounded-lg px-3 py-3 text-black focus:outline-none focus:border-[#9A7026] text-sm font-medium"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs uppercase font-bold text-black/60 tracking-wider">Time of Birth *</label>
                      <input type="time" required value={birthTime} onChange={e => setBirthTime(e.target.value)}
                        className="w-full bg-[#EEEBE6]/40 border border-black/10 rounded-lg px-3 py-3 text-black focus:outline-none focus:border-[#9A7026] text-sm font-medium"
                      />
                    </div>
                  </div>
                  <p className="text-[10px] text-black/40 -mt-3">Birth time is essential to calculate the correct Lagna (Ascendant / rising sign).</p>

                  <div className="space-y-1.5">
                    <label className="block text-xs uppercase font-bold text-black/60 tracking-wider">Place of Birth *</label>
                    <input type="text" required placeholder="e.g. Mumbai, India" value={birthCity} onChange={e => setBirthCity(e.target.value)}
                      className="w-full bg-[#EEEBE6]/40 border border-black/10 rounded-lg px-4 py-3 text-black focus:outline-none focus:border-[#9A7026] text-sm font-medium placeholder-black/30"
                    />
                    <p className="text-[10px] text-black/40">City name is geocoded via OpenStreetMap to get latitude & longitude for Lagna calculation.</p>
                  </div>

                  {geocodeError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-xs text-red-700 font-medium">
                      ⚠️ {geocodeError}
                    </div>
                  )}

                  <button type="submit" disabled={kundliLoading}
                    className="w-full py-3.5 bg-[#9A7026] hover:bg-[#9A7026]/90 disabled:opacity-60 active:scale-[0.99] font-bold text-sm text-white rounded-lg transition-all flex items-center justify-center gap-2"
                  >
                    {kundliLoading ? (
                      <>
                        <span className="inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Calculating Kundli...
                      </>
                    ) : (
                      "🔭 Calculate My Kundli & Recommend Yantras"
                    )}
                  </button>
                </form>
              )}

              {/* Kundli Step 2: Results */}
              {kundliStep === 2 && kundliResult && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center pb-2 border-b border-black/10">
                    <div>
                      <span className="text-[10px] font-bold text-[#9A7026] uppercase tracking-wider">Kundli Analysis</span>
                      <h3 className="text-base font-bold text-black font-serif">{name || "Your"} Birth Chart</h3>
                    </div>
                    <button onClick={resetKundli} className="text-xs text-red-600 hover:underline font-bold">Start Over ←</button>
                  </div>

                  {/* Lagna & Birth Info Card */}
                  <div className="bg-[#0A2133] text-white rounded-xl p-5 space-y-4">
                    <div className="flex flex-wrap gap-4 justify-between items-start">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-white/60 font-bold">Lagna (Ascendant)</p>
                        <p className="text-2xl font-bold font-serif mt-0.5">{kundliResult.lagnaSignName} ♊</p>
                        <p className="text-[11px] text-white/60 mt-1">{kundliResult.birthPlace}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-wider text-white/60 font-bold">Ayanamsha</p>
                        <p className="text-sm font-bold text-[#FFD700]">{kundliResult.ayanamsha.toFixed(4)}°</p>
                        <p className="text-[10px] text-white/50">Lahiri</p>
                      </div>
                    </div>

                    {/* Planet grid */}
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-white/60 font-bold mb-2">Navagraha Positions</p>
                      <div className="grid grid-cols-3 gap-1.5">
                        {kundliResult.planets.map(p => (
                          <div key={p.planet}
                            className={`px-2 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 ${
                              p.weakReasons.length > 0 ? "bg-red-600/30 border border-red-400/40" : "bg-white/10"
                            }`}
                          >
                            <span>{p.symbol}</span>
                            <div>
                              <div>{p.name.split(" ")[0]}</div>
                              <div className="text-[9px] font-normal opacity-75">H{p.house} · {p.signName.slice(0, 3)}</div>
                            </div>
                            {p.weakReasons.length > 0 && <span className="ml-auto text-red-300">⚠</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Weak Planets Summary */}
                  {kundliResult.weakPlanets.length === 0 ? (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center space-y-2">
                      <p className="text-2xl">✅</p>
                      <p className="text-sm font-bold text-green-800">No severely afflicted planets found in your chart.</p>
                      <p className="text-xs text-green-700">Your planetary positions appear relatively balanced. You may still use the Goal-based flow to select specific intention yantras.</p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <p className="text-xs font-bold uppercase text-black/50 tracking-wider">
                          {kundliResult.weakPlanets.length} Afflicted Planet{kundliResult.weakPlanets.length > 1 ? "s" : ""} Detected
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {kundliRecs.map(rec => (
                            <button key={rec.planet} onClick={() => setKundliActiveRec(rec.planet)}
                              className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                                kundliActiveRec === rec.planet
                                  ? "bg-[#0A2133] text-white border-[#0A2133]"
                                  : rec.severity === "high"
                                    ? "bg-red-50 border-red-200 text-red-800 hover:bg-red-100"
                                    : "bg-white border-black/10 text-black hover:border-[#9A7026]"
                              }`}
                            >
                              <span>{rec.symbol}</span>
                              <span>{rec.planetName.split(" ")[0]}</span>
                              {rec.severity === "high" && kundliActiveRec !== rec.planet && (
                                <span className="text-red-500 text-[10px]">⚠</span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Active recommendation reason */}
                      {kundliRecs.find(r => r.planet === kundliActiveRec) && (
                        <div className={`border rounded-xl p-4 text-xs space-y-1 ${
                          kundliRecs.find(r => r.planet === kundliActiveRec)?.severity === "high"
                            ? "bg-red-50 border-red-200"
                            : "bg-[#EEEBE6]/30 border-black/10"
                        }`}>
                          <p className="font-bold text-black">
                            {kundliRecs.find(r => r.planet === kundliActiveRec)?.symbol}{" "}
                            Why {kundliRecs.find(r => r.planet === kundliActiveRec)?.planetName}?
                          </p>
                          <p className="text-black/70 leading-relaxed">
                            {kundliRecs.find(r => r.planet === kundliActiveRec)?.reason}
                          </p>
                          <p className="text-[#9A7026] font-semibold">
                            Remedy: Energize the <strong>{activeKundliYantra?.name}</strong> to pacify and strengthen this planet.
                          </p>
                        </div>
                      )}

                      {/* Yantra Render */}
                      {activeKundliYantra && (
                        <>
                          <div className="border border-black/10 rounded-xl p-4 bg-white flex flex-col items-center">
                            <YantraRenderer yantra={activeKundliYantra} userName={name} destinationName="" businessName="" />
                          </div>

                          <div className="bg-[#EEEBE6]/20 border border-black/10 rounded-xl p-5 space-y-4">
                            <div>
                              <h4 className="font-bold text-black font-serif">{activeKundliYantra.name}</h4>
                              <p className="text-xs text-black/70 mt-1 leading-relaxed">{activeKundliYantra.description}</p>
                            </div>
                            <div>
                              <p className="text-[10px] uppercase font-bold text-black/50 tracking-wider">Benefits:</p>
                              <ul className="list-disc pl-4 text-xs text-black/80 space-y-0.5 mt-1">
                                {activeKundliYantra.benefits.map((b, i) => <li key={i}>{b}</li>)}
                              </ul>
                            </div>
                            {activeKundliYantra.mantras.map((m, i) => (
                              <p key={i} className="text-xs italic font-serif text-black text-center bg-white px-3 py-2 rounded border border-black/5">&quot;{m}&quot;</p>
                            ))}
                            <div className="text-xs text-black/75 space-y-0.5 pt-1 border-t border-black/5">
                              <p><span className="font-bold">Day:</span> {activeKundliYantra.preparation.day}</p>
                              <p><span className="font-bold">Time:</span> {activeKundliYantra.preparation.time}</p>
                              <p className="leading-relaxed"><span className="font-bold">Materials:</span> {activeKundliYantra.preparation.materials}</p>
                            </div>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Disclaimer */}
      <footer className="w-full text-center max-w-4xl mx-auto px-4 mt-auto">
        <p className="text-[10px] text-black/40">
          Disclaimer: AstroLearn yantras are traditional Vedic practices for educational purposes. Planetary positions are approximate. Not medical or financial advice.
        </p>
      </footer>
    </div>
  );
}

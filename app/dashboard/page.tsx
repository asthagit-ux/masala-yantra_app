"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useLanguage } from "../../lib/LanguageContext";
import { calculateKundli, geocodeCity, type KundliResult } from "../../lib/kundli";

// ─── Custom Line-Art Icons (1.5px - 2px stroke) ─────────────────────────────
const StarIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442a.562.562 0 0 1 .31.967l-4.132 3.514a.562.562 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.98 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.132-3.514a.562.562 0 0 1 .31-.967l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
  </svg>
);

const ChartIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9 3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9V4.5M15 9h4.5M15 9l5.25-5.25M15 15v4.5M15 15h4.5M15 15l5.25 5.25" />
    <circle cx="12" cy="12" r="6" />
  </svg>
);

const CompassIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 9.152 9 15.042M9.152 9 15 15.042M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Z" />
  </svg>
);

const HeartIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
  </svg>
);

const SettingsIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.43l-1.003.828c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.43l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

// ─── Animated Constellation / Starfield background component ───────────────
const CosmicBackground = ({ isDarkMode = true }: { isDarkMode: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Star properties
    const stars: Array<{ x: number; y: number; size: number; speed: number; opacity: number; dir: number }> = [];
    const numStars = 65;

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.5 + 0.5,
        speed: Math.random() * 0.05 + 0.015,
        opacity: Math.random() * 0.7 + 0.1,
        dir: Math.random() > 0.5 ? 1 : -1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Color scheme adjustments
      const starColor = isDarkMode ? "255, 255, 255" : "108, 92, 231";
      const lineColor = isDarkMode ? "rgba(255, 215, 0, 0.04)" : "rgba(108, 92, 231, 0.06)";

      // Draw connections (constellation lines)
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 0.5;
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const dx = stars[i].x - stars[j].x;
          const dy = stars[i].y - stars[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(stars[i].x, stars[i].y);
            ctx.lineTo(stars[j].x, stars[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw stars
      stars.forEach((star) => {
        star.opacity += star.speed * star.dir;
        if (star.opacity > 0.85 || star.opacity < 0.1) {
          star.dir *= -1;
        }

        ctx.fillStyle = `rgba(${starColor}, ${star.opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        // Slow float
        star.y -= star.speed * 8;
        if (star.y < 0) star.y = height;
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDarkMode]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />;
};

// ─── Dummy / Mock Data for Horoscope feed & Compatibility ────────────────────
const horoscopesData = [
  {
    id: "h-1",
    tag: "love",
    title: "Vulnerability as Strength",
    content: "Venus enters your communication sector today. Sharing an unpolished truth with a close one will dissolve a wall that has stood for months.",
    color: "#EC4899",
    bg: "rgba(236,72,153,0.1)",
  },
  {
    id: "h-2",
    tag: "career",
    title: "Mercury Trines Saturn",
    content: "Excellent day for contract negotiations, structural edits, or layout designs. Your eyes spot micro-details others miss.",
    color: "#6C5CE7",
    bg: "rgba(108,92,231,0.1)",
  },
  {
    id: "h-3",
    tag: "energy",
    title: "The Waning Gibbous Focus",
    content: "As the Moon sheds light, reflect on what systems no longer serve your physical wellbeing. Declutter your workspace today.",
    color: "#FFD369",
    bg: "rgba(255,211,105,0.1)",
  },
];

export default function AstroDashboard() {
  const { language, t } = useLanguage();

  // Navigation states
  const [activeTab, setActiveTab] = useState<"dashboard" | "chart" | "insights" | "match" | "profile">("dashboard");
  const [onboarded, setOnboarded] = useState(false);

  // Theme support: base deep midnight tones by default
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Form states
  const [userName, setUserName] = useState("");
  const [dob, setDob] = useState("");
  const [time, setTime] = useState("");
  const [city, setCity] = useState("");
  const [tz, setTz] = useState(5.5);

  // Suggestions state
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number; displayName: string } | null>(null);

  // Kundli calculations state
  const [calculationLoading, setCalculationLoading] = useState(false);
  const [kundliResult, setKundliResult] = useState<KundliResult | null>(null);

  // Compatibility states
  const [partner1Name, setPartner1Name] = useState("");
  const [partner2Name, setPartner2Name] = useState("");
  const [partner1Sign, setPartner1Sign] = useState("Aries");
  const [partner2Sign, setPartner2Sign] = useState("Libra");
  const [matchScore, setMatchScore] = useState<number | null>(null);

  // Insights filter states
  const [selectedFilter, setSelectedFilter] = useState<"all" | "love" | "career" | "energy">("all");

  // Onboarding geocoding suggestions autocomplete
  const fetchSuggestions = async (val: string) => {
    if (val.trim().length < 3) {
      setSuggestions([]);
      return;
    }
    setSearchLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(val)}&countrycodes=in&limit=5`
      );
      const data = await res.json();
      const items = data.map((item: any) => ({
        displayName: item.display_name,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
      }));
      setSuggestions(items);
    } catch {
      setSuggestions([]);
    }
    setSearchLoading(false);
  };

  const handleCityChange = (val: string) => {
    setCity(val);
    const timer = setTimeout(() => fetchSuggestions(val), 400);
    return () => clearTimeout(timer);
  };

  const selectSuggestion = (s: any) => {
    setCity(s.displayName.split(",")[0]);
    setSelectedCoords(s);
    setShowSuggestions(false);
  };

  // Submit onboarding birth details
  const handleOnboard = async (e: React.FormEvent) => {
    e.preventDefault();
    setCalculationLoading(true);

    let location = selectedCoords;
    if (!location) {
      location = await geocodeCity(city);
    }

    if (!location) {
      location = { lat: 26.2183, lng: 78.1828, displayName: "Gwalior, Madhya Pradesh, India" }; // Default
    }

    try {
      // Run math calculations using correct Vedic astronomy-engine formulas
      const result = calculateKundli(dob, time, location.lat, location.lng, location.displayName, tz);
      setKundliResult(result);
      setOnboarded(true);
    } catch (err) {
      console.error(err);
    }
    setCalculationLoading(false);
  };

  // Match calculations
  const calculateMatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partner1Name || !partner2Name) return;
    // Premium score calculation based on string hash to make it persistent
    const sum1 = partner1Name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const sum2 = partner2Name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const score = 60 + ((sum1 + sum2) % 36); // Yields score between 60% and 95%
    setMatchScore(score);
  };

  return (
    <div className={`min-h-screen relative font-sans transition-colors duration-500 overflow-x-hidden ${
      isDarkMode 
        ? "bg-[#0B0B1E] text-white" 
        : "bg-[#FAF9F6] text-[#1E1B4B]"
    }`}>
      
      {/* Background Starfield */}
      <CosmicBackground isDarkMode={isDarkMode} />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-lg mx-auto min-h-screen flex flex-col justify-between pb-28 px-4 pt-6">

        {/* ─── Top Header Navigation ─────────────────────────────────────────── */}
        <header className="flex justify-between items-center w-full pb-4 border-b border-white/5 relative z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#6C5CE7] to-[#EC4899] flex items-center justify-center text-xs font-bold text-white shadow-[0_0_12px_rgba(108,92,231,0.4)]">
              ✨
            </div>
            <div>
              <h1 className="font-serif text-lg font-bold tracking-wide">
                AstroAura
              </h1>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40">
                Premium Celestial Space
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:scale-105 active:scale-95 transition-all text-xs font-bold"
          >
            {isDarkMode ? "☀️" : "🌙"}
          </button>
        </header>

        {/* ─── Screen: Onboarding Form (If not onboarded yet) ────────────────── */}
        {!onboarded && (
          <main className="flex-grow flex flex-col justify-center py-6">
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden">
              
              {/* Star badge decoration */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-tr from-[#6C5CE7]/20 to-[#EC4899]/20 rounded-full blur-2xl pointer-events-none" />
              
              <div className="text-center space-y-1.5">
                <span className="text-[9px] font-black uppercase tracking-[0.25em] text-[#F5C453]">
                  ✦ BEGIN YOUR JOURNEY ✦
                </span>
                <h2 className="font-serif text-2xl font-bold text-white leading-tight">
                  Chart Your Placements
                </h2>
                <p className="text-xs text-white/50 max-w-xs mx-auto leading-relaxed">
                  Enter your precise coordinates to connect with the astronomical alignments.
                </p>
              </div>

              {calculationLoading ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-4">
                  <div className="relative w-20 h-20">
                    {/* Constellation animated loader dots */}
                    <div className="absolute inset-0 border-2 border-[#F5C453]/20 rounded-full animate-pulse" />
                    <span className="absolute left-0 top-1/2 w-2 h-2 bg-[#FFD369] rounded-full animate-ping" />
                    <span className="absolute right-0 top-1/2 w-2 h-2 bg-[#6C5CE7] rounded-full animate-ping" />
                    <span className="absolute top-0 left-1/2 w-2 h-2 bg-[#EC4899] rounded-full animate-ping delay-100" />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#FFD369] animate-pulse">
                    Aligning Stars...
                  </p>
                </div>
              ) : (
                <form onSubmit={handleOnboard} className="space-y-4 text-left">
                  
                  {/* Name field */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-black tracking-widest uppercase text-white/60">Your Name</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. Astha Gupta" 
                      value={userName} 
                      onChange={e => setUserName(e.target.value)}
                      className="w-full bg-[#1A1A32]/40 border border-white/10 rounded-xl px-4 py-3 text-white text-xs placeholder-white/30 focus:outline-none focus:border-[#6C5CE7]" 
                    />
                  </div>

                  {/* DOB / TOB Fields */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black tracking-widest uppercase text-white/60">Birth Date</label>
                      <input 
                        type="date" 
                        required 
                        value={dob} 
                        onChange={e => setDob(e.target.value)}
                        className="w-full bg-[#1A1A32]/40 border border-white/10 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-[#6C5CE7]" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black tracking-widest uppercase text-white/60">Birth Time</label>
                      <input 
                        type="time" 
                        required 
                        value={time} 
                        onChange={e => setTime(e.target.value)}
                        className="w-full bg-[#1A1A32]/40 border border-white/10 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-[#6C5CE7]" 
                      />
                    </div>
                  </div>

                  {/* Birth place autocomplete search */}
                  <div className="space-y-1 relative">
                    <label className="text-[9px] font-black tracking-widest uppercase text-white/60">Birth City</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        required 
                        placeholder="Search city, town..." 
                        value={city} 
                        onChange={e => handleCityChange(e.target.value)}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        className="w-full bg-[#1A1A32]/40 border border-white/10 rounded-xl px-4 py-3 text-white text-xs placeholder-white/30 focus:outline-none focus:border-[#6C5CE7]" 
                      />
                      {searchLoading && (
                        <span className="absolute right-3.5 top-3.5 block w-4 h-4 border-2 border-[#FFD369] border-t-transparent rounded-full animate-spin" />
                      )}
                    </div>

                    {showSuggestions && suggestions.length > 0 && (
                      <div className="absolute left-0 right-0 top-full mt-1.5 bg-[#0F0F28] border border-white/10 rounded-xl shadow-2xl z-50 max-h-[160px] overflow-y-auto divide-y divide-white/5">
                        {suggestions.map((s, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onMouseDown={() => selectSuggestion(s)}
                            className="w-full text-left px-4 py-2.5 hover:bg-[#6C5CE7]/10 text-xs text-white transition-all flex items-center gap-1.5"
                          >
                            <span>📍</span>
                            <span>{s.displayName}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Timezone picker */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-black tracking-widest uppercase text-white/60">Timezone Offset</label>
                    <select 
                      value={tz} 
                      onChange={e => setTz(parseFloat(e.target.value))}
                      className="w-full bg-[#1A1A32]/40 border border-white/10 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-[#6C5CE7]"
                    >
                      <option value={5.5}>IST - India Standard Time (UTC+5:30)</option>
                      <option value={0}>GMT - Greenwich Mean Time (UTC+0)</option>
                      <option value={-5}>EST - Eastern Standard Time (UTC-5)</option>
                      <option value={-8}>PST - Pacific Standard Time (UTC-8)</option>
                      <option value={1}>CET - Central European Time (UTC+1)</option>
                      <option value={8}>SGT - Singapore Time (UTC+8)</option>
                    </select>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-[#6C5CE7] via-[#A855F7] to-[#EC4899] hover:opacity-95 active:scale-[0.98] font-bold text-xs tracking-wider uppercase text-white rounded-xl transition-all shadow-[0_4px_16px_rgba(108,92,231,0.25)] flex items-center justify-center gap-1"
                  >
                    <span>Compute Birth Chart</span>
                    <span>→</span>
                  </button>

                </form>
              )}
            </div>
          </main>
        )}

        {/* ─── Onboarded Dashboard Content ──────────────────────────────────── */}
        {onboarded && kundliResult && (
          <main className="flex-grow py-4 relative z-10 space-y-6">

            {/* TAB 1: DASHBOARD */}
            {activeTab === "dashboard" && (
              <div className="space-y-5 animate-[fadeIn_0.3s_ease-out]">
                
                {/* User Greeting & Moon Phase Widget */}
                <div className="flex gap-4 items-center backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-5 shadow-lg">
                  {/* Moon phase circular progress widget */}
                  <div className="relative w-14 h-14 shrink-0 flex items-center justify-center rounded-full bg-black/40 border border-[#FFD369]/20 shadow-[0_0_12px_rgba(255,211,105,0.1)]">
                    <div className="absolute w-10 h-10 rounded-full bg-gradient-to-tr from-[#FFD369] to-[#F5C453] opacity-80" />
                    {/* Shadow overlay representing current phase (Waning Gibbous mock) */}
                    <div className="absolute w-10 h-10 rounded-full bg-[#0B0B1E] translate-x-3.5" />
                    <span className="text-[10px] font-black tracking-widest text-[#FFD369] relative z-10">
                      78%
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      Welcome back, {userName.split(" ")[0]}
                    </h3>
                    <p className="text-xs text-white/50 mt-0.5 leading-relaxed">
                      Moon is in **Scorpio** (Anuradha). It is a Waning Gibbous phase. Good time for introspection and structural cleanups.
                    </p>
                  </div>
                </div>

                {/* Daily Horoscope Card */}
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4 shadow-lg text-left relative overflow-hidden">
                  <div className="absolute -right-8 -top-8 w-28 h-28 bg-[#6C5CE7]/10 rounded-full blur-2xl" />
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] px-2.5 py-0.5 rounded-full bg-[#6C5CE7]/20 text-[#B8B5C9] border border-[#6C5CE7]/30">
                      ✦ DAILY HOROSCOPE
                    </span>
                    <span className="text-[10px] text-white/40 font-bold">
                      {new Date().toLocaleDateString(language, { month: "short", day: "numeric" })}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="font-serif text-lg font-bold text-white">
                      Celestial Alignments for your Lagna ({kundliResult.lagnaSignName})
                    </h4>
                    <p className="text-xs text-white/70 leading-relaxed">
                      With your Lagna ruler Venus placed favorably, communications will yield productive agreements today. Be honest with family relations, a key block in your communication quadrant is beginning to resolve. Focus on writing and detail editing.
                    </p>
                  </div>

                  {/* Horoscope tags */}
                  <div className="flex gap-1.5">
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-white/5 border border-white/5 text-pink-400">#Love</span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-white/5 border border-white/5 text-purple-400">#Career</span>
                  </div>
                </div>

                {/* Quick Navigation Panel */}
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setActiveTab("chart")}
                    className="backdrop-blur-xl bg-white/5 border border-white/10 hover:border-[#FFD369]/30 rounded-2xl p-4 text-left space-y-2 hover:-translate-y-0.5 transition-all group"
                  >
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FFD369] to-[#F5C453] text-black flex items-center justify-center text-sm font-bold shadow-md">
                      🔭
                    </div>
                    <h4 className="text-xs font-bold text-white group-hover:text-[#FFD369]">Natal Chart</h4>
                    <p className="text-[10px] text-white/40">Zodiac positions and full planetary tables.</p>
                  </button>

                  <button 
                    onClick={() => setActiveTab("match")}
                    className="backdrop-blur-xl bg-white/5 border border-white/10 hover:border-pink-500/30 rounded-2xl p-4 text-left space-y-2 hover:-translate-y-0.5 transition-all group"
                  >
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#EC4899] to-purple-600 text-white flex items-center justify-center text-sm font-bold shadow-md">
                      ❤️
                    </div>
                    <h4 className="text-xs font-bold text-white group-hover:text-pink-400">Compatibility</h4>
                    <p className="text-[10px] text-white/40">Vedic chart compatibility matching score.</p>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: BIRTH CHART (NATAL CHART) */}
            {activeTab === "chart" && (
              <div className="space-y-6 animate-[fadeIn_0.3s_ease-out] text-left">
                
                {/* Header info */}
                <div>
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#FFD369]">
                    ✦ SACRED GEOMETRY
                  </span>
                  <h3 className="font-serif text-xl font-bold text-white">
                    Your Natal Birth Chart
                  </h3>
                </div>

                {/* Western style circular SVG Zodiac Wheel */}
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col items-center justify-center shadow-lg">
                  <div className="relative w-full max-w-[280px]">
                    
                    {/* SVG Wheel drawing */}
                    <svg viewBox="0 0 300 300" className="w-full h-auto drop-shadow-[0_0_16px_rgba(108,92,231,0.15)]">
                      {/* Outer Ring */}
                      <circle cx="150" cy="150" r="130" fill="none" stroke="#FFD369" strokeWidth="2.5" />
                      <circle cx="150" cy="150" r="105" fill="none" stroke="#FFD369" strokeWidth="1" strokeDasharray="3,3" />
                      <circle cx="150" cy="150" r="85" fill="none" stroke="#FFD369" strokeWidth="1" />
                      
                      {/* Center Point */}
                      <circle cx="150" cy="150" r="3" fill="#FFD369" />

                      {/* Zodiac division lines (12 signs, 30 deg each) */}
                      {Array.from({ length: 12 }).map((_, i) => {
                        const angle = i * 30 * (Math.PI / 180);
                        const x1 = 150 + 85 * Math.cos(angle);
                        const y1 = 150 + 85 * Math.sin(angle);
                        const x2 = 150 + 130 * Math.cos(angle);
                        const y2 = 150 + 130 * Math.sin(angle);
                        return (
                          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#FFD369" strokeWidth="0.75" strokeOpacity="0.4" />
                        );
                      })}

                      {/* Render zodiac abbreviation symbols inside outer segments */}
                      {["ARI", "TAU", "GEM", "CAN", "LEO", "VIR", "LIB", "SCO", "SAG", "CAP", "AQU", "PSC"].map((sign, i) => {
                        // Offset by 15 deg to center label in the sector
                        const angle = (i * 30 + 15) * (Math.PI / 180);
                        const x = 150 + 115 * Math.cos(angle);
                        const y = 150 + 115 * Math.sin(angle);
                        return (
                          <text key={sign} x={x} y={y} fill="#FFD369" fontSize="7" fontWeight="bold" textAnchor="middle" dominantBaseline="middle" opacity="0.8">
                            {sign}
                          </text>
                        );
                      })}

                      {/* Draw planets mathematically placed on the wheel based on degrees */}
                      {kundliResult.planets.map((p, idx) => {
                        const absoluteAngle = p.longitude;
                        const angleRad = absoluteAngle * (Math.PI / 180);
                        
                        // Place planet inside the inner wheel sector
                        const radius = 65 + (idx % 2 === 0 ? 10 : -10); // spiral slightly to avoid overlaps
                        const x = 150 + radius * Math.cos(angleRad);
                        const y = 150 + radius * Math.sin(angleRad);

                        return (
                          <g key={p.planet}>
                            <circle cx={x} cy={y} r="6.5" fill="#0B0B1E" stroke="#EC4899" strokeWidth="1" />
                            <text x={x} y={y + 0.5} fill="#FFD369" fontSize="8" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">
                              {p.symbol}
                            </text>
                          </g>
                        );
                      })}
                    </svg>

                    {/* Quick Lagna Badge */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0B0B1E] border border-[#FFD369]/30 rounded-full px-3 py-1 text-[9px] font-black uppercase text-[#FFD369] tracking-wider">
                      {kundliResult.lagnaSignName.slice(0, 3)} LAGNA
                    </div>
                  </div>

                  <p className="text-[10px] text-white/40 mt-3 text-center">
                    Astronomically calibrated for {kundliResult.birthPlace.split(",")[0]}. Lahiri Ayanamsha: {kundliResult.ayanamsha.toFixed(4)}°.
                  </p>
                </div>

                {/* Placements breakdown table list */}
                <div className="space-y-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-white/50">
                    Planetary Coordinates
                  </h4>
                  <div className="divide-y divide-white/5 bg-white/5 border border-white/10 rounded-2xl overflow-hidden text-xs">
                    {kundliResult.planets.map(p => (
                      <div key={p.planet} className="px-4 py-3 flex justify-between items-center hover:bg-white/5 transition-all">
                        <div className="flex items-center gap-2">
                          <span className="text-base" style={{ color: p.color }}>{p.symbol}</span>
                          <div>
                            <span className="font-bold text-white">{p.name}</span>
                            {p.retrograde && <span className="text-[8px] text-orange-400 font-bold ml-1">(R)</span>}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-semibold text-white/80">H{p.house} · {p.signName}</span>
                          <p className="text-[10px] text-[#FFD369] mt-0.5">{p.degrees}°{p.minutes}′ · {p.nakshatra}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* TAB 3: INSIGHTS FEED */}
            {activeTab === "insights" && (
              <div className="space-y-6 animate-[fadeIn_0.3s_ease-out] text-left">
                
                {/* Header */}
                <div>
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#FFD369]">
                    ✦ ASTROLOGICAL INSIGHTS
                  </span>
                  <h3 className="font-serif text-xl font-bold text-white">
                    Daily Transit Forecast
                  </h3>
                </div>

                {/* Filter chips */}
                <div className="flex gap-2 pb-1 overflow-x-auto">
                  {(["all", "love", "career", "energy"] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setSelectedFilter(f)}
                      className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all ${
                        selectedFilter === f
                          ? "bg-gradient-to-r from-[#6C5CE7] to-[#EC4899] text-white"
                          : "bg-white/5 border border-white/10 text-white/60 hover:text-white"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>

                {/* Swipeable / Card-based feed list */}
                <div className="space-y-4">
                  {horoscopesData
                    .filter(h => selectedFilter === "all" || h.tag === selectedFilter)
                    .map(h => (
                      <div 
                        key={h.id} 
                        className="backdrop-blur-xl border rounded-3xl p-5 space-y-3 shadow-lg relative overflow-hidden transition-all duration-300 hover:border-white/20"
                        style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)" }}
                      >
                        {/* Glow ring */}
                        <div className="absolute right-0 top-0 w-24 h-24 rounded-full blur-2xl pointer-events-none opacity-20" style={{ background: h.color }} />
                        
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-black uppercase tracking-[0.2em] px-2.5 py-0.5 rounded-full text-white" style={{ background: h.bg, border: `1px solid ${h.color}30` }}>
                            {h.tag}
                          </span>
                          <span className="text-[10px] text-white/30 font-bold">Transit Insight</span>
                        </div>

                        <h4 className="font-serif text-base font-bold text-white pt-1">
                          {h.title}
                        </h4>
                        <p className="text-xs text-white/70 leading-relaxed">
                          {h.content}
                        </p>
                      </div>
                    ))}
                </div>

              </div>
            )}

            {/* TAB 4: COMPATIBILITY / MATCH */}
            {activeTab === "match" && (
              <div className="space-y-6 animate-[fadeIn_0.3s_ease-out] text-left">
                
                {/* Header */}
                <div>
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-pink-400">
                    ✦ SYNASTRY REPORT
                  </span>
                  <h3 className="font-serif text-xl font-bold text-white">
                    Chart Synastry Match
                  </h3>
                </div>

                {/* Matching panel */}
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 space-y-6 shadow-lg">
                  
                  {/* Arc graphics showing compatibility score if computed */}
                  {matchScore !== null ? (
                    <div className="flex flex-col items-center justify-center space-y-4 py-4">
                      <div className="relative w-36 h-36 flex items-center justify-center">
                        {/* Circle outer border */}
                        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full -rotate-90">
                          <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                          <circle 
                            cx="50" cy="50" r="42" fill="none" 
                            stroke="url(#accentGrad)" strokeWidth="4.5" 
                            strokeDasharray={Math.PI * 2 * 42}
                            strokeDashoffset={Math.PI * 2 * 42 * (1 - matchScore / 100)}
                            strokeLinecap="round" 
                          />
                          <defs>
                            <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#6C5CE7" />
                              <stop offset="50%" stopColor="#A855F7" />
                              <stop offset="100%" stopColor="#EC4899" />
                            </linearGradient>
                          </defs>
                        </svg>
                        
                        <div className="text-center space-y-0.5">
                          <p className="text-2xl font-black text-white font-serif">{matchScore}%</p>
                          <p className="text-[9px] font-black uppercase tracking-widest text-[#FFD369]">Match</p>
                        </div>
                      </div>

                      {/* Display breakdown */}
                      <div className="text-center space-y-2 max-w-xs">
                        <p className="text-xs text-white/95 font-semibold">
                          Excellent planetary harmony between {partner1Name} & {partner2Name}!
                        </p>
                        <p className="text-[11px] text-white/60 leading-relaxed">
                          Your moon signs ({partner1Sign} and {partner2Sign}) form a highly supportive relationship vector. The emotional compatibility score reflects strong mutual respect, open communication channels, and a shared cosmic frequency.
                        </p>
                        <button 
                          onClick={() => setMatchScore(null)}
                          className="text-[10px] font-bold text-pink-400 hover:underline uppercase tracking-wider pt-2"
                        >
                          Check Another Match
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={calculateMatch} className="space-y-4">
                      
                      {/* Name 1 Input */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[9px] font-black tracking-widest uppercase text-white/60">Partner 1</label>
                          <input 
                            type="text" required placeholder="Name" 
                            value={partner1Name} onChange={e => setPartner1Name(e.target.value)}
                            className="w-full bg-[#1A1A32]/40 border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs placeholder-white/30 focus:outline-none focus:border-[#6C5CE7]" 
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black tracking-widest uppercase text-white/60">Zodiac Sign</label>
                          <select 
                            value={partner1Sign} onChange={e => setPartner1Sign(e.target.value)}
                            className="w-full bg-[#1A1A32]/40 border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-[#6C5CE7]"
                          >
                            {["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"].map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Name 2 Input */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[9px] font-black tracking-widest uppercase text-white/60">Partner 2</label>
                          <input 
                            type="text" required placeholder="Name" 
                            value={partner2Name} onChange={e => setPartner2Name(e.target.value)}
                            className="w-full bg-[#1A1A32]/40 border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs placeholder-white/30 focus:outline-none focus:border-[#6C5CE7]" 
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black tracking-widest uppercase text-white/60">Zodiac Sign</label>
                          <select 
                            value={partner2Sign} onChange={e => setPartner2Sign(e.target.value)}
                            className="w-full bg-[#1A1A32]/40 border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-[#6C5CE7]"
                          >
                            {["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"].map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Submit */}
                      <button
                        type="submit"
                        className="w-full py-3.5 bg-gradient-to-r from-[#6C5CE7] to-[#EC4899] hover:opacity-95 active:scale-[0.98] font-bold text-xs tracking-wider uppercase text-white rounded-xl transition-all"
                      >
                        Compute Synastry Score
                      </button>

                    </form>
                  )}

                </div>

              </div>
            )}

            {/* TAB 5: PROFILE & SETTINGS */}
            {activeTab === "profile" && (
              <div className="space-y-6 animate-[fadeIn_0.3s_ease-out] text-left">
                
                {/* Header */}
                <div>
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">
                    ✦ PREFERENCES
                  </span>
                  <h3 className="font-serif text-xl font-bold text-white">
                    Profile & Settings
                  </h3>
                </div>

                {/* Info Card */}
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-5 shadow-lg flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#6C5CE7] to-[#EC4899] flex items-center justify-center font-bold text-base text-white">
                    {userName ? userName.slice(0, 2).toUpperCase() : "AA"}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{userName || "Astro Seeker"}</h4>
                    <p className="text-[10px] text-white/40 mt-0.5">{city} · DOB: {dob}</p>
                  </div>
                </div>

                {/* Settings list with toggles */}
                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden divide-y divide-white/5 text-xs text-white">
                  
                  {/* Daily push notifications toggle */}
                  <div className="px-4 py-4 flex justify-between items-center">
                    <div>
                      <p className="font-bold">Daily Horoscope Push</p>
                      <p className="text-[10px] text-white/40 mt-0.5">Receive transit insight updates in the morning.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-9 h-5 bg-white/10 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#FFD369]"></div>
                    </label>
                  </div>

                  {/* Astro alerts toggle */}
                  <div className="px-4 py-4 flex justify-between items-center">
                    <div>
                      <p className="font-bold">Retrograde Warnings</p>
                      <p className="text-[10px] text-white/40 mt-0.5">Alert me when Mercury, Mars, or Venus go retrograde.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-9 h-5 bg-white/10 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#FFD369]"></div>
                    </label>
                  </div>

                  {/* Sound effects */}
                  <div className="px-4 py-4 flex justify-between items-center">
                    <div>
                      <p className="font-bold">Premium High Fidelity Sounds</p>
                      <p className="text-[10px] text-white/40 mt-0.5">Play mystical background frequency chimes.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-9 h-5 bg-white/10 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#FFD369]"></div>
                    </label>
                  </div>

                  {/* Logout / Start over */}
                  <button 
                    onClick={() => setOnboarded(false)}
                    className="w-full text-left px-4 py-4 text-red-400 hover:bg-white/5 font-bold transition-all"
                  >
                    Reset & Recalculate Chart
                  </button>

                </div>

              </div>
            )}

          </main>
        )}

        {/* ─── Bottom Soft Glassmorphism Navigation Bar (5 Icons max) ────────── */}
        {onboarded && (
          <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md backdrop-blur-2xl bg-white/5 border border-white/10 rounded-3xl py-3 px-4 shadow-[0_8px_32px_rgba(0,0,0,0.5)] z-40 flex justify-between items-center">
            
            {/* Tab 1: Dashboard */}
            <button 
              onClick={() => setActiveTab("dashboard")}
              className={`flex flex-col items-center gap-1 transition-all ${
                activeTab === "dashboard" ? "text-[#FFD369] scale-105" : "text-[#B8B5C9] hover:text-white"
              }`}
            >
              <StarIcon className="w-5.5 h-5.5" />
              <span className="text-[8px] font-black uppercase tracking-wider">Aura</span>
            </button>

            {/* Tab 2: Birth Chart */}
            <button 
              onClick={() => setActiveTab("chart")}
              className={`flex flex-col items-center gap-1 transition-all ${
                activeTab === "chart" ? "text-[#FFD369] scale-105" : "text-[#B8B5C9] hover:text-white"
              }`}
            >
              <ChartIcon className="w-5.5 h-5.5" />
              <span className="text-[8px] font-black uppercase tracking-wider">Chart</span>
            </button>

            {/* Tab 3: Insights Feed */}
            <button 
              onClick={() => setActiveTab("insights")}
              className={`flex flex-col items-center gap-1 transition-all ${
                activeTab === "insights" ? "text-[#FFD369] scale-105" : "text-[#B8B5C9] hover:text-white"
              }`}
            >
              <CompassIcon className="w-5.5 h-5.5" />
              <span className="text-[8px] font-black uppercase tracking-wider">Insight</span>
            </button>

            {/* Tab 4: Compatibility */}
            <button 
              onClick={() => setActiveTab("match")}
              className={`flex flex-col items-center gap-1 transition-all ${
                activeTab === "match" ? "text-[#FFD369] scale-105" : "text-[#B8B5C9] hover:text-white"
              }`}
            >
              <HeartIcon className="w-5.5 h-5.5" />
              <span className="text-[8px] font-black uppercase tracking-wider">Synastry</span>
            </button>

            {/* Tab 5: Settings */}
            <button 
              onClick={() => setActiveTab("profile")}
              className={`flex flex-col items-center gap-1 transition-all ${
                activeTab === "profile" ? "text-[#FFD369] scale-105" : "text-[#B8B5C9] hover:text-white"
              }`}
            >
              <SettingsIcon className="w-5.5 h-5.5" />
              <span className="text-[8px] font-black uppercase tracking-wider">Setting</span>
            </button>

          </nav>
        )}

      </div>
    </div>
  );
}

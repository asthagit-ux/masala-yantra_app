"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "../lib/LanguageContext";

export default function Home() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#F9F9FB] text-black font-sans flex flex-col justify-between select-none relative overflow-x-hidden">
      
      {/* BACKGROUND DECORATIVE ELEMENTS: Rotating Celestial Chakra & Astrological Charts */}
      <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] opacity-[0.03] text-black pointer-events-none select-none animate-[spin_180s_linear_infinite]">
        <svg viewBox="0 0 200 200" className="w-full h-full fill-none stroke-current stroke-[0.5]">
          <circle cx="100" cy="100" r="90" />
          <circle cx="100" cy="100" r="75" strokeDasharray="3,3" />
          <circle cx="100" cy="100" r="60" />
          <circle cx="100" cy="100" r="45" />
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = (i * 15 * Math.PI) / 180;
            const x1 = 100 + 45 * Math.cos(angle);
            const y1 = 100 + 45 * Math.sin(angle);
            const x2 = 100 + 90 * Math.cos(angle);
            const y2 = 100 + 90 * Math.sin(angle);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
          })}
        </svg>
      </div>

      <div className="absolute bottom-[10%] right-[-10%] w-[600px] h-[600px] opacity-[0.03] text-black pointer-events-none select-none animate-[spin_240s_linear_infinite]">
        <svg viewBox="0 0 200 200" className="w-full h-full fill-none stroke-current stroke-[0.5]">
          <circle cx="100" cy="100" r="95" />
          <circle cx="100" cy="100" r="80" />
          <circle cx="100" cy="100" r="50" strokeDasharray="2,2" />
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            const x1 = 100 + 10 * Math.cos(angle);
            const y1 = 100 + 10 * Math.sin(angle);
            const x2 = 100 + 95 * Math.cos(angle);
            const y2 = 100 + 95 * Math.sin(angle);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
          })}
        </svg>
      </div>

      {/* Floating Constellation Stars */}
      <div className="absolute top-[25%] right-[15%] opacity-20 text-[#9A7026] pointer-events-none select-none animate-pulse">✦</div>
      <div className="absolute top-[60%] left-[8%] opacity-30 text-[#9A7026] pointer-events-none select-none animate-bounce duration-[4s]">✦</div>
      <div className="absolute top-[40%] left-[45%] opacity-20 text-[#9A7026] pointer-events-none select-none">✦</div>
      <div className="absolute bottom-[25%] left-[20%] opacity-25 text-[#9A7026] pointer-events-none select-none animate-pulse">✦</div>
      <div className="absolute bottom-[40%] right-[8%] opacity-20 text-[#9A7026] pointer-events-none select-none">✦</div>

      {/* AstroLearn Premium Header (Black navbar with Gold/Yellow highlights & Exact Logo) */}
      <div className="py-4 bg-black sticky top-0 z-40 px-4 md:px-8 flex justify-center items-center shadow-lg border-b border-[#FFD700]/30 relative">
        <header className="flex items-center justify-between w-full max-w-6xl mx-auto">
          
          {/* LOGO LINK WITH THE EXACT YELLOW SATURN LOGO COMPONENT */}
          <Link href="/" className="flex items-center gap-3 no-underline group">
            {/* The Exact Logo: Yellow Rounded Corner Box with Black Line-Drawing Saturn */}
            <div className="w-[38px] h-[38px] bg-[#FFD700] rounded-xl flex items-center justify-center shrink-0 shadow-md border border-black/10 transition-transform group-hover:scale-105 duration-200">
              <svg 
                viewBox="0 0 100 100" 
                className="w-[28px] h-[26px]"
              >
                <g transform="translate(50, 50) rotate(-22)">
                  {/* Behind Ring */}
                  <path 
                    d="M -36 -2 A 38 12 0 0 1 35 -4" 
                    fill="none" 
                    stroke="black" 
                    strokeWidth="9" 
                    strokeLinecap="round" 
                  />
                  {/* Planet Sphere */}
                  <path 
                    d="M 21.6 -10.5 A 24 24 0 1 0 21.6 10.5" 
                    fill="none" 
                    stroke="black" 
                    strokeWidth="9" 
                    strokeLinecap="round" 
                  />
                  {/* Front Ring */}
                  <path 
                    d="M 36 -2 A 38 12 0 0 1 -20 10" 
                    fill="none" 
                    stroke="black" 
                    strokeWidth="9" 
                    strokeLinecap="round" 
                  />
                  {/* Outer Left Ring Tip */}
                  <path 
                    d="M -36 -2 A 38 12 0 0 0 -34.4 5.1" 
                    fill="none" 
                    stroke="black" 
                    strokeWidth="9" 
                    strokeLinecap="round" 
                  />
                </g>
              </svg>
            </div>
            <h1 className="text-white font-semibold font-serif text-[24px] tracking-wide flex items-center gap-1 group-hover:text-[#FFD700] transition-colors">
              {t.logoName}
            </h1>
          </Link>

          <div className="flex gap-4 items-center">
            <Link
              href="/remedies/find"
              className="text-xs font-semibold text-white/80 hover:text-[#FFD700] transition-colors hidden sm:block"
            >
              {t.masalaRemedies}
            </Link>
            <Link
              href="/yantra-funnel"
              className="text-xs font-semibold text-white/80 hover:text-[#FFD700] transition-colors hidden sm:block"
            >
              {t.yantra}
            </Link>

            {/* Language Toggle Switcher */}
            <div className="flex bg-white/10 rounded-lg p-0.5 border border-white/10 ml-2">
              <button
                onClick={() => setLanguage("en")}
                className={`text-[10px] font-bold px-2.5 py-1 rounded-md transition-all ${
                  language === "en" ? "bg-[#FFD700] text-black shadow-sm" : "text-white/60 hover:text-white"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage("hi")}
                className={`text-[10px] font-bold px-2.5 py-1 rounded-md transition-all ${
                  language === "hi" ? "bg-[#FFD700] text-black shadow-sm" : "text-white/60 hover:text-white"
                }`}
              >
                हिन्दी
              </button>
            </div>
          </div>
        </header>
      </div>

      {/* Hero Section */}
      <main className="flex-grow w-full max-w-6xl mx-auto px-4 py-8 md:py-16 space-y-12 z-10 relative">
        <section className="relative overflow-hidden md:flex flex-row-reverse items-center justify-between gap-[5%] py-8 w-full">
          
          {/* Rotating Chakra Decorative Graphic */}
          <div className="w-full md:w-[45%] flex justify-center items-center relative py-4">
            <div className="w-64 h-64 md:w-80 md:h-80 bg-white rounded-full flex justify-center items-center border border-[#9A7026]/20 shadow-lg animate-[spin_60s_linear_infinite]">
              <svg
                viewBox="0 0 200 200"
                className="w-56 h-56 md:w-72 md:h-72 text-[#9A7026] opacity-75"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="5,5" />
                <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="100" cy="100" r="50" fill="none" stroke="currentColor" strokeWidth="1" />
                {Array.from({ length: 12 }).map((_, i) => {
                  const angle = (i * 30 * Math.PI) / 180;
                  const x1 = 100 + 40 * Math.cos(angle);
                  const y1 = 100 + 40 * Math.sin(angle);
                  const x2 = 100 + 90 * Math.cos(angle);
                  const y2 = 100 + 90 * Math.sin(angle);
                  return (
                    <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="0.75" />
                  );
                })}
                <path
                  d="M100 10L110 50L150 60L110 70L100 110L90 70L50 60L90 50Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  transform="translate(0, 40)"
                />
              </svg>
            </div>
            {/* Core focus center item */}
            <div className="absolute w-12 h-12 bg-black rounded-full flex items-center justify-center shadow-xl border border-[#FFD700]/30">
              <span className="text-xl">🪐</span>
            </div>
          </div>

          {/* Hero text */}
          <div className="w-full md:w-[50%] text-center md:text-left space-y-4 max-md:mt-6">
            <div className="flex justify-center md:justify-start items-center gap-2">
              <span className="bg-[#FFD700] rounded-full text-black text-[10px] font-bold px-2.5 py-0.5 uppercase tracking-wider shadow-sm">
                {t.freeBadge}
              </span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-black">
              {t.heroTitleLine1} <br /> {t.heroTitleLine2} <br /> {t.heroTitleLine3}
            </h2>
            <p className="text-sm md:text-base text-black/60 leading-relaxed max-w-md">
              {t.heroSubtitle}
            </p>
          </div>
        </section>

        {/* Engines Entry Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-center gap-2 text-center pb-2 border-b border-black/5">
            <span className="text-sm font-bold uppercase tracking-wider text-black/60 font-mono">
              {t.selectEngine}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Masala Remedies Entry */}
            <Link
              href="/remedies/find"
              className="bg-white border border-black/10 hover:border-[#FFD700] p-6 md:p-8 rounded-2xl flex flex-col justify-between transition-all duration-300 hover:shadow-xl group text-left hover:-translate-y-1"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl p-2.5 bg-[#F9F9FB] rounded-xl group-hover:scale-110 transition-transform">
                    🌶️
                  </span>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-black group-hover:text-[#9A7026] transition-colors">
                      {t.masalaRemedies}
                    </h3>
                    <p className="text-xs text-[#9A7026] font-semibold">
                      {t.masalaCardTagline}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-black/60 leading-relaxed">
                  {t.masalaCardDesc}
                </p>
              </div>
              <div className="pt-6 flex items-center justify-between text-xs font-bold text-black group-hover:text-[#9A7026] transition-colors">
                <span dangerouslySetInnerHTML={{ __html: t.masalaCardCTA }} />
                <span className="text-black/30 font-normal">{t.masalaCountText}</span>
              </div>
            </Link>

            {/* Yantra Entry */}
            <Link
              href="/yantra-funnel"
              className="bg-white border border-black/10 hover:border-[#FFD700] p-6 md:p-8 rounded-2xl flex flex-col justify-between transition-all duration-300 hover:shadow-xl group text-left hover:-translate-y-1"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl p-2.5 bg-[#F9F9FB] rounded-xl group-hover:scale-110 transition-transform">
                    🔱
                  </span>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-black group-hover:text-[#9A7026] transition-colors">
                      {t.yantraCardTitle}
                    </h3>
                    <p className="text-xs text-[#9A7026] font-semibold">
                      {t.yantraCardTagline}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-black/60 leading-relaxed">
                  {t.yantraCardDesc}
                </p>
              </div>
              <div className="pt-6 flex items-center justify-between text-xs font-bold text-black group-hover:text-[#9A7026] transition-colors">
                <span dangerouslySetInnerHTML={{ __html: t.yantraCardCTA }} />
                <span className="text-black/30 font-normal">{t.yantraCountText}</span>
              </div>
            </Link>
          </div>
        </section>

        {/* Categories Quick Browse list */}
        <section className="space-y-4 text-center">
          <h4 className="text-xs font-bold uppercase tracking-wider text-black/50">
            {t.browseLibraries}
          </h4>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/remedies"
              className="px-4 py-2 bg-white border border-black/5 rounded-lg text-xs font-bold text-black hover:border-[#FFD700] hover:shadow-md transition-all"
            >
              {t.grahaRemediesLink}
            </Link>
            <Link
              href="/masala-remedies"
              className="px-4 py-2 bg-white border border-black/5 rounded-lg text-xs font-bold text-black hover:border-[#FFD700] hover:shadow-md transition-all"
            >
              {t.masalaCategoriesLink}
            </Link>
            <Link
              href="/horoscope"
              className="px-4 py-2 bg-white border border-black/5 rounded-lg text-xs font-bold text-black hover:border-[#FFD700] hover:shadow-md transition-all"
            >
              {t.dailyHoroscopeLink}
            </Link>
          </div>
        </section>
      </main>

      {/* Disclaimer */}
      <footer className="w-full text-center max-w-4xl mx-auto px-4 mt-auto z-10 relative">
        <p className="text-[10px] text-black/40">
          {t.disclaimer}
        </p>
      </footer>
    </div>
  );
}

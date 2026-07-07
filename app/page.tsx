"use client";

import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#EEEBE6] text-black font-sans flex flex-col justify-between select-none">
      
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
              className="text-xs font-semibold text-black hover:text-[#9A7026]"
            >
              Masala Remedies
            </Link>
            <Link
              href="/yantra-funnel"
              className="text-xs font-semibold text-black hover:text-[#9A7026]"
            >
              Yantra
            </Link>
          </div>
        </header>
      </div>

      {/* Hero Section */}
      <main className="flex-grow w-full max-w-4xl mx-auto px-4 py-8 md:py-16 space-y-12">
        <section className="relative overflow-hidden md:flex flex-row-reverse items-center justify-between gap-[5%] py-8 w-full">
          
          {/* Rotating Chakra Decorative Graphic */}
          <div className="w-full md:w-[45%] flex justify-center items-center relative py-4">
            <div className="w-64 h-64 md:w-80 md:h-80 bg-white/20 rounded-full flex justify-center items-center border border-[#9A7026]/10 animate-[spin_60s_linear_infinite]">
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
            <div className="absolute w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md border border-black/5">
              <span className="text-xl">🪐</span>
            </div>
          </div>

          {/* Hero text */}
          <div className="w-full md:w-[50%] text-center md:text-left space-y-4 max-md:mt-6">
            <div className="flex justify-center md:justify-start items-center gap-2">
              <span className="bg-[#FFD700] rounded-full text-black text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                Free Vedic Wisdom
              </span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-black">
              India’s Largest <br /> Online <br /> Astro-Learning Platform
            </h2>
            <p className="text-sm md:text-base text-black/60 leading-relaxed max-w-md">
              Unlock personalized astrological yantras and kitchen masala remedies derived from ancient scriptures. 100% self-hosted, no subscriptions.
            </p>
          </div>
        </section>

        {/* Funnels Entry Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-center gap-2 text-center pb-2 border-b border-black/5">
            <span className="text-sm font-bold uppercase tracking-wider text-black/60 font-mono">
              Select Your Vedic Engine
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Masala Funnel Entry */}
            <Link
              href="/remedies/find"
              className="bg-white border border-black/10 hover:border-[#9A7026]/40 p-6 md:p-8 rounded-2xl flex flex-col justify-between transition-all duration-300 hover:shadow-lg group text-left"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl p-2.5 bg-[#EEEBE6] rounded-xl group-hover:scale-110 transition-transform">
                    🌶️
                  </span>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-black group-hover:text-[#9A7026] transition-colors">
                      Masala Remedies
                    </h3>
                    <p className="text-xs text-[#9A7026] font-semibold">
                      Kitchen Spice Formulas
                    </p>
                  </div>
                </div>
                <p className="text-xs text-black/60 leading-relaxed">
                  Got money drain, relationship disputes, vastu defects, or poor health? Answer simple concern questions and get convenient spice remedies you can do straight from home.
                </p>
              </div>
              <div className="pt-6 flex items-center justify-between text-xs font-bold text-[#0A2133] group-hover:text-[#9A7026] transition-colors">
                <span>Find My Remedy &rarr;</span>
                <span className="text-black/30 font-normal">126+ remedies mapped</span>
              </div>
            </Link>

            {/* Yantra Funnel Entry */}
            <Link
              href="/yantra-funnel"
              className="bg-white border border-black/10 hover:border-[#9A7026]/40 p-6 md:p-8 rounded-2xl flex flex-col justify-between transition-all duration-300 hover:shadow-lg group text-left"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl p-2.5 bg-[#EEEBE6] rounded-xl group-hover:scale-110 transition-transform">
                    🔱
                  </span>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-black group-hover:text-[#9A7026] transition-colors">
                      Personalized Yantra
                    </h3>
                    <p className="text-xs text-[#9A7026] font-semibold">
                      Geometric Talisman Generator
                    </p>
                  </div>
                </div>
                <p className="text-xs text-black/60 leading-relaxed">
                  Determine your custom geometrical Vedic talismans. Supports DOB-based Numeroscope grid analysis to spot missing numbers, plus manual planet selections. Render and print.
                </p>
              </div>
              <div className="pt-6 flex items-center justify-between text-xs font-bold text-[#0A2133] group-hover:text-[#9A7026] transition-colors">
                <span>Find My Yantra &rarr;</span>
                <span className="text-black/30 font-normal">56+ geometric grids</span>
              </div>
            </Link>
          </div>
        </section>

        {/* Categories Quick Browse list */}
        <section className="space-y-4 text-center">
          <h4 className="text-xs font-bold uppercase tracking-wider text-black/50">
            Or Browse Reference Libraries
          </h4>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/remedies"
              className="px-4 py-2 bg-white border border-black/5 rounded-lg text-xs font-bold text-black hover:border-[#9A7026]/40 transition-all shadow-sm"
            >
              🪐 Graha Remedies Index
            </Link>
            <Link
              href="/masala-remedies"
              className="px-4 py-2 bg-white border border-black/5 rounded-lg text-xs font-bold text-black hover:border-[#9A7026]/40 transition-all shadow-sm"
            >
              🌿 Masala Categories List
            </Link>
            <Link
              href="/horoscope"
              className="px-4 py-2 bg-white border border-black/5 rounded-lg text-xs font-bold text-black hover:border-[#9A7026]/40 transition-all shadow-sm"
            >
              🔮 Daily Horoscope Outlook
            </Link>
          </div>
        </section>
      </main>

      {/* Disclaimer */}
      <footer className="w-full text-center max-w-4xl mx-auto px-4 mt-auto">
        <p className="text-[10px] text-black/40">
          Disclaimer: AstroLearn remedies and talismans are traditional Vedic practices, provided for educational and cultural purposes. Not medical or financial advice.
        </p>
      </footer>
    </div>
  );
}

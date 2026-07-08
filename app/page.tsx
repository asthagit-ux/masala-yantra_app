"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "../lib/LanguageContext";
import { AstroLearnLogo } from "../components/AstroLearnLogo";

export default function Home() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="min-h-screen text-white font-sans flex flex-col justify-between select-none relative overflow-x-hidden" style={{ background: "#08081A" }}>

      {/* ── Ambient background glows ─────────────────────────────────────── */}
      <div className="pointer-events-none select-none fixed inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -top-32 -left-32 w-[560px] h-[560px] rounded-full opacity-[0.12]"
          style={{ background: "radial-gradient(circle, #6C5CE7 0%, transparent 70%)" }} />
        <div className="absolute top-[40%] -right-40 w-[480px] h-[480px] rounded-full opacity-[0.09]"
          style={{ background: "radial-gradient(circle, #EC4899 0%, transparent 70%)" }} />
        <div className="absolute -bottom-20 left-[30%] w-[400px] h-[400px] rounded-full opacity-[0.08]"
          style={{ background: "radial-gradient(circle, #FFD369 0%, transparent 70%)" }} />
      </div>

      {/* ── Rotating celestial mandala (background) ──────────────────────── */}
      <div className="absolute top-[12%] right-[-8%] w-[520px] h-[520px] opacity-[0.05] pointer-events-none select-none animate-[spin_180s_linear_infinite]">
        <svg viewBox="0 0 200 200" className="w-full h-full fill-none stroke-white stroke-[0.4]">
          <circle cx="100" cy="100" r="92" />
          <circle cx="100" cy="100" r="76" strokeDasharray="4,4" />
          <circle cx="100" cy="100" r="60" />
          <circle cx="100" cy="100" r="42" strokeDasharray="2,2" />
          {Array.from({ length: 24 }).map((_, i) => {
            const a = (i * 15 * Math.PI) / 180;
            return <line key={i} x1={100 + 42 * Math.cos(a)} y1={100 + 42 * Math.sin(a)} x2={100 + 92 * Math.cos(a)} y2={100 + 92 * Math.sin(a)} />;
          })}
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i * 30 * Math.PI) / 180;
            const x = 100 + 76 * Math.cos(a); const y = 100 + 76 * Math.sin(a);
            return <circle key={i} cx={x} cy={y} r="3" />;
          })}
        </svg>
      </div>

      {/* ── Floating star accents ─────────────────────────────────────────── */}
      <div className="absolute top-[22%] left-[8%] text-[#FFD369] opacity-30 pointer-events-none animate-pulse text-xs">✦</div>
      <div className="absolute top-[55%] right-[12%] text-[#A855F7] opacity-25 pointer-events-none animate-pulse text-sm" style={{ animationDelay: "1.2s" }}>✦</div>
      <div className="absolute bottom-[35%] left-[18%] text-[#EC4899] opacity-20 pointer-events-none animate-pulse" style={{ animationDelay: "2.5s" }}>✦</div>
      <div className="absolute top-[70%] left-[50%] text-[#FFD369] opacity-15 pointer-events-none animate-pulse text-xs" style={{ animationDelay: "0.8s" }}>✦</div>

      {/* ── Navigation ───────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-40 px-4 md:px-8 py-4 flex justify-center items-center border-b border-[#FFD369]/15 backdrop-blur-md" style={{ background: "rgba(8,8,26,0.88)" }}>
        <header className="flex items-center justify-between w-full max-w-6xl mx-auto">
          <Link href="/" className="flex items-center gap-3 no-underline group">
            <AstroLearnLogo size={40} className="group-hover:scale-105 transition-transform" />
            <h1 className="text-white font-semibold font-serif text-[22px] tracking-wide group-hover:text-[#FFD369] transition-colors">
              {t.logoName}
            </h1>
          </Link>

          <div className="flex gap-4 items-center">
            <Link href="/remedies/find" className="text-xs font-semibold text-white/70 hover:text-[#FFD369] transition-colors hidden sm:block">
              {t.masalaRemedies}
            </Link>
            <Link href="/yantra-funnel" className="text-xs font-semibold text-white/70 hover:text-[#FFD369] transition-colors hidden sm:block">
              {t.yantra}
            </Link>
            <div className="flex rounded-lg p-0.5 border border-white/10 ml-2" style={{ background: "rgba(255,255,255,0.06)" }}>
              <button onClick={() => setLanguage("en")}
                className={`text-[10px] font-bold px-2.5 py-1 rounded-md transition-all ${language === "en" ? "bg-[#FFD369] text-black shadow-sm" : "text-white/50 hover:text-white"}`}>
                EN
              </button>
              <button onClick={() => setLanguage("hi")}
                className={`text-[10px] font-bold px-2.5 py-1 rounded-md transition-all ${language === "hi" ? "bg-[#FFD369] text-black shadow-sm" : "text-white/50 hover:text-white"}`}>
                हिन्दी
              </button>
            </div>
          </div>
        </header>
      </div>

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <main className="flex-grow w-full max-w-6xl mx-auto px-4 py-10 md:py-16 space-y-16 z-10 relative">

        {/* ── Hero Section ─────────────────────────────────────────────── */}
        <section className="relative overflow-hidden md:flex flex-row-reverse items-center justify-between gap-12 py-6 w-full">

          {/* Animated Vedic Chakra */}
          <div className="w-full md:w-[44%] flex justify-center items-center relative py-6">
            {/* Outer slow ring */}
            <div className="w-72 h-72 md:w-96 md:h-96 rounded-full flex justify-center items-center relative animate-[spin_80s_linear_infinite]"
              style={{ border: "1px solid rgba(255,213,105,0.12)" }}>
              {/* Inner ring counter-rotate */}
              <div className="absolute inset-8 rounded-full animate-[spin_40s_linear_infinite_reverse]"
                style={{ border: "1px dashed rgba(168,85,247,0.2)" }} />
              <svg viewBox="0 0 200 200" className="w-60 h-60 md:w-80 md:h-80" xmlns="http://www.w3.org/2000/svg">
                <circle cx="100" cy="100" r="88" fill="none" stroke="rgba(255,213,105,0.18)" strokeWidth="0.8" strokeDasharray="5,5" />
                <circle cx="100" cy="100" r="70" fill="none" stroke="rgba(255,213,105,0.25)" strokeWidth="1" />
                <circle cx="100" cy="100" r="50" fill="none" stroke="rgba(168,85,247,0.2)" strokeWidth="0.8" />
                {Array.from({ length: 12 }).map((_, i) => {
                  const a = (i * 30 * Math.PI) / 180;
                  return (
                    <line key={i}
                      x1={100 + 40 * Math.cos(a)} y1={100 + 40 * Math.sin(a)}
                      x2={100 + 88 * Math.cos(a)} y2={100 + 88 * Math.sin(a)}
                      stroke="rgba(255,213,105,0.15)" strokeWidth="0.6" />
                  );
                })}
                {/* Star of David yantra geometry */}
                <polygon points="100,18 116,48 148,48 124,68 132,100 100,82 68,100 76,68 52,48 84,48"
                  fill="none" stroke="rgba(255,213,105,0.22)" strokeWidth="0.8" />
              </svg>
            </div>
            {/* Center planet orb */}
            <div className="absolute w-14 h-14 rounded-full flex items-center justify-center shadow-2xl"
              style={{ background: "linear-gradient(135deg, #0F0F25, #1a1a3e)", border: "2px solid rgba(255,213,105,0.35)", boxShadow: "0 0 32px rgba(108,92,231,0.5)" }}>
              <span className="text-2xl">🪐</span>
            </div>
          </div>

          {/* Hero Text */}
          <div className="w-full md:w-[52%] text-center md:text-left space-y-5 max-md:mt-8">
            <div className="flex justify-center md:justify-start">
              <span className="text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-md"
                style={{ background: "linear-gradient(135deg, #6C5CE7, #EC4899)", color: "white" }}>
                ✦ {t.freeBadge}
              </span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold leading-tight"
              style={{ background: "linear-gradient(135deg, #FFD369 0%, #F1F0FF 55%, #C4B5FD 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              {t.heroTitleLine1} <br /> {t.heroTitleLine2} <br /> {t.heroTitleLine3}
            </h2>
            <p className="text-sm md:text-base text-white/55 leading-relaxed max-w-md">
              {t.heroSubtitle}
            </p>
          </div>
        </section>

        {/* ── Engine Cards Section ──────────────────────────────────────── */}
        <section className="space-y-5">
          <div className="flex items-center justify-center gap-3 text-center pb-4">
            <div className="h-px flex-1 max-w-[80px]" style={{ background: "linear-gradient(to right, transparent, rgba(255,213,105,0.3))" }} />
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/40">{t.selectEngine}</span>
            <div className="h-px flex-1 max-w-[80px]" style={{ background: "linear-gradient(to left, transparent, rgba(255,213,105,0.3))" }} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Masala Remedies Card */}
            <Link href="/remedies/find"
              className="group relative rounded-3xl p-7 md:p-9 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 overflow-hidden"
              style={{ background: "linear-gradient(145deg, #0F0F25 0%, #111128 100%)", border: "1px solid rgba(255,213,105,0.13)" }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(255,213,105,0.4)")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,213,105,0.13)")}>
              {/* Card glow */}
              <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: "radial-gradient(circle, rgba(255,213,105,0.08) 0%, transparent 70%)" }} />

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  {/* Icon badge */}
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 text-2xl group-hover:scale-110 transition-transform"
                    style={{ background: "linear-gradient(135deg, rgba(255,213,105,0.12), rgba(249,115,22,0.1))", border: "1px solid rgba(255,213,105,0.2)" }}>
                    🌶️
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-white group-hover:text-[#FFD369] transition-colors">
                      {t.masalaRemedies}
                    </h3>
                    <p className="text-xs font-semibold mt-0.5" style={{ color: "#FFD369", opacity: 0.7 }}>
                      {t.masalaCardTagline}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-white/50 leading-relaxed">
                  {t.masalaCardDesc}
                </p>
              </div>

              <div className="pt-7 flex items-center justify-between">
                <span className="text-xs font-black text-white/70 group-hover:text-[#FFD369] transition-colors"
                  dangerouslySetInnerHTML={{ __html: t.masalaCardCTA }} />
                <span className="text-white/25 text-[10px]">{t.masalaCountText}</span>
              </div>
            </Link>

            {/* Yantra Recommendation Card */}
            <Link href="/yantra-funnel"
              className="group relative rounded-3xl p-7 md:p-9 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 overflow-hidden"
              style={{ background: "linear-gradient(145deg, #0F0F25 0%, #12102a 100%)", border: "1px solid rgba(168,85,247,0.13)" }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(168,85,247,0.4)")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(168,85,247,0.13)")}>
              {/* Card glow */}
              <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: "radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)" }} />

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 text-2xl group-hover:scale-110 transition-transform"
                    style={{ background: "linear-gradient(135deg, rgba(108,92,231,0.15), rgba(168,85,247,0.1))", border: "1px solid rgba(168,85,247,0.25)" }}>
                    🔱
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-white group-hover:text-[#A855F7] transition-colors">
                      {t.yantraCardTitle}
                    </h3>
                    <p className="text-xs font-semibold mt-0.5" style={{ color: "#A855F7", opacity: 0.75 }}>
                      {t.yantraCardTagline}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-white/50 leading-relaxed">
                  {t.yantraCardDesc}
                </p>
              </div>

              <div className="pt-7 flex items-center justify-between">
                <span className="text-xs font-black text-white/70 group-hover:text-[#A855F7] transition-colors"
                  dangerouslySetInnerHTML={{ __html: t.yantraCardCTA }} />
                <span className="text-white/25 text-[10px]">{t.yantraCountText}</span>
              </div>
            </Link>
          </div>
        </section>

        {/* ── Quick Browse ─────────────────────────────────────────────── */}
        <section className="space-y-4 text-center">
          <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-white/30">
            {t.browseLibraries}
          </h4>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { href: "/remedies", label: t.grahaRemediesLink },
              { href: "/masala-remedies", label: t.masalaCategoriesLink },
              { href: "/horoscope", label: t.dailyHoroscopeLink },
            ].map(({ href, label }) => (
              <Link key={href} href={href}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white/60 hover:text-[#FFD369] transition-all duration-200 hover:-translate-y-0.5"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(255,213,105,0.3)")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}>
                {label}
              </Link>
            ))}
          </div>
        </section>

      </main>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="w-full text-center max-w-4xl mx-auto px-4 py-6 z-10 relative">
        <p className="text-[10px] text-white/25">{t.disclaimer}</p>
      </footer>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "../../../lib/LanguageContext";
import { AstroLearnLogo } from "../../../components/AstroLearnLogo";
import protectionData from "../../../content/masala-remedies/protection.json";
import wealthData from "../../../content/masala-remedies/wealth.json";
import loveData from "../../../content/masala-remedies/love-relationships.json";
import healthData from "../../../content/masala-remedies/health-wellbeing.json";
import planetaryData from "../../../content/masala-remedies/planetary.json";
import spiritualData from "../../../content/masala-remedies/spiritual-luck.json";
import problemsData from "../../../content/masala-remedies/problems.json";

// ── Type definitions ────────────────────────────────────────────────────────
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

const allRemedies: Remedy[] = [
  ...(protectionData.remedies as Remedy[]),
  ...(wealthData.remedies as Remedy[]),
  ...(loveData.remedies as Remedy[]),
  ...(healthData.remedies as Remedy[]),
  ...(planetaryData.remedies as Remedy[]),
  ...(spiritualData.remedies as Remedy[])
];

// ── Shared style constants ──────────────────────────────────────────────────
const BG_BASE    = "#08081A";
const BG_SURFACE = "#0F0F25";
const BG_CARD    = "linear-gradient(145deg, #111128 0%, #0d0d22 100%)";
const BORDER_DIM = "rgba(255,213,105,0.12)";

export default function MasalaFunnel() {
  const { language, setLanguage, t } = useLanguage();

  const [step, setStep] = useState<number>(1);
  const [name, setName] = useState<string>("Rahul Sharma");
  const [category, setCategory] = useState<string>("");
  const [selectedProblemId, setSelectedProblemId] = useState<string>("");
  const [matchingRemedies, setMatchingRemedies] = useState<Remedy[]>([]);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  // ── Category metadata ─────────────────────────────────────────────────────

  const categoryTitles: Record<string, Record<string, string>> = {
    protection: { en: "Protection & Cleansing", hi: "रक्षा और शुद्धिकरण" },
    wealth: { en: "Wealth & Abundance", hi: "धन और समृद्धि" },
    "love-relationships": { en: "Love & Relationships", hi: "प्रेम और संबंध" },
    "health-wellbeing": { en: "Health & Wellbeing", hi: "स्वास्थ्य और कल्याण" },
    planetary: { en: "Planetary Doshas", hi: "ग्रहों के दोष" },
    "spiritual-luck": { en: "Spiritual & Good Luck", hi: "आद्यात्मिक और सौभाग्य" }
  };

  const categoryDescs: Record<string, Record<string, string>> = {
    protection: { en: "Shield your home, ward off evil eye, and clear negative energies.", hi: "घर की रक्षा करें, बुरी नजर उतारें, और नकारात्मक ऊर्जा दूर करें।" },
    wealth: { en: "Attract money, pay off debts, clear blockages, and expand sales.", hi: "धन आकर्षित करें, ऋण चुकाएं, बाधाएं दूर करें, और बिक्री बढ़ाएं।" },
    "love-relationships": { en: "Resolve disputes, remove marriage delays, and improve harmony.", hi: "विवाद सुलझाएं, विवाह में देरी दूर करें, और पारिवारिक शांति बढ़ाएं।" },
    "health-wellbeing": { en: "Enhance physical strength, sleep peace, clear long illness, and recover.", hi: "शारीरिक शक्ति बढ़ाएं, शांति से सोएं, लंबी बीमारी दूर करें।" },
    planetary: { en: "Pacify Shani, Rahu/Ketu, Pitra dosh, or boost planetary strength.", hi: "शनि, राहु/केतु, पितृ दोष शांत करें या ग्रहों की शक्ति बढ़ाएं।" },
    "spiritual-luck": { en: "Wish fulfillment, winning situations, legal support, and charms.", hi: "इच्छा पूर्ति, जीत की स्थिति, कानूनी सहायता, और सौभाग्य तावीज।" }
  };

  const categoryIcons: Record<string, string> = {
    protection: "🛡️", wealth: "💰", "love-relationships": "❤️",
    "health-wellbeing": "🌿", planetary: "🪐", "spiritual-luck": "✨"
  };

  const categoryGradients: Record<string, { from: string; to: string; border: string }> = {
    protection:           { from: "rgba(96,165,250,0.12)", to: "rgba(37,99,235,0.06)", border: "rgba(96,165,250,0.25)" },
    wealth:               { from: "rgba(255,215,0,0.12)",  to: "rgba(234,179,8,0.06)",  border: "rgba(255,215,0,0.3)" },
    "love-relationships": { from: "rgba(244,114,182,0.12)", to: "rgba(236,72,153,0.06)", border: "rgba(244,114,182,0.3)" },
    "health-wellbeing":   { from: "rgba(74,222,128,0.12)", to: "rgba(34,197,94,0.06)",  border: "rgba(74,222,128,0.25)" },
    planetary:            { from: "rgba(192,132,252,0.12)", to: "rgba(168,85,247,0.06)", border: "rgba(192,132,252,0.3)" },
    "spiritual-luck":     { from: "rgba(251,146,60,0.12)",  to: "rgba(249,115,22,0.06)", border: "rgba(251,146,60,0.3)" },
  };

  const problemLabels: Record<string, Record<string, string>> = {
    "cleanse-home": { en: "Dispel negative energies and cleanse my living space", hi: "नकारात्मक ऊर्जाओं को दूर करें और अपने घर को शुद्ध करें" },
    "evil-eye": { en: "Remove or protect against Nazar / Evil Eye", hi: "बुरी नजर (नजर दोष) को दूर करें या उससे रक्षा करें" },
    "shield-doorway": { en: "Stop negative blockages from entering through the entrance", hi: "मुख्य प्रवेश द्वार से नकारात्मक ऊर्जाओं को आने से रोकें" },
    "reverse-negativity": { en: "Reverse general curses, bad luck, or negative vibes", hi: "सामान्य शाप, दुर्भाग्य या नकारात्मक तरंगों को उलट दें" },
    "vastu-defects": { en: "Neutralize Vastu defects in my home or bathroom", hi: "अपने घर या शौचालय में वास्तु दोषों को दूर करें" },
    "nightmares-fear": { en: "Ward off nightmares and paranormal fears", hi: "बुरे सपनों और अदृश्य भयों से बचाव करें" },
    "money-draining": { en: "Money keeps draining out rapidly / high unexpected expenses", hi: "पैसा तेजी से बाहर जा रहा है / अचानक अधिक खर्च हो रहे हैं" },
    "debts-loans": { en: "Struggling to pay off old debts and loans", hi: "पुराने कर्ज और ऋण चुकाने में कठिनाई हो रही है" },
    "attract-wealth": { en: "Want to attract general abundance, money flow, and wealth", hi: "सामान्य समृद्धि, धन का प्रवाह और लक्ष्मी आकर्षित करना चाहते हैं" },
    "recover-money": { en: "Recovering stuck or blocked money from someone", hi: "किसी से फंसा हुआ या रुका हुआ पैसा वापस पाना" },
    "business-sales": { en: "Want to attract more customers and improve sales at work", hi: "काम पर अधिक ग्राहकों को आकर्षित करना और बिक्री बढ़ाना चाहते हैं" },
    "career-job": { en: "Need success in a job interview or to get a promotion", hi: "नौकरी के साक्षात्कार में सफलता या पदोन्नति चाहिए" },
    "marriage-delays": { en: "Experiencing delay, blocks, or obstacles in marriage", hi: "विवाह में देरी, रुकावट या बाधाओं का सामना करना" },
    "spouse-disputes": { en: "Frequent disputes, fights, or coldness with my partner", hi: "जीवनसाथी के साथ बार-बार विवाद, झगड़े या अनबन होना" },
    "inlaw-respect": { en: "Not getting love, respect, or acceptance from in-laws", hi: "ससुराल वालों से प्यार, सम्मान या स्वीकृति नहीं मिलना" },
    "attract-partner-love": { en: "Want to deepen love, attraction, or romance with partner", hi: "साथी के साथ प्यार, आकर्षण या रोमांस को गहरा करना चाहते हैं" },
    "family-peace": { en: "Lack of peace and harmony at home", hi: "घर में सुख-शांति और सद्भाव की कमी" },
    "friendship-conflicts": { en: "Want to resolve conflicts with friends, siblings, or colleagues", hi: "मित्रों, भाई-बहनों या सहकर्मियों के साथ संघर्ष सुलझाना चाहते हैं" },
    "physical-strength": { en: "Feeling physically weak / want to boost strength and immunity", hi: "शारीरिक कमजोरी महसूस होना / शक्ति और रोग प्रतिरोधक क्षमता बढ़ाना" },
    "pregnancy-nausea": { en: "Suffering from morning sickness or nausea during pregnancy", hi: "गर्भावस्था के दौरान मतली या कमजोरी होना" },
    "long-illness": { en: "Struggling with a long-term chronic illness or pain", hi: "लंबे समय से चली आ रही बीमारी या दर्द से पीड़ित होना" },
    "sex-drive": { en: "Want to enhance sexual desire or intimacy", hi: "शारीरिक ऊर्जा, आकर्षण या अंतरंगता बढ़ाना चाहते हैं" },
    "depression-sleep": { en: "Suffer from depression, nightmares, or sleeplessness", hi: "तनाव, बुरे सपने या अनिद्रा (नींद न आना) से परेशान होना" },
    "addiction-recovery": { en: "Help someone with alcohol or substance de-addiction", hi: "शराब या अन्य किसी लत को छुड़ाने में मदद करना" },
    "shani-dosha": { en: "Remove Shani Dosha / pacify Saturn", hi: "शनि दोष दूर करें / शनि देव को शांत करें" },
    "venus-weak": { en: "Strengthen Venus (for relationships, charm, luxury)", hi: "शुक्र ग्रह को मजबूत करें (संबंधों, आकर्षण, विलासिता के लिए)" },
    "mars-dosha": { en: "Support Mars / resolve delayed or incomplete works", hi: "मंगल ग्रह को सहारा दें / विलंबित या अधूरे कार्यों को पूरा करें" },
    "mercury-weak": { en: "Boost Mercury (for intellect, speech, business)", hi: "बुध ग्रह को मजबूत करें (बुद्धि, वाणी, व्यापार के लिए)" },
    "rahu-ketu-dosha": { en: "Balance Rahu & Ketu (ward off confusion & sudden setbacks)", hi: "राहु और केतु को संतुलित करें (भ्रम और अचानक बाधाओं से बचें)" },
    "pitra-dosha": { en: "Remove Pitra Dosha / satisfy ancestors for family blessings", hi: "पितृ दोष दूर करें / पूर्वजों की संतुष्टि और आशीर्वाद पाएं" },
    "hard-work-no-results": { en: "Not getting results despite immense hard work (Mars/Hanuman)", hi: "कठिन परिश्रम के बावजूद परिणाम नहीं मिलना (मंगल/हनुमान उपाय)" },
    "wish-fulfillment": { en: "Manifest a specific wish or deep desire", hi: "किसी विशिष्ट मनोकामना या गहरी इच्छा को पूरा करना" },
    "gambling-meetings": { en: "Attract luck for gambling, court cases, share market, or meetings", hi: "अदालत के मामलों, शेयर बाजार, या महत्वपूर्ण बैठकों के लिए भाग्य जगाएं" },
    "beauty-charm": { en: "Enhance personal charm, attractiveness, and beauty", hi: "व्यक्तिगत आकर्षण, सुंदरता और कांति बढ़ाएं" },
    "good-fortune": { en: "General road opening, good luck, and fortune", hi: "सामान्य मार्ग खोलना, सौभाग्य और अच्छा भाग्य पाना" },
    "negativity-banish": { en: "Banish persistent bad luck (Badkismati) or blockages", hi: "लगातार चल रहे दुर्भाग्य (बदकिस्मती) या बाधाओं को दूर भगाएं" },
    "missing-person": { en: "Find a missing person or bring home a lost family member", hi: "लापता व्यक्ति को खोजना या खोए हुए सदस्य को वापस लाना" },
    "theft-prevention": { en: "Protect house from theft while traveling", hi: "यात्रा के दौरान घर को चोरी से बचाना" }
  };

  const categoriesList = [
    { id: "protection", title: categoryTitles.protection[language], desc: categoryDescs.protection[language], icon: categoryIcons.protection },
    { id: "wealth", title: categoryTitles.wealth[language], desc: categoryDescs.wealth[language], icon: categoryIcons.wealth },
    { id: "love-relationships", title: categoryTitles["love-relationships"][language], desc: categoryDescs["love-relationships"][language], icon: categoryIcons["love-relationships"] },
    { id: "health-wellbeing", title: categoryTitles["health-wellbeing"][language], desc: categoryDescs["health-wellbeing"][language], icon: categoryIcons["health-wellbeing"] },
    { id: "planetary", title: categoryTitles.planetary[language], desc: categoryDescs.planetary[language], icon: categoryIcons.planetary },
    { id: "spiritual-luck", title: categoryTitles["spiritual-luck"][language], desc: categoryDescs["spiritual-luck"][language], icon: categoryIcons["spiritual-luck"] },
  ];

  // ── Category result meta ───────────────────────────────────────────────────
  const categoryMeta: Record<string, { label: string; color: string; bg: string; symbol: string; rulerPlanet: string }> = {
    "protection":         { label: "PROTECTION", color: "#60a5fa", bg: "rgba(37,99,235,0.15)",  symbol: "हं",  rulerPlanet: "SHANI (SATURN)" },
    "wealth":             { label: "WEALTH",     color: "#FFD700", bg: "rgba(234,179,8,0.15)",  symbol: "श्रीं", rulerPlanet: "GURU (JUPITER)" },
    "love-relationships": { label: "LOVE",       color: "#f472b6", bg: "rgba(236,72,153,0.15)", symbol: "ह्रीं", rulerPlanet: "SHUKRA (VENUS)" },
    "health-wellbeing":   { label: "HEALTH",     color: "#4ade80", bg: "rgba(34,197,94,0.15)",  symbol: "ऐं",  rulerPlanet: "SURYA (SUN)" },
    "planetary":          { label: "PLANETARY",  color: "#c084fc", bg: "rgba(168,85,247,0.15)", symbol: "ॐ",   rulerPlanet: "NAVAGRAHA" },
    "spiritual-luck":     { label: "SPIRITUAL",  color: "#fb923c", bg: "rgba(249,115,22,0.15)", symbol: "गं",  rulerPlanet: "GURU (JUPITER)" },
  };

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleStep1 = (e: React.FormEvent) => { e.preventDefault(); setStep(2); };

  const handleCategorySelect = (catId: string) => { setCategory(catId); setStep(3); };

  const handleProblemSelect = (probId: string, titles: string[]) => {
    setSelectedProblemId(probId);
    const found = allRemedies.filter((r) => titles.includes(r.title));
    setMatchingRemedies(found);
    setCheckedIngredients({});
    setStep(4);
  };

  const handleToggleIngredient = (remedyIdx: number, ingIdx: number) => {
    const key = `${remedyIdx}-${ingIdx}`;
    setCheckedIngredients((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleReset = () => {
    setStep(1); setName("Rahul Sharma"); setCategory("");
    setSelectedProblemId(""); setMatchingRemedies([]);
    setCheckedIngredients({}); setExpandedIdx(null);
  };

  // ── Reusable input style ───────────────────────────────────────────────────
  const inputCls = "w-full rounded-xl px-4 py-3 text-sm text-white font-medium placeholder-white/25 focus:outline-none transition-all";
  const inputStyle = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,213,105,0.2)", color: "white" } as React.CSSProperties;

  // ── Step progress indicator ─────────────────────────────────────────────
  const stepLabels = ["You", "Category", "Concern", "Remedy"];

  return (
    <div className="min-h-screen text-white font-sans flex flex-col pb-14 relative overflow-x-hidden" style={{ background: BG_BASE }}>

      {/* ── Ambient glows ─────────────────────────────────────────────────── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full opacity-[0.10]"
          style={{ background: "radial-gradient(circle, #6C5CE7 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 -right-20 w-96 h-96 rounded-full opacity-[0.08]"
          style={{ background: "radial-gradient(circle, #FFD369 0%, transparent 70%)" }} />
      </div>

      {/* ── Nav ───────────────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-40 px-4 md:px-8 py-4 flex justify-center backdrop-blur-md border-b" style={{ background: "rgba(8,8,26,0.9)", borderColor: "rgba(255,213,105,0.12)" }}>
        <header className="flex items-center justify-between w-full max-w-6xl mx-auto">
          <Link href="/" className="flex items-center gap-3 group">
            <AstroLearnLogo size={38} className="group-hover:scale-105 transition-transform" />
            <h1 className="text-white font-semibold font-serif text-xl tracking-wide group-hover:text-[#FFD369] transition-colors">{t.logoName}</h1>
          </Link>
          <div className="flex gap-4 items-center">
            <Link href="/yantra-funnel" className="text-xs font-bold text-white/60 hover:text-[#FFD369] transition-colors hidden sm:block">{t.yantra}</Link>
            <div className="flex rounded-lg p-0.5 border border-white/10" style={{ background: "rgba(255,255,255,0.05)" }}>
              <button onClick={() => setLanguage("en")} className={`text-[10px] font-bold px-2.5 py-1 rounded-md transition-all ${language === "en" ? "bg-[#FFD369] text-black" : "text-white/50 hover:text-white"}`}>EN</button>
              <button onClick={() => setLanguage("hi")} className={`text-[10px] font-bold px-2.5 py-1 rounded-md transition-all ${language === "hi" ? "bg-[#FFD369] text-black" : "text-white/50 hover:text-white"}`}>हिन्दी</button>
            </div>
          </div>
        </header>
      </div>

      {/* ── Page ──────────────────────────────────────────────────────────── */}
      <div className="flex-grow w-full max-w-4xl mx-auto px-4 py-10 md:py-14 z-10 relative">

        {/* Page header */}
        <div className="text-center space-y-2 mb-10">
          <p className="text-[10px] font-black uppercase tracking-[0.25em]" style={{ color: "#FFD369", opacity: 0.75 }}>
            ✦ {language === "en" ? "Vedic Kitchen Science" : "वैदिक रसोई विज्ञान"} ✦
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold"
            style={{ background: "linear-gradient(135deg, #FFD369 0%, #F1F0FF 60%, #C4B5FD 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            {t.masalaFunnelTitle}
          </h2>
          <p className="text-xs text-white/45 max-w-md mx-auto leading-relaxed">{t.masalaFunnelDesc}</p>
        </div>

        {/* Step progress bar */}
        {step <= 4 && (
          <div className="flex items-center justify-center gap-0 mb-10">
            {stepLabels.map((lbl, i) => {
              const num = i + 1;
              const done = step > num;
              const active = step === num;
              return (
                <React.Fragment key={lbl}>
                  <div className="flex flex-col items-center gap-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-black transition-all ${done ? "text-black" : active ? "text-black" : "text-white/30"}`}
                      style={{ background: done || active ? "linear-gradient(135deg, #FFD369, #F5A623)" : "rgba(255,255,255,0.07)", border: done || active ? "none" : "1px solid rgba(255,255,255,0.1)" }}>
                      {done ? "✓" : num}
                    </div>
                    <span className={`text-[9px] font-bold uppercase tracking-wider ${active ? "text-[#FFD369]" : done ? "text-white/50" : "text-white/25"}`}>{lbl}</span>
                  </div>
                  {i < 3 && (
                    <div className="w-12 md:w-20 h-px mx-1 mb-5 transition-all"
                      style={{ background: done ? "rgba(255,213,105,0.5)" : "rgba(255,255,255,0.08)" }} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        )}

        {/* ── STEP 1: Name ──────────────────────────────────────────────── */}
        {step === 1 && (
          <form onSubmit={handleStep1} className="space-y-6 max-w-lg mx-auto">
            <div className="rounded-2xl p-8 space-y-6" style={{ background: BG_CARD, border: `1px solid ${BORDER_DIM}` }}>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/45">
                  {t.yourNameOptional}
                </label>
                <input type="text" placeholder="e.g. Priya Sharma"
                  value={name} onChange={(e) => setName(e.target.value)}
                  className={inputCls} style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = "rgba(255,213,105,0.55)")}
                  onBlur={e => (e.target.style.borderColor = "rgba(255,213,105,0.2)")} />
                <p className="text-[10px] text-white/30 leading-relaxed">{t.nameHelper}</p>
              </div>
            </div>
            <button type="submit"
              className="w-full py-4 rounded-2xl font-black text-sm text-white transition-all hover:opacity-90 active:scale-[0.99] shadow-lg"
              style={{ background: "linear-gradient(135deg, #6C5CE7, #A855F7, #EC4899)", boxShadow: "0 8px 24px rgba(108,92,231,0.35)" }}>
              {t.continueToCategories} →
            </button>
          </form>
        )}

        {/* ── STEP 2: Categories ────────────────────────────────────────── */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold font-serif text-white/90">{t.step2Title}</h3>
              <button onClick={() => setStep(1)} className="text-xs font-bold text-white/40 hover:text-[#FFD369] transition-colors">← {t.back}</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoriesList.map((cat) => {
                const grad = categoryGradients[cat.id];
                return (
                  <button key={cat.id} onClick={() => handleCategorySelect(cat.id)}
                    className="group text-left rounded-2xl p-5 transition-all duration-250 active:scale-[0.97] space-y-3 hover:-translate-y-1"
                    style={{ background: `linear-gradient(145deg, ${grad.from}, ${grad.to})`, border: `1px solid ${grad.border}40` }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = grad.border)}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = `${grad.border}40`)}>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl group-hover:scale-110 transition-transform block">{cat.icon}</span>
                      <p className="font-bold text-white font-serif text-sm leading-tight">{cat.title}</p>
                    </div>
                    <p className="text-[11px] text-white/50 leading-relaxed">{cat.desc}</p>
                    <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider"
                      style={{ color: grad.border }}>
                      <span>Select</span>
                      <span>→</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── STEP 3: Problems ──────────────────────────────────────────── */}
        {step === 3 && (() => {
          const grad = categoryGradients[category] || categoryGradients.wealth;
          return (
            <div className="space-y-5 max-w-2xl mx-auto">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-white/35">Step 3 of 4</p>
                  <h3 className="text-base font-bold font-serif text-white/90 mt-0.5">{t.step3Title}</h3>
                </div>
                <button onClick={() => setStep(2)} className="text-xs font-bold text-white/40 hover:text-[#FFD369] transition-colors">← {t.back}</button>
              </div>

              <div className="space-y-2">
                {(problemsData as any)[category]?.problems?.map((prob: any) => {
                  const localizedLabel = problemLabels[prob.id]?.[language] || prob.label;
                  return (
                    <button key={prob.id} onClick={() => handleProblemSelect(prob.id, prob.remedyTitles)}
                      className="group w-full text-left rounded-xl px-5 py-4 flex items-center justify-between gap-3 transition-all duration-200 active:scale-[0.99] hover:-translate-x-0.5"
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                      onMouseEnter={e => { e.currentTarget.style.background = `linear-gradient(135deg, ${grad.from}, ${grad.to})`; e.currentTarget.style.borderColor = grad.border; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; }}>
                      <span className="text-xs text-white/75 group-hover:text-white leading-relaxed transition-colors font-medium">{localizedLabel}</span>
                      <span className="text-white/30 group-hover:text-[#FFD369] text-base shrink-0 transition-colors">→</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* ── STEP 4: Results ───────────────────────────────────────────── */}
        {step === 4 && (() => {
          const meta = categoryMeta[category] || categoryMeta["wealth"];
          return (
            <div className="space-y-7">
              {/* Results header */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: "#FFD369", opacity: 0.7 }}>
                    ✦ Vedic Kitchen Science ✦
                  </p>
                  <h3 className="text-xl font-bold text-white font-serif mt-0.5">
                    {matchingRemedies.length} {language === "en" ? "Sacred Remedies Prescribed" : "पवित्र उपाय निर्धारित"}
                  </h3>
                </div>
                <button onClick={handleReset}
                  className="text-[10px] font-black uppercase tracking-wider text-white/35 hover:text-red-400 transition-colors border border-white/10 hover:border-red-400/30 px-3 py-1.5 rounded-lg">
                  ← Start Over
                </button>
              </div>

              {/* Card grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {matchingRemedies.map((remedy, remIdx) => {
                  const isExpanded = expandedIdx === remIdx;
                  const maxIngTags = 3;
                  const extraIng = remedy.ingredients.length - maxIngTags;

                  return (
                    <div key={remIdx}
                      className="flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_32px_rgba(255,213,105,0.08)]"
                      style={{ background: "linear-gradient(160deg, #0d0d1e 0%, #111028 100%)", border: `1px solid ${BORDER_DIM}` }}>

                      {/* Top bar */}
                      <div className="flex items-center justify-between px-4 pt-4 pb-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-bold tracking-wider uppercase text-white/25">RULER:</span>
                          <span className="text-[9px] font-bold tracking-wider uppercase text-white/50">{remedy.planetName || meta.rulerPlanet}</span>
                        </div>
                        <button onClick={() => setExpandedIdx(isExpanded ? null : remIdx)}
                          className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all"
                          style={{ background: isExpanded ? meta.color : `${meta.color}20`, color: isExpanded ? "#000" : meta.color }}>
                          {isExpanded ? "✕" : "→"}
                        </button>
                      </div>

                      {/* Category badge */}
                      <div className="px-4 pb-1">
                        <span className="inline-block text-[9px] font-black tracking-[0.12em] px-2.5 py-0.5 rounded-full"
                          style={{ background: meta.bg, color: meta.color, border: `1px solid ${meta.color}35` }}>
                          {meta.label}
                        </span>
                      </div>

                      {/* Symbol glyph */}
                      <div className="relative flex items-center justify-center py-6 mx-4 mt-1 overflow-hidden rounded-xl" style={{ background: `${meta.color}06` }}>
                        <div className="absolute w-24 h-24 rounded-full" style={{ background: `radial-gradient(circle, ${meta.color}18 0%, transparent 70%)` }} />
                        <span className="relative text-5xl font-serif select-none leading-none"
                          style={{ color: meta.color, textShadow: `0 0 28px ${meta.color}55, 0 0 60px ${meta.color}25` }}>
                          {meta.symbol}
                        </span>
                      </div>

                      {/* Title + timing */}
                      <div className="px-4 pt-3">
                        <h4 className="text-xs font-black uppercase tracking-wide text-white leading-snug">{remedy.title}</h4>
                        {remedy.timing && (
                          <p className="text-[10px] mt-1.5 flex items-center gap-1.5" style={{ color: "#FFD369" }}>
                            <span>⏱</span>
                            <span className="font-medium">{remedy.timing}</span>
                          </p>
                        )}
                      </div>

                      {/* Ingredient chips */}
                      <div className="px-4 pt-3 pb-4 flex flex-wrap gap-1.5 mt-auto">
                        {remedy.ingredients.slice(0, maxIngTags).map((ing, i) => (
                          <span key={i} className="text-[9px] font-semibold px-2.5 py-1 rounded-full"
                            style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.08)" }}>
                            {ing}
                          </span>
                        ))}
                        {extraIng > 0 && (
                          <span className="text-[9px] font-semibold px-2.5 py-1 rounded-full"
                            style={{ background: "rgba(255,215,0,0.1)", color: "#FFD700", border: "1px solid rgba(255,215,0,0.2)" }}>
                            +{extraIng} more
                          </span>
                        )}
                      </div>

                      {/* Expanded panel */}
                      {isExpanded && (
                        <div className="border-t px-4 py-5 space-y-5"
                          style={{ borderColor: `${meta.color}18`, background: `${meta.color}04` }}>

                          {/* Ingredients checklist */}
                          <div className="space-y-2">
                            <p className="text-[9px] font-black tracking-[0.18em] uppercase" style={{ color: meta.color }}>✦ Ingredients Required</p>
                            <div className="flex flex-wrap gap-1.5">
                              {remedy.ingredients.map((ing, ingIdx) => {
                                const isChecked = checkedIngredients[`${remIdx}-${ingIdx}`];
                                return (
                                  <button key={ingIdx} onClick={() => handleToggleIngredient(remIdx, ingIdx)}
                                    className="text-[10px] font-semibold px-2.5 py-1 rounded-full transition-all"
                                    style={{
                                      background: isChecked ? "rgba(74,222,128,0.12)" : "rgba(255,255,255,0.05)",
                                      color: isChecked ? "#4ade80" : "rgba(255,255,255,0.55)",
                                      border: isChecked ? "1px solid rgba(74,222,128,0.3)" : "1px solid rgba(255,255,255,0.08)",
                                      textDecoration: isChecked ? "line-through" : "none"
                                    }}>
                                    {isChecked ? "✓ " : ""}{ing}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Process steps */}
                          <div className="space-y-2">
                            <p className="text-[9px] font-black tracking-[0.18em] uppercase" style={{ color: meta.color }}>✦ Sacred Process</p>
                            <ol className="space-y-2">
                              {remedy.process.map((stepTxt, i) => (
                                <li key={i} className="flex gap-2.5 text-[11px] leading-relaxed text-white/65">
                                  <span className="shrink-0 font-black text-[10px] mt-0.5" style={{ color: meta.color }}>0{i + 1}.</span>
                                  <span>{stepTxt}</span>
                                </li>
                              ))}
                            </ol>
                          </div>

                          {/* Mantra / Intention */}
                          {(remedy.sampleIntention || remedy.mantra) && (
                            <div className="rounded-xl p-3 space-y-1"
                              style={{ background: meta.bg, border: `1px solid ${meta.color}25` }}>
                              {remedy.mantra && (
                                <>
                                  <p className="text-[9px] font-black tracking-[0.18em] uppercase" style={{ color: meta.color }}>✦ Mantra</p>
                                  <p className="text-sm font-serif font-semibold text-white leading-relaxed">{remedy.mantra}</p>
                                </>
                              )}
                              {remedy.sampleIntention && (
                                <p className="text-[10px] italic text-white/55 leading-relaxed pt-1">
                                  &ldquo;{remedy.sampleIntention.replace("Rahul Sharma", name || "Native")}&rdquo;
                                </p>
                              )}
                            </div>
                          )}

                          {/* Benefits */}
                          {remedy.benefits && (
                            <div className="text-[10px] text-white/55 leading-relaxed">
                              <span className="font-bold text-green-400">Benefits: </span>
                              {Array.isArray(remedy.benefits) ? remedy.benefits.join(" · ") : remedy.benefits}
                            </div>
                          )}

                          {/* Warnings */}
                          {(remedy.note || (remedy.notes && remedy.notes.length > 0)) && (
                            <div className="rounded-xl p-3 space-y-1"
                              style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)" }}>
                              <p className="text-[9px] font-black tracking-[0.18em] uppercase text-red-400">⚠ Important Guidance</p>
                              {remedy.note && <p className="text-[10px] text-red-300/80 leading-relaxed">{remedy.note}</p>}
                              {remedy.notes && remedy.notes.map((n, i) => <p key={i} className="text-[10px] text-red-300/80 leading-relaxed">• {n}</p>)}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

      </div>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="w-full text-center max-w-4xl mx-auto px-4 py-4 z-10 relative">
        <p className="text-[10px] text-white/20">{t.disclaimer}</p>
      </footer>
    </div>
  );
}

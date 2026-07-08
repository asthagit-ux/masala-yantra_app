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

export default function MasalaFunnel() {
  const { language, setLanguage, t } = useLanguage();

  const [step, setStep] = useState<number>(1);
  const [name, setName] = useState<string>("Rahul Sharma");
  const [category, setCategory] = useState<string>("");
  const [selectedProblemId, setSelectedProblemId] = useState<string>("");
  const [matchingRemedies, setMatchingRemedies] = useState<Remedy[]>([]);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});

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

  const problemLabels: Record<string, Record<string, string>> = {
    // Protection
    "cleanse-home": { en: "Dispel negative energies and cleanse my living space", hi: "नकारात्मक ऊर्जाओं को दूर करें और अपने घर को शुद्ध करें" },
    "evil-eye": { en: "Remove or protect against Nazar / Evil Eye", hi: "बुरी नजर (नजर दोष) को दूर करें या उससे रक्षा करें" },
    "shield-doorway": { en: "Stop negative blockages from entering through the entrance", hi: "मुख्य प्रवेश द्वार से नकारात्मक ऊर्जाओं को आने से रोकें" },
    "reverse-negativity": { en: "Reverse general curses, bad luck, or negative vibes", hi: "सामान्य शाप, दुर्भाग्य या नकारात्मक तरंगों को उलट दें" },
    "vastu-defects": { en: "Neutralize Vastu defects in my home or bathroom", hi: "अपने घर या शौचालय में वास्तु दोषों को दूर करें" },
    "nightmares-fear": { en: "Ward off nightmares and paranormal fears", hi: "बुरे सपनों और अदृश्य भयों से बचाव करें" },

    // Wealth
    "money-draining": { en: "Money keeps draining out rapidly / high unexpected expenses", hi: "पैसा तेजी से बाहर जा रहा है / अचानक अधिक खर्च हो रहे हैं" },
    "debts-loans": { en: "Struggling to pay off old debts and loans", hi: "पुराने कर्ज और ऋण चुकाने में कठिनाई हो रही है" },
    "attract-wealth": { en: "Want to attract general abundance, money flow, and wealth", hi: "सामान्य समृद्धि, धन का प्रवाह और लक्ष्मी आकर्षित करना चाहते हैं" },
    "recover-money": { en: "Recovering stuck or blocked money from someone", hi: "किसी से फंसा हुआ या रुका हुआ पैसा वापस पाना" },
    "business-sales": { en: "Want to attract more customers and improve sales at work", hi: "काम पर अधिक ग्राहकों को आकर्षित करना और बिक्री बढ़ाना चाहते हैं" },
    "career-job": { en: "Need success in a job interview or to get a promotion", hi: "नौकरी के साक्षात्कार में सफलता या पदोन्नति चाहिए" },

    // Love & Relationships
    "marriage-delays": { en: "Experiencing delay, blocks, or obstacles in marriage", hi: "विवाह में देरी, रुकावट या बाधाओं का सामना करना" },
    "spouse-disputes": { en: "Frequent disputes, fights, or coldness with my partner", hi: "जीवनसाथी के साथ बार-बार विवाद, झगड़े या अनबन होना" },
    "inlaw-respect": { en: "Not getting love, respect, or acceptance from in-laws", hi: "ससुराल वालों से प्यार, सम्मान या स्वीकृति नहीं मिलना" },
    "attract-partner-love": { en: "Want to deepen love, attraction, or romance with partner", hi: "साथी के साथ प्यार, आकर्षण या रोमांस को गहरा करना चाहते हैं" },
    "family-peace": { en: "Lack of peace and harmony at home", hi: "घर में सुख-शांति और सद्भाव की कमी" },
    "friendship-conflicts": { en: "Want to resolve conflicts with friends, siblings, or colleagues", hi: "मित्रों, भाई-बहनों या सहकर्मियों के साथ संघर्ष सुलझाना चाहते हैं" },

    // Health
    "physical-strength": { en: "Feeling physically weak / want to boost strength and immunity", hi: "शारीरिक कमजोरी महसूस होना / शक्ति और रोग प्रतिरोधक क्षमता बढ़ाना" },
    "pregnancy-nausea": { en: "Suffering from morning sickness or nausea during pregnancy", hi: "गर्भावस्था के दौरान मतली या कमजोरी होना" },
    "long-illness": { en: "Struggling with a long-term chronic illness or pain", hi: "लंबे समय से चली आ रही बीमारी या दर्द से पीड़ित होना" },
    "sex-drive": { en: "Want to enhance sexual desire or intimacy", hi: "शारीरिक ऊर्जा, आकर्षण या अंतरंगता बढ़ाना चाहते हैं" },
    "depression-sleep": { en: "Suffer from depression, nightmares, or sleeplessness", hi: "तनाव, बुरे सपने या अनिद्रा (नींद न आना) से परेशान होना" },
    "addiction-recovery": { en: "Help someone with alcohol or substance de-addiction", hi: "शराब या अन्य किसी लत को छुड़ाने में मदद करना" },

    // Planetary
    "shani-dosha": { en: "Remove Shani Dosha / pacify Saturn", hi: "शनि दोष दूर करें / शनि देव को शांत करें" },
    "venus-weak": { en: "Strengthen Venus (for relationships, charm, luxury)", hi: "शुक्र ग्रह को मजबूत करें (संबंधों, आकर्षण, विलासिता के लिए)" },
    "mars-dosha": { en: "Support Mars / resolve delayed or incomplete works", hi: "मंगल ग्रह को सहारा दें / विलंबित या अधूरे कार्यों को पूरा करें" },
    "mercury-weak": { en: "Boost Mercury (for intellect, speech, business)", hi: "बुध ग्रह को मजबूत करें (बुद्धि, वाणी, व्यापार के लिए)" },
    "rahu-ketu-dosha": { en: "Balance Rahu & Ketu (ward off confusion & sudden setbacks)", hi: "राहु और केतु को संतुलित करें (भ्रम और अचानक बाधाओं से बचें)" },
    "pitra-dosha": { en: "Remove Pitra Dosha / satisfy ancestors for family blessings", hi: "पितृ दोष दूर करें / पूर्वजों की संतुष्टि और आशीर्वाद पाएं" },
    "hard-work-no-results": { en: "Not getting results despite immense hard work (Mars/Hanuman)", hi: "कठिन परिश्रम के बावजूद परिणाम नहीं मिलना (मंगल/हनुमान उपाय)" },

    // Spiritual
    "wish-fulfillment": { en: "Manifest a specific wish or deep desire", hi: "किसी विशिष्ट मनोकामना या गहरी इच्छा को पूरा करना" },
    "gambling-meetings": { en: "Attract luck for gambling, court cases, share market, or meetings", hi: "अदालत के मामलों, शेयर बाजार, या महत्वपूर्ण बैठकों के लिए भाग्य जगाएं" },
    "beauty-charm": { en: "Enhance personal charm, attractiveness, and beauty", hi: "व्यक्तिगत आकर्षण, सुंदरता और कांति बढ़ाएं" },
    "good-fortune": { en: "General road opening, good luck, and fortune", hi: "सामान्य मार्ग खोलना, सौभाग्य और अच्छा भाग्य पाना" },
    "negativity-banish": { en: "Banish persistent bad luck (Badkismati) or blockages", hi: "लगातार चल रहे दुर्भाग्य (बदकिस्मती) या बाधाओं को दूर भगाएं" },
    "missing-person": { en: "Find a missing person or bring home a lost family member", hi: "लापता व्यक्ति को खोजना या खोए हुए सदस्य को वापस लाना" },
    "theft-prevention": { en: "Protect house from theft while traveling", hi: "यात्रा के दौरान घर को चोरी से बचाना" }
  };

  const categoriesList = [
    { id: "protection", title: categoryTitles.protection[language], desc: categoryDescs.protection[language], icon: "🛡️" },
    { id: "wealth", title: categoryTitles.wealth[language], desc: categoryDescs.wealth[language], icon: "💰" },
    { id: "love-relationships", title: categoryTitles["love-relationships"][language], desc: categoryDescs["love-relationships"][language], icon: "❤️" },
    { id: "health-wellbeing", title: categoryTitles["health-wellbeing"][language], desc: categoryDescs["health-wellbeing"][language], icon: "🌿" },
    { id: "planetary", title: categoryTitles.planetary[language], desc: categoryDescs.planetary[language], icon: "🪐" },
    { id: "spiritual-luck", title: categoryTitles["spiritual-luck"][language], desc: categoryDescs["spiritual-luck"][language], icon: "✨" }
  ];

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
    setName("Rahul Sharma");
    setCategory("");
    setSelectedProblemId("");
    setMatchingRemedies([]);
    setCheckedIngredients({});
  };

  return (
    <div className="min-h-screen bg-[#F9F9FB] text-black font-sans flex flex-col justify-between pb-10 relative overflow-x-hidden">
      
      {/* BACKGROUND DECORATIVE ELEMENTS: Rotating Celestial Chakra & Astrological Charts */}
      <div className="absolute top-[10%] left-[-15%] w-[600px] h-[600px] opacity-[0.025] text-black pointer-events-none select-none animate-[spin_200s_linear_infinite]">
        <svg viewBox="0 0 200 200" className="w-full h-full fill-none stroke-current stroke-[0.5]">
          <circle cx="100" cy="100" r="90" />
          <circle cx="100" cy="100" r="75" strokeDasharray="3,3" />
          <circle cx="100" cy="100" r="60" />
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

      {/* Floating Constellation Stars */}
      <div className="absolute top-[20%] right-[10%] opacity-25 text-[#9A7026] pointer-events-none select-none animate-pulse">✦</div>
      <div className="absolute top-[50%] left-[5%] opacity-20 text-[#9A7026] pointer-events-none select-none animate-bounce duration-[5s]">✦</div>
      <div className="absolute bottom-[30%] right-[5%] opacity-20 text-[#9A7026] pointer-events-none select-none animate-pulse">✦</div>

      {/* AstroLearn Premium Header with Exact Saturn Logo */}
      <div className="py-4 bg-black sticky top-0 z-40 px-4 md:px-8 flex justify-center items-center shadow-lg border-b border-[#FFD700]/30 relative">
        <header className="flex items-center justify-between w-full max-w-6xl mx-auto">
          
          <Link href="/" className="flex items-center gap-3 no-underline group">
            <AstroLearnLogo size={42} className="group-hover:scale-105" />
            <h1 className="text-white font-semibold font-serif text-[24px] tracking-wide flex items-center gap-1 group-hover:text-[#FFD700] transition-colors">
              {t.logoName}
            </h1>
          </Link>

          <div className="flex gap-4 items-center">
            <Link
              href="/yantra-funnel"
              className="text-xs font-bold text-black bg-[#FFD700] hover:bg-[#FFC800] px-3.5 py-2 rounded transition-all shadow-sm"
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

      {/* Main Content Area */}
      <div className="flex-grow w-full max-w-5xl mx-auto px-4 py-8 md:py-12 z-10 relative">
        <div className="bg-white border border-black/10 rounded-2xl p-6 md:p-10 shadow-md space-y-8">
          
          {/* Funnel Title */}
          <div className="text-center space-y-2">
            <p className="text-[#9A7026] font-bold uppercase tracking-wider text-xs font-mono">
              {language === "en" ? "Vedic Kitchen Science" : "वैदिक रसोई विज्ञान"}
            </p>
            <h2 className="text-2xl md:text-3xl font-bold font-serif text-black">
              {t.masalaFunnelTitle}
            </h2>
            <p className="text-xs text-black/60 max-w-md mx-auto">
              {t.masalaFunnelDesc}
            </p>
          </div>

          {/* Step 1: Details */}
          {step === 1 && (
            <form onSubmit={handleStep1} className="space-y-6 max-w-xl mx-auto">
              <div className="space-y-4">
                <h3 className="text-base font-semibold font-serif text-black pb-1 border-b border-black/10">
                  {t.step1Title}
                </h3>
                
                <div className="space-y-1.5">
                  <label className="block text-xs uppercase font-bold text-black/60 tracking-wider">
                    {t.yourNameOptional}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#F9F9FB] border border-black/10 rounded-lg px-4 py-3 text-black focus:outline-none focus:border-[#FFD700] transition-all font-medium placeholder-black/30 text-sm"
                  />
                  <p className="text-[10px] text-black/40">
                    {t.nameHelper}
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-black hover:bg-black/90 active:scale-[0.99] font-bold text-sm text-white rounded-lg transition-all"
              >
                {t.continueToCategories}
              </button>
            </form>
          )}

          {/* Step 2: Categories */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-1 border-b border-black/10">
                <h3 className="text-base font-semibold font-serif text-black">
                  {t.step2Title}
                </h3>
                <button
                  onClick={() => setStep(1)}
                  className="text-xs text-[#9A7026] hover:underline font-bold"
                >
                  {t.back}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoriesList.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    className="text-left bg-white border border-black/10 hover:border-[#FFD700] hover:shadow-xl rounded-xl p-5 transition-all duration-200 active:scale-[0.98] group space-y-1"
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
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="flex justify-between items-center pb-1 border-b border-black/10">
                <h3 className="text-base font-semibold font-serif text-black">
                  {t.step3Title}
                </h3>
                <button
                  onClick={() => setStep(2)}
                  className="text-xs text-[#9A7026] hover:underline font-bold"
                >
                  {t.back}
                </button>
              </div>

              <div className="space-y-3">
                {(problemsData as any)[category]?.problems?.map((prob: any) => {
                  const localizedLabel = problemLabels[prob.id]?.[language] || prob.label;
                  return (
                    <button
                      key={prob.id}
                      onClick={() => handleProblemSelect(prob.id, prob.remedyTitles)}
                      className="w-full text-left bg-white border border-black/10 hover:border-[#FFD700] hover:shadow-lg rounded-xl p-4 text-xs font-semibold text-black hover:text-[#9A7026] transition-all leading-relaxed active:scale-[0.99] flex items-center justify-between"
                    >
                      <span>{localizedLabel}</span>
                      <span className="text-[#9A7026] text-sm">&rarr;</span>
                    </button>
                  );
                })}
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
                    {t.recommendedRemedies}
                  </span>
                  <h3 className="text-base font-bold text-black">
                    {t.multipleOptionsSubtitle}
                  </h3>
                </div>
                <button
                  onClick={handleReset}
                  className="text-xs text-red-600 hover:underline font-bold"
                >
                  {t.startOver}
                </button>
              </div>

              {/* Remedies Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {matchingRemedies.map((remedy, remIdx) => (
                  <div
                    key={remIdx}
                    className="border border-black/10 hover:border-[#FFD700] bg-white rounded-xl p-5 md:p-6 space-y-4 shadow-sm transition-all"
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
                        <span className="inline-block bg-black text-[#FFD700] text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">
                          ⏱ {remedy.timing}
                        </span>
                      )}
                    </div>

                    {/* Ingredients Checklist */}
                    <div className="space-y-2">
                      <p className="text-[10px] uppercase font-bold text-black/50 tracking-wider">
                        {t.checkIngredients}
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
                                  ? "bg-green-50 border-green-300 text-green-800 line-through"
                                  : "bg-[#F9F9FB] border-black/10 text-black/80 hover:border-black/30"
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
                        {t.processSteps}
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
                      <div className="bg-[#F9F9FB] border-l-4 border-[#FFD700] p-3 rounded-r-lg">
                        <p className="text-[9px] uppercase font-bold text-[#9A7026] tracking-wider mb-1">
                          {t.intentionTitle}
                        </p>
                        <p className="text-xs italic text-black/80 font-serif leading-relaxed">
                          &quot;{remedy.sampleIntention.replace("Rahul Sharma", name || (language === "en" ? "Native" : "जातक"))}&quot;
                        </p>
                      </div>
                    )}

                    {/* Mantra */}
                    {remedy.mantra && (
                      <div className="bg-yellow-50/30 border border-[#FFD700]/30 p-3 rounded-lg text-center">
                        <p className="text-[9px] uppercase font-bold text-[#9A7026] tracking-wider mb-1">
                          {t.mantraChanting}
                        </p>
                        <p className="text-sm font-semibold text-black leading-relaxed font-serif">
                          {remedy.mantra}
                        </p>
                      </div>
                    )}

                    {/* Benefits */}
                    {remedy.benefits && (
                      <div className="pt-2 border-t border-black/5 text-xs">
                        <span className="font-bold text-green-700">{t.benefitsLabel} </span>
                        <span className="text-black/75">
                          {Array.isArray(remedy.benefits) ? remedy.benefits.join(", ") : remedy.benefits}
                        </span>
                      </div>
                    )}

                    {/* Warnings/Notes */}
                    {(remedy.note || (remedy.notes && remedy.notes.length > 0)) && (
                      <div className="bg-red-50/50 p-3 rounded-lg border border-red-200/40 text-[10px] text-red-900 leading-relaxed">
                        <p className="font-bold uppercase tracking-wider mb-1">{t.importantGuidance}</p>
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
      <footer className="w-full text-center max-w-4xl mx-auto px-4 mt-auto z-10 relative">
        <p className="text-[10px] text-black/40">
          {t.disclaimer}
        </p>
      </footer>
    </div>
  );
}

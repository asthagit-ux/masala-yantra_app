"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "../../lib/LanguageContext";
import YantraRenderer from "@/components/YantraRenderer";
import { AstroLearnLogo } from "../../components/AstroLearnLogo";
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

type AppMode = "goal" | "kundli";

export default function YantraPage() {
  const { language, setLanguage, t } = useLanguage();

  const [appMode, setAppMode] = useState<AppMode>("goal");
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
  const [geocodeError, setGeocodeError] = useState("");
  const [kundliResult, setKundliResult] = useState<KundliResult | null>(null);
  const [kundliRecs, setKundliRecs] = useState<YantraRecommendation[]>([]);
  const [kundliActiveRec, setKundliActiveRec] = useState<string>("");
  const [kundliLoading, setKundliLoading] = useState(false);

  const categoryTitles: Record<string, Record<string, string>> = {
    wealth: { en: "Wealth & Prosperity", hi: "धन और समृद्धि" },
    health: { en: "Health & Healing", hi: "स्वास्थ्य और कल्याण" },
    studies: { en: "Studies & Knowledge", hi: "शिक्षा और ज्ञान" },
    protection: { en: "Protection & Ward Evil", hi: "रक्षा और बुरी नजर बचाव" },
    marriage: { en: "Marriage & Love Harmony", hi: "विवाह और प्रेम सामंजस्य" },
    success: { en: "Success & Manifestation", hi: "सफलता और मनोकामना" }
  };

  const categoryDescs: Record<string, Record<string, string>> = {
    wealth: { en: "For business expansion, wealth accumulation, and good luck.", hi: "व्यापार विस्तार, धन संचय और अच्छे भाग्य के लिए।" },
    health: { en: "For chronic illness recovery, pain relief, and mental calm.", hi: "पुरानी बीमारी से उबरने, दर्द से राहत और मानसिक शांति के लिए।" },
    studies: { en: "For exam success, memory power, concentration, and focus.", hi: "परीक्षा में सफलता, स्मरण शक्ति, एकाग्रता और ध्यान के लिए।" },
    protection: { en: "For house protection, evil eye removal, travel safety, and nightmares.", hi: "घर की सुरक्षा, बुरी नजर हटाने, यात्रा सुरक्षा और बुरे सपनों से बचाव के लिए।" },
    marriage: { en: "For delayed marriage, couple bonding, and marital peace.", hi: "विवाह में देरी, आपसी जुड़ाव और वैवाहिक शांति के लिए।" },
    success: { en: "For court cases, fame, manifesting wishes, and spiritual occult power.", hi: "अदालत के मामलों, प्रसिद्धि, मनोकामना पूरी करने और गुप्त शक्ति के लिए।" }
  };

  const yantraIssueLabels: Record<string, Record<string, string>> = {
    "w-1": { en: "I want to clear debt and expand my store/business.", hi: "मैं कर्ज चुकाना चाहता हूँ और अपनी दुकान/व्यवसाय बढ़ाना चाहता हूँ।" },
    "w-2": { en: "I want to attract wealth through hard work and efforts.", hi: "मैं कड़ी मेहनत और प्रयासों से धन आकर्षित करना चाहता हूँ।" },
    "w-3": { en: "I want to accumulate money and secure savings in my vault/safe.", hi: "मैं धन का संचय करना चाहता हूँ और अपनी तिजोरी में बचत सुरक्षित रखना चाहता हूँ।" },
    "w-4": { en: "I need overall good fortune and luck in new projects.", hi: "मुझे नई परियोजनाओं में समग्र सौभाग्य और सफलता चाहिए।" },
    "w-5": { en: "I am trying to acquire a personal vehicle.", hi: "मैं एक नया वाहन खरीदने की कोशिश कर रहा हूँ।" },
    "w-6": { en: "I want general household abundance and business growth.", hi: "मुझे सामान्य घरेलू समृद्धि और व्यावसायिक विकास चाहिए।" },

    "h-1": { en: "I want relief from chronic or acute diseases.", hi: "मुझे पुरानी या गंभीर बीमारियों से राहत चाहिए।" },
    "h-2": { en: "I want to cure minor but persistent fever, cold, or flu.", hi: "मैं छोटे लेकिन लगातार होने वाले बुखार या सर्दी-जुकाम को ठीक करना चाहता हूँ।" },
    "h-3": { en: "I suffer from muscular, joint, or physical pains.", hi: "मैं मांसपेशियों, जोड़ों या शारीरिक दर्द से पीड़ित हूँ।" },
    "h-4": { en: "I want to protect a pregnancy or prevent miscarriages.", hi: "मैं गर्भावस्था की रक्षा करना या गर्भपात को रोकना चाहती हूँ।" },
    "h-5": { en: "I want to speed recovery of a family member.", hi: "मैं परिवार के किसी सदस्य के शीघ्र स्वस्थ होने की कामना करता हूँ।" },
    "h-6": { en: "I want absolute mental peace and temper control.", hi: "मुझे पूर्ण मानसिक शांति और क्रोध पर नियंत्रण चाहिए।" },
    "h-7": { en: "I suffer from continuous physical/emotional grief.", hi: "मैं लगातार शारीरिक या मानसिक कष्ट से पीड़ित हूँ।" },

    "s-1": { en: "I want to overcome exam phobia and score well.", hi: "मैं परीक्षा के डर को दूर करना और अच्छे अंक प्राप्त करना चाहता हूँ।" },
    "s-2": { en: "I want to improve memory, concentration, and deep learning.", hi: "मैं याददाश्त, एकाग्रता और गहरी समझ में सुधार करना चाहता हूँ।" },
    "s-3": { en: "I want academic success under competitive pressure.", hi: "मुझे प्रतियोगी दबाव में शैक्षणिक सफलता चाहिए।" },
    "s-4": { en: "I want to learn arts, music, or pursue high research.", hi: "मैं कला, संगीत सीखना चाहता हूँ या उच्च शोध करना चाहता हूँ।" },
    "s-5": { en: "I need concentration, focus, and body toxin cleaning.", hi: "मुझे एकाग्रता, ध्यान और शरीर की शुद्धि चाहिए।" },

    "p-1": { en: "I want to shield my home from negative blockages.", hi: "मैं अपने घर को नकारात्मक बाधाओं से बचाना चाहता हूँ।" },
    "p-2": { en: "My child/family is suffering from sudden Nazar (Evil Eye).", hi: "मेरा बच्चा/परिवार अचानक लगी बुरी नजर (नजर दोष) से पीड़ित है।" },
    "p-3": { en: "I need strong protection from negative vibes (for adults).", hi: "मुझे नकारात्मक तरंगों से मजबूत सुरक्षा चाहिए (वयस्कों के लिए)।" },
    "p-4": { en: "I experience paranormal fears or nightmares.", hi: "मुझे बुरे सपने या अज्ञात भय महसूस होते हैं।" },
    "p-5": { en: "I am going on an important or urgent journey.", hi: "मैं एक महत्वपूर्ण या आवश्यक यात्रा पर जा रहा हूँ।" },
    "p-6": { en: "I have persistent nightmares and want peaceful sleep.", hi: "मुझे बार-बार बुरे सपने आते हैं और मैं शांति से सोना चाहता हूँ।" },
    "p-7": { en: "I need protection from hidden enemies.", hi: "मुझे गुप्त शत्रुओं से सुरक्षा चाहिए।" },

    "m-1": { en: "My marriage is experiencing delays or obstacles.", hi: "मेरे विवाह में देरी या बाधाएं आ रही हैं।" },
    "m-2": { en: "We are recently married and want to build understanding.", hi: "हमारा हाल ही में विवाह हुआ है और हम आपसी समझ बढ़ाना चाहते हैं।" },
    "m-3": { en: "I want to resolve family discord and ensure love life success.", hi: "मैं पारिवारिक कलह को दूर करना और प्रेम जीवन में सफलता चाहता हूँ।" },
    "m-4": { en: "I want to remove obstacles in my married life.", hi: "मैं अपने वैवाहिक जीवन की बाधाओं को दूर करना चाहता हूँ।" },

    "c-1": { en: "I want public recognition, name, and fame in my circle.", hi: "मुझे सार्वजनिक पहचान, नाम और प्रसिद्धि चाहिए।" },
    "c-2": { en: "I want commercial success and client conversion skills.", hi: "मुझे व्यावसायिक सफलता और ग्राहक आकर्षित करने का कौशल चाहिए।" },
    "c-3": { en: "I want a new job, promotion, and success in all areas.", hi: "मुझे नई नौकरी, पदोन्नति और सभी क्षेत्रों में सफलता चाहिए।" },
    "c-4": { en: "I am involved in legal disputes or court cases.", hi: "मैं कानूनी विवादों या अदालती मामलों में उलझा हुआ हूँ।" },
    "c-5": { en: "I want to manifest my goals and wishes.", hi: "मैं अपने लक्ष्यों और इच्छाओं को पूरा करना चाहता हूँ।" },
    "c-6": { en: "I want to attain pure occult and intuitive powers.", hi: "मैं शुद्ध गुप्त विज्ञान और अंतर्ज्ञान शक्तियां प्राप्त करना चाहता हूँ।" },
    "c-7": { en: "I want to get general planetary protection.", hi: "मुझे सामान्य ग्रहों की शांति और सुरक्षा चाहिए।" },
    "c-8": { en: "I want the blessings of Lord Shiva.", hi: "मुझे भगवान शिव का आशीर्वाद चाहिए।" }
  };

  const categoriesList = [
    { id: "wealth", title: categoryTitles.wealth[language], desc: categoryDescs.wealth[language], icon: "💰" },
    { id: "health", title: categoryTitles.health[language], desc: categoryDescs.health[language], icon: "🌿" },
    { id: "studies", title: categoryTitles.studies[language], desc: categoryDescs.studies[language], icon: "🎓" },
    { id: "protection", title: categoryTitles.protection[language], desc: categoryDescs.protection[language], icon: "🛡️" },
    { id: "marriage", title: categoryTitles.marriage[language], desc: categoryDescs.marriage[language], icon: "❤️" },
    { id: "success", title: categoryTitles.success[language], desc: categoryDescs.success[language], icon: "✨" }
  ];

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
      setGeocodeError(language === "en" 
        ? "Could not find this city. Try a more specific name (e.g. 'Mumbai, India')." 
        : "यह शहर नहीं मिल सका। कृपया अधिक विशिष्ट नाम (जैसे 'मुंबई, भारत') आज़माएं।");
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
      setGeocodeError(language === "en" 
        ? "Calculation error. Please check birth details and try again." 
        : "गणना त्रुटि। कृपया जन्म के विवरण की जांच करें और पुनः प्रयास करें।");
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

  return (
    <div className="min-h-screen bg-[#F9F9FB] text-black font-sans flex flex-col justify-between pb-10 relative overflow-x-hidden">

      {/* BACKGROUND DECORATIVE ELEMENTS: Rotating Celestial Chakra & Astrological Charts */}
      <div className="absolute top-[10%] right-[-15%] w-[600px] h-[600px] opacity-[0.025] text-black pointer-events-none select-none animate-[spin_200s_linear_infinite]">
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
      <div className="absolute top-[20%] left-[10%] opacity-25 text-[#9A7026] pointer-events-none select-none animate-pulse">✦</div>
      <div className="absolute top-[50%] right-[5%] opacity-20 text-[#9A7026] pointer-events-none select-none animate-bounce duration-[5s]">✦</div>
      <div className="absolute bottom-[30%] left-[5%] opacity-20 text-[#9A7026] pointer-events-none select-none animate-pulse">✦</div>

      {/* AstroLearn Premium Header with Exact Saturn Logo */}
      <div className="py-4 bg-black sticky top-0 z-40 px-4 md:px-8 flex justify-center shadow-lg border-b border-[#FFD700]/30 relative">
        <header className="flex items-center justify-between w-full max-w-6xl mx-auto">
          <Link href="/" className="flex items-center gap-3 no-underline group">
            <AstroLearnLogo size={38} className="group-hover:scale-105" />
            <h1 className="text-white font-semibold font-serif text-2xl tracking-wide group-hover:text-[#FFD700] transition-colors">{t.logoName}</h1>
          </Link>

          <div className="flex gap-4 items-center">
            <Link href="/remedies/find" className="text-xs font-bold text-white bg-[#0A2133] hover:bg-[#0A2133]/90 px-3.5 py-2 rounded transition-all">
              {t.masalaRemedies}
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

      {/* Main */}
      <div className="flex-grow w-full max-w-6xl mx-auto px-4 py-8 md:py-12 z-10 relative">
        <div className="bg-white border border-black/10 rounded-2xl p-6 md:p-10 shadow-md space-y-8">

          {/* Title */}
          <div className="text-center space-y-2">
            <p className="text-[#9A7026] font-bold uppercase tracking-wider text-xs font-mono">
              {language === "en" ? "Vedic Geometry Talismans" : "वैदिक ज्यामितीय तावीज"}
            </p>
            <h2 className="text-2xl md:text-3xl font-bold font-serif text-black">{t.yantraTitle}</h2>
            <p className="text-xs text-black/60 max-w-md mx-auto">
              {t.yantraDesc}
            </p>
          </div>

          {/* Mode Toggle — only show on Step 1 of each flow */}
          {(goalStep === 1 || kundliStep === 1) && (
            <div className="grid grid-cols-2 gap-3 max-w-2xl mx-auto">
              <button
                onClick={() => { setAppMode("goal"); resetGoal(); }}
                className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all text-left space-y-0.5 ${
                  appMode === "goal"
                    ? "bg-black text-white border-black"
                    : "bg-white border-black/10 text-black hover:border-[#FFD700]"
                }`}
              >
                <div className="text-base">🎯</div>
                <div>{t.byGoalBtn}</div>
                <div className={`text-[10px] font-normal ${appMode === "goal" ? "text-white/70" : "text-black/40"}`}>
                  {t.byGoalBtnDesc}
                </div>
              </button>
              <button
                onClick={() => { setAppMode("kundli"); resetKundli(); }}
                className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all text-left space-y-0.5 ${
                  appMode === "kundli"
                    ? "bg-[#9A7026] text-white border-[#9A7026]"
                    : "bg-white border-black/10 text-black hover:border-[#FFD700]"
                }`}
              >
                <div className="text-base">🔭</div>
                <div>{t.byKundliBtn}</div>
                <div className={`text-[10px] font-normal ${appMode === "kundli" ? "text-white/70" : "text-black/40"}`}>
                  {t.byKundliBtnDesc}
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
                <form onSubmit={handleGoalStep1} className="space-y-6 max-w-2xl mx-auto">
                  <h3 className="text-base font-semibold font-serif text-black pb-1 border-b border-black/10">
                    {t.yantraStep1Title}
                  </h3>

                  <div className="space-y-1.5">
                    <label className="block text-xs uppercase font-bold text-black/60 tracking-wider">
                      {t.yourNameRequired}
                    </label>
                    <input
                      type="text" required placeholder="e.g. Rahul Sharma"
                      value={name} onChange={e => setName(e.target.value)}
                      className="w-full bg-[#F9F9FB] border border-black/10 rounded-lg px-4 py-3 text-black focus:outline-none focus:border-[#FFD700] transition-all font-medium placeholder-black/30 text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs uppercase font-bold text-black/60 tracking-wider">
                      {t.planetaryAlignment}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["none", "dob", "manual"] as const).map((mode) => (
                        <button key={mode} type="button" onClick={() => setPlanetSelectMode(mode)}
                          className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all ${
                            planetSelectMode === mode
                              ? "bg-black text-white border-black"
                              : "bg-white border-black/10 text-black hover:border-[#FFD700]"
                          }`}
                        >
                          {mode === "none" ? t.noFocus : mode === "dob" ? t.dobCheck : t.pickPlanet}
                        </button>
                      ))}
                    </div>
                  </div>

                  {planetSelectMode === "dob" && (
                    <div className="p-4 bg-[#F9F9FB] border border-black/10 rounded-xl space-y-1.5">
                      <label className="block text-xs uppercase font-bold text-black/60 tracking-wider">
                        {t.dobLabel}
                      </label>
                      <input type="date" required value={dob} onChange={e => setDob(e.target.value)}
                        className="w-full bg-white border border-black/10 rounded-lg px-4 py-2.5 text-black focus:outline-none focus:border-[#FFD700] text-sm font-medium"
                      />
                      <p className="text-[10px] text-black/40">
                        {t.dobHelper}
                      </p>
                    </div>
                  )}

                  {planetSelectMode === "manual" && (
                    <div className="p-4 bg-[#F9F9FB] border border-black/10 rounded-xl space-y-2">
                      <label className="block text-xs uppercase font-bold text-black/60 tracking-wider">
                        {t.selectPlanetFocus}
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[180px] overflow-y-auto pr-1">
                        {planetList.map((p) => (
                          <button key={p.id} type="button" onClick={() => setSelectedPlanet(p.id)}
                            className={`text-left px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                              selectedPlanet === p.id
                                ? "bg-yellow-50/50 border-[#FFD700] text-[#9A7026] font-bold"
                                : "bg-white border-black/10 text-black hover:border-black/30"
                            }`}
                          >
                            🪐 {p.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <button type="submit" className="w-full py-3.5 bg-black hover:bg-black/90 active:scale-[0.99] font-bold text-sm text-white rounded-lg transition-all">
                    {t.continueToGoals}
                  </button>
                </form>
              )}

              {/* Goal Step 2: Category */}
              {goalStep === 2 && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center pb-1 border-b border-black/10">
                    <h3 className="text-base font-semibold font-serif text-black">
                      {t.yantraStep2Title}
                    </h3>
                    <button onClick={() => setGoalStep(1)} className="text-xs text-[#9A7026] hover:underline font-bold">
                      {t.back}
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoriesList.map(cat => (
                      <button key={cat.id} onClick={() => handleCategorySelect(cat.id)}
                        className="text-left bg-white border border-black/10 hover:border-[#FFD700] hover:shadow-xl rounded-xl p-5 transition-all duration-200 active:scale-[0.98] group space-y-1"
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
                <div className="space-y-6 max-w-2xl mx-auto">
                  <div className="flex justify-between items-center pb-1 border-b border-black/10">
                    <h3 className="text-base font-semibold font-serif text-black">
                      {t.yantraStep3Title}
                    </h3>
                    <button onClick={() => setGoalStep(2)} className="text-xs text-[#9A7026] hover:underline font-bold">
                      {t.back}
                    </button>
                  </div>
                  <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                    {issueList[category]?.map(issue => {
                      const localizedLabel = yantraIssueLabels[issue.id]?.[language] || issue.label;
                      return (
                        <button key={issue.id} onClick={() => handleIssueSelect(issue.id, issue.recommendedId)}
                          className="w-full text-left bg-white border border-black/10 hover:border-[#FFD700] hover:shadow-lg rounded-xl p-4 text-xs font-semibold text-black hover:text-[#9A7026] transition-all leading-relaxed active:scale-[0.99] flex items-center justify-between gap-2"
                        >
                          <span>{localizedLabel}</span>
                          <span className="text-[#9A7026] text-sm shrink-0">→</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Goal Step 4: Yantra Result */}
              {goalStep === 4 && currentYantra && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center pb-2 border-b border-black/10">
                    <h3 className="text-base font-bold font-serif text-[#9A7026]">
                      {t.yourRecommendedTalisman}
                    </h3>
                    <button onClick={resetGoal} className="text-xs text-red-600 hover:underline font-bold">
                      {t.startOver}
                    </button>
                  </div>

                  {/* Responsive 2-Column Live Editor Layout */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Column: Switchers & Info */}
                    <div className="lg:col-span-7 space-y-6">
                      
                      {/* DOB Numerology */}
                      {planetSelectMode === "dob" && missingNumbers.length > 0 && (
                        <div className="bg-[#F9F9FB] border border-black/10 p-4 rounded-xl space-y-3">
                          <p className="text-xs font-bold text-[#9A7026] uppercase tracking-wider">
                            {t.numeroscopeInsights}
                          </p>
                          <p className="text-[11px] text-black/70">
                            {t.missingGridNumbers} <span className="font-bold text-[#9A7026]">{missingNumbers.join(", ")}</span>
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <button onClick={() => setCurrentYantra(primaryYantra)}
                              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${currentYantra?.id === primaryYantra?.id ? "bg-black text-white border-black" : "bg-white text-black border-black/10 hover:border-[#FFD700]"}`}
                            >
                              {t.goalYantraRecommended}
                            </button>
                            {missingNumbers.map(num => {
                              const m = numerologyMap[num];
                              if (!m) return null;
                              const y = yantras.find(y => y.id === m.yantraId);
                              if (!y) return null;
                              return (
                                <button key={num} onClick={() => setCurrentYantra(y)}
                                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${currentYantra?.id === y.id ? "bg-black text-white border-black" : "bg-white text-black border-black/10 hover:border-[#FFD700]"}`}
                                >
                                  {language === "en" ? `Missing ${num}:` : `लापता ${num}:`} {y.name.split(" ")[0]}
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
                          <div className="bg-[#F9F9FB] border border-black/10 p-4 rounded-xl space-y-3">
                            <p className="text-xs font-bold text-[#9A7026] uppercase tracking-wider">
                              {t.planetFocusToggle}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              <button onClick={() => setCurrentYantra(primaryYantra)}
                                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${currentYantra?.id === primaryYantra?.id ? "bg-black text-white border-black" : "bg-white text-black border-black/10 hover:border-[#FFD700]"}`}
                              >
                                {t.goalYantra}
                              </button>
                              {linked && (
                                <button onClick={() => setCurrentYantra(linked)}
                                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${currentYantra?.id === linked.id ? "bg-black text-white border-black" : "bg-white text-black border-black/10 hover:border-[#FFD700]"}`}
                                >
                                  {t.planetYantraLabel} {linked.name.split(" ")[0]}
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })()}

                      {/* Custom input for dynamic yantras */}
                      {["travel-arch", "business-grid", "court-yantra", "house-protection"].includes(currentYantra.layout.type) && (
                        <div className="bg-[#F9F9FB] border border-black/10 p-4 rounded-xl space-y-3">
                          <p className="text-[11px] font-bold text-[#9A7026] uppercase tracking-wider">
                            {t.customizeTalismanContent}
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {currentYantra.layout.type === "travel-arch" && (
                              <div className="space-y-1">
                                <label className="text-[10px] text-black/50 font-bold uppercase">{t.destinationName}</label>
                                <input type="text" placeholder="e.g. Kashi" value={destination} onChange={e => setDestination(e.target.value)}
                                  className="w-full bg-white border border-black/10 rounded-lg px-3 py-2 text-black text-xs focus:outline-none focus:border-[#FFD700]" />
                              </div>
                            )}
                            {currentYantra.layout.type === "business-grid" && (
                              <div className="space-y-1">
                                <label className="text-[10px] text-black/50 font-bold uppercase">{t.businessName}</label>
                                <input type="text" placeholder="e.g. Sharma Traders" value={businessName} onChange={e => setBusinessName(e.target.value)}
                                  className="w-full bg-white border border-black/10 rounded-lg px-3 py-2 text-black text-xs focus:outline-none focus:border-[#FFD700]" />
                              </div>
                            )}
                            <div className="space-y-1">
                              <label className="text-[10px] text-black/50 font-bold uppercase">{t.nameOnTalisman}</label>
                              <input type="text" placeholder="e.g. Rahul Sharma" value={name} onChange={e => setName(e.target.value)}
                                className="w-full bg-white border border-black/10 rounded-lg px-3 py-2 text-black text-xs focus:outline-none focus:border-[#FFD700]" />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Yantra text details */}
                      <div className="bg-[#F9F9FB] border border-black/10 rounded-xl p-5 space-y-4">
                        <div>
                          <h4 className="font-bold text-black font-serif text-lg">{currentYantra.name}</h4>
                          <p className="text-xs text-black/70 mt-1 leading-relaxed">{currentYantra.description}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-bold text-black/50 tracking-wider">Benefits:</p>
                          <ul className="list-disc pl-4 text-xs text-black/80 space-y-0.5 mt-1">
                            {currentYantra.benefits.map((b, i) => <li key={i}>{b}</li>)}
                          </ul>
                        </div>
                      </div>

                    </div>

                    {/* Right Column: Rendering & Mantras (Sticky on Desktop) */}
                    <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
                      
                      {/* Yantra rendering card */}
                      <div className="border border-black/10 rounded-xl p-6 bg-white flex flex-col items-center shadow-md">
                        <YantraRenderer yantra={currentYantra} userName={name} destinationName={destination} businessName={businessName} />
                      </div>

                      {/* Mantras & preparation info */}
                      <div className="bg-yellow-50/15 border border-[#FFD700]/30 rounded-xl p-5 space-y-4">
                        {currentYantra.mantras.map((m, i) => (
                          <div key={i} className="text-center">
                            <p className="text-[9px] uppercase font-bold text-black/50 tracking-wider mb-1">{language === "en" ? "Mantra Chanting" : "मंत्र जाप"}</p>
                            <p className="text-sm italic font-serif text-black bg-white px-3 py-2.5 rounded border border-black/5 font-semibold">&quot;{m}&quot;</p>
                          </div>
                        ))}
                        <div className="text-xs text-black/75 space-y-0.5 pt-2 border-t border-black/5">
                          <p><span className="font-bold">{t.preparationDay}</span> {currentYantra.preparation.day}</p>
                          <p><span className="font-bold">{t.preparationTime}</span> {currentYantra.preparation.time}</p>
                          <p className="leading-relaxed"><span className="font-bold">{t.preparationMaterials}</span> {currentYantra.preparation.materials}</p>
                        </div>
                      </div>

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
                <form onSubmit={handleKundliSubmit} className="space-y-6 max-w-2xl mx-auto">
                  <div className="pb-1 border-b border-black/10 space-y-1">
                    <h3 className="text-base font-semibold font-serif text-black">
                      {t.enterBirthDetails}
                    </h3>
                    <p className="text-[11px] text-black/50">
                      {t.birthDetailsHelper}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs uppercase font-bold text-black/60 tracking-wider">
                      {language === "en" ? "Your Name" : "आपका नाम"}
                    </label>
                    <input type="text" placeholder="e.g. Rahul Sharma" value={name} onChange={e => setName(e.target.value)}
                      className="w-full bg-[#F9F9FB] border border-black/10 rounded-lg px-4 py-3 text-black focus:outline-none focus:border-[#FFD700] text-sm font-medium placeholder-black/30"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs uppercase font-bold text-black/60 tracking-wider">
                        {t.dobRequired}
                      </label>
                      <input type="date" required value={birthDob} onChange={e => setBirthDob(e.target.value)}
                        className="w-full bg-[#F9F9FB] border border-[#F9F9FB]/10 rounded-lg px-3 py-3 text-black focus:outline-none focus:border-[#FFD700] text-sm font-medium"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs uppercase font-bold text-black/60 tracking-wider">
                        {t.tobRequired}
                      </label>
                      <input type="time" required value={birthTime} onChange={e => setBirthTime(e.target.value)}
                        className="w-full bg-[#F9F9FB] border border-black/10 rounded-lg px-3 py-3 text-black focus:outline-none focus:border-[#FFD700] text-sm font-medium"
                      />
                    </div>
                  </div>
                  <p className="text-[10px] text-black/40 -mt-3">
                    {t.tobHelper}
                  </p>

                  <div className="space-y-1.5">
                    <label className="block text-xs uppercase font-bold text-black/60 tracking-wider">
                      {t.pobRequired}
                    </label>
                    <input type="text" required placeholder="e.g. Mumbai, India" value={birthCity} onChange={e => setBirthCity(e.target.value)}
                      className="w-full bg-[#F9F9FB] border border-black/10 rounded-lg px-4 py-3 text-black focus:outline-none focus:border-[#FFD700] text-sm font-medium placeholder-black/30"
                    />
                    <p className="text-[10px] text-black/40">
                      {t.pobHelper}
                    </p>
                  </div>

                  {geocodeError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-xs text-red-700 font-medium">
                      ⚠️ {geocodeError}
                    </div>
                  )}

                  <button type="submit" disabled={kundliLoading}
                    className="w-full py-3.5 bg-[#9A7026] hover:bg-[#855D1D] disabled:opacity-60 active:scale-[0.99] font-bold text-sm text-white rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    {kundliLoading ? (
                      <>
                        <span className="inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        {t.calculatingText}
                      </>
                    ) : (
                      t.calculateBtn
                    )}
                  </button>
                </form>
              )}

              {/* Kundli Step 2: Results */}
              {kundliStep === 2 && kundliResult && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center pb-2 border-b border-black/10">
                    <div>
                      <span className="text-[10px] font-bold text-[#9A7026] uppercase tracking-wider">
                        {t.kundliAnalysis}
                      </span>
                      <h3 className="text-base font-bold text-black font-serif">
                        {name || (language === "en" ? "Your" : "आपका")} {t.birthChartTitle}
                      </h3>
                    </div>
                    <button onClick={resetKundli} className="text-xs text-red-600 hover:underline font-bold">
                      {t.back}
                    </button>
                  </div>

                  {/* Responsive 2-Column live calculation editor */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Column: Planetary tables, chart, switcher */}
                    <div className="lg:col-span-7 space-y-6">
                      
                      {/* Lagna & Birth Info Card */}
                      <div className="bg-black text-white rounded-xl p-5 space-y-4 border border-[#FFD700]/30 shadow-md">
                        <div className="flex flex-wrap gap-4 justify-between items-start">
                          <div>
                            <p className="text-[10px] uppercase tracking-wider text-[#FFD700] font-bold">{t.lagnaLabel}</p>
                            <p className="text-2xl font-bold font-serif mt-0.5 text-white">{kundliResult.lagnaSignName}</p>
                            <p className="text-[11px] text-white/60 mt-0.5">
                              {kundliResult.lagnaDegrees}° {kundliResult.lagnaMinutes}′ · {kundliResult.lagnaNakshatra}
                            </p>
                            <p className="text-[11px] text-white/50 mt-0.5">{kundliResult.birthPlace}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] uppercase tracking-wider text-[#FFD700] font-bold">{t.ayanamshaLabel}</p>
                            <p className="text-sm font-bold text-white">{kundliResult.ayanamsha.toFixed(4)}°</p>
                            <p className="text-[10px] text-white/50">Lahiri</p>
                          </div>
                        </div>

                        {/* Planet grid */}
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-[#FFD700] font-bold mb-2">
                            {t.navagrahaPositions}
                          </p>
                          <div className="space-y-1 text-black">
                            {kundliResult.planets.map(p => (
                              <div key={p.planet}
                                className={`px-2.5 py-2 rounded-lg text-[10px] font-bold flex items-center gap-2 ${
                                  p.debilitated || p.combust ? "bg-red-100 border border-red-300"
                                  : p.exalted ? "bg-yellow-50 border border-yellow-300"
                                  : p.ownSign ? "bg-green-50 border border-green-200"
                                  : "bg-white"
                                }`}
                              >
                                <span className="text-base shrink-0" style={{ color: p.color }}>{p.symbol}</span>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1">
                                    <span>{p.name.split(" ")[0]}</span>
                                    {p.retrograde && <span className="text-[8px] text-orange-600 font-black">(R)</span>}
                                    {p.exalted && <span className="text-[8px] text-yellow-700 font-black">⬆ UCH</span>}
                                    {p.ownSign && !p.exalted && <span className="text-[8px] text-green-700 font-black">⌂ SW</span>}
                                    {p.debilitated && <span className="text-[8px] text-red-700 font-black">⬇ NEE</span>}
                                    {p.combust && !p.debilitated && <span className="text-[8px] text-orange-700 font-black">🔥</span>}
                                  </div>
                                  <div className="text-[9px] font-normal opacity-70 mt-0.5">
                                    H{p.house} · {p.signName.slice(0, 3)} {p.degrees}°{p.minutes}′ · {p.nakshatra}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Weak Planets Summary */}
                      {kundliResult.weakPlanets.length === 0 ? (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center space-y-2">
                          <p className="text-2xl">✅</p>
                          <p className="text-sm font-bold text-green-800">
                            {t.noWeakPlanets}
                          </p>
                          <p className="text-xs text-green-700">
                            {t.noWeakPlanetsDesc}
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <p className="text-xs font-bold uppercase text-black/50 tracking-wider">
                              {kundliResult.weakPlanets.length}{" "}
                              {kundliResult.weakPlanets.length > 1 ? t.afflictedPlanetsDetectedPlural : t.afflictedPlanetsDetected}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {kundliRecs.map(rec => (
                                <button key={rec.planet} onClick={() => setKundliActiveRec(rec.planet)}
                                  className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                                    kundliActiveRec === rec.planet
                                      ? "bg-black text-white border-black"
                                      : rec.severity === "high"
                                        ? "bg-red-50 border-red-200 text-red-800 hover:bg-red-100"
                                        : "bg-white border-black/10 text-black hover:border-[#FFD700]"
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
                          {kundliRecs.find(r => r.planet === kundliActiveRec) && (() => {
                            const activeRecObj = kundliRecs.find(r => r.planet === kundliActiveRec);
                            return (
                              <div className={`border rounded-xl p-4 text-xs space-y-1 ${
                                activeRecObj?.severity === "high" ? "bg-red-50 border-red-200" : "bg-[#F9F9FB] border-black/10"
                              }`}>
                                <p className="font-bold text-black">
                                  {activeRecObj?.symbol} {t.whyPlanetQuestion} {activeRecObj?.planetName}?
                                </p>
                                <p className="text-black/70 leading-relaxed">
                                  {activeRecObj?.reason}
                                </p>
                                <p className="text-[#9A7026] font-semibold">
                                  {t.remedyStrongLabel} <strong>{t.remedyText}</strong>
                                </p>
                              </div>
                            );
                          })()}
                        </div>
                      )}

                    </div>

                    {/* Right Column: Rendered Yantra (Sticky) */}
                    <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
                      
                      {activeKundliYantra && (
                        <>
                          <div className="border border-black/10 rounded-xl p-6 bg-white flex flex-col items-center shadow-md">
                            <YantraRenderer yantra={activeKundliYantra} userName={name} destinationName="" businessName="" />
                          </div>

                          <div className="bg-yellow-50/15 border border-[#FFD700]/30 rounded-xl p-5 space-y-4 text-left">
                            <div>
                              <h4 className="font-bold text-black font-serif text-lg">{activeKundliYantra.name}</h4>
                              <p className="text-xs text-black/70 mt-1 leading-relaxed">{activeKundliYantra.description}</p>
                            </div>
                            <div>
                              <p className="text-[10px] uppercase font-bold text-black/50 tracking-wider">Benefits:</p>
                              <ul className="list-disc pl-4 text-xs text-black/80 space-y-0.5 mt-1">
                                {activeKundliYantra.benefits.map((b, i) => <li key={i}>{b}</li>)}
                              </ul>
                            </div>
                            {activeKundliYantra.mantras.map((m, i) => (
                              <p key={i} className="text-xs italic font-serif text-black text-center bg-white px-3 py-2 rounded border border-black/5 font-semibold">&quot;{m}&quot;</p>
                            ))}
                            <div className="text-xs text-black/75 space-y-0.5 pt-2 border-t border-black/5">
                              <p><span className="font-bold">{t.preparationDay}</span> {activeKundliYantra.preparation.day}</p>
                              <p><span className="font-bold">{t.preparationTime}</span> {activeKundliYantra.preparation.time}</p>
                              <p className="leading-relaxed"><span className="font-bold">{t.preparationMaterials}</span> {activeKundliYantra.preparation.materials}</p>
                            </div>
                          </div>
                        </>
                      )}

                    </div>

                  </div>
                </div>
              )}
            </>
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

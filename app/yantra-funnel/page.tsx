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

type AppMode = "goal" | "kundli" | "planet";

// ── Shared style constants ─────────────────────────────────────────────────
const BG_BASE    = "#08081A";
const BG_CARD    = "linear-gradient(145deg, #111128 0%, #0d0d22 100%)";
const BORDER_DIM = "rgba(255,213,105,0.12)";

export default function YantraPage() {
  const { language, setLanguage, t } = useLanguage();

  const [appMode, setAppMode] = useState<AppMode>("goal");
  const [name, setName] = useState("");

  // ── Goal-based flow state ───────────────────────────────────────────────
  const [goalStep, setGoalStep] = useState(1);
  const [planetSelectMode, setPlanetSelectMode] = useState<"none" | "dob" | "manual">("none");
  const [dob, setDob] = useState("");
  const [selectedPlanet, setSelectedPlanet] = useState("");
  const [planetStep, setPlanetStep] = useState(1);
  const [missingNumbers, setMissingNumbers] = useState<number[]>([]);
  const [category, setCategory] = useState("");
  const [primaryYantra, setPrimaryYantra] = useState<Yantra | null>(null);
  const [currentYantra, setCurrentYantra] = useState<Yantra | null>(null);
  const [destination, setDestination] = useState("");
  const [businessName, setBusinessName] = useState("");

  // ── Kundli flow state ─────────────────────────────────────────────────
  const [kundliStep, setKundliStep] = useState(1);
  const [birthDob, setBirthDob] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthCity, setBirthCity] = useState("");
  const [birthTz, setBirthTz] = useState<number>(5.5);
  const [geocodeError, setGeocodeError] = useState("");
  const [kundliResult, setKundliResult] = useState<KundliResult | null>(null);
  const [kundliRecs, setKundliRecs] = useState<YantraRecommendation[]>([]);
  const [kundliActiveRec, setKundliActiveRec] = useState<string>("");
  const [kundliLoading, setKundliLoading] = useState(false);

  // ── Location autocomplete ─────────────────────────────────────────────
  const [suggestions, setSuggestions] = useState<Array<{ displayName: string; lat: number; lng: number }>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number; displayName: string } | null>(null);
  const debounceTimer = React.useRef<any>(null);

  const fetchSuggestions = async (val: string) => {
    if (val.trim().length < 3) { setSuggestions([]); return; }
    setSearchLoading(true);
    try {
      let url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(val)}&countrycodes=in&format=json&limit=6&addressdetails=1`;
      let res = await fetch(url, { headers: { "User-Agent": "AstroLearn-Kundli/1.0" } });
      let data = await res.json();
      if (!data || data.length === 0) {
        url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(val)}&format=json&limit=6&addressdetails=1`;
        res = await fetch(url, { headers: { "User-Agent": "AstroLearn-Kundli/1.0" } });
        data = await res.json();
      }
      if (data && Array.isArray(data)) {
        setSuggestions(data.map(item => {
          const addr = item.address || {};
          const place = addr.village || addr.town || addr.suburb || addr.city_district || addr.city || addr.municipality || "";
          const district = addr.county || addr.district || "";
          const state = addr.state || "";
          const country = addr.country || "";
          let parts = [place, district, state, country].filter(Boolean);
          let display = parts.join(", ");
          if (!display) display = item.display_name;
          return { displayName: display, lat: parseFloat(item.lat), lng: parseFloat(item.lon) };
        }));
      }
    } catch (err) { console.error("Suggestions error:", err); }
    setSearchLoading(false);
  };

  const handleCityChange = (val: string) => {
    setBirthCity(val); setSelectedCoords(null); setShowSuggestions(true);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => fetchSuggestions(val), 450);
  };

  const selectSuggestion = (s: { displayName: string; lat: number; lng: number }) => {
    setBirthCity(s.displayName); setSelectedCoords({ lat: s.lat, lng: s.lng, displayName: s.displayName });
    setSuggestions([]); setShowSuggestions(false);
  };

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

  const categoryColors: Record<string, { color: string; from: string; to: string }> = {
    wealth:     { color: "#FFD700", from: "rgba(255,215,0,0.12)",   to: "rgba(234,179,8,0.05)" },
    health:     { color: "#4ade80", from: "rgba(74,222,128,0.12)",  to: "rgba(34,197,94,0.05)" },
    studies:    { color: "#60a5fa", from: "rgba(96,165,250,0.12)",  to: "rgba(37,99,235,0.05)" },
    protection: { color: "#c084fc", from: "rgba(192,132,252,0.12)", to: "rgba(168,85,247,0.05)" },
    marriage:   { color: "#f472b6", from: "rgba(244,114,182,0.12)", to: "rgba(236,72,153,0.05)" },
    success:    { color: "#fb923c", from: "rgba(251,146,60,0.12)",  to: "rgba(249,115,22,0.05)" },
  };

  const categoriesList = [
    { id: "wealth",    title: categoryTitles.wealth[language],     desc: categoryDescs.wealth[language],     icon: "💰" },
    { id: "health",    title: categoryTitles.health[language],     desc: categoryDescs.health[language],     icon: "🌿" },
    { id: "studies",   title: categoryTitles.studies[language],    desc: categoryDescs.studies[language],    icon: "🎓" },
    { id: "protection",title: categoryTitles.protection[language], desc: categoryDescs.protection[language], icon: "🛡️" },
    { id: "marriage",  title: categoryTitles.marriage[language],   desc: categoryDescs.marriage[language],   icon: "❤️" },
    { id: "success",   title: categoryTitles.success[language],    desc: categoryDescs.success[language],    icon: "✨" },
  ];

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

  // ── Handlers: Goal flow ────────────────────────────────────────────────
  const handleGoalStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (planetSelectMode === "dob" && dob) {
      const digits = new Set<number>();
      for (const c of dob.replace(/[^0-9]/g, "")) { const n = parseInt(c); if (n >= 1 && n <= 9) digits.add(n); }
      const missing: number[] = [];
      for (let i = 1; i <= 9; i++) { if (!digits.has(i)) missing.push(i); }
      setMissingNumbers(missing);
    } else { setMissingNumbers([]); }
    setGoalStep(2);
  };

  const handleCategorySelect = (catId: string) => { setCategory(catId); setGoalStep(3); };

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

  const resetPlanet = () => {
    setPlanetStep(1); setSelectedPlanet(""); setName(""); setCurrentYantra(null);
  };

  const handlePlanetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlanet) return;
    const found = yantras.find((y) => y.id === selectedPlanet);
    if (found) { setCurrentYantra(found); }
    setPlanetStep(2);
  };

  // ── Handlers: Kundli flow ─────────────────────────────────────────────
  const handleKundliSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeocodeError("");
    setKundliLoading(true);
    let location: { lat: number; lng: number; displayName: string } | null = null;
    if (selectedCoords && selectedCoords.displayName === birthCity) {
      location = selectedCoords;
    } else {
      location = await geocodeCity(birthCity);
    }
    if (!location) {
      setGeocodeError(language === "en" ? "Could not find this city. Try selecting from the suggestions list." : "यह शहर नहीं मिल सका। कृपया सुझाव सूची से चयन करने का प्रयास करें।");
      setKundliLoading(false);
      return;
    }
    try {
      const result = calculateKundli(birthDob, birthTime, location.lat, location.lng, location.displayName, birthTz);
      const recs = getKundliYantraRecommendations(result);
      setKundliResult(result);
      setKundliRecs(recs);
      if (recs.length > 0) setKundliActiveRec(recs[0].planet);
      setKundliStep(2);
    } catch (err) {
      setGeocodeError(language === "en" ? "Calculation error. Please check birth details and try again." : "गणना त्रुटि। कृपया जन्म के विवरण की जांच करें और पुनः प्रयास करें।");
    }
    setKundliLoading(false);
  };

  const resetKundli = () => {
    setKundliStep(1); setBirthDob(""); setBirthTime(""); setBirthCity("");
    setSuggestions([]); setShowSuggestions(false); setSelectedCoords(null);
    setKundliResult(null); setKundliRecs([]); setKundliActiveRec(""); setGeocodeError("");
  };

  const activeKundliYantra = kundliRecs.length > 0 ? yantras.find(y => y.id === kundliActiveRec) ?? null : null;

  // ── Shared input style ─────────────────────────────────────────────────
  const inputCls = "w-full rounded-xl px-4 py-3 text-sm text-white font-medium focus:outline-none transition-all placeholder-white/25";
  const inputStyle = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,213,105,0.2)", color: "white" } as React.CSSProperties;

  // ── Sanskrit planet names ──────────────────────────────────────────────
  const sanskritNames: Record<string, string> = {
    surya: "सूर्य यंत्र", chandra: "चन्द्र यंत्र", mangal: "मंगल यंत्र",
    budh: "बुध यंत्र", guru: "गुरु यंत्र", shukra: "शुक्र यंत्र",
    shani: "शनि यंत्र", rahu: "राहु यंत्र", ketu: "केतु यंत्र"
  };

  return (
    <div className="min-h-screen text-white font-sans flex flex-col pb-14 relative overflow-x-hidden" style={{ background: BG_BASE }}>

      {/* ── Ambient glows ─────────────────────────────────────────────────── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-[0.10]"
          style={{ background: "radial-gradient(circle, #A855F7 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 -left-20 w-96 h-96 rounded-full opacity-[0.08]"
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
            <Link href="/remedies/find" className="text-xs font-bold text-white/60 hover:text-[#FFD369] transition-colors hidden sm:block">{t.masalaRemedies}</Link>
            <div className="flex rounded-lg p-0.5 border border-white/10" style={{ background: "rgba(255,255,255,0.05)" }}>
              <button onClick={() => setLanguage("en")} className={`text-[10px] font-bold px-2.5 py-1 rounded-md transition-all ${language === "en" ? "bg-[#FFD369] text-black" : "text-white/50 hover:text-white"}`}>EN</button>
              <button onClick={() => setLanguage("hi")} className={`text-[10px] font-bold px-2.5 py-1 rounded-md transition-all ${language === "hi" ? "bg-[#FFD369] text-black" : "text-white/50 hover:text-white"}`}>हिन्दी</button>
            </div>
          </div>
        </header>
      </div>

      {/* ── Main ──────────────────────────────────────────────────────────── */}
      <div className="flex-grow w-full max-w-6xl mx-auto px-4 py-10 md:py-14 z-10 relative">

        {/* Page header */}
        <div className="text-center space-y-2 mb-10">
          <p className="text-[10px] font-black uppercase tracking-[0.25em]" style={{ color: "#FFD369", opacity: 0.7 }}>
            ✦ {language === "en" ? "Vedic Geometry Talismans" : "वैदिक ज्यामितीय तावीज"} ✦
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold"
            style={{ background: "linear-gradient(135deg, #FFD369 0%, #F1F0FF 60%, #C4B5FD 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            {t.yantraTitle}
          </h2>
          <p className="text-xs text-white/40 max-w-md mx-auto leading-relaxed">{t.yantraDesc}</p>
        </div>

        {/* ── Mode Toggle — only on step 1 ──────────────────────────────── */}
        {((appMode === "goal" && goalStep === 1) || (appMode === "kundli" && kundliStep === 1) || (appMode === "planet" && planetStep === 1)) && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-10">
            <button onClick={() => { setAppMode("goal"); resetGoal(); }}
              className="py-5 px-5 rounded-2xl border text-left transition-all duration-250 space-y-1.5"
              style={{
                background: appMode === "goal" ? "linear-gradient(135deg, rgba(108,92,231,0.2), rgba(168,85,247,0.1))" : "rgba(255,255,255,0.03)",
                border: appMode === "goal" ? "1px solid rgba(168,85,247,0.5)" : "1px solid rgba(255,255,255,0.08)",
                boxShadow: appMode === "goal" ? "0 0 24px rgba(108,92,231,0.2)" : "none"
              }}>
              <div className="text-xl">🎯</div>
              <div className="text-xs font-black text-white">{t.byGoalBtn}</div>
              <div className="text-[10px] font-normal text-white/45">{t.byGoalBtnDesc}</div>
            </button>
            <button onClick={() => { setAppMode("kundli"); resetKundli(); }}
              className="py-5 px-5 rounded-2xl border text-left transition-all duration-250 space-y-1.5"
              style={{
                background: appMode === "kundli" ? "linear-gradient(135deg, rgba(255,213,105,0.12), rgba(245,166,35,0.06))" : "rgba(255,255,255,0.03)",
                border: appMode === "kundli" ? "1px solid rgba(255,213,105,0.45)" : "1px solid rgba(255,255,255,0.08)",
                boxShadow: appMode === "kundli" ? "0 0 24px rgba(255,213,105,0.12)" : "none"
              }}>
              <div className="text-xl">🔭</div>
              <div className="text-xs font-black text-white">{t.byKundliBtn}</div>
              <div className="text-[10px] font-normal text-white/45">{t.byKundliBtnDesc}</div>
            </button>
            <button onClick={() => { setAppMode("planet"); resetPlanet(); }}
              className="py-5 px-5 rounded-2xl border text-left transition-all duration-250 space-y-1.5"
              style={{
                background: appMode === "planet" ? "linear-gradient(135deg, rgba(168,85,247,0.15), rgba(192,132,252,0.1))" : "rgba(255,255,255,0.03)",
                border: appMode === "planet" ? "1px solid rgba(168,85,247,0.5)" : "1px solid rgba(255,255,255,0.08)",
                boxShadow: appMode === "planet" ? "0 0 24px rgba(168,85,247,0.15)" : "none"
              }}>
              <div className="text-xl">🪐</div>
              <div className="text-xs font-black text-white">{t.byPlanetBtn}</div>
              <div className="text-[10px] font-normal text-white/45">{t.byPlanetBtnDesc}</div>
            </button>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            GOAL BASED FLOW
        ══════════════════════════════════════════════════════ */}
        {appMode === "goal" && (
          <>
            {/* Goal Step 1: Details */}
            {goalStep === 1 && (
              <form onSubmit={handleGoalStep1} className="space-y-5 max-w-xl mx-auto">
                <div className="rounded-2xl p-7 space-y-5" style={{ background: BG_CARD, border: `1px solid ${BORDER_DIM}` }}>
                  <h3 className="text-sm font-black font-serif text-white/80 pb-3 border-b border-white/8">{t.yantraStep1Title}</h3>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/40">{t.yourNameRequired}</label>
                    <input type="text" required placeholder="e.g. Rahul Sharma"
                      value={name} onChange={e => setName(e.target.value)}
                      className={inputCls} style={inputStyle}
                      onFocus={e => (e.target.style.borderColor = "rgba(168,85,247,0.55)")}
                      onBlur={e => (e.target.style.borderColor = "rgba(255,213,105,0.2)")} />
                  </div>
                </div>

                <button type="submit"
                  className="w-full py-4 rounded-2xl font-black text-sm text-white transition-all hover:opacity-90 active:scale-[0.99] shadow-lg"
                  style={{ background: "linear-gradient(135deg, #6C5CE7, #A855F7, #EC4899)", boxShadow: "0 8px 24px rgba(108,92,231,0.35)" }}>
                  {t.continueToGoals} →
                </button>
              </form>
            )}

            {/* Goal Step 2: Categories */}
            {goalStep === 2 && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-bold font-serif text-white/90">{t.yantraStep2Title}</h3>
                  <button onClick={() => setGoalStep(1)} className="text-xs font-bold text-white/40 hover:text-[#FFD369] transition-colors">← {t.back}</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoriesList.map(cat => {
                    const c = categoryColors[cat.id];
                    return (
                      <button key={cat.id} onClick={() => handleCategorySelect(cat.id)}
                        className="group text-left rounded-2xl p-5 transition-all duration-250 active:scale-[0.97] space-y-3 hover:-translate-y-1"
                        style={{ background: `linear-gradient(145deg, ${c.from}, ${c.to})`, border: `1px solid ${c.color}25` }}
                        onMouseEnter={e => (e.currentTarget.style.borderColor = `${c.color}60`)}
                        onMouseLeave={e => (e.currentTarget.style.borderColor = `${c.color}25`)}>
                        <div className="flex items-center gap-3">
                          <span className="text-2xl group-hover:scale-110 transition-transform block">{cat.icon}</span>
                          <p className="font-bold text-white font-serif text-sm">{cat.title}</p>
                        </div>
                        <p className="text-[11px] text-white/50 leading-relaxed">{cat.desc}</p>
                        <div className="text-[10px] font-black uppercase tracking-wider flex items-center gap-1" style={{ color: c.color }}>
                          <span>Choose</span><span>→</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Goal Step 3: Issues */}
            {goalStep === 3 && (
              <div className="space-y-5 max-w-2xl mx-auto">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-wider text-white/35">Select Your Concern</p>
                    <h3 className="text-base font-bold font-serif text-white/90 mt-0.5">{t.yantraStep3Title}</h3>
                  </div>
                  <button onClick={() => setGoalStep(2)} className="text-xs font-bold text-white/40 hover:text-[#FFD369] transition-colors">← {t.back}</button>
                </div>
                <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                  {issueList[category]?.map(issue => {
                    const localizedLabel = yantraIssueLabels[issue.id]?.[language] || issue.label;
                    return (
                      <button key={issue.id} onClick={() => handleIssueSelect(issue.id, issue.recommendedId)}
                        className="group w-full text-left rounded-xl px-5 py-4 flex items-center justify-between gap-3 transition-all duration-200 active:scale-[0.99]"
                        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(168,85,247,0.07)"; e.currentTarget.style.borderColor = "rgba(168,85,247,0.3)"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; }}>
                        <span className="text-xs text-white/70 group-hover:text-white leading-relaxed font-medium transition-colors">{localizedLabel}</span>
                        <span className="text-white/30 group-hover:text-[#A855F7] text-base shrink-0 transition-colors">→</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Goal Step 4: Yantra Result */}
            {goalStep === 4 && currentYantra && (
              <div className="space-y-6">
                {/* ── Result Header ── */}
                <div className="flex justify-between items-center px-1">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#FFD369]/60">✦ Your Sacred Talisman</p>
                    <h3 className="text-xl font-bold font-serif text-white mt-0.5">{t.yourRecommendedTalisman}</h3>
                  </div>
                  <button onClick={resetGoal}
                    className="text-[10px] font-black uppercase tracking-wider text-white/35 hover:text-red-400 transition-colors border border-white/10 hover:border-red-400/30 px-3 py-1.5 rounded-lg">
                    {t.startOver}
                  </button>
                </div>

                {/* ── Full-width Yantra Card (reference: apnaastro layout) ── */}
                <div className="rounded-2xl overflow-hidden" style={{ background: BG_CARD, border: "1px solid rgba(255,213,105,0.22)" }}>

                  {/* Card Top Banner */}
                  <div className="flex flex-wrap items-start justify-between gap-3 px-7 pt-6 pb-5 border-b" style={{ borderColor: "rgba(255,213,105,0.12)" }}>
                    <div className="space-y-1">
                      <h3 className="text-xl md:text-2xl font-black font-serif text-[#FFD369] uppercase tracking-wide leading-tight">
                        {currentYantra.name}
                      </h3>
                      <p className="text-[10px] font-bold tracking-[0.22em] text-white/30 uppercase">✦ Vedic Remedial Geometry ✦</p>
                    </div>
                    <span className="shrink-0 text-black text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider mt-1"
                      style={{ background: "linear-gradient(135deg, #FFD369, #F5A623)" }}>
                      RECOMMENDED REMEDY
                    </span>
                  </div>

                  {/* Card Body — 2 always-filled columns */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">

                    {/* ── LEFT COLUMN: Drawing + Description + Optional Switchers ── */}
                    <div className="p-6 space-y-5 border-r" style={{ borderColor: "rgba(255,213,105,0.08)" }}>

                      {/* Yantra SVG Drawing */}
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#FFD369]/65 mb-3 flex items-center gap-2">
                          <span className="text-yellow-400">✨</span> SACRED BHOJPATRA DRAWING
                        </p>
                        <div className="flex flex-col items-center justify-center p-5 bg-white rounded-2xl shadow-2xl max-w-[280px] mx-auto">
                          <YantraRenderer yantra={currentYantra} userName={name} destinationName={destination} businessName={businessName} justSvg={true} />
                        </div>
                      </div>

                      {/* Description */}
                      <div className="rounded-xl p-4 space-y-1.5" style={{ background: "rgba(255,213,105,0.04)", border: "1px solid rgba(255,213,105,0.12)" }}>
                        <p className="text-[9px] font-black tracking-[0.18em] uppercase text-[#FFD369]">Focus of Talisman</p>
                        <p className="text-[11px] text-white/75 leading-relaxed">{currentYantra.description}</p>
                      </div>

                      {/* DOB Numerology switcher (optional) */}
                      {planetSelectMode === "dob" && missingNumbers.length > 0 && (
                        <div className="rounded-xl p-4 space-y-3" style={{ background: "rgba(255,213,105,0.04)", border: "1px solid rgba(255,213,105,0.12)" }}>
                          <p className="text-[9px] font-black tracking-[0.18em] uppercase text-[#FFD369]">{t.numeroscopeInsights}</p>
                          <p className="text-[10px] text-white/55">
                            {t.missingGridNumbers} <span className="font-bold text-[#FFD369]">{missingNumbers.join(", ")}</span>
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <button onClick={() => setCurrentYantra(primaryYantra)}
                              className="px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all"
                              style={{ background: currentYantra?.id === primaryYantra?.id ? "#FFD369" : "rgba(255,255,255,0.06)", color: currentYantra?.id === primaryYantra?.id ? "#000" : "rgba(255,255,255,0.65)", border: currentYantra?.id === primaryYantra?.id ? "none" : "1px solid rgba(255,255,255,0.1)" }}>
                              {t.goalYantraRecommended}
                            </button>
                            {missingNumbers.map(num => {
                              const m = numerologyMap[num];
                              if (!m) return null;
                              const y = yantras.find(y => y.id === m.yantraId);
                              if (!y) return null;
                              return (
                                <button key={num} onClick={() => setCurrentYantra(y)}
                                  className="px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all"
                                  style={{ background: currentYantra?.id === y.id ? "#FFD369" : "rgba(255,255,255,0.06)", color: currentYantra?.id === y.id ? "#000" : "rgba(255,255,255,0.65)", border: currentYantra?.id === y.id ? "none" : "1px solid rgba(255,255,255,0.1)" }}>
                                  {language === "en" ? `Missing ${num}:` : `लापता ${num}:`} {y.name.split(" ")[0]}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Manual planet switcher (optional) */}
                      {planetSelectMode === "manual" && selectedPlanet && (() => {
                        const linked = yantras.find(y => y.id === selectedPlanet);
                        return (
                          <div className="rounded-xl p-4 space-y-3" style={{ background: "rgba(168,85,247,0.05)", border: "1px solid rgba(168,85,247,0.15)" }}>
                            <p className="text-[9px] font-black tracking-[0.18em] uppercase text-[#A855F7]">{t.planetFocusToggle}</p>
                            <div className="flex flex-wrap gap-2">
                              <button onClick={() => setCurrentYantra(primaryYantra)}
                                className="px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all"
                                style={{ background: currentYantra?.id === primaryYantra?.id ? "#FFD369" : "rgba(255,255,255,0.06)", color: currentYantra?.id === primaryYantra?.id ? "#000" : "rgba(255,255,255,0.65)", border: currentYantra?.id === primaryYantra?.id ? "none" : "1px solid rgba(255,255,255,0.1)" }}>
                                {t.goalYantra}
                              </button>
                              {linked && (
                                <button onClick={() => setCurrentYantra(linked)}
                                  className="px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all"
                                  style={{ background: currentYantra?.id === linked.id ? "#FFD369" : "rgba(255,255,255,0.06)", color: currentYantra?.id === linked.id ? "#000" : "rgba(255,255,255,0.65)", border: currentYantra?.id === linked.id ? "none" : "1px solid rgba(255,255,255,0.1)" }}>
                                  {t.planetYantraLabel} {linked.name.split(" ")[0]}
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })()}

                      {/* Dynamic yantra customizer (optional) */}
                      {["travel-arch", "business-grid", "court-yantra", "house-protection"].includes(currentYantra.layout.type) && (
                        <div className="rounded-xl p-4 space-y-3" style={{ background: "rgba(255,213,105,0.04)", border: "1px solid rgba(255,213,105,0.12)" }}>
                          <p className="text-[9px] font-black tracking-[0.18em] uppercase text-[#FFD369]">{t.customizeTalismanContent}</p>
                          <div className="space-y-3">
                            {currentYantra.layout.type === "travel-arch" && (
                              <div className="space-y-1">
                                <label className="text-[10px] text-white/40 font-bold uppercase">{t.destinationName}</label>
                                <input type="text" placeholder="e.g. Kashi" value={destination} onChange={e => setDestination(e.target.value)} className={inputCls} style={inputStyle} />
                              </div>
                            )}
                            {currentYantra.layout.type === "business-grid" && (
                              <div className="space-y-1">
                                <label className="text-[10px] text-white/40 font-bold uppercase">{t.businessName}</label>
                                <input type="text" placeholder="e.g. Sharma Traders" value={businessName} onChange={e => setBusinessName(e.target.value)} className={inputCls} style={inputStyle} />
                              </div>
                            )}
                            <div className="space-y-1">
                              <label className="text-[10px] text-white/40 font-bold uppercase">{t.nameOnTalisman}</label>
                              <input type="text" placeholder="e.g. Rahul Sharma" value={name} onChange={e => setName(e.target.value)} className={inputCls} style={inputStyle} />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* ── RIGHT COLUMN: Consecration Details ── */}
                    <div className="p-6 space-y-5">

                      {/* Section 1: Problem Analysis */}
                      <div className="space-y-3">
                        <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-[#FFD369]/65 flex items-center gap-2">
                          <span className="text-red-400">🛑</span> 1. PROBLEM & CHALLENGE ANALYSIS
                        </h4>
                        <div className="rounded-xl p-4 space-y-1.5" style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)" }}>
                          <p className="text-[9px] font-black tracking-[0.18em] uppercase text-red-400">Identified Blockage</p>
                          <p className="text-[11px] text-white/75 leading-relaxed">{currentYantra.description}</p>
                        </div>
                      </div>

                      {/* Section 2: Ritual Instructions */}
                      <div className="space-y-3">
                        <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-[#FFD369]/65 flex items-center gap-2">
                          <span className="text-green-400">🧘</span> 2. CONSECRATION & ACTIVATION
                        </h4>
                        <div className="rounded-xl p-4 space-y-2 text-[11px]" style={{ background: "rgba(74,222,128,0.04)", border: "1px solid rgba(74,222,128,0.12)" }}>
                          <p className="text-[9px] font-black tracking-[0.18em] uppercase text-green-400">Ritual Instructions</p>
                          <p className="text-white/65"><span className="font-bold text-white/50">{t.preparationDay}</span> {currentYantra.preparation.day}</p>
                          <p className="text-white/65"><span className="font-bold text-white/50">{t.preparationTime}</span> {currentYantra.preparation.time}</p>
                          <p className="text-white/65 leading-relaxed"><span className="font-bold text-white/50">{t.preparationMaterials}</span> {currentYantra.preparation.materials}</p>
                        </div>
                      </div>

                      {/* Section 3: Mantras */}
                      <div className="space-y-3">
                        <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-[#FFD369]/65 flex items-center gap-2">
                          <span className="text-violet-400">🔱</span> 3. ACTIVATION MANTRAS
                        </h4>
                        <div className="space-y-2">
                          {currentYantra.mantras.map((m, i) => (
                            <p key={i} className="italic text-xs font-serif text-white/80 rounded-xl px-4 py-3 text-center font-semibold leading-relaxed"
                              style={{ background: "rgba(168,85,247,0.06)", border: "1px solid rgba(168,85,247,0.15)" }}>
                              &ldquo;{m}&rdquo;
                            </p>
                          ))}
                        </div>
                      </div>

                      {/* Section 4: Benefits */}
                      <div className="space-y-3">
                        <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-[#FFD369]/65 flex items-center gap-2">
                          <span className="text-yellow-400">✦</span> 4. EXPECTED BENEFITS
                        </h4>
                        <ul className="space-y-2">
                          {currentYantra.benefits.map((b, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-[11px] text-white/65">
                              <span className="text-[#FFD369] shrink-0 mt-0.5 font-black">›</span>
                              <span className="leading-relaxed">{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ══════════════════════════════════════════════════════
            KUNDLI FLOW
        ══════════════════════════════════════════════════════ */}
        {appMode === "kundli" && (
          <>
            {/* Kundli Step 1: Birth Form */}
            {kundliStep === 1 && (
              <form onSubmit={handleKundliSubmit} className="space-y-5 max-w-2xl mx-auto">
                <div className="rounded-2xl p-7 space-y-5" style={{ background: BG_CARD, border: `1px solid ${BORDER_DIM}` }}>
                  <div className="space-y-1 pb-3 border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
                    <h3 className="text-sm font-black font-serif text-white/85">{t.enterBirthDetails}</h3>
                    <p className="text-[11px] text-white/40">{t.birthDetailsHelper}</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                      {language === "en" ? "Your Name" : "आपका नाम"}
                    </label>
                    <input type="text" placeholder="e.g. Priya Sharma" value={name} onChange={e => setName(e.target.value)}
                      className={inputCls} style={inputStyle}
                      onFocus={e => (e.target.style.borderColor = "rgba(255,213,105,0.5)")}
                      onBlur={e => (e.target.style.borderColor = "rgba(255,213,105,0.2)")} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/40">{t.dobRequired}</label>
                      <input type="date" required value={birthDob} onChange={e => setBirthDob(e.target.value)}
                        className={inputCls} style={inputStyle}
                        onFocus={e => (e.target.style.borderColor = "rgba(255,213,105,0.5)")}
                        onBlur={e => (e.target.style.borderColor = "rgba(255,213,105,0.2)")} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/40">{t.tobRequired}</label>
                      <input type="time" required value={birthTime} onChange={e => setBirthTime(e.target.value)}
                        className={inputCls} style={inputStyle}
                        onFocus={e => (e.target.style.borderColor = "rgba(255,213,105,0.5)")}
                        onBlur={e => (e.target.style.borderColor = "rgba(255,213,105,0.2)")} />
                    </div>
                  </div>
                  <p className="text-[10px] text-white/30 -mt-3">{t.tobHelper}</p>

                  <div className="space-y-1.5 relative">
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/40">{t.pobRequired}</label>
                    <div className="relative">
                      <input type="text" required
                        placeholder={language === "en" ? "Search your village, town or city..." : "अपना गाँव, कस्बा या शहर खोजें..."}
                        value={birthCity} onChange={e => handleCityChange(e.target.value)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 250)}
                        onFocus={() => setShowSuggestions(true)}
                        className={inputCls + " pr-10"} style={inputStyle}
                        onFocusCapture={e => (e.target.style.borderColor = "rgba(255,213,105,0.5)")}
                        onBlurCapture={e => (e.target.style.borderColor = "rgba(255,213,105,0.2)")} />
                      {searchLoading && (
                        <span className="absolute right-3.5 top-3.5 block w-4 h-4 border-2 border-[#FFD369] border-t-transparent rounded-full animate-spin" />
                      )}
                    </div>
                    {/* Suggestions dropdown */}
                    {showSuggestions && suggestions.length > 0 && (
                      <div className="absolute left-0 right-0 top-full mt-1 rounded-xl shadow-2xl z-50 max-h-[220px] overflow-y-auto divide-y"
                        style={{ background: "#1a1a35", border: "1px solid rgba(255,213,105,0.2)" }}>
                        {suggestions.map((s, idx) => (
                          <button key={idx} type="button" onMouseDown={() => selectSuggestion(s)}
                            className="w-full text-left px-4 py-2.5 text-xs font-semibold transition-all flex items-start gap-1.5 leading-relaxed text-white/70 hover:text-white"
                            style={{ background: "transparent" }}
                            onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,213,105,0.07)")}
                            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                            <span className="text-[#FFD369] shrink-0 text-sm">📍</span>
                            <span>{s.displayName}</span>
                          </button>
                        ))}
                      </div>
                    )}
                    <p className="text-[10px] text-white/30">
                      {language === "en" ? "✨ Autocomplete prioritizes Indian villages, tehsils and towns." : "✨ स्वतः पूर्ण सुविधा भारतीय गांवों, तहसीलों और शहरों को प्राथमिकता देती है।"}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                      {language === "en" ? "Time Zone (UTC Offset)" : "समय क्षेत्र (UTC अंतर)"}
                    </label>
                    <select value={birthTz} onChange={e => setBirthTz(parseFloat(e.target.value))}
                      className={inputCls} style={{ ...inputStyle, appearance: "none" as any }}>
                      <optgroup label="India">
                        <option value={5.5}>IST — India Standard Time (UTC+5:30) ✓ Default</option>
                      </optgroup>
                      <optgroup label="Asia">
                        <option value={5.75}>NPT — Nepal (UTC+5:45)</option>
                        <option value={6}>BST — Bangladesh / Bhutan (UTC+6)</option>
                        <option value={5}>PKT — Pakistan (UTC+5)</option>
                        <option value={8}>CST — China / Singapore (UTC+8)</option>
                        <option value={7}>WIB — Indonesia West (UTC+7)</option>
                        <option value={9}>JST — Japan / Korea (UTC+9)</option>
                        <option value={4}>GST — Gulf / UAE / Oman (UTC+4)</option>
                        <option value={3}>AST — Saudi / Kuwait (UTC+3)</option>
                      </optgroup>
                      <optgroup label="Europe">
                        <option value={0}>GMT — UK (UTC+0)</option>
                        <option value={1}>CET — Central Europe (UTC+1)</option>
                        <option value={2}>EET — Eastern Europe (UTC+2)</option>
                      </optgroup>
                      <optgroup label="Americas">
                        <option value={-5}>EST — US East (UTC-5)</option>
                        <option value={-6}>CST — US Central (UTC-6)</option>
                        <option value={-7}>MST — US Mountain (UTC-7)</option>
                        <option value={-8}>PST — US Pacific (UTC-8)</option>
                        <option value={-3}>BRT — Brazil (UTC-3)</option>
                      </optgroup>
                      <optgroup label="Other">
                        <option value={2}>SAST — South Africa (UTC+2)</option>
                        <option value={10}>AEST — Australia East (UTC+10)</option>
                        <option value={12}>NZST — New Zealand (UTC+12)</option>
                      </optgroup>
                    </select>
                    <p className="text-[10px] text-white/30">⚠ {language === "en" ? "Select your birth city's exact time zone. Wrong TZ = wrong Ascendant (Lagna)." : "जन्म शहर का सही समय क्षेत्र चुनें। गलत TZ = गलत लग्न।"}</p>
                  </div>

                  {geocodeError && (
                    <div className="rounded-xl px-4 py-3 text-xs font-medium" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#fca5a5" }}>
                      ⚠️ {geocodeError}
                    </div>
                  )}
                </div>

                <button type="submit" disabled={kundliLoading}
                  className="w-full py-4 rounded-2xl font-black text-sm text-black transition-all hover:opacity-90 active:scale-[0.99] disabled:opacity-60 shadow-lg flex items-center justify-center gap-2"
                  style={{ background: "linear-gradient(135deg, #FFD369, #F5A623)", boxShadow: "0 8px 24px rgba(255,211,105,0.3)" }}>
                  {kundliLoading ? (
                    <><span className="inline-block w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />{t.calculatingText}</>
                  ) : t.calculateBtn}
                </button>
              </form>
            )}

            {/* Kundli Step 2: Results */}
            {kundliStep === 2 && kundliResult && (
              <div className="space-y-6">

                {/* Page header */}
                <div className="flex justify-between items-center px-1">
                  <div>
                    <p className="text-[10px] font-black tracking-[0.25em] uppercase text-[#FFD369]/60">✦ {t.kundliAnalysis}</p>
                    <h3 className="text-xl font-bold text-white font-serif mt-0.5">
                      {name || (language === "en" ? "Your" : "आपका")} {t.birthChartTitle}
                    </h3>
                  </div>
                  <button onClick={resetKundli}
                    className="text-[10px] font-black uppercase tracking-wider text-white/35 hover:text-red-400 transition-colors border border-white/10 hover:border-red-400/30 px-3 py-1.5 rounded-lg">
                    ← {t.back}
                  </button>
                </div>

                {/* Row 1: 2 equal columns — planets left, yantra list right */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">

                  {/* LEFT — Lagna + Planetary table */}
                  <div className="rounded-2xl p-5 space-y-4" style={{ background: BG_CARD, border: "1px solid rgba(255,213,105,0.2)" }}>
                    <div className="flex flex-wrap gap-4 justify-between items-start border-b pb-4" style={{ borderColor: "rgba(255,213,105,0.1)" }}>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-[#FFD369] font-black">{t.lagnaLabel}</p>
                        <p className="text-2xl font-bold font-serif mt-0.5 text-white">{kundliResult.lagnaSignName}</p>
                        <p className="text-[11px] text-white/45 mt-0.5">
                          {kundliResult.lagnaDegrees}° {kundliResult.lagnaMinutes}′ · {kundliResult.lagnaNakshatra}
                        </p>
                        <p className="text-[10px] text-white/30 mt-0.5">{kundliResult.birthPlace}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-wider text-[#FFD369] font-black">{t.ayanamshaLabel}</p>
                        <p className="text-sm font-bold text-white">{kundliResult.ayanamsha.toFixed(4)}°</p>
                        <p className="text-[10px] text-white/30">Lahiri</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.2em] text-[#FFD369] font-black mb-2.5">{t.navagrahaPositions}</p>
                      <div className="space-y-1">
                        {kundliResult.planets.map(p => (
                          <div key={p.planet}
                            className="px-3 py-2 rounded-xl text-[10px] font-bold flex items-center gap-2"
                            style={{
                              background: p.debilitated || p.combust ? "rgba(239,68,68,0.10)"
                                : p.exalted ? "rgba(255,215,0,0.08)"
                                : p.ownSign ? "rgba(74,222,128,0.07)"
                                : "rgba(255,255,255,0.03)",
                              border: p.debilitated || p.combust ? "1px solid rgba(239,68,68,0.2)"
                                : p.exalted ? "1px solid rgba(255,215,0,0.2)"
                                : p.ownSign ? "1px solid rgba(74,222,128,0.18)"
                                : "1px solid rgba(255,255,255,0.06)"
                            }}>
                            <span className="text-base shrink-0" style={{ color: p.color }}>{p.symbol}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1 text-white">
                                <span>{p.name.split(" ")[0]}</span>
                                {p.retrograde && <span className="text-[8px] text-orange-400 font-black">(R)</span>}
                                {p.exalted && <span className="text-[8px] text-yellow-400 font-black">⬆ UCH</span>}
                                {p.ownSign && !p.exalted && <span className="text-[8px] text-green-400 font-black">⌂ SW</span>}
                                {p.debilitated && <span className="text-[8px] text-red-400 font-black">⬇ NEE</span>}
                                {p.combust && !p.debilitated && <span className="text-[8px] text-orange-400 font-black">🔥</span>}
                              </div>
                              <div className="text-[9px] font-normal text-white/35 mt-0.5">
                                H{p.house} · {p.signName.slice(0, 3)} {p.degrees}°{p.minutes}′ · {p.nakshatra}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* RIGHT — Yantra selection as horizontal rows (no orphaned grid cells) */}
                  <div className="space-y-4">
                    <div>
                      <p className="text-[9px] font-black tracking-[0.22em] uppercase text-[#FFD369]/60">
                        ✦ {language === "en" ? "Vedic Remedies" : "वैदिक उपाय"} ✦
                      </p>
                      <h3 className="text-base font-bold text-white font-serif mt-0.5">
                        {kundliResult.weakPlanets.length === 0
                          ? t.noWeakPlanets
                          : language === "en" ? "Yantras Recommended for Your Afflictions" : "दोषों के लिए अनुशंसित यंत्र"}
                      </h3>
                    </div>

                    {kundliResult.weakPlanets.length === 0 ? (
                      <div className="rounded-2xl p-8 text-center space-y-3" style={{ background: "rgba(74,222,128,0.07)", border: "1px solid rgba(74,222,128,0.2)" }}>
                        <p className="text-3xl">✅</p>
                        <p className="text-sm font-bold text-green-300">{t.noWeakPlanets}</p>
                        <p className="text-xs text-green-400/70">{t.noWeakPlanetsDesc}</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {kundliRecs.map(rec => {
                          const isActive = kundliActiveRec === rec.planet;
                          const targetYantra = yantras.find(y => y.id === rec.planet);
                          const clr = rec.severity === "high" ? "#ef4444" : rec.severity === "medium" ? "#eab308" : "#FFD700";
                          return (
                            <div key={rec.planet} onClick={() => setKundliActiveRec(rec.planet)}
                              className="cursor-pointer flex items-center gap-4 rounded-2xl px-4 py-3 transition-all duration-300"
                              style={{
                                background: isActive ? `linear-gradient(135deg, ${clr}14, ${clr}07)` : "rgba(255,255,255,0.03)",
                                border: isActive ? `1px solid ${clr}55` : "1px solid rgba(255,255,255,0.07)",
                                boxShadow: isActive ? `0 0 18px ${clr}14` : "none"
                              }}>
                              {/* Planet glyph circle */}
                              <div className="relative shrink-0 w-14 h-14 rounded-xl flex items-center justify-center overflow-hidden"
                                style={{ background: `${clr}12`, border: `1px solid ${clr}28` }}>
                                <div className="absolute inset-0 rounded-xl"
                                  style={{ background: `radial-gradient(circle, ${clr}20 0%, transparent 70%)` }} />
                                <span className="relative text-2xl leading-none"
                                  style={{ color: clr, textShadow: `0 0 12px ${clr}60` }}>
                                  {rec.symbol}
                                </span>
                              </div>
                              {/* Info */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2 mb-0.5">
                                  <h4 className="text-xs font-black uppercase tracking-wide text-white truncate">
                                    {targetYantra?.name.split(" (")[0] || rec.planetName}
                                  </h4>
                                  <span className="shrink-0 text-[8px] font-black tracking-widest px-2 py-0.5 rounded-full uppercase"
                                    style={{
                                      background: rec.severity === "high" ? "rgba(239,68,68,0.15)" : "rgba(234,179,8,0.15)",
                                      color: clr,
                                      border: `1px solid ${clr}30`
                                    }}>
                                    {rec.severity === "high" ? "CRITICAL" : "WEAK"}
                                  </span>
                                </div>
                                {sanskritNames[rec.planet] && (
                                  <p className="text-[10px] text-[#FFD369]/55 font-serif mb-0.5">{sanskritNames[rec.planet]}</p>
                                )}
                                <p className="text-[10px] text-white/45 leading-relaxed line-clamp-2">{rec.reason}</p>
                              </div>
                              {/* Active indicator */}
                              <span className="shrink-0 text-base font-black"
                                style={{ color: isActive ? clr : "rgba(255,255,255,0.18)" }}>
                                {isActive ? "●" : "›"}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Row 2: Full-width consecration report — only shows when a yantra is selected */}
                {activeKundliYantra && (() => {
                  const activeRecObj = kundliRecs.find(r => r.planet === kundliActiveRec);
                  return (
                    <div className="rounded-2xl overflow-hidden" style={{ background: BG_CARD, border: "1px solid rgba(255,213,105,0.22)" }}>

                      {/* Top banner */}
                      <div className="flex flex-wrap items-start justify-between gap-3 px-7 pt-6 pb-5 border-b"
                        style={{ borderColor: "rgba(255,213,105,0.12)" }}>
                        <div className="space-y-1">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="text-xl md:text-2xl font-black font-serif text-[#FFD369] uppercase tracking-wide leading-tight">
                              {activeKundliYantra.name}
                            </h3>
                            {sanskritNames[kundliActiveRec] && (
                              <span className="text-[10px] px-2.5 py-0.5 rounded-full font-serif"
                                style={{ background: "rgba(255,213,105,0.1)", color: "#FFD369", border: "1px solid rgba(255,213,105,0.2)" }}>
                                {sanskritNames[kundliActiveRec]}
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] font-bold tracking-[0.22em] text-white/30 uppercase">✦ Vedic Remedial Geometry ✦</p>
                        </div>
                        <span className="shrink-0 text-black text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider"
                          style={{ background: "linear-gradient(135deg, #FFD369, #F5A623)" }}>
                          RECOMMENDED REMEDY
                        </span>
                      </div>

                      {/* Body: drawing left | details right */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">

                        {/* LEFT: Yantra drawing + blockage info */}
                        <div className="p-6 space-y-5 border-r" style={{ borderColor: "rgba(255,213,105,0.08)" }}>
                          <div>
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#FFD369]/60 mb-3 flex items-center gap-2">
                              <span className="text-yellow-400">✨</span> SACRED BHOJPATRA DRAWING
                            </p>
                            <div className="flex flex-col items-center justify-center p-5 bg-white rounded-2xl shadow-2xl max-w-[280px] mx-auto">
                              <YantraRenderer yantra={activeKundliYantra} userName={name} destinationName="" businessName="" justSvg={true} />
                            </div>
                          </div>
                          <div className="rounded-xl p-4 space-y-2"
                            style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)" }}>
                            <p className="text-[9px] font-black tracking-[0.18em] uppercase text-red-400">🛑 Identified Energetic Blockage</p>
                            <p className="text-xs text-white/80 font-semibold leading-relaxed">{activeRecObj?.reason}</p>
                            <p className="text-[10px] text-white/45 leading-relaxed pt-1.5 border-t"
                              style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                              Your chart shows an affliction on {activeRecObj?.planetName}. The sacred mathematical
                              arrangement of the {activeKundliYantra.name} directly harmonises this planetary energy.
                            </p>
                          </div>
                        </div>

                        {/* RIGHT: Consecration, mantras, benefits */}
                        <div className="p-6 space-y-5">

                          <div className="space-y-3">
                            <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-[#FFD369]/65 flex items-center gap-2">
                              <span className="text-green-400">🧘</span> 1. CONSECRATION & ACTIVATION
                            </h4>
                            <div className="rounded-xl p-4 space-y-2 text-[11px]"
                              style={{ background: "rgba(74,222,128,0.04)", border: "1px solid rgba(74,222,128,0.12)" }}>
                              <p className="text-[9px] font-black tracking-[0.18em] uppercase text-green-400">Ritual Instructions</p>
                              <p className="text-white/65">
                                <span className="font-bold text-white/50">{t.preparationDay}</span> {activeKundliYantra.preparation.day}
                              </p>
                              <p className="text-white/65">
                                <span className="font-bold text-white/50">{t.preparationTime}</span> {activeKundliYantra.preparation.time}
                              </p>
                              <p className="text-white/65 leading-relaxed">
                                <span className="font-bold text-white/50">{t.preparationMaterials}</span> {activeKundliYantra.preparation.materials}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-[#FFD369]/65 flex items-center gap-2">
                              <span className="text-violet-400">🔱</span> 2. ACTIVATION MANTRAS
                            </h4>
                            <div className="space-y-2">
                              {activeKundliYantra.mantras.map((m, i) => (
                                <p key={i}
                                  className="italic text-xs font-serif text-white/80 rounded-xl px-4 py-3 text-center font-semibold leading-relaxed"
                                  style={{ background: "rgba(168,85,247,0.06)", border: "1px solid rgba(168,85,247,0.15)" }}>
                                  &ldquo;{m}&rdquo;
                                </p>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-3">
                            <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-[#FFD369]/65 flex items-center gap-2">
                              <span className="text-yellow-400">✦</span> 3. EXPECTED BENEFITS
                            </h4>
                            <ul className="space-y-2">
                              {activeKundliYantra.benefits.map((b, i) => (
                                <li key={i} className="flex items-start gap-2.5 text-[11px] text-white/60">
                                  <span className="text-[#FFD369] shrink-0 mt-0.5 font-black">›</span>
                                  <span className="leading-relaxed">{b}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                        </div>
                      </div>
                    </div>
                  );
                })()}

              </div>
            )}
          </>
        )}
            {/* Planet Flow */}
            {appMode === "planet" && (
              <>
                {/* Planet Step 1: Selection Form */}
                {planetStep === 1 && (
                  <form onSubmit={handlePlanetSubmit} className="space-y-5 max-w-xl mx-auto">
                    <div className="rounded-2xl p-7 space-y-5" style={{ background: BG_CARD, border: `1px solid ${BORDER_DIM}` }}>
                      <div className="space-y-1 pb-3 border-b border-white/8">
                        <h3 className="text-sm font-black font-serif text-white/85">
                          {language === "en" ? "Generate Yantra by Planet Focus" : "ग्रह फोकस द्वारा यंत्र बनाएं"}
                        </h3>
                        <p className="text-[11px] text-white/40">
                          {language === "en" ? "Select a planet to generate its sacred geometry talisman" : "अपनी पसंद के ग्रह का यंत्र प्राप्त करने के लिए नीचे चुनें"}
                        </p>
                      </div>

                      {/* Name field */}
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                          {t.yourNameRequired}
                        </label>
                        <input type="text" required placeholder="e.g. Rahul Sharma"
                          value={name} onChange={e => setName(e.target.value)}
                          className={inputCls} style={inputStyle}
                          onFocus={e => (e.target.style.borderColor = "rgba(168,85,247,0.55)")}
                          onBlur={e => (e.target.style.borderColor = "rgba(255,213,105,0.2)")} />
                      </div>

                      {/* Planet list */}
                      <div className="space-y-2">
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                          {language === "en" ? "Select Planet Focus" : "ग्रह फोकस चुनें"}
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1">
                          {planetList.map((p) => {
                            const isSelected = selectedPlanet === p.id;
                            const glyphColors: Record<string, string> = {
                              surya: "#ffb020", chandra: "#38bdf8", mangal: "#ef4444",
                              budh: "#10b981", guru: "#f5c453", shukra: "#ec4899",
                              shani: "#a855f7", rahu: "#f97316", ketu: "#6366f1"
                            };
                            const color = glyphColors[p.id] || "#FFD700";
                            const glyphs: Record<string, string> = {
                              surya: "☀️", chandra: "🌙", mangal: "♂", budh: "☿", guru: "♃", shukra: "♀", shani: "♄", rahu: "☊", ketu: "☋"
                            };
                            const glyph = glyphs[p.id] || "🪐";
                            return (
                              <button key={p.id} type="button" onClick={() => setSelectedPlanet(p.id)}
                                className="text-left px-3 py-2.5 rounded-xl transition-all duration-200 flex items-center gap-3.5"
                                style={{
                                  background: isSelected ? `linear-gradient(135deg, ${color}15, ${color}08)` : "rgba(255,255,255,0.03)",
                                  border: isSelected ? `1px solid ${color}55` : "1px solid rgba(255,255,255,0.06)",
                                  boxShadow: isSelected ? `0 0 20px ${color}12` : "none"
                                }}>
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-lg font-bold"
                                  style={{ background: `${color}10`, border: `1px solid ${color}20` }}>
                                  <span style={{ color: isSelected ? color : "rgba(255,255,255,0.4)" }}>{glyph}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-black uppercase tracking-wide text-white truncate">{p.name.split(" — ")[0]}</p>
                                  <p className="text-[10px] text-white/35 truncate mt-0.5">{p.name.split(" — ")[1]}</p>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <button type="submit" disabled={!selectedPlanet}
                      className="w-full py-4 rounded-2xl font-black text-sm text-white transition-all hover:opacity-90 active:scale-[0.99] shadow-lg disabled:opacity-40"
                      style={{ background: "linear-gradient(135deg, #6C5CE7, #A855F7, #EC4899)", boxShadow: "0 8px 24px rgba(108,92,231,0.35)" }}>
                      {language === "en" ? "Generate Yantra" : "यंत्र उत्पन्न करें"} →
                    </button>
                  </form>
                )}

                {/* Planet Step 2: Yantra Result */}
                {planetStep === 2 && currentYantra && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center px-1">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#FFD369]/60">✦ Your Planetary Talisman</p>
                        <h3 className="text-xl font-bold font-serif text-white mt-0.5">{t.yourRecommendedTalisman}</h3>
                      </div>
                      <button onClick={resetPlanet}
                        className="text-[10px] font-black uppercase tracking-wider text-white/35 hover:text-red-400 transition-colors border border-white/10 hover:border-red-400/30 px-3 py-1.5 rounded-lg">
                        {t.startOver}
                      </button>
                    </div>

                    {/* ── Full-width Yantra Card ── */}
                    <div className="rounded-2xl overflow-hidden" style={{ background: BG_CARD, border: "1px solid rgba(255,213,105,0.22)" }}>

                      {/* Card Top Banner */}
                      <div className="flex flex-wrap items-start justify-between gap-3 px-7 pt-6 pb-5 border-b" style={{ borderColor: "rgba(255,213,105,0.12)" }}>
                        <div className="space-y-1">
                          <h3 className="text-xl md:text-2xl font-black font-serif text-[#FFD369] uppercase tracking-wide leading-tight">
                            {currentYantra.name}
                          </h3>
                          <p className="text-[10px] font-bold tracking-[0.22em] text-white/30 uppercase">✦ Vedic Remedial Geometry ✦</p>
                        </div>
                        <span className="shrink-0 text-black text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider mt-1"
                          style={{ background: "linear-gradient(135deg, #FFD369, #F5A623)" }}>
                          RECOMMENDED REMEDY
                        </span>
                      </div>

                      {/* Card Body — 2 columns */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">

                        {/* LEFT COLUMN: Drawing */}
                        <div className="p-6 space-y-5 border-r" style={{ borderColor: "rgba(255,213,105,0.08)" }}>
                          <div>
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#FFD369]/65 mb-3 flex items-center gap-2">
                              <span className="text-yellow-400">✨</span> SACRED BHOJPATRA DRAWING
                            </p>
                            <div className="flex flex-col items-center justify-center p-5 bg-white rounded-2xl shadow-2xl max-w-[280px] mx-auto">
                              <YantraRenderer yantra={currentYantra} userName={name} destinationName="" businessName="" justSvg={true} />
                            </div>
                          </div>

                          <div className="rounded-xl p-4 space-y-1.5" style={{ background: "rgba(255,213,105,0.04)", border: "1px solid rgba(255,213,105,0.12)" }}>
                            <p className="text-[9px] font-black tracking-[0.18em] uppercase text-[#FFD369]">Focus of Talisman</p>
                            <p className="text-[11px] text-white/75 leading-relaxed">{currentYantra.description}</p>
                          </div>
                        </div>

                        {/* RIGHT COLUMN: Consecration Details */}
                        <div className="p-6 space-y-5">
                          <div className="space-y-3">
                            <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-[#FFD369]/65 flex items-center gap-2">
                              <span className="text-red-400">🛑</span> 1. PROBLEM & CHALLENGE ANALYSIS
                            </h4>
                            <div className="rounded-xl p-4 space-y-1.5" style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)" }}>
                              <p className="text-[9px] font-black tracking-[0.18em] uppercase text-red-400">Identified Blockage</p>
                              <p className="text-[11px] text-white/75 leading-relaxed">{currentYantra.description}</p>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-[#FFD369]/65 flex items-center gap-2">
                              <span className="text-green-400">🧘</span> 2. CONSECRATION & ACTIVATION
                            </h4>
                            <div className="rounded-xl p-4 space-y-2 text-[11px]" style={{ background: "rgba(74,222,128,0.04)", border: "1px solid rgba(74,222,128,0.12)" }}>
                              <p className="text-[9px] font-black tracking-[0.18em] uppercase text-green-400">Ritual Instructions</p>
                              <p className="text-white/65"><span className="font-bold text-white/50">{t.preparationDay}</span> {currentYantra.preparation.day}</p>
                              <p className="text-white/65"><span className="font-bold text-white/50">{t.preparationTime}</span> {currentYantra.preparation.time}</p>
                              <p className="text-white/65 leading-relaxed"><span className="font-bold text-white/50">{t.preparationMaterials}</span> {currentYantra.preparation.materials}</p>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-[#FFD369]/65 flex items-center gap-2">
                              <span className="text-violet-400">🔱</span> 3. ACTIVATION MANTRAS
                            </h4>
                            <div className="space-y-2">
                              {currentYantra.mantras.map((m, i) => (
                                <p key={i} className="italic text-xs font-serif text-white/80 rounded-xl px-4 py-3 text-center font-semibold leading-relaxed"
                                  style={{ background: "rgba(168,85,247,0.06)", border: "1px solid rgba(168,85,247,0.15)" }}>
                                  &ldquo;{m}&rdquo;
                                </p>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-3">
                            <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-[#FFD369]/65 flex items-center gap-2">
                              <span className="text-yellow-400">✦</span> 4. EXPECTED BENEFITS
                            </h4>
                            <ul className="space-y-2">
                              {currentYantra.benefits.map((b, i) => (
                                <li key={i} className="flex items-start gap-2.5 text-[11px] text-white/65">
                                  <span className="text-[#FFD369] shrink-0 mt-0.5 font-black">›</span>
                                  <span className="leading-relaxed">{b}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
      </div>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="w-full text-center max-w-4xl mx-auto px-4 py-4 z-10 relative">
        <p className="text-[10px] text-white/20">{t.disclaimer}</p>
      </footer>
    </div>
  );
}

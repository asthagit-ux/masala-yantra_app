// lib/kundli.ts
// Vedic (Jyotish) Kundli calculation engine using astronomy-engine
// Uses Lahiri Ayanamsha (Chitra Paksha), Whole Sign house system
// Supports explicit UTC offset input for accurate ascendant calculation

import * as Astronomy from "astronomy-engine";

export const SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
] as const;

export type SignName = typeof SIGNS[number];

// ─── Vedic dignity tables (0-indexed: Aries=0 … Pisces=11) ───────────────────

// Exaltation sign (Uchcha)
const EXALTATION_SIGN: Record<string, number> = {
  surya:   0,   // Aries
  chandra: 1,   // Taurus
  mangal:  9,   // Capricorn
  budh:    5,   // Virgo
  guru:    3,   // Cancer
  shukra: 11,   // Pisces
  shani:   6,   // Libra
};

// Debilitation sign (Neecha) — exactly opposite the exaltation sign
const DEBILITATION_SIGN: Record<string, number> = {
  surya:   6,   // Libra
  chandra: 7,   // Scorpio
  mangal:  3,   // Cancer
  budh:   11,   // Pisces
  guru:    9,   // Capricorn
  shukra:  5,   // Virgo
  shani:   0,   // Aries
};

// Own signs (Swakshetra)
const OWN_SIGNS: Record<string, number[]> = {
  surya:   [4],       // Leo
  chandra: [3],       // Cancer
  mangal:  [0, 7],    // Aries, Scorpio
  budh:    [2, 5],    // Gemini, Virgo
  guru:    [8, 11],   // Sagittarius, Pisces
  shukra:  [1, 6],    // Taurus, Libra
  shani:   [9, 10],   // Capricorn, Aquarius
};

// Combustion orbs (classical Vedic values — degrees from Sun)
// Rahu & Ketu are excluded (they cannot be combust)
const COMBUSTION_ORB: Record<string, number> = {
  chandra: 12,
  mangal:  17,
  budh:    14,
  guru:    11,
  shukra:  10,
  shani:   15,
};

// Planet display
const PLANET_NAMES: Record<string, string> = {
  surya:   "Surya (Sun)",
  chandra: "Chandra (Moon)",
  mangal:  "Mangal (Mars)",
  budh:    "Budh (Mercury)",
  guru:    "Guru (Jupiter)",
  shukra:  "Shukra (Venus)",
  shani:   "Shani (Saturn)",
  rahu:    "Rahu (N.Node)",
  ketu:    "Ketu (S.Node)",
};

const PLANET_SYMBOLS: Record<string, string> = {
  surya: "☉", chandra: "☽", mangal: "♂", budh: "☿",
  guru: "♃", shukra: "♀", shani: "♄", rahu: "☊", ketu: "☋"
};

const PLANET_COLORS: Record<string, string> = {
  surya: "#FF6B35", chandra: "#C8B8DB", mangal: "#E63946", budh: "#2DC653",
  guru: "#FFD700", shukra: "#FF85A1", shani: "#6B7280", rahu: "#4B0082", ketu: "#8B4513"
};

// 27 Nakshatras
const NAKSHATRAS = [
  "Ashwini","Bharani","Krittika","Rohini","Mrigashira","Ardra",
  "Punarvasu","Pushya","Ashlesha","Magha","Purva Phalguni","Uttara Phalguni",
  "Hasta","Chitra","Swati","Vishakha","Anuradha","Jyeshtha",
  "Mula","Purva Ashadha","Uttara Ashadha","Shravana","Dhanishtha",
  "Shatabhisha","Purva Bhadrapada","Uttara Bhadrapada","Revati"
];

// Nakshatra dasha lords (Vimshottari)
const NAKSHATRA_LORDS = [
  "ketu","shukra","surya","chandra","mangal","rahu",
  "guru","shani","budh","ketu","shukra","surya",
  "chandra","mangal","rahu","guru","shani","budh",
  "ketu","shukra","surya","chandra","mangal","rahu",
  "guru","shani","budh"
];

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface PlanetInfo {
  planet: string;
  name: string;
  symbol: string;
  color: string;
  longitude: number;      // Sidereal 0–360°
  degrees: number;        // Integer degrees within sign (0–29)
  minutes: number;        // Arc-minutes (0–59)
  sign: number;           // 0–11
  signName: string;
  house: number;          // 1–12 (Whole Sign from Lagna)
  retrograde: boolean;
  exalted: boolean;
  debilitated: boolean;
  ownSign: boolean;
  combust: boolean;
  nakshatra: string;
  nakshatraPada: number;  // 1–4
  nakshatraLord: string;
  weakReasons: string[];
  strengthReasons: string[];
}

export interface KundliResult {
  lagna: number;           // Sidereal ascendant (0–360°)
  lagnaSign: number;       // 0–11
  lagnaSignName: string;
  lagnaDegrees: number;
  lagnaMinutes: number;
  lagnaNakshatra: string;
  planets: PlanetInfo[];
  weakPlanets: PlanetInfo[];
  ayanamsha: number;
  birthPlace: string;
  birthLat: number;
  birthLng: number;
}

export interface YantraRecommendation {
  planet: string;
  planetName: string;
  symbol: string;
  color: string;
  yantraId: string;
  reason: string;
  severity: "high" | "medium";
  house: number;
  signName: string;
}

// ─── Math helpers ─────────────────────────────────────────────────────────────

function normLng(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

function angularDiff(a: number, b: number): number {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

function dateToJD(date: Date): number {
  return date.getTime() / 86400000 + 2440587.5;
}

function getNakshatra(lng: number): { name: string; pada: number; lord: string } {
  // 27 nakshatras × 13°20' each = 360°
  const degPerNak = 360 / 27;         // 13.3333...°
  const degPerPada = degPerNak / 4;   // 3.3333...°
  const idx = Math.floor(lng / degPerNak) % 27;
  const rem = lng % degPerNak;
  const pada = Math.min(Math.floor(rem / degPerPada) + 1, 4);
  return { name: NAKSHATRAS[idx], pada, lord: NAKSHATRA_LORDS[idx] };
}

// ─── Lahiri Ayanamsha ─────────────────────────────────────────────────────────
// Official Indian (IENA) standard:
//   Value on 1956-Mar-21 0h UT = 23° 15' 00.658" = 23.25018278°
//   Annual precession rate = 50.2388475" = 0.01395524°/year

function getLahiriAyanamsha(jd: number): number {
  const JD_1956_MAR21 = 2435553.5;
  const AYANAMSHA_1956 = 23.25018278;
  const RATE_DEG_PER_DAY = 50.2388475 / 3600 / 365.25;
  return AYANAMSHA_1956 + (jd - JD_1956_MAR21) * RATE_DEG_PER_DAY;
}

function toSidereal(tropical: number, ayanamsha: number): number {
  return normLng(tropical - ayanamsha);
}

// ─── Planetary longitude ──────────────────────────────────────────────────────

function getGeocentricLongitude(body: Astronomy.Body, date: Date): number {
  const vec = Astronomy.GeoVector(body, date, true);
  const ecl = Astronomy.Ecliptic(vec);
  return normLng(ecl.elon);
}

// Retrograde: compare longitude 1 day before and 1 day after
function isRetrograde(body: Astronomy.Body, date: Date): boolean {
  const msDay = 86400000;
  const lng1 = getGeocentricLongitude(body, new Date(date.getTime() - msDay));
  const lng2 = getGeocentricLongitude(body, new Date(date.getTime() + msDay));
  let diff = lng2 - lng1;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return diff < 0;
}

// Rahu: Mean Lunar North Node (classical Vedic uses mean node)
// Formula from Chapront (used by Swiss Ephemeris):
//   Ω = 125.04455501° − 0.052953922° × (JD − J2000.0)  [tropical]
function getRahuMeanTropicalLng(jd: number): number {
  const J2000 = 2451545.0;
  return normLng(125.04455501 - (jd - J2000) * 0.052953922);
}

// ─── Ascendant ────────────────────────────────────────────────────────────────

function calculateAscendantTropical(date: Date, lat: number, lng: number): number {
  const gstHours = Astronomy.SiderealTime(date);
  // Local Sidereal Time (degrees)
  const lst = normLng(gstHours * 15 + lng);
  const ramc = lst * (Math.PI / 180);

  // Obliquity (IAU formula, Julian centuries from J2000)
  const jd = dateToJD(date);
  const T = (jd - 2451545.0) / 36525;
  const eps = (23.439291111 - 0.013004167 * T) * (Math.PI / 180);
  const phi = lat * (Math.PI / 180);

  // Standard ascendant formula
  const asc = Math.atan2(
    -Math.cos(ramc),
    Math.sin(eps) * Math.tan(phi) + Math.cos(eps) * Math.sin(ramc)
  ) * (180 / Math.PI);

  return normLng(asc);
}

// ─── Main Kundli calculation ──────────────────────────────────────────────────
// tzOffsetHours: UTC offset of the birth location (e.g. IST = +5.5)
// IMPORTANT: Using longitude/15 is INACCURATE for real timezone offsets.
// Always pass the actual timezone offset. Defaults to 5.5 (IST) for India.

export function calculateKundli(
  dob: string,                    // YYYY-MM-DD
  time: string,                   // HH:MM (local time at birth place)
  latitude: number,
  longitude: number,
  cityName: string,
  tzOffsetHours: number = 5.5     // Default IST. Pass actual UTC offset!
): KundliResult {
  const [year, month, day] = dob.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);

  // Convert local time to UTC
  // total local minutes from midnight:
  const localTotalMinutes = hour * 60 + minute;
  const utcTotalMinutes = localTotalMinutes - Math.round(tzOffsetHours * 60);

  // Handle day rollover
  const adjustedDate = new Date(Date.UTC(year, month - 1, day));
  adjustedDate.setUTCMinutes(adjustedDate.getUTCMinutes() + utcTotalMinutes);

  const date = adjustedDate;
  const jd = dateToJD(date);
  const ayanamsha = getLahiriAyanamsha(jd);

  // ── Tropical longitudes ──────────────────────────────────────────────────────
  const rawSun  = getGeocentricLongitude(Astronomy.Body.Sun,     date);
  const rawMoon = getGeocentricLongitude(Astronomy.Body.Moon,    date);
  const rawMars = getGeocentricLongitude(Astronomy.Body.Mars,    date);
  const rawMerc = getGeocentricLongitude(Astronomy.Body.Mercury, date);
  const rawJup  = getGeocentricLongitude(Astronomy.Body.Jupiter, date);
  const rawVen  = getGeocentricLongitude(Astronomy.Body.Venus,   date);
  const rawSat  = getGeocentricLongitude(Astronomy.Body.Saturn,  date);
  const rawRahu = getRahuMeanTropicalLng(jd);
  const rawKetu = normLng(rawRahu + 180);

  // ── Sidereal (Vedic) longitudes via Lahiri ayanamsha ────────────────────────
  const sidSun  = toSidereal(rawSun,  ayanamsha);
  const sidMoon = toSidereal(rawMoon, ayanamsha);
  const sidMars = toSidereal(rawMars, ayanamsha);
  const sidMerc = toSidereal(rawMerc, ayanamsha);
  const sidJup  = toSidereal(rawJup,  ayanamsha);
  const sidVen  = toSidereal(rawVen,  ayanamsha);
  const sidSat  = toSidereal(rawSat,  ayanamsha);
  const sidRahu = toSidereal(rawRahu, ayanamsha);
  const sidKetu = toSidereal(rawKetu, ayanamsha);

  // ── Retrograde detection (Sun & Moon never retrograde; Rahu/Ketu always) ────
  const retMars = isRetrograde(Astronomy.Body.Mars,    date);
  const retMerc = isRetrograde(Astronomy.Body.Mercury, date);
  const retJup  = isRetrograde(Astronomy.Body.Jupiter, date);
  const retVen  = isRetrograde(Astronomy.Body.Venus,   date);
  const retSat  = isRetrograde(Astronomy.Body.Saturn,  date);

  // ── Lagna (Ascendant) ────────────────────────────────────────────────────────
  const ascTropical = calculateAscendantTropical(date, latitude, longitude);
  const ascSidereal = toSidereal(ascTropical, ayanamsha);
  const lagnaSign   = Math.floor(ascSidereal / 30);
  const lagnaDeg    = Math.floor(ascSidereal % 30);
  const lagnaMin    = Math.floor(((ascSidereal % 30) % 1) * 60);
  const lagnaNak    = getNakshatra(ascSidereal);

  // ── Planet data ──────────────────────────────────────────────────────────────
  const rawPlanets = [
    { id: "surya",   lng: sidSun,  retrograde: false    },
    { id: "chandra", lng: sidMoon, retrograde: false    },
    { id: "mangal",  lng: sidMars, retrograde: retMars  },
    { id: "budh",    lng: sidMerc, retrograde: retMerc  },
    { id: "guru",    lng: sidJup,  retrograde: retJup   },
    { id: "shukra",  lng: sidVen,  retrograde: retVen   },
    { id: "shani",   lng: sidSat,  retrograde: retSat   },
    { id: "rahu",    lng: sidRahu, retrograde: true     }, // Mean node always retrograde
    { id: "ketu",    lng: sidKetu, retrograde: true     },
  ];

  const planets: PlanetInfo[] = rawPlanets.map(({ id, lng, retrograde }) => {
    const sign     = Math.floor(lng / 30);
    const degrees  = Math.floor(lng % 30);
    const minutes  = Math.floor(((lng % 30) % 1) * 60);

    // Whole Sign house — Lagna sign = 1st house
    const house = ((sign - lagnaSign + 12) % 12) + 1;

    // Dignity
    const exalted     = EXALTATION_SIGN[id] !== undefined && EXALTATION_SIGN[id] === sign;
    const debilitated = DEBILITATION_SIGN[id] !== undefined && DEBILITATION_SIGN[id] === sign;
    const ownSign     = (OWN_SIGNS[id] ?? []).includes(sign);

    // Combustion (Rahu & Ketu excluded — they are mathematical points, not physical bodies)
    const orb    = COMBUSTION_ORB[id];
    const combust = orb !== undefined && angularDiff(sidSun, lng) <= orb;

    // Nakshatra
    const nakInfo = getNakshatra(lng);

    // ── Weakness reasons ────────────────────────────────────────────────────────
    // Classic Vedic criteria for a planet being weak/afflicted:
    //   1. Debilitated (Neecha) — strongest weakness
    //   2. Combust — close to Sun, loses strength
    //   3. In 8th or 12th house — dusthana (houses of loss/death/isolation)
    //      NOTE: 6th house is an UPACHAYA house (growth over time) — NOT a dusthana weakness
    //            unless the planet is also debilitated/combust there.
    //   4. Retrograde is NOT a weakness — in Vedic it gives Cheshta Bala (extra strength)
    //      However we DISPLAY retrograde status as information.

    const weakReasons: string[] = [];

    // 8th & 12th are clear dusthanas
    if (house === 8)  weakReasons.push("in the 8th house (ashtama — obstacles, sudden events)");
    if (house === 12) weakReasons.push("in the 12th house (vyaya — losses, isolation)");

    // 6th is only weak if also debilitated or combust (it's an upachaya otherwise)
    if (house === 6 && (debilitated || combust)) {
      weakReasons.push("in the 6th house while debilitated/combust");
    }

    if (debilitated) weakReasons.push(`debilitated (neecha) in ${SIGNS[sign]}`);
    if (combust)     weakReasons.push("combust — too close to Sun, loses individuality");

    // ── Strength reasons ────────────────────────────────────────────────────────
    const strengthReasons: string[] = [];
    if (exalted)  strengthReasons.push(`exalted (uchcha) in ${SIGNS[sign]}`);
    if (ownSign)  strengthReasons.push(`in own sign (swakshetra) — ${SIGNS[sign]}`);
    if (retrograde && id !== "rahu" && id !== "ketu") {
      strengthReasons.push("retrograde (Cheshta Bala — extra motivational strength)");
    }
    if ([1, 4, 5, 7, 9, 10].includes(house)) {
      strengthReasons.push(`in ${house}th house (${[1,4,7,10].includes(house) ? "kendra" : "trikona"})`);
    }

    return {
      planet: id,
      name:   PLANET_NAMES[id],
      symbol: PLANET_SYMBOLS[id],
      color:  PLANET_COLORS[id],
      longitude: lng,
      degrees,
      minutes,
      sign,
      signName: SIGNS[sign],
      house,
      retrograde,
      exalted,
      debilitated,
      ownSign,
      combust,
      nakshatra:      nakInfo.name,
      nakshatraPada:  nakInfo.pada,
      nakshatraLord:  nakInfo.lord,
      weakReasons,
      strengthReasons,
    };
  });

  const weakPlanets = planets.filter((p) => p.weakReasons.length > 0);

  return {
    lagna:         ascSidereal,
    lagnaSign,
    lagnaSignName: SIGNS[lagnaSign],
    lagnaDegrees:  lagnaDeg,
    lagnaMinutes:  lagnaMin,
    lagnaNakshatra: lagnaNak.name,
    planets,
    weakPlanets,
    ayanamsha,
    birthPlace:  cityName,
    birthLat:    latitude,
    birthLng:    longitude,
  };
}

// ─── Geocoding ────────────────────────────────────────────────────────────────

export async function geocodeCity(
  city: string
): Promise<{ lat: number; lng: number; displayName: string } | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`;
    const res = await fetch(url, { headers: { "User-Agent": "AstroLearn-Kundli/1.0" } });
    const data = await res.json();
    if (data && data.length > 0) {
      return {
        lat:         parseFloat(data[0].lat),
        lng:         parseFloat(data[0].lon),
        displayName: data[0].display_name.split(",").slice(0, 2).join(", "),
      };
    }
  } catch {}
  return null;
}

// ─── Yantra Recommendations ───────────────────────────────────────────────────

export function getKundliYantraRecommendations(
  kundli: KundliResult
): YantraRecommendation[] {
  return kundli.weakPlanets
    .map((p) => ({
      planet:     p.planet,
      planetName: p.name,
      symbol:     p.symbol,
      color:      p.color,
      yantraId:   p.planet,
      reason:     `${p.name} is ${p.weakReasons.join(" and ")} in your Kundli.`,
      severity:   (p.debilitated || p.house === 8 ? "high" : "medium") as "high" | "medium",
      house:      p.house,
      signName:   p.signName,
    }))
    .sort((a, b) => (a.severity === "high" ? -1 : 1));
}

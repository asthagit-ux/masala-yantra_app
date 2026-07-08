// lib/kundli.ts
// Vedic (Jyotish) Kundli calculation engine using astronomy-engine
// Uses Lahiri Ayanamsha (Chitra Paksha), Whole Sign house system
// Planets: Surya, Chandra, Mangal, Budh, Guru, Shukra, Shani, Rahu (Mean Node), Ketu

import * as Astronomy from "astronomy-engine";

export const SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
] as const;

export type SignName = typeof SIGNS[number];

// ─── Vedic dignity tables (all 0-indexed: Aries=0 … Pisces=11) ────────────────

// Exaltation sign for each planet (Uchcha)
const EXALTATION_SIGN: Record<string, number> = {
  surya:  0,   // Aries
  chandra: 1,  // Taurus
  mangal: 9,   // Capricorn
  budh:   5,   // Virgo
  guru:   3,   // Cancer
  shukra: 11,  // Pisces
  shani:  6,   // Libra
};

// Deep exaltation degree within the sign (Paramochha)
const EXALTATION_DEGREE: Record<string, number> = {
  surya:  10,  // 10° Aries
  chandra: 3,  // 3° Taurus
  mangal: 28,  // 28° Capricorn
  budh:   15,  // 15° Virgo
  guru:   5,   // 5° Cancer
  shukra: 27,  // 27° Pisces
  shani:  20,  // 20° Libra
};

// Debilitation sign (Neecha) = opposite of exaltation
const DEBILITATION_SIGN: Record<string, number> = {
  surya:  6,   // Libra
  chandra: 7,  // Scorpio
  mangal: 3,   // Cancer
  budh:   11,  // Pisces
  guru:   9,   // Capricorn
  shukra: 5,   // Virgo
  shani:  0,   // Aries
};

// Own signs (Swakshetra) for each planet
const OWN_SIGNS: Record<string, number[]> = {
  surya:  [4],        // Leo
  chandra: [3],       // Cancer
  mangal: [0, 7],     // Aries, Scorpio
  budh:   [2, 5],     // Gemini, Virgo
  guru:   [8, 11],    // Sagittarius, Pisces
  shukra: [1, 6],     // Taurus, Libra
  shani:  [9, 10],    // Capricorn, Aquarius
};

// Combustion orbs (degrees from Sun for combustion) — classical Vedic values
const COMBUSTION_ORB: Record<string, number> = {
  chandra: 12,   // Moon: 12°
  mangal:  17,   // Mars: 17°
  budh:    14,   // Mercury: 14° (when direct); 12° when retrograde — use 14
  guru:    11,   // Jupiter: 11°
  shukra:  10,   // Venus: 10° (when direct); 8° when retrograde — use 10
  shani:   15,   // Saturn: 15°
};

// Planet display info
const PLANET_NAMES: Record<string, string> = {
  surya:   "Surya (Sun)",
  chandra: "Chandra (Moon)",
  mangal:  "Mangal (Mars)",
  budh:    "Budh (Mercury)",
  guru:    "Guru (Jupiter)",
  shukra:  "Shukra (Venus)",
  shani:   "Shani (Saturn)",
  rahu:    "Rahu (North Node)",
  ketu:    "Ketu (South Node)",
};

const PLANET_SYMBOLS: Record<string, string> = {
  surya: "☉", chandra: "☽", mangal: "♂", budh: "☿",
  guru: "♃", shukra: "♀", shani: "♄", rahu: "☊", ketu: "☋"
};

const PLANET_COLORS: Record<string, string> = {
  surya: "#FF6B35", chandra: "#C8B8DB", mangal: "#E63946", budh: "#2DC653",
  guru: "#FFD700", shukra: "#FF85A1", shani: "#6B7280", rahu: "#4B0082", ketu: "#8B4513"
};

// Nakshatra names (27 nakshatras)
const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
  "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
  "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
  "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishtha",
  "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
];

// Nakshatra lords for Vimshottari Dasha
const NAKSHATRA_LORDS = [
  "ketu", "shukra", "surya", "chandra", "mangal", "rahu",
  "guru", "shani", "budh", "ketu", "shukra", "surya",
  "chandra", "mangal", "rahu", "guru", "shani", "budh",
  "ketu", "shukra", "surya", "chandra", "mangal", "rahu",
  "guru", "shani", "budh"
];

export interface PlanetInfo {
  planet: string;
  name: string;
  symbol: string;
  color: string;
  longitude: number;    // Sidereal 0–360°
  degrees: number;      // Degrees within sign (0–29.99°)
  minutes: number;      // Minutes (0–59)
  sign: number;         // 0–11
  signName: string;
  house: number;        // 1–12 (Whole Sign)
  retrograde: boolean;
  exalted: boolean;
  debilitated: boolean;
  ownSign: boolean;
  combust: boolean;
  nakshatra: string;    // Nakshatra name
  nakshatraPada: number; // Pada 1–4
  nakshatraLord: string; // Ruling planet of nakshatra
  weakReasons: string[];
  strengthReasons: string[];
}

export interface KundliResult {
  lagna: number;         // Sidereal ascendant degree (0–360°)
  lagnaSign: number;     // 0–11
  lagnaSignName: string;
  lagnaMinutes: number;  // minutes within the sign
  lagnaDegrees: number;  // degrees within the sign
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

function getNakshatra(siderealLng: number): { name: string; pada: number; lord: string } {
  // Each nakshatra = 13°20' = 13.3333...°
  // 360° / 27 = 13.333...°
  const nakshatraIndex = Math.floor(siderealLng / (360 / 27));
  const remainder = siderealLng % (360 / 27);
  // Each nakshatra has 4 padas of 3°20' each = 3.3333°
  const pada = Math.floor(remainder / (360 / 108)) + 1;
  return {
    name: NAKSHATRAS[nakshatraIndex % 27],
    pada: Math.min(pada, 4),
    lord: NAKSHATRA_LORDS[nakshatraIndex % 27],
  };
}

// ─── Lahiri Ayanamsha ─────────────────────────────────────────────────────────
//
// Official Lahiri (Chitra Paksha) ayanamsha:
//   At epoch 1956 March 21 0h UT: 23° 15' 00.658" = 23.25018278°
//   Precession rate: 50.2388475"/year = 0.013955235°/year
//
// This matches the Indian Ephemeris & Nautical Almanac (IENA) standard.

function getLahiriAyanamsha(date: Date): number {
  const jd = dateToJD(date);
  // Reference epoch: 1956 March 21 0h UT = JD 2435553.5
  const JD_1956_MAR21 = 2435553.5;
  const AYANAMSHA_1956 = 23.25018278; // 23° 15' 00.658"
  const PRECESSION_RATE_DEG_PER_DAY = 50.2388475 / 3600 / 365.25; // degrees per day
  return AYANAMSHA_1956 + (jd - JD_1956_MAR21) * PRECESSION_RATE_DEG_PER_DAY;
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

// Detect retrograde by comparing longitude 1 day before and after
function isRetrograde(body: Astronomy.Body, date: Date): boolean {
  const dt1 = new Date(date.getTime() - 24 * 60 * 60 * 1000);
  const dt2 = new Date(date.getTime() + 24 * 60 * 60 * 1000);
  const lng1 = getGeocentricLongitude(body, dt1);
  const lng2 = getGeocentricLongitude(body, dt2);
  // Handle wrap-around (e.g., 359° → 1°)
  let diff = lng2 - lng1;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return diff < 0;
}

// Mean Lunar North Node (Rahu) — Mean Node is preferred in classical Vedic
// Formula from Chapront's theory (used by Swiss Ephemeris for Mean Node):
// Ω = 125.04455501° − 0.052953922° × (JD − J2000.0)  [tropical]
function getRahuMeanTropicalLng(jd: number): number {
  const J2000 = 2451545.0;
  return normLng(125.04455501 - (jd - J2000) * 0.052953922);
}

// ─── Ascendant calculation ────────────────────────────────────────────────────

function calculateAscendantTropical(date: Date, latitude: number, longitude: number): number {
  // Greenwich Sidereal Time (decimal hours) from astronomy-engine
  const gstHours = Astronomy.SiderealTime(date);
  // Local Sidereal Time in degrees
  const lst = normLng(gstHours * 15 + longitude);
  const ramc = lst * (Math.PI / 180);

  // Obliquity of ecliptic (IAU formula)
  const jd = dateToJD(date);
  const T = (jd - 2451545.0) / 36525; // Julian centuries from J2000
  const epsilon = (23.439291111 - 0.013004167 * T - 0.0000001639 * T * T + 0.0000005036 * T * T * T) * (Math.PI / 180);
  const lat = latitude * (Math.PI / 180);

  // Standard ascendant formula (Sayana / Tropical)
  // ASC = atan2(-cos(RAMC), sin(ε)·tan(φ) + cos(ε)·sin(RAMC))
  const asc = Math.atan2(
    -Math.cos(ramc),
    Math.sin(epsilon) * Math.tan(lat) + Math.cos(epsilon) * Math.sin(ramc)
  ) * (180 / Math.PI);

  return normLng(asc);
}

// ─── Main Kundli calculation ──────────────────────────────────────────────────

export function calculateKundli(
  dob: string,        // YYYY-MM-DD
  time: string,       // HH:MM  (local time at birth place)
  latitude: number,
  longitude: number,
  cityName: string
): KundliResult {
  const [year, month, day] = dob.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);

  // Convert local time to UTC using LONGITUDE-based offset
  // (For production, a proper timezone database would be more accurate,
  //  but longitude/15 is the standard astronomical approximation)
  const tzOffsetHours = longitude / 15;
  const utcHour = hour - tzOffsetHours;
  const date = new Date(Date.UTC(year, month - 1, day, Math.floor(utcHour), Math.round((utcHour % 1) * 60) + minute, 0));

  const jd = dateToJD(date);
  const ayanamsha = getLahiriAyanamsha(date);

  // ── Tropical longitudes via astronomy-engine ────────────────────────────────
  const rawSun  = getGeocentricLongitude(Astronomy.Body.Sun,     date);
  const rawMoon = getGeocentricLongitude(Astronomy.Body.Moon,    date);
  const rawMars = getGeocentricLongitude(Astronomy.Body.Mars,    date);
  const rawMerc = getGeocentricLongitude(Astronomy.Body.Mercury, date);
  const rawJup  = getGeocentricLongitude(Astronomy.Body.Jupiter, date);
  const rawVen  = getGeocentricLongitude(Astronomy.Body.Venus,   date);
  const rawSat  = getGeocentricLongitude(Astronomy.Body.Saturn,  date);
  const rawRahu = getRahuMeanTropicalLng(jd);
  const rawKetu = normLng(rawRahu + 180); // Ketu is always 180° from Rahu

  // ── Convert to Sidereal (Vedic) by subtracting Lahiri ayanamsha ─────────────
  const sidSun  = toSidereal(rawSun,  ayanamsha);
  const sidMoon = toSidereal(rawMoon, ayanamsha);
  const sidMars = toSidereal(rawMars, ayanamsha);
  const sidMerc = toSidereal(rawMerc, ayanamsha);
  const sidJup  = toSidereal(rawJup,  ayanamsha);
  const sidVen  = toSidereal(rawVen,  ayanamsha);
  const sidSat  = toSidereal(rawSat,  ayanamsha);
  const sidRahu = toSidereal(rawRahu, ayanamsha);
  const sidKetu = toSidereal(rawKetu, ayanamsha);

  // ── Retrograde detection ────────────────────────────────────────────────────
  // Sun and Moon never retrograde. Rahu/Ketu always retrograde (mean node).
  const retMars = isRetrograde(Astronomy.Body.Mars,    date);
  const retMerc = isRetrograde(Astronomy.Body.Mercury, date);
  const retJup  = isRetrograde(Astronomy.Body.Jupiter, date);
  const retVen  = isRetrograde(Astronomy.Body.Venus,   date);
  const retSat  = isRetrograde(Astronomy.Body.Saturn,  date);

  // ── Lagna (Ascendant) ───────────────────────────────────────────────────────
  const ascTropical = calculateAscendantTropical(date, latitude, longitude);
  const ascSidereal = toSidereal(ascTropical, ayanamsha);
  const lagnaSign = Math.floor(ascSidereal / 30);
  const lagnaDegrees = Math.floor(ascSidereal % 30);
  const lagnaMinutes = Math.floor((ascSidereal % 1) * 60);
  const lagnaNakInfo = getNakshatra(ascSidereal);

  // ── Planet entries ──────────────────────────────────────────────────────────
  const rawPlanets: Array<{ id: string; lng: number; retrograde: boolean }> = [
    { id: "surya",   lng: sidSun,  retrograde: false },
    { id: "chandra", lng: sidMoon, retrograde: false },
    { id: "mangal",  lng: sidMars, retrograde: retMars },
    { id: "budh",    lng: sidMerc, retrograde: retMerc },
    { id: "guru",    lng: sidJup,  retrograde: retJup  },
    { id: "shukra",  lng: sidVen,  retrograde: retVen  },
    { id: "shani",   lng: sidSat,  retrograde: retSat  },
    { id: "rahu",    lng: sidRahu, retrograde: true  },  // Mean node always retrograde
    { id: "ketu",    lng: sidKetu, retrograde: true  },  // Ketu always retrograde
  ];

  const planets: PlanetInfo[] = rawPlanets.map(({ id, lng, retrograde }) => {
    const sign = Math.floor(lng / 30);
    const degrees = Math.floor(lng % 30);
    const minutes = Math.floor((lng % 1) * 60);

    // Whole Sign house system: Lagna sign = 1st house
    // House number = (sign - lagnaSign + 12) % 12 + 1
    const house = ((sign - lagnaSign + 12) % 12) + 1;

    // Dignity checks
    const exalted = EXALTATION_SIGN[id] === sign;
    const debilitated = DEBILITATION_SIGN[id] === sign;
    const ownSign = (OWN_SIGNS[id] || []).includes(sign);

    // Combustion — Rahu and Ketu cannot be combust
    const orb = COMBUSTION_ORB[id];
    const combust = orb !== undefined && id !== "rahu" && id !== "ketu"
      && angularDiff(sidSun, lng) <= orb;

    // Nakshatra
    const nakInfo = getNakshatra(lng);

    // Weakness reasons
    const weakReasons: string[] = [];
    if ([6, 8, 12].includes(house)) weakReasons.push(`in the ${house}${house === 6 ? "th" : house === 8 ? "th" : "th"} house (dusthana)`);
    if (debilitated) weakReasons.push(`debilitated (neecha) in ${SIGNS[sign]}`);
    if (combust) weakReasons.push("combust (close to Sun)");
    if (retrograde && id !== "rahu" && id !== "ketu") weakReasons.push("retrograde (vakri)");

    // Strength reasons
    const strengthReasons: string[] = [];
    if (exalted) strengthReasons.push(`exalted (uchcha) in ${SIGNS[sign]}`);
    if (ownSign) strengthReasons.push(`in own sign (swakshetra) — ${SIGNS[sign]}`);
    if ([1, 4, 5, 7, 9, 10].includes(house)) strengthReasons.push(`in the ${house}th house (kendras/trikonas)`);

    return {
      planet: id,
      name: PLANET_NAMES[id],
      symbol: PLANET_SYMBOLS[id],
      color: PLANET_COLORS[id],
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
      nakshatra: nakInfo.name,
      nakshatraPada: nakInfo.pada,
      nakshatraLord: nakInfo.lord,
      weakReasons,
      strengthReasons,
    };
  });

  const weakPlanets = planets.filter((p) => p.weakReasons.length > 0);

  return {
    lagna: ascSidereal,
    lagnaSign,
    lagnaSignName: SIGNS[lagnaSign],
    lagnaDegrees,
    lagnaMinutes,
    lagnaNakshatra: lagnaNakInfo.name,
    planets,
    weakPlanets,
    ayanamsha,
    birthPlace: cityName,
    birthLat: latitude,
    birthLng: longitude,
  };
}

// ─── Geocoding ────────────────────────────────────────────────────────────────

export async function geocodeCity(
  city: string
): Promise<{ lat: number; lng: number; displayName: string } | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`;
    const res = await fetch(url, {
      headers: { "User-Agent": "AstroLearn-Kundli/1.0" },
    });
    const data = await res.json();
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
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
      planet: p.planet,
      planetName: p.name,
      symbol: p.symbol,
      color: p.color,
      yantraId: p.planet,
      reason: `${p.name} is ${p.weakReasons.join(" and ")} in your Kundli.`,
      severity: (p.debilitated || p.house === 8 ? "high" : "medium") as "high" | "medium",
      house: p.house,
      signName: p.signName,
    }))
    .sort((a, b) => (a.severity === "high" ? -1 : 1));
}

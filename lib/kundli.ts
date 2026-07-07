// lib/kundli.ts
// Vedic (Jyotish) Kundli calculation engine using astronomy-engine
// Uses Lahiri Ayanamsha, Whole Sign house system

import * as Astronomy from "astronomy-engine";

export const SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
] as const;

export type SignName = typeof SIGNS[number];

// Debilitation sign index (0-11) for each planet
const DEBILITATION_SIGN: Record<string, number> = {
  surya: 6,    // Libra
  chandra: 7,  // Scorpio
  mangal: 3,   // Cancer
  budh: 11,    // Pisces
  guru: 9,     // Capricorn
  shukra: 5,   // Virgo
  shani: 0,    // Aries
};

// Combustion orbs: planet combust when within N degrees of Sun
const COMBUSTION_ORB: Record<string, number> = {
  chandra: 12,
  mangal: 17,
  budh: 14,
  guru: 11,
  shukra: 10,
  shani: 15,
};

// Planet display info
const PLANET_NAMES: Record<string, string> = {
  surya: "Surya (Sun)",
  chandra: "Chandra (Moon)",
  mangal: "Mangal (Mars)",
  budh: "Budh (Mercury)",
  guru: "Guru (Jupiter)",
  shukra: "Shukra (Venus)",
  shani: "Shani (Saturn)",
  rahu: "Rahu",
  ketu: "Ketu",
};

const PLANET_SYMBOLS: Record<string, string> = {
  surya: "☉", chandra: "☽", mangal: "♂", budh: "☿",
  guru: "♃", shukra: "♀", shani: "♄", rahu: "☊", ketu: "☋"
};

const PLANET_COLORS: Record<string, string> = {
  surya: "#FF6B35", chandra: "#C8B8DB", mangal: "#E63946", budh: "#2DC653",
  guru: "#FFD700", shukra: "#FF85A1", shani: "#6B7280", rahu: "#4B0082", ketu: "#8B4513"
};

export interface PlanetInfo {
  planet: string;
  name: string;
  symbol: string;
  color: string;
  longitude: number;    // Sidereal 0–360
  degrees: number;      // Degrees within sign (0–29.99)
  sign: number;         // 0–11
  signName: string;
  house: number;        // 1–12
  retrograde: boolean;
  debilitated: boolean;
  combust: boolean;
  weakReasons: string[];
}

export interface KundliResult {
  lagna: number;
  lagnaSign: number;
  lagnaSignName: string;
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

// ─── Math helpers ───────────────────────────────────────────────────────────

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

// ─── Ayanamsha ──────────────────────────────────────────────────────────────

function getLahiriAyanamsha(date: Date): number {
  const J2000 = 2451545.0;
  const jd = dateToJD(date);
  const T = (jd - J2000) / 365.25; // Julian years from J2000
  // Lahiri: 23.856° at J2000, rate ~50.27"/year = 0.013964°/year
  return 23.856 + T * 0.013964;
}

function toSidereal(tropical: number, ayanamsha: number): number {
  return normLng(tropical - ayanamsha);
}

// ─── Planetary longitude helpers ─────────────────────────────────────────────

function getGeocentricLongitude(body: Astronomy.Body, date: Date): number {
  const vec = Astronomy.GeoVector(body, date, true);
  const ecl = Astronomy.Ecliptic(vec);
  return normLng(ecl.elon);
}

// Rahu (Mean Lunar North Node) — moves retrograde ~0.05295°/day
function getRahuTropicalLng(jd: number): number {
  const J2000 = 2451545.0;
  return normLng(125.044555 - (jd - J2000) * 0.052953922);
}

// ─── Ascendant calculation ───────────────────────────────────────────────────

function calculateAscendantTropical(date: Date, latitude: number, longitude: number): number {
  // Greenwich Sidereal Time (hours) from astronomy-engine
  const gst = Astronomy.SiderealTime(date);
  // Local Sidereal Time in degrees
  const lst = normLng((gst * 15) + longitude);
  const ramc = lst * (Math.PI / 180);

  // Obliquity of ecliptic (approximate)
  const jd = dateToJD(date);
  const T = (jd - 2451545.0) / 36525;
  const epsilon = (23.439291111 - 0.013004167 * T) * (Math.PI / 180);
  const lat = latitude * (Math.PI / 180);

  // Ascendant formula (tropical)
  let asc = Math.atan2(
    -Math.cos(ramc),
    Math.sin(epsilon) * Math.tan(lat) + Math.cos(epsilon) * Math.sin(ramc)
  ) * (180 / Math.PI);

  return normLng(asc);
}

// ─── Main Kundli calculation ─────────────────────────────────────────────────

export function calculateKundli(
  dob: string,        // YYYY-MM-DD
  time: string,       // HH:MM  (local time at birth place)
  latitude: number,
  longitude: number,
  cityName: string
): KundliResult {
  const [year, month, day] = dob.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);

  // Approximate UTC from local time using longitude offset
  const tzOffset = longitude / 15; // rough offset in hours
  const utcHour = hour - tzOffset;
  const date = new Date(Date.UTC(year, month - 1, day, utcHour, minute, 0));

  const jd = dateToJD(date);
  const ayanamsha = getLahiriAyanamsha(date);

  // Tropical longitudes
  const rawSun = getGeocentricLongitude(Astronomy.Body.Sun, date);
  const rawMoon = getGeocentricLongitude(Astronomy.Body.Moon, date);
  const rawMars = getGeocentricLongitude(Astronomy.Body.Mars, date);
  const rawMerc = getGeocentricLongitude(Astronomy.Body.Mercury, date);
  const rawJup = getGeocentricLongitude(Astronomy.Body.Jupiter, date);
  const rawVen = getGeocentricLongitude(Astronomy.Body.Venus, date);
  const rawSat = getGeocentricLongitude(Astronomy.Body.Saturn, date);
  const rawRahu = getRahuTropicalLng(jd);
  const rawKetu = normLng(rawRahu + 180);

  // Sidereal (Vedic) longitudes
  const sidSun = toSidereal(rawSun, ayanamsha);
  const sidMoon = toSidereal(rawMoon, ayanamsha);
  const sidMars = toSidereal(rawMars, ayanamsha);
  const sidMerc = toSidereal(rawMerc, ayanamsha);
  const sidJup = toSidereal(rawJup, ayanamsha);
  const sidVen = toSidereal(rawVen, ayanamsha);
  const sidSat = toSidereal(rawSat, ayanamsha);
  const sidRahu = toSidereal(rawRahu, ayanamsha);
  const sidKetu = toSidereal(rawKetu, ayanamsha);

  // Lagna (Ascendant) — sidereal
  const ascTropical = calculateAscendantTropical(date, latitude, longitude);
  const ascSidereal = toSidereal(ascTropical, ayanamsha);
  const lagnaSign = Math.floor(ascSidereal / 30);

  // Planet data
  const rawPlanets = [
    { id: "surya", lng: sidSun },
    { id: "chandra", lng: sidMoon },
    { id: "mangal", lng: sidMars },
    { id: "budh", lng: sidMerc },
    { id: "guru", lng: sidJup },
    { id: "shukra", lng: sidVen },
    { id: "shani", lng: sidSat },
    { id: "rahu", lng: sidRahu },
    { id: "ketu", lng: sidKetu },
  ];

  const planets: PlanetInfo[] = rawPlanets.map(({ id, lng }) => {
    const sign = Math.floor(lng / 30);
    const degrees = lng % 30;
    const house = ((sign - lagnaSign + 12) % 12) + 1;
    const debilitated = DEBILITATION_SIGN[id] === sign;
    const orb = COMBUSTION_ORB[id];
    const combust = orb !== undefined && angularDiff(sidSun, lng) <= orb;
    const weakReasons: string[] = [];

    if ([6, 8, 12].includes(house)) weakReasons.push(`in the ${house}th house (dusthana)`);
    if (debilitated) weakReasons.push(`debilitated in ${SIGNS[sign]}`);
    if (combust) weakReasons.push("combust (close to Sun)");

    return {
      planet: id,
      name: PLANET_NAMES[id],
      symbol: PLANET_SYMBOLS[id],
      color: PLANET_COLORS[id],
      longitude: lng,
      degrees,
      sign,
      signName: SIGNS[sign],
      house,
      retrograde: false,
      debilitated,
      combust,
      weakReasons,
    };
  });

  const weakPlanets = planets.filter((p) => p.weakReasons.length > 0);

  return {
    lagna: ascSidereal,
    lagnaSign,
    lagnaSignName: SIGNS[lagnaSign],
    planets,
    weakPlanets,
    ayanamsha,
    birthPlace: cityName,
    birthLat: latitude,
    birthLng: longitude,
  };
}

// ─── Geocoding ───────────────────────────────────────────────────────────────

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

// ─── Yantra Recommendations ──────────────────────────────────────────────────

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

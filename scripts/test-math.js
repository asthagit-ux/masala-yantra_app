// scripts/test-math.js
import * as Astronomy from "astronomy-engine";

function normLng(deg) {
  return ((deg % 360) + 360) % 360;
}

function dateToJD(date) {
  return date.getTime() / 86400000 + 2440587.5;
}

function getLahiriAyanamsha(jd) {
  const JD_1956_MAR21 = 2435553.5;
  const AYANAMSHA_1956 = 23.25018278; // 23° 15' 00.658"
  const RATE_DEG_PER_DAY = 50.2388475 / 3600 / 365.25;
  return AYANAMSHA_1956 + (jd - JD_1956_MAR21) * RATE_DEG_PER_DAY;
}

function getGeocentricLongitude(body, date) {
  const vec = Astronomy.GeoVector(body, date, true);
  const ecl = Astronomy.Ecliptic(vec);
  return normLng(ecl.elon);
}

function getRahuMeanTropicalLng(jd) {
  const J2000 = 2451545.0;
  return normLng(125.04455501 - (jd - J2000) * 0.052953922);
}

function calculateAscendantTropical(date, lat, lng) {
  const time = Astronomy.MakeTime(date);
  const gstHours = Astronomy.SiderealTime(time); // GMST in hours
  const gstDegrees = gstHours * 15; // Convert hours to degrees
  const lst = normLng(gstDegrees + lng); // Local Sidereal Time in degrees
  const ramc = lst * (Math.PI / 180);

  const jd = dateToJD(date);
  const T = (jd - 2451545.0) / 36525;
  const eps = (23.439291111 - 0.013004167 * T) * (Math.PI / 180);
  const phi = lat * (Math.PI / 180);

  const num = Math.cos(ramc);
  const den = -Math.sin(ramc) * Math.cos(eps) - Math.tan(phi) * Math.sin(eps);
  
  let asc = Math.atan2(num, den) * (180 / Math.PI);
  return normLng(asc);
}

// Test Gandhi's birth: 1869-10-02, 07:11 AM LMT
const tzOffset = 69.6293 / 15;
const date = new Date(Date.UTC(1869, 9, 2, 0, 0, 0));
date.setUTCMinutes(Math.round((7 * 60 + 11) - tzOffset * 60));

const jd = dateToJD(date);
const ayan = getLahiriAyanamsha(jd);
const ascTrop = calculateAscendantTropical(date, 21.6417, 69.6293);
const ascSid = normLng(ascTrop - ayan);

const signs = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

console.log("=== Gandhi Birth Chart (Sidereal Lahiri Ayanamsha) ===");
console.log("Lagna Sign:", signs[Math.floor(ascSid / 30)], `(${Math.floor(ascSid % 30)}°${Math.floor(((ascSid % 30) % 1) * 60)}')`);

const bodies = [
  { id: "surya", body: Astronomy.Body.Sun },
  { id: "chandra", body: Astronomy.Body.Moon },
  { id: "mangal", body: Astronomy.Body.Mars },
  { id: "budh", body: Astronomy.Body.Mercury },
  { id: "guru", body: Astronomy.Body.Jupiter },
  { id: "shukra", body: Astronomy.Body.Venus },
  { id: "shani", body: Astronomy.Body.Saturn },
];

for (const b of bodies) {
  const trop = getGeocentricLongitude(b.body, date);
  const sid = normLng(trop - ayan);
  console.log(
    b.id.padEnd(8),
    "Tropical:", trop.toFixed(2).padStart(6),
    "Sidereal:", sid.toFixed(2).padStart(6),
    signs[Math.floor(sid / 30)]
  );
}

const rahuTrop = getRahuMeanTropicalLng(jd);
const rahuSid = normLng(rahuTrop - ayan);
console.log("rahu".padEnd(8), "Tropical:", rahuTrop.toFixed(2).padStart(6), "Sidereal:", rahuSid.toFixed(2).padStart(6), signs[Math.floor(rahuSid / 30)]);

const ketuSid = normLng(rahuSid + 180);
console.log("ketu".padEnd(8), " ".repeat(18), "Sidereal:", ketuSid.toFixed(2).padStart(6), signs[Math.floor(ketuSid / 30)]);

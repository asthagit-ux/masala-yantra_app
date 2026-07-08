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
  const AYANAMSHA_1956 = 23.25018278;
  const RATE_DEG_PER_DAY = 50.2388475 / 3600 / 365.25;
  return AYANAMSHA_1956 + (jd - JD_1956_MAR21) * RATE_DEG_PER_DAY;
}

function getGeocentricLongitude(body, date) {
  const vec = Astronomy.GeoVector(body, date, true);
  const ecl = Astronomy.Ecliptic(vec);
  return normLng(ecl.elon);
}

function isRetrograde(body, date) {
  const msDay = 86400000;
  const lng1 = getGeocentricLongitude(body, new Date(date.getTime() - msDay));
  const lng2 = getGeocentricLongitude(body, new Date(date.getTime() + msDay));
  let diff = lng2 - lng1;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return diff < 0;
}

function getRahuMeanTropicalLng(jd) {
  const J2000 = 2451545.0;
  return normLng(125.04455501 - (jd - J2000) * 0.052953922);
}

function calculateAscendantTropical(date, lat, lng) {
  const time = Astronomy.MakeTime(date);
  const gstHours = Astronomy.SiderealTime(time);
  const gstDegrees = gstHours * 15;
  const lst = normLng(gstDegrees + lng);
  const ramc = lst * (Math.PI / 180);

  const jd = dateToJD(date);
  const T = (jd - 2451545.0) / 36525;
  const eps = (23.439291111 - 0.013004167 * T) * (Math.PI / 180);
  const phi = lat * (Math.PI / 180);

  const num = Math.cos(ramc);
  const den = -Math.sin(ramc) * Math.cos(eps) - Math.tan(phi) * Math.sin(eps);
  const asc = Math.atan2(num, den) * (180 / Math.PI);
  return normLng(asc);
}

const signs = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

function runTest(label, year, month0, day, hour, minute, lat, lng) {
  const tzOffset = 5.5; // IST
  const date = new Date(Date.UTC(year, month0, day, 0, 0, 0));
  date.setUTCMinutes(Math.round((hour * 60 + minute) - tzOffset * 60));

  const jd = dateToJD(date);
  const ayan = getLahiriAyanamsha(jd);
  const ascTrop = calculateAscendantTropical(date, lat, lng);
  const ascSid = normLng(ascTrop - ayan);

  console.log(`\n=== ${label} ===`);
  console.log("UTC:", date.toUTCString());
  console.log(`Lagna: ${signs[Math.floor(ascSid / 30)]} — ${Math.floor(ascSid % 30)}°${Math.floor(((ascSid % 30) % 1) * 60)}'`);

  const bodies = [
    { id: "Surya", body: Astronomy.Body.Sun },
    { id: "Chandra", body: Astronomy.Body.Moon },
    { id: "Mangal", body: Astronomy.Body.Mars },
    { id: "Budh", body: Astronomy.Body.Mercury },
    { id: "Guru", body: Astronomy.Body.Jupiter },
    { id: "Shukra", body: Astronomy.Body.Venus },
    { id: "Shani", body: Astronomy.Body.Saturn },
  ];

  for (const b of bodies) {
    const trop = getGeocentricLongitude(b.body, date);
    const sid = normLng(trop - ayan);
    const retro = isRetrograde(b.body, date);
    console.log(
      `  ${b.id.padEnd(8)} ${signs[Math.floor(sid / 30)].padEnd(13)} ${Math.floor(sid % 30)}°${Math.floor(((sid % 30) % 1) * 60)}'${retro ? " (R)" : ""}`
    );
  }

  // Rahu/Ketu
  const rahuTrop = getRahuMeanTropicalLng(jd);
  const rahuSid = normLng(rahuTrop - ayan);
  const ketuSid = normLng(rahuSid + 180);
  console.log(`  Rahu    ${signs[Math.floor(rahuSid / 30)].padEnd(13)} ${Math.floor(rahuSid % 30)}°${Math.floor(((rahuSid % 30) % 1) * 60)}'`);
  console.log(`  Ketu    ${signs[Math.floor(ketuSid / 30)].padEnd(13)} ${Math.floor(ketuSid % 30)}°${Math.floor(((ketuSid % 30) % 1) * 60)}'`);
}

// Test 1: User's own birth details
runTest(
  "Your Chart: Gwalior, 26 Feb 2004, 10:15 PM IST",
  2004, 1, 26,   // month0 = 1 for February
  22, 15,         // 10:15 PM = 22:15
  26.2183, 78.1828 // Gwalior lat/lng
);

// Test 2: Reference case that is reported as "correct"
runTest(
  "Reference Chart: 04 Feb 2001, 10:45 AM IST",
  2001, 1, 4,    // month0 = 1 for February
  10, 45,
  26.2183, 78.1828 // assuming same city, adjust if different
);

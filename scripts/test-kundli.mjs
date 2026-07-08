// Quick test: validate kundli calculation against known reference charts
// Run: node --require ts-node/register /Users/apple/Downloads/astro-app/scripts/test-kundli.mjs

// Test with a well-known reference:
// Mahatma Gandhi: born 1869-10-02, 07:11 AM, Porbandar India (21.6417°N, 69.6293°E)
// Known Vedic chart: Lagna = Libra (Tula), Moon in Leo (Simha)

// And a modern test case for quick debugging
import { calculateKundli } from "../lib/kundli.js";

const tests = [
  {
    name: "Gandhi (known Vedic reference)",
    dob: "1869-10-02",
    time: "07:11",
    lat: 21.6417,
    lng: 69.6293,
    city: "Porbandar",
    tzOffsetHours: 5.5,   // IST
    expectedLagna: "Libra",
    expectedMoon: "Leo",
    expectedSun: "Virgo",
  },
  {
    name: "Modern test - Delhi noon",
    dob: "1990-01-15",
    time: "12:00",
    lat: 28.6139,
    lng: 77.2090,
    city: "Delhi",
    tzOffsetHours: 5.5,
    expectedLagna: null,
    expectedMoon: null,
    expectedSun: "Sagittarius",  // 15 Jan 1990 tropical sun ~295° - ayan ~23.7° = ~271.3° = Sagittarius
  }
];

for (const t of tests) {
  console.log("\n===", t.name, "===");
  try {
    const r = calculateKundli(t.dob, t.time, t.lat, t.lng, t.city, t.tzOffsetHours);
    console.log("Lagna:", r.lagnaSignName, `(${r.lagnaDegrees}°${r.lagnaMinutes}′)`, "Nakshatra:", r.lagnaNakshatra);
    for (const p of r.planets) {
      const badges = [
        p.retrograde ? "(R)" : "",
        p.exalted ? "EXALTED" : "",
        p.ownSign ? "OWN" : "",
        p.debilitated ? "DEBILITATED" : "",
        p.combust ? "COMBUST" : "",
      ].filter(Boolean).join(" ");
      console.log(
        `  ${p.symbol} ${p.name.padEnd(22)} H${p.house} ${p.signName.padEnd(12)} ${p.degrees}°${p.minutes}′ ${p.nakshatra} ${badges}`
      );
    }
    if (t.expectedLagna) {
      const ok = r.lagnaSignName === t.expectedLagna;
      console.log(`  Lagna check: ${ok ? "✅" : "❌"} expected ${t.expectedLagna}, got ${r.lagnaSignName}`);
    }
    const sun = r.planets.find(p => p.planet === "surya");
    if (t.expectedSun && sun) {
      const ok = sun.signName === t.expectedSun;
      console.log(`  Sun check:   ${ok ? "✅" : "❌"} expected ${t.expectedSun}, got ${sun.signName}`);
    }
    const moon = r.planets.find(p => p.planet === "chandra");
    if (t.expectedMoon && moon) {
      const ok = moon.signName === t.expectedMoon;
      console.log(`  Moon check:  ${ok ? "✅" : "❌"} expected ${t.expectedMoon}, got ${moon.signName}`);
    }
    console.log("  Weak planets:", r.weakPlanets.map(p => `${p.name.split(" ")[0]}(${p.weakReasons.join(", ")})`).join(" | ") || "None");
  } catch (err) {
    console.error("  ERROR:", err);
  }
}

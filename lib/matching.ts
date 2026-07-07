import fs from "fs";
import path from "path";

const CONTENT_DIR = path.join(process.cwd(), "content");

export const PLANETS = [
  "surya", "chandra", "mangal", "budh", "guru", "shukra", "shani", "rahu", "ketu"
] as const;

export const SIGNS = [
  "aries", "taurus", "gemini", "cancer", "leo", "virgo",
  "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"
] as const;

export type Planet = typeof PLANETS[number];
export type Sign = typeof SIGNS[number];

export interface RemedyEntry {
  id: string;
  name: string;
  en: string;
  day: string;
  governs: string;
  doshaTriggers: string[];
  remedies: string[];
  yantra: string;
  yantraName: string;
}

export interface HoroscopeEntry {
  sign: string;
  ruler: string;
  areas: {
    love: string[];
    career: string[];
    health: string[];
    finance: string[];
  };
}

// Deterministic, dependency-free daily index picker.
// Same date + same seed always returns the same index, so content
// rotates day to day without a database or random() call.
function dailyIndex(seed: string, dateStr: string, length: number): number {
  const combined = `${seed}:${dateStr}`;
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    hash = (hash * 31 + combined.charCodeAt(i)) >>> 0;
  }
  return hash % length;
}

export function getRemedy(planet: Planet): RemedyEntry {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, "remedies", `${planet}.json`), "utf-8");
  return JSON.parse(raw);
}

export function getYantraSvgPath(planet: Planet): string {
  return path.join(CONTENT_DIR, "yantras", `${planet}.svg`);
}

export function getYantraSvg(planet: Planet): string {
  return fs.readFileSync(getYantraSvgPath(planet), "utf-8");
}

// Picks one remedy line for the day, so a "today's remedy" page
// doesn't repeat the exact same line every single day.
export function getDailyRemedyLine(planet: Planet, date: Date = new Date()): string {
  const entry = getRemedy(planet);
  const dateStr = date.toISOString().slice(0, 10);
  const idx = dailyIndex(planet, dateStr, entry.remedies.length);
  return entry.remedies[idx];
}

export function getHoroscope(sign: Sign): HoroscopeEntry {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, "horoscope", `${sign}.json`), "utf-8");
  return JSON.parse(raw);
}

// Returns today's pick for each life area, deterministic per day.
export function getDailyHoroscope(sign: Sign, date: Date = new Date()) {
  const entry = getHoroscope(sign);
  const dateStr = date.toISOString().slice(0, 10);
  const areas = entry.areas;
  return {
    sign: entry.sign,
    ruler: entry.ruler,
    date: dateStr,
    love: areas.love[dailyIndex(`${sign}:love`, dateStr, areas.love.length)],
    career: areas.career[dailyIndex(`${sign}:career`, dateStr, areas.career.length)],
    health: areas.health[dailyIndex(`${sign}:health`, dateStr, areas.health.length)],
    finance: areas.finance[dailyIndex(`${sign}:finance`, dateStr, areas.finance.length)]
  };
}

// ─── Masala Remedies ─────────────────────────────────────────────────────────

export interface MasalaRemedy {
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

export interface MasalaCategory {
  category: string;
  label: string;
  icon: string;
  description: string;
  remedies: MasalaRemedy[];
}

export interface MasalaIndexEntry {
  id: string;
  label: string;
  icon: string;
  description: string;
  file: string;
  count: number;
}

export interface MasalaIndex {
  categories: MasalaIndexEntry[];
  totalRemedies: number;
  source: string;
  disclaimer: string;
}

const MASALA_DIR = path.join(CONTENT_DIR, "masala-remedies");

export function getMasalaIndex(): MasalaIndex {
  const raw = fs.readFileSync(path.join(MASALA_DIR, "index.json"), "utf-8");
  return JSON.parse(raw);
}

export function getMasalaCategory(categoryId: string): MasalaCategory {
  const index = getMasalaIndex();
  const entry = index.categories.find((c) => c.id === categoryId);
  if (!entry) throw new Error(`Masala category not found: ${categoryId}`);
  const raw = fs.readFileSync(path.join(MASALA_DIR, entry.file), "utf-8");
  return JSON.parse(raw);
}

export function getMasalaPlanetaryRemedies(planet: Planet): MasalaRemedy[] {
  const category = getMasalaCategory("planetary");
  return category.remedies.filter((r) => r.planet === planet);
}

export const MASALA_CATEGORY_IDS = [
  "protection",
  "wealth",
  "love-relationships",
  "health-wellbeing",
  "planetary",
  "spiritual-luck",
] as const;

export type MasalaCategoryId = typeof MASALA_CATEGORY_IDS[number];

export interface MasalaProblem {
  id: string;
  label: string;
  remedyTitles: string[];
}

export interface MasalaProblemsCategory {
  title: string;
  problems: MasalaProblem[];
}

export type MasalaProblemsMap = Record<string, MasalaProblemsCategory>;

export function getMasalaProblems(): MasalaProblemsMap {
  const raw = fs.readFileSync(path.join(MASALA_DIR, "problems.json"), "utf-8");
  return JSON.parse(raw);
}


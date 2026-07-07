"use client";

import React from "react";

interface YantraData {
  id: string;
  number: number;
  name: string;
  category: string;
  description: string;
  benefits: string[];
  mantras: string[];
  preparation: {
    day: string;
    time: string;
    materials: string;
  };
  layout: {
    type: string;
    rows?: number;
    cols?: number;
    cells?: string[][];
    numbers?: string[];
    text1?: string;
    text2?: string;
    header?: string;
    label?: string;
    text?: string;
    seed1?: string;
    seed2?: string;
    destination?: string;
    number?: string;
    left?: string;
    right?: string;
    center?: string;
    top_numbers?: string[];
    mantra?: string;
    bottom_left?: string;
    bottom_right?: string;
    outer_numbers?: string[];
    points?: string[];
    outer?: string[];
    inner?: string[];
    labels?: string[][];
  };
}

interface YantraRendererProps {
  yantra: YantraData;
  userName?: string;
  destinationName?: string;
  businessName?: string;
}

export default function YantraRenderer({
  yantra,
  userName = "",
  destinationName = "",
  businessName = "",
}: YantraRendererProps) {
  const nameToUse = userName.trim() || "NATIVE NAME";
  const destToUse = destinationName.trim() || "DESTINATION";
  const bizToUse = businessName.trim() || "BUSINESS NAME";

  // Shared SVG styles for premium look
  const strokeColor = "#b45309"; // amber-700
  const fillColor = "#fffbf0"; // warm cream/parchment
  const textColor = "#1e1b4b"; // deep indigo text
  const accentColor = "#dc2626"; // red-600 for mantras

  const renderLayout = () => {
    const layout = yantra.layout;

    switch (layout.type) {
      case "grid":
      case "seed-grid-gap": {
        const rows = layout.rows || 3;
        const cols = layout.cols || 3;
        const cells = layout.cells || [];
        const width = 300;
        const height = 300;
        const cellW = width / cols;
        const cellH = height / rows;

        return (
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-[320px] mx-auto drop-shadow-md">
            {/* Outer Box */}
            <rect x="5" y="5" width={width - 10} height={height - 10} fill={fillColor} stroke={strokeColor} strokeWidth="3" rx="4" />
            <rect x="12" y="12" width={width - 24} height={height - 24} fill="none" stroke={strokeColor} strokeWidth="1.5" />

            {/* Grid Lines */}
            {Array.from({ length: cols - 1 }).map((_, i) => {
              const x = (i + 1) * cellW;
              return <line key={`v-${i}`} x1={x} y1="12" x2={x} y2={height - 12} stroke={strokeColor} strokeWidth="1.5" />;
            })}
            {Array.from({ length: rows - 1 }).map((_, i) => {
              const y = (i + 1) * cellH;
              return <line key={`h-${i}`} x1="12" y1={y} x2={width - 12} y2={y} stroke={strokeColor} strokeWidth="1.5" />;
            })}

            {/* Cells Content */}
            {cells.map((row, rIdx) =>
              row.map((cell, cIdx) => {
                const x = cIdx * cellW + cellW / 2;
                const y = rIdx * cellH + cellH / 2;
                
                // Replace name placeholder dynamically
                let displayVal = cell;
                let isPlaceholder = false;
                if (cell === "[नाम]" || cell === "[NAME]") {
                  displayVal = nameToUse;
                  isPlaceholder = true;
                }

                return (
                  <text
                    key={`c-${rIdx}-${cIdx}`}
                    x={x}
                    y={y}
                    dominantBaseline="middle"
                    textAnchor="middle"
                    fill={isPlaceholder ? accentColor : textColor}
                    className={`font-semibold ${isPlaceholder ? "text-xs select-none" : "text-base"} font-serif`}
                  >
                    {displayVal}
                  </text>
                );
              })
            )}
          </svg>
        );
      }

      case "business-grid": {
        const cells = layout.cells || [];
        const width = 300;
        const height = 300;
        const cellW = width / 3;
        const cellH = (height - 60) / 3;

        return (
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-[320px] mx-auto drop-shadow-md">
            <rect x="5" y="5" width={width - 10} height={height - 10} fill={fillColor} stroke={strokeColor} strokeWidth="3" rx="4" />
            <rect x="12" y="12" width={width - 24} height={height - 24} fill="none" stroke={strokeColor} strokeWidth="1.5" />

            {/* Business name header box */}
            <rect x="12" y="12" width={width - 24} height="48" fill="none" stroke={strokeColor} strokeWidth="1.5" />
            <line x1="12" y1="60" x2={width - 12} y2="60" stroke={strokeColor} strokeWidth="2" />
            
            <text x={width / 2} y="36" dominantBaseline="middle" textAnchor="middle" fill={accentColor} className="text-xs font-semibold font-serif">
              {bizToUse}
            </text>

            {/* 3x3 Grid lines underneath */}
            {Array.from({ length: 2 }).map((_, i) => {
              const x = (i + 1) * cellW;
              return <line key={`v-${i}`} x1={x} y1="60" x2={x} y2={height - 12} stroke={strokeColor} strokeWidth="1.5" />;
            })}
            {Array.from({ length: 2 }).map((_, i) => {
              const y = 60 + (i + 1) * cellH;
              return <line key={`h-${i}`} x1="12" y1={y} x2={width - 12} y2={y} stroke={strokeColor} strokeWidth="1.5" />;
            })}

            {/* Grid numbers */}
            {cells.map((row, rIdx) =>
              row.map((cell, cIdx) => {
                const x = cIdx * cellW + cellW / 2;
                const y = 60 + rIdx * cellH + cellH / 2;
                return (
                  <text key={`c-${rIdx}-${cIdx}`} x={x} y={y} dominantBaseline="middle" textAnchor="middle" fill={textColor} className="text-base font-semibold font-serif">
                    {cell}
                  </text>
                );
              })
            )}
          </svg>
        );
      }

      case "grid-vertical-label": {
        const cells = layout.cells || [];
        const label = layout.label || "NAME";
        const width = 300;
        const height = 300;
        const labelW = 60;
        const cellW = (width - labelW) / 4;
        const cellH = height / 4;

        return (
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-[320px] mx-auto drop-shadow-md">
            <rect x="5" y="5" width={width - 10} height={height - 10} fill={fillColor} stroke={strokeColor} strokeWidth="3" rx="4" />
            <rect x="12" y="12" width={width - 24} height={height - 24} fill="none" stroke={strokeColor} strokeWidth="1.5" />

            {/* Vertical label divider */}
            <line x1={12 + labelW} y1="12" x2={12 + labelW} y2={height - 12} stroke={strokeColor} strokeWidth="2" />

            {/* Label Characters */}
            {label.split("").map((char, i) => {
              const y = 20 + i * (280 / label.length) + (280 / label.length) / 2;
              return (
                <text key={`l-${i}`} x={12 + labelW / 2} y={y} dominantBaseline="middle" textAnchor="middle" fill={accentColor} className="text-sm font-bold font-serif">
                  {char}
                </text>
              );
            })}

            {/* Grid vertical lines */}
            {Array.from({ length: 3 }).map((_, i) => {
              const x = 12 + labelW + (i + 1) * cellW;
              return <line key={`v-${i}`} x1={x} y1="12" x2={x} y2={height - 12} stroke={strokeColor} strokeWidth="1.5" />;
            })}
            {/* Grid horizontal lines */}
            {Array.from({ length: 3 }).map((_, i) => {
              const y = (i + 1) * cellH;
              return <line key={`h-${i}`} x1={12 + labelW} y1={y} x2={width - 12} y2={y} stroke={strokeColor} strokeWidth="1.5" />;
            })}

            {/* Cells */}
            {cells.map((row, rIdx) =>
              row.map((cell, cIdx) => {
                const x = 12 + labelW + cIdx * cellW + cellW / 2;
                const y = rIdx * cellH + cellH / 2;
                return (
                  <text key={`c-${rIdx}-${cIdx}`} x={x} y={y} dominantBaseline="middle" textAnchor="middle" fill={textColor} className="text-base font-semibold font-serif">
                    {cell}
                  </text>
                );
              })
            )}
          </svg>
        );
      }

      case "grid-vertical-label-right": {
        const cells = layout.cells || [];
        const label = layout.label || "NAME";
        const width = 300;
        const height = 300;
        const labelW = 60;
        const cols = cells[0]?.length || 3;
        const rows = cells.length || 3;
        const cellW = (width - labelW - 24) / cols;
        const cellH = (height - 24) / rows;

        return (
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-[320px] mx-auto drop-shadow-md">
            <rect x="5" y="5" width={width - 10} height={height - 10} fill={fillColor} stroke={strokeColor} strokeWidth="3" rx="4" />
            <rect x="12" y="12" width={width - 24} height={height - 24} fill="none" stroke={strokeColor} strokeWidth="1.5" />

            {/* Vertical label divider */}
            <line x1={width - 12 - labelW} y1="12" x2={width - 12 - labelW} y2={height - 12} stroke={strokeColor} strokeWidth="2" />

            {/* Label Characters (e.g. user name or default) */}
            {nameToUse.slice(0, 8).toUpperCase().split("").map((char, i) => {
              const count = Math.min(nameToUse.length, 8);
              const y = 12 + i * ((height - 24) / count) + ((height - 24) / count) / 2;
              return (
                <text key={`l-${i}`} x={width - 12 - labelW / 2} y={y} dominantBaseline="middle" textAnchor="middle" fill={accentColor} className="text-xs font-bold font-serif select-none">
                  {char}
                </text>
              );
            })}

            {/* Grid vertical lines */}
            {Array.from({ length: cols - 1 }).map((_, i) => {
              const x = 12 + (i + 1) * cellW;
              return <line key={`v-${i}`} x1={x} y1="12" x2={x} y2={height - 12} stroke={strokeColor} strokeWidth="1.5" />;
            })}
            {/* Grid horizontal lines */}
            {Array.from({ length: rows - 1 }).map((_, i) => {
              const y = 12 + (i + 1) * cellH;
              return <line key={`h-${i}`} x1="12" y1={y} x2={width - 12 - labelW} y2={y} stroke={strokeColor} strokeWidth="1.5" />;
            })}

            {/* Cells */}
            {cells.map((row, rIdx) =>
              row.map((cell, cIdx) => {
                const x = 12 + cIdx * cellW + cellW / 2;
                const y = 12 + rIdx * cellH + cellH / 2;
                return (
                  <text key={`c-${rIdx}-${cIdx}`} x={x} y={y} dominantBaseline="middle" textAnchor="middle" fill={textColor} className="text-base font-semibold font-serif">
                    {cell}
                  </text>
                );
              })
            )}
          </svg>
        );
      }

      case "grid-labeled": {
        const cells = layout.cells || [];
        const labels = layout.labels || [];
        const width = 300;
        const height = 300;
        const cellW = width / 3;
        const cellH = height / 3;

        return (
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-[320px] mx-auto drop-shadow-md">
            <rect x="5" y="5" width={width - 10} height={height - 10} fill={fillColor} stroke={strokeColor} strokeWidth="3" rx="4" />
            <rect x="12" y="12" width={width - 24} height={height - 24} fill="none" stroke={strokeColor} strokeWidth="1.5" />

            {/* Grid Lines */}
            {Array.from({ length: 2 }).map((_, i) => {
              const x = (i + 1) * cellW;
              return <line key={`v-${i}`} x1={x} y1="12" x2={x} y2={height - 12} stroke={strokeColor} strokeWidth="1.5" />;
            })}
            {Array.from({ length: 2 }).map((_, i) => {
              const y = (i + 1) * cellH;
              return <line key={`h-${i}`} x1="12" y1={y} x2={width - 12} y2={y} stroke={strokeColor} strokeWidth="1.5" />;
            })}

            {/* Cells with labels */}
            {cells.map((row, rIdx) =>
              row.map((cell, cIdx) => {
                const x = cIdx * cellW + cellW / 2;
                const yVal = rIdx * cellH + cellH / 2 - 8;
                const yLabel = rIdx * cellH + cellH / 2 + 12;
                const cellLabel = labels[rIdx]?.[cIdx] || "";
                return (
                  <g key={`cl-${rIdx}-${cIdx}`}>
                    <text x={x} y={yVal} dominantBaseline="middle" textAnchor="middle" fill={textColor} className="text-lg font-semibold font-serif">
                      {cell}
                    </text>
                    <text x={x} y={yLabel} dominantBaseline="middle" textAnchor="middle" fill={accentColor} className="text-[8px] font-medium font-sans tracking-tight">
                      {cellLabel}
                    </text>
                  </g>
                );
              })
            )}
          </svg>
        );
      }

      case "court-yantra":
      case "house-protection": {
        const nums = layout.numbers || ["56", "4", "5", "45"];
        const line1 = layout.text1 || layout.text || "RAAM DOOT HANUMAN";
        const width = 300;
        const height = 240;
        const cellW = (width - 24) / 4;

        return (
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-[320px] mx-auto drop-shadow-md">
            <rect x="5" y="5" width={width - 10} height={height - 10} fill={fillColor} stroke={strokeColor} strokeWidth="3" rx="4" />
            <rect x="12" y="12" width={width - 24} height={height - 24} fill="none" stroke={strokeColor} strokeWidth="1.5" />

            {/* Top row cells (numbers) */}
            <line x1="12" y1="60" x2={width - 12} y2="60" stroke={strokeColor} strokeWidth="1.5" />
            {Array.from({ length: 3 }).map((_, i) => {
              const x = 12 + (i + 1) * cellW;
              return <line key={`v-${i}`} x1={x} y1="12" x2={x} y2="60" stroke={strokeColor} strokeWidth="1.5" />;
            })}

            {nums.map((num, i) => (
              <text key={`num-${i}`} x={12 + i * cellW + cellW / 2} y="36" dominantBaseline="middle" textAnchor="middle" fill={textColor} className="text-lg font-semibold font-serif">
                {num}
              </text>
            ))}

            {/* Middle Row (Mantra) */}
            <line x1="12" y1="120" x2={width - 12} y2="120" stroke={strokeColor} strokeWidth="1.5" />
            <text x={width / 2} y="90" dominantBaseline="middle" textAnchor="middle" fill={accentColor} className="text-sm font-bold font-serif tracking-widest">
              {line1}
            </text>

            {/* Bottom Row (Owner / Case details) */}
            <text x={width / 2} y="160" dominantBaseline="middle" textAnchor="middle" fill={textColor} className="text-xs font-semibold font-sans tracking-wide">
              {layout.type === "court-yantra" ? "CASE DETAILS / SUCCESS FOR:" : "OWNER OF THE HOUSE:"}
            </text>
            <text x={width / 2} y="195" dominantBaseline="middle" textAnchor="middle" fill={accentColor} className="text-sm font-bold font-serif select-none border-b border-dashed border-red-300">
              {nameToUse}
            </text>
          </svg>
        );
      }

      case "down-triangle":
      case "triangle-mantra": {
        const width = 300;
        const height = 300;
        const lLabel = layout.left || "AUM";
        const rLabel = layout.right || "HREEM";
        const innerText = layout.text || "HREEM";

        return (
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-[320px] mx-auto drop-shadow-md">
            <rect x="5" y="5" width={width - 10} height={height - 10} fill={fillColor} stroke={strokeColor} strokeWidth="3" rx="4" />
            <rect x="12" y="12" width={width - 24} height={height - 24} fill="none" stroke={strokeColor} strokeWidth="1.5" />

            {/* Downward pointing triangle */}
            <polygon points="150,260 40,70 260,70" fill="none" stroke={strokeColor} strokeWidth="2.5" />

            {layout.type === "down-triangle" ? (
              <text x="150" y="140" dominantBaseline="middle" textAnchor="middle" fill={accentColor} className="text-2xl font-bold font-serif tracking-widest">
                {innerText}
              </text>
            ) : (
              <>
                <text x="105" y="120" dominantBaseline="middle" textAnchor="middle" fill={accentColor} className="text-sm font-bold font-serif">
                  {lLabel}
                </text>
                <text x="195" y="120" dominantBaseline="middle" textAnchor="middle" fill={accentColor} className="text-sm font-bold font-serif">
                  {rLabel}
                </text>
              </>
            )}
          </svg>
        );
      }

      case "pyramid-triangle": {
        const cells = layout.cells || [];
        const width = 300;
        const height = 300;

        return (
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-[320px] mx-auto drop-shadow-md">
            <rect x="5" y="5" width={width - 10} height={height - 10} fill={fillColor} stroke={strokeColor} strokeWidth="3" rx="4" />
            <rect x="12" y="12" width={width - 24} height={height - 24} fill="none" stroke={strokeColor} strokeWidth="1.5" />

            {/* Outer Triangle */}
            <polygon points="150,30 20,270 280,270" fill="none" stroke={strokeColor} strokeWidth="2.5" />

            {/* Horizontal partition lines inside triangle */}
            {/* Top divider */}
            <line x1="93" y1="110" x2="207" y2="110" stroke={strokeColor} strokeWidth="1.5" />
            {/* Bottom divider */}
            <line x1="51" y1="190" x2="249" y2="190" stroke={strokeColor} strokeWidth="1.5" />

            {/* Vertical/Diagonal compartments inside Middle & Bottom rows */}
            {/* Row 2 (Middle) vertical splits */}
            <line x1="150" y1="110" x2="150" y2="190" stroke={strokeColor} strokeWidth="1.5" />
            <line x1="120" y1="110" x2="100" y2="190" stroke={strokeColor} strokeWidth="1.5" />
            <line x1="180" y1="110" x2="200" y2="190" stroke={strokeColor} strokeWidth="1.5" />

            {/* Row 3 (Bottom) vertical splits */}
            <line x1="100" y1="190" x2="85" y2="270" stroke={strokeColor} strokeWidth="1.5" />
            <line x1="150" y1="190" x2="150" y2="270" stroke={strokeColor} strokeWidth="1.5" />
            <line x1="200" y1="190" x2="215" y2="270" stroke={strokeColor} strokeWidth="1.5" />

            {/* Texts in cells */}
            {/* Cell 1: Top (cells[0][0]) */}
            {cells[0]?.[0] && (
              <text x="150" y="80" dominantBaseline="middle" textAnchor="middle" fill={textColor} className="text-lg font-bold font-serif">
                {cells[0][0]}
              </text>
            )}

            {/* Row 2 (Middle, cells[1]) */}
            {cells[1]?.map((val, idx) => {
              const xPositions = [110, 135, 165, 190];
              return (
                <text key={`r2-${idx}`} x={xPositions[idx]} y="150" dominantBaseline="middle" textAnchor="middle" fill={textColor} className="text-base font-semibold font-serif">
                  {val}
                </text>
              );
            })}

            {/* Row 3 (Bottom, cells[2]) */}
            {cells[2]?.map((val, idx) => {
              const xPositions = [65, 120, 180, 235];
              return (
                <text key={`r3-${idx}`} x={xPositions[idx]} y="230" dominantBaseline="middle" textAnchor="middle" fill={textColor} className="text-base font-semibold font-serif">
                  {val}
                </text>
              );
            })}
          </svg>
        );
      }

      case "hexagram-star":
      case "star-david": {
        const cells = layout.cells || layout.points || [];
        const centerVal = layout.center || "5";
        const width = 300;
        const height = 300;

        // Coordinates of 6 points of star of david
        // Top, top-right, bottom-right, bottom, bottom-left, top-left
        const pX = [150, 240, 240, 150, 60, 60];
        const pY = [35, 90, 210, 265, 210, 90];

        return (
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-[320px] mx-auto drop-shadow-md">
            <rect x="5" y="5" width={width - 10} height={height - 10} fill={fillColor} stroke={strokeColor} strokeWidth="3" rx="4" />
            <rect x="12" y="12" width={width - 24} height={height - 24} fill="none" stroke={strokeColor} strokeWidth="1.5" />

            {/* Triangle 1: Upward */}
            <polygon points="150,30 50,210 250,210" fill="none" stroke={strokeColor} strokeWidth="2" />
            {/* Triangle 2: Downward */}
            <polygon points="150,270 50,90 250,90" fill="none" stroke={strokeColor} strokeWidth="2" />

            {/* Center Value */}
            <text x="150" y="150" dominantBaseline="middle" textAnchor="middle" fill={textColor} className="text-xl font-bold font-serif">
              {centerVal}
            </text>

            {/* Numbers on points / compartments */}
            {cells.slice(0, 10).map((val, idx) => {
              // Approximate coordinates for the 6 outer star vertices & 4 inner segments
              const coords = [
                { x: 150, y: 55, c: textColor },    // top point
                { x: 230, y: 105, c: textColor },   // top-right point
                { x: 230, y: 195, c: textColor },   // bottom-right point
                { x: 150, y: 245, c: textColor },   // bottom point
                { x: 70, y: 195, c: textColor },    // bottom-left point
                { x: 70, y: 105, c: textColor },    // top-left point
                // Inner cells
                { x: 120, y: 120, c: accentColor },
                { x: 180, y: 120, c: accentColor },
                { x: 120, y: 180, c: accentColor },
                { x: 180, y: 180, c: accentColor },
              ];

              const pt = coords[idx];
              if (!pt) return null;
              return (
                <text key={`pt-${idx}`} x={pt.x} y={pt.y} dominantBaseline="middle" textAnchor="middle" fill={pt.c} className="text-base font-bold font-serif">
                  {val}
                </text>
              );
            })}
          </svg>
        );
      }

      case "pentagram-star": {
        const centerVal = layout.center || "KLEEM";
        const points = layout.points || ["HREEM", "SHREEM", "HREEM", "SHREEM", "HREEM"];
        const width = 300;
        const height = 300;

        return (
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-[320px] mx-auto drop-shadow-md">
            <rect x="5" y="5" width={width - 10} height={height - 10} fill={fillColor} stroke={strokeColor} strokeWidth="3" rx="4" />
            <rect x="12" y="12" width={width - 24} height={height - 24} fill="none" stroke={strokeColor} strokeWidth="1.5" />

            {/* Circular boundary */}
            <circle cx="150" cy="150" r="100" fill="none" stroke={strokeColor} strokeWidth="2" />

            {/* 5-pointed star (Pentagram) */}
            {/* Vertices of standard pentagram: 180, 54, 342, 270, 198, 126 etc. */}
            <polygon points="150,55 210,230 70,120 230,120 90,230" fill="none" stroke={strokeColor} strokeWidth="2" />

            {/* Center Syllable */}
            <text x="150" y="150" dominantBaseline="middle" textAnchor="middle" fill={textColor} className="text-base font-bold font-serif">
              {centerVal}
            </text>

            {/* Seed mantras around points */}
            {points.slice(0, 5).map((p, idx) => {
              const coords = [
                { x: 150, y: 35 },   // Top point
                { x: 245, y: 120 },  // Right inner point area
                { x: 210, y: 250 },  // Bottom right point
                { x: 90, y: 250 },   // Bottom left point
                { x: 55, y: 120 },   // Left inner point area
              ];
              const pt = coords[idx];
              if (!pt) return null;
              return (
                <text key={`m-${idx}`} x={pt.x} y={pt.y} dominantBaseline="middle" textAnchor="middle" fill={accentColor} className="text-xs font-bold font-serif">
                  {p}
                </text>
              );
            })}
          </svg>
        );
      }

      case "prosperity-triangle": {
        const width = 300;
        const height = 240;
        const left = layout.left || "Shreem";
        const right = layout.right || "Hreem";
        const center = layout.center || "AUM";
        const topNums = layout.top_numbers || ["5", "5"];
        const mantra = layout.mantra || "Tanno Devi Prachodayat";

        return (
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-[320px] mx-auto drop-shadow-md">
            <rect x="5" y="5" width={width - 10} height={height - 10} fill={fillColor} stroke={strokeColor} strokeWidth="3" rx="4" />
            <rect x="12" y="12" width={width - 24} height={height - 24} fill="none" stroke={strokeColor} strokeWidth="1.5" />

            {/* Inner Triangle */}
            <polygon points="150,30 30,170 270,170" fill="none" stroke={strokeColor} strokeWidth="2" />

            {/* Left label */}
            <text x="60" y="145" dominantBaseline="middle" textAnchor="middle" fill={accentColor} className="text-xs font-bold font-serif">
              {left}
            </text>
            
            {/* Right label */}
            <text x="240" y="145" dominantBaseline="middle" textAnchor="middle" fill={accentColor} className="text-xs font-bold font-serif">
              {right}
            </text>

            {/* Top numbers */}
            <text x="120" y="55" dominantBaseline="middle" textAnchor="middle" fill={textColor} className="text-sm font-semibold font-serif">
              {topNums[0]}
            </text>
            <text x="180" y="55" dominantBaseline="middle" textAnchor="middle" fill={textColor} className="text-sm font-semibold font-serif">
              {topNums[1]}
            </text>

            {/* Center Syllable */}
            <text x="150" y="110" dominantBaseline="middle" textAnchor="middle" fill={textColor} className="text-lg font-bold font-serif">
              {center}
            </text>

            {/* Mantra at bottom */}
            <line x1="12" y1="190" x2={width - 12} y2="190" stroke={strokeColor} strokeWidth="1.5" />
            <text x={width / 2} y="215" dominantBaseline="middle" textAnchor="middle" fill={accentColor} className="text-xs font-bold font-serif tracking-widest">
              {mantra}
            </text>
          </svg>
        );
      }

      case "mental-peace-triangle": {
        const width = 300;
        const height = 260;
        const cVal = layout.center || "3";
        const lVal = layout.left || "8";
        const rVal = layout.right || "10";
        const blVal = layout.bottom_left || "7";
        const brVal = layout.bottom_right || "7";
        const out = layout.outer_numbers || ["2", "1", "5", "4"];

        return (
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-[320px] mx-auto drop-shadow-md">
            <rect x="5" y="5" width={width - 10} height={height - 10} fill={fillColor} stroke={strokeColor} strokeWidth="3" rx="4" />
            <rect x="12" y="12" width={width - 24} height={height - 24} fill="none" stroke={strokeColor} strokeWidth="1.5" />

            {/* Large Triangle pointing upwards */}
            <polygon points="150,30 40,210 260,210" fill="none" stroke={strokeColor} strokeWidth="2" />
            
            {/* Nested lines forming internal compartments */}
            <line x1="150" y1="30" x2="150" y2="210" stroke={strokeColor} strokeWidth="1.5" />
            <line x1="95" y1="120" x2="205" y2="120" stroke={strokeColor} strokeWidth="1.5" />
            <line x1="95" y1="120" x2="150" y2="210" stroke={strokeColor} strokeWidth="1.5" />
            <line x1="205" y1="120" x2="150" y2="210" stroke={strokeColor} strokeWidth="1.5" />

            {/* Internal numbers */}
            <text x="150" y="160" dominantBaseline="middle" textAnchor="middle" fill={textColor} className="text-base font-bold font-serif">{cVal}</text>
            <text x="110" y="80" dominantBaseline="middle" textAnchor="middle" fill={textColor} className="text-sm font-semibold font-serif">{lVal}</text>
            <text x="190" y="80" dominantBaseline="middle" textAnchor="middle" fill={textColor} className="text-sm font-semibold font-serif">{rVal}</text>
            <text x="100" y="175" dominantBaseline="middle" textAnchor="middle" fill={textColor} className="text-sm font-semibold font-serif">{blVal}</text>
            <text x="200" y="175" dominantBaseline="middle" textAnchor="middle" fill={textColor} className="text-sm font-semibold font-serif">{brVal}</text>

            {/* Outer box compartments / numbers */}
            {/* Draw 4 corner box attachments */}
            <rect x="25" y="50" width="30" height="30" fill="none" stroke={strokeColor} strokeWidth="1.5" />
            <text x="40" y="65" dominantBaseline="middle" textAnchor="middle" fill={textColor} className="text-sm font-semibold font-serif">{out[0]}</text>

            <rect x="245" y="25" width="30" height="30" fill="none" stroke={strokeColor} strokeWidth="1.5" />
            <text x="260" y="40" dominantBaseline="middle" textAnchor="middle" fill={textColor} className="text-sm font-semibold font-serif">{out[1]}</text>

            <rect x="55" y="218" width="30" height="30" fill="none" stroke={strokeColor} strokeWidth="1.5" />
            <text x="70" y="233" dominantBaseline="middle" textAnchor="middle" fill={textColor} className="text-sm font-semibold font-serif">{out[2]}</text>

            <rect x="215" y="210" width="30" height="30" fill="none" stroke={strokeColor} strokeWidth="1.5" />
            <text x="230" y="225" dominantBaseline="middle" textAnchor="middle" fill={textColor} className="text-sm font-semibold font-serif">{out[3]}</text>
          </svg>
        );
      }

      case "concentric-vehicle": {
        const outer = layout.outer || ["1", "4", "6", "9"];
        const inner = layout.inner || ["3", "2", "8", "7"];
        const center = layout.center || "10";
        const width = 300;
        const height = 240;

        return (
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-[320px] mx-auto drop-shadow-md">
            <rect x="5" y="5" width={width - 10} height={height - 10} fill={fillColor} stroke={strokeColor} strokeWidth="3" rx="4" />
            <rect x="12" y="12" width={width - 24} height={height - 24} fill="none" stroke={strokeColor} strokeWidth="1.5" />

            {/* Concentric rectangle boxes and diamond partition */}
            <rect x="40" y="40" width={width - 80} height={height - 80} fill="none" stroke={strokeColor} strokeWidth="1.5" />
            
            {/* Diamond inside */}
            <polygon points="150,40 260,120 150,200 40,120" fill="none" stroke={strokeColor} strokeWidth="1.5" />

            {/* Center circle */}
            <circle cx="150" cy="120" r="22" fill="none" stroke={strokeColor} strokeWidth="1.5" />

            {/* Outer box numbers (top, left, right, bottom) */}
            <text x="150" y="25" dominantBaseline="middle" textAnchor="middle" fill={textColor} className="text-sm font-bold font-serif">{outer[0]}</text>
            <text x="26" y="120" dominantBaseline="middle" textAnchor="middle" fill={textColor} className="text-sm font-bold font-serif">{outer[1]}</text>
            <text x="274" y="120" dominantBaseline="middle" textAnchor="middle" fill={textColor} className="text-sm font-bold font-serif">{outer[2]}</text>
            <text x="150" y="215" dominantBaseline="middle" textAnchor="middle" fill={textColor} className="text-sm font-bold font-serif">{outer[3]}</text>

            {/* Inner compartments numbers */}
            <text x="110" y="80" dominantBaseline="middle" textAnchor="middle" fill={textColor} className="text-sm font-semibold font-serif">{inner[0]}</text>
            <text x="190" y="80" dominantBaseline="middle" textAnchor="middle" fill={textColor} className="text-sm font-semibold font-serif">{inner[1]}</text>
            <text x="110" y="160" dominantBaseline="middle" textAnchor="middle" fill={textColor} className="text-sm font-semibold font-serif">{inner[2]}</text>
            <text x="190" y="160" dominantBaseline="middle" textAnchor="middle" fill={textColor} className="text-sm font-semibold font-serif">{inner[3]}</text>

            {/* Center Number */}
            <text x="150" y="120" dominantBaseline="middle" textAnchor="middle" fill={accentColor} className="text-base font-bold font-serif">{center}</text>
          </svg>
        );
      }

      case "circle-text": {
        const cells = layout.cells || [];
        const width = 300;
        const height = 300;

        return (
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-[320px] mx-auto drop-shadow-md">
            <rect x="5" y="5" width={width - 10} height={height - 10} fill={fillColor} stroke={strokeColor} strokeWidth="3" rx="4" />
            <rect x="12" y="12" width={width - 24} height={height - 24} fill="none" stroke={strokeColor} strokeWidth="1.5" />

            {/* Central circle */}
            <circle cx="150" cy="150" r="100" fill="none" stroke={strokeColor} strokeWidth="2.5" />

            {/* Mantra texts in circle */}
            {cells.map((row, rIdx) => {
              const y = 110 + rIdx * 40;
              return (
                <g key={`r-${rIdx}`}>
                  <text x="110" y={y} dominantBaseline="middle" textAnchor="middle" fill={accentColor} className="text-base font-bold font-serif tracking-widest">
                    {row[0]}
                  </text>
                  <text x="190" y={y} dominantBaseline="middle" textAnchor="middle" fill={accentColor} className="text-base font-bold font-serif tracking-widest">
                    {row[1]}
                  </text>
                </g>
              );
            })}
          </svg>
        );
      }

      case "travel-arch": {
        const header = layout.header || "व्यक्ति का नाम";
        const seed1 = layout.seed1 || "ल्रूं";
        const seed2 = layout.seed2 || "जं";
        const destination = layout.destination || "स्थान का नाम";
        const num = layout.number || "124";
        const width = 300;
        const height = 260;

        return (
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-[320px] mx-auto drop-shadow-md">
            <rect x="5" y="5" width={width - 10} height={height - 10} fill={fillColor} stroke={strokeColor} strokeWidth="3" rx="4" />
            <rect x="12" y="12" width={width - 24} height={height - 24} fill="none" stroke={strokeColor} strokeWidth="1.5" />

            {/* Horizontal line divisions */}
            <line x1="12" y1="50" x2={width - 12} y2="50" stroke={strokeColor} strokeWidth="1.5" />
            <line x1="12" y1="210" x2={width - 12} y2="210" stroke={strokeColor} strokeWidth="1.5" />

            {/* Top row (User Name / Traveler Name) */}
            <text x={width / 2} y="32" dominantBaseline="middle" textAnchor="middle" fill={accentColor} className="text-xs font-bold font-serif select-none">
              {nameToUse}
            </text>

            {/* Semicircle Arch */}
            <path d="M 50 200 A 100 100 0 0 1 250 200" fill="none" stroke={strokeColor} strokeWidth="2.5" />

            {/* Seed syllables inside Arch */}
            <text x="150" y="95" dominantBaseline="middle" textAnchor="middle" fill={textColor} className="text-xl font-bold font-serif">
              {seed1}
            </text>
            <circle cx="150" cy="130" r="14" fill="none" stroke={strokeColor} strokeWidth="1.5" />
            <text x="150" y="130" dominantBaseline="middle" textAnchor="middle" fill={textColor} className="text-sm font-bold font-serif">
              {seed2}
            </text>

            {/* Bottom Row (Destination & Number) */}
            <text x={width / 2} y="180" dominantBaseline="middle" textAnchor="middle" fill={accentColor} className="text-xs font-bold font-serif select-none">
              {destToUse}
            </text>

            <text x={width / 2} y="235" dominantBaseline="middle" textAnchor="middle" fill={textColor} className="text-base font-bold font-serif tracking-widest">
              {num}
            </text>
          </svg>
        );
      }

      case "ganesha-names": {
        const cells = layout.cells || [];
        const width = 300;
        const height = 300;
        const cellW = width / 4;
        const cellH = height / 4;

        return (
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-[320px] mx-auto drop-shadow-md">
            <rect x="5" y="5" width={width - 10} height={height - 10} fill={fillColor} stroke={strokeColor} strokeWidth="3" rx="4" />
            <rect x="12" y="12" width={width - 24} height={height - 24} fill="none" stroke={strokeColor} strokeWidth="1.5" />

            {/* Grid vertical lines */}
            {Array.from({ length: 3 }).map((_, i) => {
              const x = 12 + (i + 1) * cellW;
              return <line key={`v-${i}`} x1={x} y1="12" x2={x} y2={height - 12} stroke={strokeColor} strokeWidth="1.5" />;
            })}
            {/* Grid horizontal lines */}
            {Array.from({ length: 3 }).map((_, i) => {
              const y = 12 + (i + 1) * cellH;
              return <line key={`h-${i}`} x1="12" y1={y} x2={width - 12} y2={y} stroke={strokeColor} strokeWidth="1.5" />;
            })}

            {/* Cells */}
            {cells.map((row, rIdx) =>
              row.map((cell, cIdx) => {
                // If it is the middle center (spanning cells)
                if (rIdx === 1 && cIdx === 1) {
                  // Merged text across the 2x2 center
                  return (
                    <text
                      key="c-merged"
                      x={width / 2}
                      y={height / 2}
                      dominantBaseline="middle"
                      textAnchor="middle"
                      fill={accentColor}
                      className="text-xs font-black font-serif tracking-tighter"
                    >
                      SHREE GANESHAAY
                    </text>
                  );
                }
                
                // Skip rendering cells covered by the center merged block
                if ((rIdx === 1 || rIdx === 2) && (cIdx === 1 || cIdx === 2)) {
                  return null;
                }

                // Shorten/format Ganesha names to fit neatly
                const displayName = cell.replace("OM ", "").replace(" NAMAH", "");
                const x = cIdx * cellW + cellW / 2;
                const y = rIdx * cellH + cellH / 2;

                return (
                  <text key={`c-${rIdx}-${cIdx}`} x={x} y={y} dominantBaseline="middle" textAnchor="middle" fill={textColor} className="text-[7.5px] font-bold font-sans tracking-tighter">
                    {displayName}
                  </text>
                );
              })
            )}
          </svg>
        );
      }

      default:
        return (
          <div className="w-full max-w-[320px] aspect-square flex items-center justify-center border-2 border-amber-700 bg-amber-50 rounded-lg p-6 text-center text-amber-900 font-serif">
            <div>
              <p className="text-3xl mb-4">✥</p>
              <p className="text-sm font-semibold">{yantra.name}</p>
              <p className="text-xs text-amber-700 mt-2">Draw on Bhojpatra with Ashtagandha ink.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-md border border-amber-100 rounded-2xl p-6 shadow-xl max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          Yantra #{yantra.number}
        </span>
        <h2 className="text-2xl font-bold font-serif text-indigo-950">{yantra.name}</h2>
        <p className="text-xs text-slate-500 capitalize">{yantra.category} Remedy</p>
      </div>

      <div className="flex justify-center py-2">{renderLayout()}</div>

      <div className="space-y-4 text-left border-t border-slate-100 pt-4">
        {yantra.mantras && yantra.mantras.length > 0 && (
          <div className="space-y-1">
            <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider">Chant Mantra</h4>
            {yantra.mantras.map((m, i) => (
              <p key={i} className="text-sm font-serif italic text-rose-700 font-medium bg-rose-50/50 px-3 py-1.5 rounded-lg border border-rose-100/50">
                &ldquo;{m}&rdquo;
              </p>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <h4 className="uppercase font-bold text-slate-400 tracking-wider mb-1">Auspicious Day</h4>
            <p className="font-semibold text-indigo-950 bg-indigo-50/50 px-2.5 py-1.5 rounded-lg border border-indigo-100/50">
              {yantra.preparation.day || "Any Day"}
            </p>
          </div>
          <div>
            <h4 className="uppercase font-bold text-slate-400 tracking-wider mb-1">Best Time</h4>
            <p className="font-semibold text-indigo-950 bg-indigo-50/50 px-2.5 py-1.5 rounded-lg border border-indigo-100/50 truncate">
              {yantra.preparation.time || "Any Time"}
            </p>
          </div>
        </div>

        <div className="space-y-1 text-xs">
          <h4 className="uppercase font-bold text-slate-400 tracking-wider">How to Make & Worship</h4>
          <p className="text-slate-600 leading-relaxed bg-amber-50/40 p-3 rounded-xl border border-amber-100/40">
            {yantra.preparation.materials} Worship daily by offering a ghee diya, incense (dhoop), and reciting the mantra.
          </p>
        </div>

        <div className="space-y-1">
          <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider">Key Benefits</h4>
          <ul className="list-disc list-inside space-y-1 text-xs text-slate-600">
            {yantra.benefits.map((b, i) => (
              <li key={i} className="leading-relaxed">{b}</li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Print Button */}
      <button 
        onClick={() => window.print()}
        className="w-full py-2.5 text-xs font-semibold rounded-xl text-amber-900 bg-amber-100 hover:bg-amber-200 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229-2.523a3.115 3.115 0 0 0-1.285-2.592l-2.858-1.906a1.2 1.2 0 0 0-1.503 0l-2.858 1.906a3.115 3.115 0 0 0-1.285 2.592L6.34 18M18 18h1.25a2.25 2.25 0 0 0 2.25-2.25v-6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801-12h2.25m-2.25 0a2.25 2.25 0 0 0-2.25 2.25v1.5m2.25-3.75a2.25 2.25 0 0 1 2.25 2.25v1.5m-6.75 3.75a2.25 2.25 0 0 0-2.25-2.25h-.584c-1.13 0-2.085.83-2.179 1.956a48.848 48.848 0 0 0-.08 1.123m0 0v6.108c0 1.135.845 2.098 1.976 2.192H6.34m11.32-6.108c0-.734-.407-1.391-1.042-1.721L13.76 7.643a1.2 1.2 0 0 0-1.503 0l-2.858 1.906c-.635.33-1.042.987-1.042 1.721v6.108" />
        </svg>
        Print this Yantra Talisman
      </button>
    </div>
  );
}

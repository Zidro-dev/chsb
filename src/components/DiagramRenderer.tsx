import React from 'react';

interface DiagramRendererProps {
  type?: 'graph' | 'cylinder' | 'tetrahedron' | 'box_unfolding' | 'sphere' | 'table' | 'vector' | 'inclined';
  points?: { x: number; y: number }[];
  params?: Record<string, any>;
}

export const DiagramRenderer: React.FC<DiagramRendererProps> = ({ type, points, params }) => {
  if (type === 'graph') {
    const pts = points || [
      { x: 0, y: 4 }, { x: 1, y: 3 }, { x: 2, y: 2 }, { x: 3, y: 0 },
      { x: 4, y: 2 }, { x: 5, y: 4 }, { x: 6, y: 2 }, { x: 7, y: 0 },
      { x: 8, y: -2 }, { x: 9, y: 5 }
    ];

    const width = 460;
    const height = 240;
    const padding = 35;
    const scaleX = (width - padding * 2) / 9;
    const scaleY = (height - padding * 2) / 8; // y from -3 to 5
    const originY = padding + 5 * scaleY; // y=0 line

    const toSvgX = (x: number) => padding + x * scaleX;
    const toSvgY = (y: number) => originY - y * scaleY;

    const pathData = pts
      .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${toSvgX(p.x)} ${toSvgY(p.y)}`)
      .join(' ');

    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 my-3 overflow-x-auto shadow-inner text-slate-100">
        <div className="flex items-center justify-between text-xs text-cyan-400 font-medium mb-2">
          <span>Funksiya grafigi: y = f(x), x ∈ [0; 9]</span>
          <span className="text-slate-400">Nuqtalar koordinatalari ko'rsatilgan</span>
        </div>
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-[500px] mx-auto h-auto">
          {/* Grid lines */}
          {Array.from({ length: 10 }).map((_, i) => (
            <line
              key={`grid-x-${i}`}
              x1={toSvgX(i)}
              y1={padding}
              x2={toSvgX(i)}
              y2={height - padding}
              stroke="#1e293b"
              strokeWidth="1"
              strokeDasharray="2,2"
            />
          ))}
          {[-3, -2, -1, 0, 1, 2, 3, 4, 5].map((yVal) => (
            <line
              key={`grid-y-${yVal}`}
              x1={padding}
              y1={toSvgY(yVal)}
              x2={width - padding}
              y2={toSvgY(yVal)}
              stroke={yVal === 0 ? '#64748b' : '#1e293b'}
              strokeWidth={yVal === 0 ? '1.5' : '1'}
              strokeDasharray={yVal === 0 ? undefined : '2,2'}
            />
          ))}

          {/* Axes */}
          <line
            x1={padding}
            y1={originY}
            x2={width - padding + 15}
            y2={originY}
            stroke="#94a3b8"
            strokeWidth="2"
          />
          <line
            x1={padding}
            y1={height - padding}
            x2={padding}
            y2={padding - 15}
            stroke="#94a3b8"
            strokeWidth="2"
          />

          {/* Axis Labels */}
          <text x={width - padding + 18} y={originY + 4} fill="#cbd5e1" fontSize="12" fontWeight="bold">x</text>
          <text x={padding - 5} y={padding - 18} fill="#cbd5e1" fontSize="12" fontWeight="bold">y</text>

          {/* Numbers on X */}
          {Array.from({ length: 10 }).map((_, i) => (
            <text
              key={`num-x-${i}`}
              x={toSvgX(i)}
              y={originY + 16}
              fill="#94a3b8"
              fontSize="10"
              textAnchor="middle"
            >
              {i}
            </text>
          ))}

          {/* Numbers on Y */}
          {[-2, 0, 2, 4].map((yVal) => (
            <text
              key={`num-y-${yVal}`}
              x={padding - 10}
              y={toSvgY(yVal) + 4}
              fill="#94a3b8"
              fontSize="10"
              textAnchor="end"
            >
              {yVal}
            </text>
          ))}

          {/* Plot Polyline */}
          <path d={pathData} fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Point Dots */}
          {pts.map((p, idx) => (
            <g key={`pt-${idx}`}>
              <circle
                cx={toSvgX(p.x)}
                cy={toSvgY(p.y)}
                r="4.5"
                fill="#38bdf8"
                stroke="#0f172a"
                strokeWidth="2"
              />
              <text
                x={toSvgX(p.x)}
                y={toSvgY(p.y) - 8}
                fill="#f8fafc"
                fontSize="10"
                fontWeight="bold"
                textAnchor="middle"
              >
                {p.y}
              </text>
            </g>
          ))}
        </svg>
      </div>
    );
  }

  if (type === 'box_unfolding') {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 my-3 text-slate-100">
        <div className="text-xs text-emerald-400 font-semibold mb-2">
          3 ta sirtning tekislikka yoyilmasi va eng qisqa kabel yo'li (AB + BC + CD):
        </div>
        <svg viewBox="0 0 500 180" className="w-full max-w-[500px] mx-auto h-auto">
          {/* Face 1: ABFE (Old) */}
          <rect x="40" y="30" width="120" height="110" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
          <text x="100" y="22" fill="#38bdf8" fontSize="11" textAnchor="middle" fontWeight="bold">OLD SIRT (ABFE)</text>
          <text x="100" y="158" fill="#94a3b8" fontSize="11" textAnchor="middle">AB = w</text>

          {/* Face 2: BCGF (O'ng yon) */}
          <rect x="160" y="30" width="150" height="110" fill="#0f172a" stroke="#a855f7" strokeWidth="1.5" />
          <text x="235" y="22" fill="#a855f7" fontSize="11" textAnchor="middle" fontWeight="bold">O'NG YON (BCGF)</text>
          <text x="235" y="158" fill="#94a3b8" fontSize="11" textAnchor="middle">BC = d</text>

          {/* Face 3: DCGH (Orqa) */}
          <rect x="310" y="30" width="120" height="110" fill="#1e293b" stroke="#ec4899" strokeWidth="1.5" />
          <text x="370" y="22" fill="#ec4899" fontSize="11" textAnchor="middle" fontWeight="bold">ORQA SIRT (DCGH)</text>
          <text x="370" y="158" fill="#94a3b8" fontSize="11" textAnchor="middle">CD = w</text>

          {/* Shortest path line from A to H */}
          <line x1="40" y1="140" x2="430" y2="30" stroke="#f43f5e" strokeWidth="3" strokeDasharray="none" />

          {/* Corner points */}
          <circle cx="40" cy="140" r="5" fill="#f43f5e" />
          <text x="30" y="155" fill="#f43f5e" fontSize="12" fontWeight="bold">A</text>

          <circle cx="160" cy="106" r="4" fill="#fbbf24" />
          <text x="150" y="100" fill="#fbbf24" fontSize="10">P</text>

          <circle cx="310" cy="64" r="4" fill="#fbbf24" />
          <text x="316" y="60" fill="#fbbf24" fontSize="10">K</text>

          <circle cx="430" cy="30" r="5" fill="#f43f5e" />
          <text x="440" y="30" fill="#f43f5e" fontSize="12" fontWeight="bold">H</text>

          {/* Height indicator */}
          <line x1="25" y1="30" x2="25" y2="140" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3,3" />
          <text x="15" y="90" fill="#94a3b8" fontSize="11" textAnchor="middle">h</text>
        </svg>
      </div>
    );
  }

  if (type === 'cylinder') {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 my-3 text-slate-100">
        <div className="text-xs text-sky-400 font-semibold mb-2">
          Silindr o'qi va fazoviy kesma AB sxemasi:
        </div>
        <svg viewBox="0 0 320 200" className="w-full max-w-[320px] mx-auto h-auto">
          {/* Top Ellipse */}
          <ellipse cx="160" cy="40" rx="90" ry="25" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
          {/* Cylinder side lines */}
          <line x1="70" y1="40" x2="70" y2="150" stroke="#38bdf8" strokeWidth="1.5" />
          <line x1="250" y1="40" x2="250" y2="150" stroke="#38bdf8" strokeWidth="1.5" />
          {/* Bottom Ellipse */}
          <ellipse cx="160" cy="150" rx="90" ry="25" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3,3" />
          <path d="M 70 150 A 90 25 0 0 0 250 150" fill="none" stroke="#38bdf8" strokeWidth="1.5" />

          {/* Central Axis */}
          <line x1="160" y1="20" x2="160" y2="170" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4,4" />
          <text x="168" y="28" fill="#f59e0b" fontSize="11" fontWeight="bold">O'q</text>

          {/* Segment AB */}
          <line x1="95" y1="130" x2="225" y2="70" stroke="#ef4444" strokeWidth="2.5" />
          <circle cx="95" cy="130" r="4" fill="#ef4444" />
          <text x="82" y="135" fill="#ef4444" fontSize="11" fontWeight="bold">A</text>
          <circle cx="225" cy="70" r="4" fill="#ef4444" />
          <text x="235" y="70" fill="#ef4444" fontSize="11" fontWeight="bold">B</text>

          {/* Distance d to axis */}
          <line x1="160" y1="100" x2="160" y2="100" stroke="#10b981" strokeWidth="2" />
          <text x="135" y="105" fill="#10b981" fontSize="11" fontWeight="bold">d_min</text>
        </svg>
      </div>
    );
  }

  if (type === 'tetrahedron') {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 my-3 text-slate-100">
        <div className="text-xs text-indigo-400 font-semibold mb-2">
          Muntazam tetraedr TABC va TG balandligi:
        </div>
        <svg viewBox="0 0 300 200" className="w-full max-w-[300px] mx-auto h-auto">
          {/* Base triangle ABC */}
          <polygon points="50,160 250,160 170,120" fill="#1e1b4b" stroke="#818cf8" strokeWidth="1.5" />
          {/* Top vertex T */}
          <line x1="150" y1="30" x2="50" y2="160" stroke="#818cf8" strokeWidth="2" />
          <line x1="150" y1="30" x2="250" y2="160" stroke="#818cf8" strokeWidth="2" />
          <line x1="150" y1="30" x2="170" y2="120" stroke="#818cf8" strokeWidth="1.5" strokeDasharray="3,3" />

          {/* Height TG */}
          <line x1="150" y1="30" x2="155" y2="148" stroke="#f43f5e" strokeWidth="2" strokeDasharray="3,3" />
          <circle cx="155" cy="148" r="3.5" fill="#f43f5e" />
          <text x="162" y="152" fill="#f43f5e" fontSize="11" fontWeight="bold">G</text>

          <circle cx="150" cy="30" r="4" fill="#818cf8" />
          <text x="145" y="22" fill="#818cf8" fontSize="12" fontWeight="bold">T</text>
          <text x="35" y="170" fill="#818cf8" fontSize="11" fontWeight="bold">A</text>
          <text x="260" y="170" fill="#818cf8" fontSize="11" fontWeight="bold">B</text>
          <text x="175" y="118" fill="#818cf8" fontSize="11" fontWeight="bold">C</text>
        </svg>
      </div>
    );
  }

  return null;
};

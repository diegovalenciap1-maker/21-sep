import React, { useState } from 'react';
import { PCAResult, BiplotPoint } from '../utils/pcaEngine';
import { Compass, Filter, Eye, Layers, MapPin } from 'lucide-react';

interface BiplotSectionProps {
  pca: PCAResult;
}

export const BiplotSection: React.FC<BiplotSectionProps> = ({ pca }) => {
  const [colorBy, setColorBy] = useState<'religion' | 'fertility' | 'education'>('religion');
  const [selectedDistrict, setSelectedDistrict] = useState<BiplotPoint | null>(pca.scores[17]); // Default: Lausanne
  const [showVectors, setShowVectors] = useState<boolean>(true);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [hoveredPoint, setHoveredPoint] = useState<BiplotPoint | null>(null);

  // SVG coordinate transform
  // PC1 range roughly [-4, +4], PC2 range roughly [-3, +3]
  const width = 640;
  const height = 520;
  const padding = 50;
  const plotWidth = width - 2 * padding;
  const plotHeight = height - 2 * padding;

  const minX = -3.8;
  const maxX = 3.8;
  const minY = -3.2;
  const maxY = 3.2;

  const toSvgX = (x: number) => padding + ((x - minX) / (maxX - minX)) * plotWidth;
  const toSvgY = (y: number) => padding + ((maxY - y) / (maxY - minY)) * plotHeight; // Invert Y

  // Factor to scale loading vectors so they fit elegantly on the score plot
  const vectorScale = 3.2;

  // Determine point color
  const getPointColor = (point: BiplotPoint) => {
    if (colorBy === 'religion') {
      return point.religion === 'Católica' ? '#dc2626' : '#2563eb';
    }
    if (colorBy === 'fertility') {
      // Fertility from ~35 to ~92
      const val = point.raw['Fertility'];
      return val > 75 ? '#dc2626' : val > 60 ? '#f59e0b' : '#10b981';
    }
    if (colorBy === 'education') {
      const val = point.raw['Education'];
      return val > 20 ? '#10b981' : val > 8 ? '#3b82f6' : '#64748b';
    }
    return '#475569';
  };

  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="bg-white border border-stone-200 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-stone-900 text-white rounded-lg">
                <Compass className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-stone-900">
                  Biplot Interactivo: PC1 vs PC2 (72.4% de Varianza)
                </h2>
                <p className="text-xs sm:text-sm text-stone-600">
                  Superposición de observaciones (los 47 cantones) y vectores de carga de las 6 variables socioeconómicas.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Biplot Controls */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-200 p-1 rounded-lg">
              <Filter className="w-3.5 h-3.5 text-stone-500 ml-1" />
              <span className="text-stone-600 font-medium">Colorear:</span>
              <button
                onClick={() => setColorBy('religion')}
                className={`px-2 py-1 rounded font-medium transition-colors ${
                  colorBy === 'religion' ? 'bg-stone-900 text-white shadow-xs' : 'text-stone-700 hover:bg-stone-200'
                }`}
              >
                Religión
              </button>
              <button
                onClick={() => setColorBy('fertility')}
                className={`px-2 py-1 rounded font-medium transition-colors ${
                  colorBy === 'fertility' ? 'bg-stone-900 text-white shadow-xs' : 'text-stone-700 hover:bg-stone-200'
                }`}
              >
                Fertilidad
              </button>
              <button
                onClick={() => setColorBy('education')}
                className={`px-2 py-1 rounded font-medium transition-colors ${
                  colorBy === 'education' ? 'bg-stone-900 text-white shadow-xs' : 'text-stone-700 hover:bg-stone-200'
                }`}
              >
                Educación
              </button>
            </div>

            <button
              onClick={() => setShowVectors(!showVectors)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                showVectors ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-stone-100 text-stone-600'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{showVectors ? 'Ocultar Flechas' : 'Mostrar Flechas'}</span>
            </button>

            <button
              onClick={() => setShowLabels(!showLabels)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                showLabels ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600'
              }`}
            >
              <span>{showLabels ? 'Ocultar Nombres' : 'Mostrar Nombres'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Biplot & Inspector Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SVG Biplot Area (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col items-center">
          <div className="w-full flex items-center justify-between text-xs text-stone-500 mb-2 px-2">
            <span>Eje Horizontal: <strong>PC1 (53.8% de varianza)</strong> — Modernización vs Rural</span>
            <span>Eje Vertical: <strong>PC2 (18.6% de varianza)</strong> — Mortalidad / Salud</span>
          </div>

          <div className="relative w-full overflow-hidden flex justify-center bg-stone-50/70 rounded-xl border border-stone-200/80 p-1">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full max-w-[660px] h-auto select-none"
            >
              <defs>
                {/* Vector arrowhead marker */}
                <marker
                  id="vector-arrow"
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#059669" />
                </marker>

                {/* Subdued grid pattern */}
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
                </pattern>
              </defs>

              {/* Background Grid */}
              <rect x={padding} y={padding} width={plotWidth} height={plotHeight} fill="url(#grid)" />

              {/* Quadrant Background Tints */}
              <rect
                x={toSvgX(minX)}
                y={toSvgY(maxY)}
                width={toSvgX(0) - toSvgX(minX)}
                height={toSvgY(0) - toSvgY(maxY)}
                fill="#2563eb"
                fillOpacity="0.02"
              />
              <rect
                x={toSvgX(0)}
                y={toSvgY(0)}
                width={toSvgX(maxX) - toSvgX(0)}
                height={toSvgY(minY) - toSvgY(0)}
                fill="#dc2626"
                fillOpacity="0.02"
              />

              {/* Zero Axes */}
              <line
                x1={toSvgX(minX)}
                y1={toSvgY(0)}
                x2={toSvgX(maxX)}
                y2={toSvgY(0)}
                stroke="#94a3b8"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <line
                x1={toSvgX(0)}
                y1={toSvgY(minY)}
                x2={toSvgX(0)}
                y2={toSvgY(maxY)}
                stroke="#94a3b8"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />

              {/* Quadrant Concept Labels */}
              <text x={toSvgX(-3.3)} y={toSvgY(2.8)} fill="#64748b" fontSize="10" fontWeight="600">
                ← Alta Educación / Urbana
              </text>
              <text x={toSvgX(1.4)} y={toSvgY(2.8)} fill="#64748b" fontSize="10" fontWeight="600">
                Alta Fertilidad / Tradicional →
              </text>
              <text x={toSvgX(-3.3)} y={toSvgY(-2.8)} fill="#64748b" fontSize="10" fontWeight="600">
                Baja Mortalidad Infantil ↓
              </text>
              <text x={toSvgX(1.4)} y={toSvgY(-2.8)} fill="#64748b" fontSize="10" fontWeight="600">
                Alta Mortalidad Infantil ↑
              </text>

              {/* Loading Vectors (Variable Arrows) */}
              {showVectors &&
                pca.loadings.map((load) => {
                  const xEnd = toSvgX(load.pc1 * vectorScale);
                  const yEnd = toSvgY(load.pc2 * vectorScale);
                  const xOrigin = toSvgX(0);
                  const yOrigin = toSvgY(0);

                  return (
                    <g key={load.variableKey} className="transition-opacity hover:opacity-100">
                      <line
                        x1={xOrigin}
                        y1={yOrigin}
                        x2={xEnd}
                        y2={yEnd}
                        stroke="#059669"
                        strokeWidth="2.2"
                        markerEnd="url(#vector-arrow)"
                        strokeOpacity="0.85"
                      />
                      {/* Variable label with subtle background */}
                      <g transform={`translate(${xEnd + (load.pc1 >= 0 ? 8 : -8)}, ${yEnd + (load.pc2 >= 0 ? -6 : 10)})`}>
                        <text
                          textAnchor={load.pc1 >= 0 ? 'start' : 'end'}
                          fill="#065f46"
                          fontSize="11"
                          fontWeight="700"
                          className="drop-shadow-xs"
                        >
                          {load.variableName}
                        </text>
                      </g>
                    </g>
                  );
                })}

              {/* Observations: 47 Swiss Districts */}
              {pca.scores.map((point) => {
                const cx = toSvgX(point.pc1);
                const cy = toSvgY(point.pc2);
                const isSelected = selectedDistrict?.id === point.id;
                const isHovered = hoveredPoint?.id === point.id;
                const color = getPointColor(point);

                return (
                  <g
                    key={point.id}
                    className="cursor-pointer"
                    onClick={() => setSelectedDistrict(point)}
                    onMouseEnter={() => setHoveredPoint(point)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  >
                    {/* Ring highlight when selected */}
                    {isSelected && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={12}
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="3"
                        strokeDasharray="3 3"
                        className="animate-pulse"
                      />
                    )}

                    {/* Main point marker */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isSelected ? 7 : isHovered ? 6 : 4.5}
                      fill={color}
                      stroke="#ffffff"
                      strokeWidth={isSelected ? 2.5 : 1.5}
                      className="transition-all duration-150 shadow-sm"
                    />

                    {/* District name label */}
                    {(showLabels || isSelected || isHovered) && (
                      <text
                        x={cx}
                        y={cy - (isSelected ? 14 : 8)}
                        textAnchor="middle"
                        fill={isSelected ? '#0f172a' : '#475569'}
                        fontSize={isSelected ? '11' : '9'}
                        fontWeight={isSelected ? '700' : '500'}
                        className="pointer-events-none drop-shadow-xs"
                      >
                        {point.district}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Biplot Legend */}
          <div className="w-full flex flex-wrap items-center justify-between text-xs text-stone-600 mt-3 pt-2 border-t border-stone-100">
            <div className="flex items-center gap-4">
              <span className="font-semibold text-stone-800">Leyenda:</span>
              {colorBy === 'religion' && (
                <>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-600 inline-block" />
                    Mayoría Católica (&gt;50%)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-blue-600 inline-block" />
                    Mayoría Protestante
                  </span>
                </>
              )}
              {colorBy === 'fertility' && (
                <>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-600" /> Alta (&gt;75)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Media (60-75)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Baja (&lt;60)
                  </span>
                </>
              )}
              {colorBy === 'education' && (
                <>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" /> Alta (&gt;20%)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Media (8-20%)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-500" /> Baja (&lt;8%)
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 text-stone-500">
              <span className="w-4 h-0.5 bg-emerald-600 inline-block" />
              <span>Flechas: Vectores de variables originales</span>
            </div>
          </div>
        </div>

        {/* Selected District Inspector & Pedagogical Meaning (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Selected Canton Card */}
          <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-stone-900 text-base">
                  {selectedDistrict ? selectedDistrict.district : 'Selecciona un Cantón'}
                </h3>
              </div>
              {selectedDistrict && (
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    selectedDistrict.religion === 'Católica'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {selectedDistrict.religion}
                </span>
              )}
            </div>

            {selectedDistrict ? (
              <div className="space-y-3 mt-3">
                {/* Coordinates in PCA space */}
                <div className="grid grid-cols-2 gap-2 bg-stone-50 p-2.5 rounded-xl border border-stone-200 font-mono text-xs">
                  <div>
                    <span className="text-stone-500 block text-[10px]">Coordenada PC1</span>
                    <strong className={selectedDistrict.pc1 >= 0 ? 'text-amber-700' : 'text-blue-700'}>
                      {selectedDistrict.pc1 > 0 ? `+${selectedDistrict.pc1}` : selectedDistrict.pc1}
                    </strong>
                  </div>
                  <div>
                    <span className="text-stone-500 block text-[10px]">Coordenada PC2</span>
                    <strong className={selectedDistrict.pc2 >= 0 ? 'text-emerald-700' : 'text-purple-700'}>
                      {selectedDistrict.pc2 > 0 ? `+${selectedDistrict.pc2}` : selectedDistrict.pc2}
                    </strong>
                  </div>
                </div>

                {/* Real values from 1888 */}
                <div className="space-y-1.5 pt-1 text-xs">
                  <span className="font-semibold text-stone-700 text-[11px] block">
                    Valores Históricos Reales (1888):
                  </span>
                  {pca.variables.map((v) => {
                    const val = selectedDistrict.raw[v.key];
                    return (
                      <div key={v.key} className="flex items-center justify-between py-1 border-b border-stone-100 last:border-0">
                        <span className="text-stone-600">{v.name}:</span>
                        <span className="font-mono font-medium text-stone-900">
                          {val} {v.unit}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* District Sociological Interpretation */}
                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-stone-700 space-y-1">
                  <span className="font-bold text-emerald-900 block">¿Por qué está en esta posición?</span>
                  {selectedDistrict.pc1 < -1.5 ? (
                    <p>
                      Se ubica en el extremo izquierdo de PC1 debido a sus altos niveles de <strong>Educación</strong> y <strong>Examen militar</strong>, característico de ciudades desarrolladas como Ginebra o Lausana.
                    </p>
                  ) : selectedDistrict.pc1 > 1.5 ? (
                    <p>
                      Se ubica en el extremo derecho de PC1 por su predominio <strong>Agrícola</strong>, alta <strong>Fertilidad</strong> y tradición <strong>Católica</strong> (ej. Glane, Sarine o Herens).
                    </p>
                  ) : (
                    <p>
                      Se encuentra en la zona media de transición socioeconómica de los cantones de habla francesa en 1888.
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-xs text-stone-500 py-4 text-center">
                Haz clic en cualquier punto del gráfico para inspeccionar sus variables originales y coordenadas de proyección.
              </p>
            )}
          </div>

          {/* Quick Biplot Interpretation Guide */}
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-xs space-y-2 text-stone-700">
            <span className="font-bold text-stone-900 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>Cómo Leer las Flechas del Biplot</span>
            </span>
            <ul className="space-y-1.5 pl-3 list-disc text-stone-600">
              <li>
                <strong>Longitud de la flecha:</strong> Indica qué tan bien representada está esa variable en las primeras 2 componentes (mayor longitud = mayor peso).
              </li>
              <li>
                <strong>Ángulo agudo (&lt;90°):</strong> Variables fuertemente correlacionadas positivamente (ej: <em>Educación</em> y <em>Examen</em>).
              </li>
              <li>
                <strong>Ángulo obtuso (~180°):</strong> Variables fuertemente correlacionadas negativamente (ej: <em>Educación</em> vs <em>Agricultura</em>).
              </li>
              <li>
                <strong>Ángulo recto (~90°):</strong> Variables independientes / incorrelacionadas (ej: <em>Mortalidad Infantil</em> con respecto a <em>Educación</em>).
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

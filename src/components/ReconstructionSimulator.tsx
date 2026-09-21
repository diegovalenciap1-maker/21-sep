import React, { useState } from 'react';
import { PCAResult, reconstructObservation } from '../utils/pcaEngine';
import { SWISS_DATA, SwissRecord } from '../data/swissData';
import { Sparkles, Sliders, CheckCircle2, AlertTriangle, MapPin } from 'lucide-react';

interface ReconstructionSimulatorProps {
  pca: PCAResult;
}

export const ReconstructionSimulator: React.FC<ReconstructionSimulatorProps> = ({ pca }) => {
  const [selectedId, setSelectedId] = useState<string>('18'); // Lausanne
  const [kComponents, setKComponents] = useState<number>(2); // Default to elbow choice

  const selectedDistrict = SWISS_DATA.find((d) => d.id === selectedId) || SWISS_DATA[0];
  const reconstruction = reconstructObservation(selectedDistrict, kComponents, pca);
  const varianceRetained = pca.screeData[kComponents - 1].cumulativeVariance;

  // Calculate average error
  const keys = pca.variables.map((v) => v.key as string);
  const totalAbsoluteError = keys.reduce((sum, key) => sum + reconstruction[key].error, 0);
  const meanAbsoluteError = (totalAbsoluteError / keys.length).toFixed(2);

  return (
    <div className="space-y-6">
      {/* Lead Card */}
      <div className="bg-white border border-stone-200 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-stone-900 text-white rounded-lg">
                <Sparkles className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-stone-900">
                  Simulador de Reconstrucción &amp; Compresión
                </h2>
                <p className="text-xs sm:text-sm text-stone-600">
                  Experimenta cómo el número de componentes (elegido con el método del codo) aproxima los valores reales de cualquier distrito.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-lg">
              Varianza retenida: <strong>{varianceRetained}%</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Simulator Controls & Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column (4 cols) */}
        <div className="lg:col-span-4 bg-stone-50 border border-stone-200 rounded-2xl p-5 shadow-xs space-y-5">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-2">
              1. Seleccionar Distrito de Prueba
            </label>
            <div className="relative">
              <select
                id="district-select"
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
              >
                {SWISS_DATA.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.district} ({d.religionMajority})
                  </option>
                ))}
              </select>
            </div>
            <p className="text-[11px] text-stone-500 mt-1">
              Prueba con distritos opuestos como <strong>Lausanne</strong> (urbano) vs <strong>Glane</strong> o <strong>Herens</strong> (agrícola).
            </p>
          </div>

          {/* K slider / buttons */}
          <div className="space-y-3 pt-2 border-t border-stone-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-emerald-600" />
                <span>2. Componentes Retenidas (k):</span>
              </label>
              <span className="text-sm font-bold font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                k = {kComponents}
              </span>
            </div>

            <div className="grid grid-cols-6 gap-1.5">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <button
                  key={num}
                  id={`k-btn-${num}`}
                  onClick={() => setKComponents(num)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    kComponents === num
                      ? 'bg-stone-900 text-white shadow-xs ring-2 ring-emerald-500'
                      : num === 2
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 hover:bg-emerald-200'
                      : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-200'
                  }`}
                >
                  k={num}
                  {num === 2 && <span className="block text-[8px] font-normal">Codo</span>}
                </button>
              ))}
            </div>

            <div className="p-3 bg-white rounded-xl border border-stone-200 text-xs space-y-1 text-stone-600">
              <span className="font-semibold text-stone-900 block">Compromiso (Trade-off):</span>
              {kComponents === 1 && (
                <p>k=1 comprime todo a un único escalar. Error de aproximación apreciable.</p>
              )}
              {kComponents === 2 && (
                <p className="text-emerald-800 font-medium">
                  🎯 <strong>Recomendación del Codo</strong>: Con sólo 2 números se reconstruyen 6 variables con alta fidelidad y 72.4% de la señal original.
                </p>
              )}
              {kComponents === 6 && (
                <p>k=6 conserva el 100% de la información. El error es 0.0 (reconstrucción matemática exacta).</p>
              )}
              {kComponents > 2 && kComponents < 6 && (
                <p>Se gana precisión marginal agregando complejidad matemática adicional.</p>
              )}
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-2 text-xs">
            <span className="text-stone-500 uppercase tracking-wider font-semibold text-[10px] block">
              Métricas de Reconstrucción
            </span>
            <div className="flex justify-between items-center">
              <span className="text-stone-600">Error Medio Absoluto (MAE):</span>
              <span className="font-mono font-bold text-stone-900">{meanAbsoluteError}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-stone-600">Dimensiones descartadas:</span>
              <span className="font-mono text-stone-700">{6 - kComponents} de 6</span>
            </div>
          </div>
        </div>

        {/* Reconstruction Comparison Table & Bars (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-stone-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-stone-900 text-base">
                  Reconstrucción de &quot;{selectedDistrict.district}&quot; con {kComponents} {kComponents === 1 ? 'componente' : 'componentes'}
                </h3>
              </div>
              <span className="text-xs text-stone-500">
                Fórmula: <code className="font-mono text-stone-800">x̂ = μ + Σ s_k · v_k · σ</code>
              </span>
            </div>

            {/* Variable Comparison Cards */}
            <div className="space-y-3">
              {pca.variables.map((v) => {
                const rec = reconstruction[v.key as string];
                const originalVal = rec.original;
                const reconVal = rec.reconstructed;
                const error = rec.error;
                const isGoodFit = error <= 5.0;

                return (
                  <div
                    key={v.key}
                    className="p-3 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-stone-50 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                      <div>
                        <span className="font-bold text-stone-900 text-xs sm:text-sm">{v.name}</span>
                        <span className="text-[11px] text-stone-500 ml-2">({v.desc})</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs font-mono">
                        <span className="text-stone-600">
                          Original: <strong className="text-stone-900">{originalVal} {v.unit}</strong>
                        </span>
                        <span className="text-stone-300">|</span>
                        <span className="text-emerald-700 font-semibold">
                          Reconstruido: <strong>{reconVal} {v.unit}</strong>
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] ${
                            isGoodFit ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          Δ = {error}
                        </span>
                      </div>
                    </div>

                    {/* Visual Comparison Bar */}
                    <div className="space-y-1">
                      <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden relative">
                        {/* Original reference line or bar */}
                        <div
                          className="h-full bg-stone-400 rounded-full"
                          style={{ width: `${Math.min(100, (originalVal / (v.key === 'Fertility' ? 100 : v.key === 'Education' ? 60 : 100)) * 100)}%` }}
                        />
                      </div>
                      <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden relative">
                        {/* Reconstructed bar */}
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            isGoodFit ? 'bg-emerald-600' : 'bg-amber-500'
                          }`}
                          style={{ width: `${Math.min(100, Math.max(0, (reconVal / (v.key === 'Fertility' ? 100 : v.key === 'Education' ? 60 : 100)) * 100))}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-stone-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-1.5 bg-stone-400 rounded-full inline-block" /> Barra gris: Valor Original
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-1.5 bg-emerald-600 rounded-full inline-block" /> Barra verde: Aproximación PCA
              </span>
            </div>
            <span>
              {kComponents === 2
                ? '✅ El codo k=2 ofrece una reconstrucción equilibrada sin sobredimensionar.'
                : `k = ${kComponents}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

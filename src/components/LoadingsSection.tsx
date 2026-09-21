import React, { useState } from 'react';
import { PCAResult } from '../utils/pcaEngine';
import { BarChart3, HelpCircle, Layers, ArrowUpDown } from 'lucide-react';

interface LoadingsSectionProps {
  pca: PCAResult;
}

export const LoadingsSection: React.FC<LoadingsSectionProps> = ({ pca }) => {
  const [activePC, setActivePC] = useState<'pc1' | 'pc2' | 'pc3'>('pc1');

  const pcDetails = {
    pc1: {
      title: 'PC1: Eje de Modernización vs Tradicional Agrario',
      variance: '53.8%',
      eigenvalue: pca.eigenvalues[0].toFixed(2),
      summary:
        'Representa el contraste histórico más marcado de la Suiza de 1888: distritos rurales, agrícolas y de alta natalidad frente a distritos industrializados, con alta tasa de alfabetización militar y educación superior.',
    },
    pc2: {
      title: 'PC2: Eje de Salud Infantil y Vulnerabilidad Sanitaria',
      variance: '18.6%',
      eigenvalue: pca.eigenvalues[1].toFixed(2),
      summary:
        'Dominado principalmente por la tasa de Mortalidad Infantil y disparidades de fertilidad residuales. Es independiente (ortogonal) a la dicotomía educación/agricultura de PC1.',
    },
    pc3: {
      title: 'PC3: Eje Cultural y Confesional Residual',
      variance: '13.8%',
      eigenvalue: pca.eigenvalues[2].toFixed(2),
      summary:
        'Diferencia distritos con combinaciones atípicas entre religión católica y porcentaje agrícola que no quedaron explicadas en PC1.',
    },
  };

  const currentInfo = pcDetails[activePC];

  // Sort variables by absolute loading in active PC
  const sortedLoadings = [...pca.loadings].sort(
    (a, b) => Math.abs(b[activePC]) - Math.abs(a[activePC])
  );

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-white border border-stone-200 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-stone-900 text-white rounded-lg">
                <Layers className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-stone-900">
                  Cargas Factoriales (Loadings) &amp; Significado de las Componentes
                </h2>
                <p className="text-xs sm:text-sm text-stone-600">
                  Las cargas indican la correlación entre cada una de las 6 variables originales y las nuevas componentes calculadas.
                </p>
              </div>
            </div>
          </div>

          {/* PC Selector Tabs */}
          <div className="flex items-center gap-2 bg-stone-100 p-1 rounded-xl">
            {(['pc1', 'pc2', 'pc3'] as const).map((pcKey) => {
              const label = pcKey.toUpperCase();
              const isSelected = activePC === pcKey;
              return (
                <button
                  key={pcKey}
                  onClick={() => setActivePC(pcKey)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200'
                  }`}
                >
                  {label} ({pcDetails[pcKey].variance})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Breakdown Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Loadings Visual Bar Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-stone-200 rounded-2xl p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
            <div>
              <h3 className="font-bold text-stone-900 text-base">{currentInfo.title}</h3>
              <p className="text-xs text-stone-500">
                Varianza explicada: <strong className="text-emerald-700">{currentInfo.variance}</strong> | Autovalor λ:{' '}
                <strong className="text-stone-800">{currentInfo.eigenvalue}</strong>
              </p>
            </div>
            <span className="text-xs font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-1 rounded">
              Escala: -1.0 a +1.0
            </span>
          </div>

          {/* Diverging Loadings Bar representation */}
          <div className="space-y-4">
            {sortedLoadings.map((load) => {
              const val = load[activePC];
              const isPositive = val >= 0;
              const absVal = Math.abs(val);
              const percentageWidth = Math.min(100, Math.round((absVal / 1.0) * 100));

              return (
                <div key={load.variableKey} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-stone-800">{load.variableName}</span>
                    <span
                      className={`font-mono font-bold ${
                        isPositive ? 'text-emerald-700' : 'text-blue-700'
                      }`}
                    >
                      {isPositive ? `+${val.toFixed(3)}` : val.toFixed(3)}
                    </span>
                  </div>

                  {/* Divergent Center Bar */}
                  <div className="w-full bg-stone-100 h-6 rounded-lg relative overflow-hidden flex items-center border border-stone-200">
                    {/* Center zero guide line */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-stone-400 z-10" />

                    {/* Negative Left Bar */}
                    <div className="w-1/2 h-full flex justify-end pr-0.5">
                      {!isPositive && (
                        <div
                          className="h-full bg-blue-600 rounded-l transition-all duration-300 flex items-center justify-start pl-2 text-[10px] text-white font-mono"
                          style={{ width: `${percentageWidth}%` }}
                        >
                          {absVal > 0.4 ? val.toFixed(2) : ''}
                        </div>
                      )}
                    </div>

                    {/* Positive Right Bar */}
                    <div className="w-1/2 h-full flex justify-start pl-0.5">
                      {isPositive && (
                        <div
                          className="h-full bg-emerald-600 rounded-r transition-all duration-300 flex items-center justify-end pr-2 text-[10px] text-white font-mono"
                          style={{ width: `${percentageWidth}%` }}
                        >
                          {absVal > 0.4 ? `+${val.toFixed(2)}` : ''}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
            <span>← Influencia Negativa Fuerte</span>
            <span className="font-mono">0 (Sin Correlación)</span>
            <span>Influencia Positiva Fuerte →</span>
          </div>
        </div>

        {/* Interpretation & Context Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 shadow-xs space-y-4 text-xs text-stone-700">
            <div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-stone-400 block mb-1">
                Interpretación Sociológica de {activePC.toUpperCase()}
              </span>
              <p className="text-sm font-medium text-stone-900 leading-snug">
                {currentInfo.summary}
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-1.5">
                <span className="font-bold text-stone-900 flex items-center gap-1.5">
                  <ArrowUpDown className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Variables con Mayor Peso</span>
                </span>
                <p className="text-stone-600 leading-relaxed">
                  {activePC === 'pc1' && (
                    <>
                      <strong>Educación (-0.83)</strong> y <strong>Examen Militar (-0.81)</strong> tiran hacia la izquierda, mientras que <strong>Agricultura (+0.75)</strong> y <strong>Fertilidad (+0.74)</strong> tiran con idéntica fuerza hacia la derecha.
                    </>
                  )}
                  {activePC === 'pc2' && (
                    <>
                      <strong>Mortalidad Infantil (+0.72)</strong> es el factor dominante indiscutible de esta componente. Las condiciones de salubridad y mortalidad al nacer no dependían exclusivamente del desarrollo económico.
                    </>
                  )}
                  {activePC === 'pc3' && (
                    <>
                      <strong>Catolicismo (+0.62)</strong> versus contrastes de tasas agrícolas. Permite aislar el factor confesional puro del factor ocupacional primario.
                    </>
                  )}
                </p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-1.5">
                <span className="font-bold text-stone-900 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>¿Por qué importa el Signo (+ / -)?</span>
                </span>
                <p className="text-stone-600 leading-relaxed">
                  En PCA, los signos de las cargas no indican que una variable sea &quot;buena&quot; o &quot;mala&quot;, sino que
                  apuntan en <strong>direcciones opuestas</strong> a lo largo de un mismo continuo latente. Dos variables con signos contrarios están negativamente correlacionadas en esa dimensión.
                </p>
              </div>
            </div>
          </div>

          {/* Key Takeaway Card */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-1.5">
            <span className="font-bold block">💡 Conexión con el Método del Codo</span>
            <p className="leading-relaxed">
              El gráfico del codo demostró que después de PC1 y PC2 la ganancia se estanca. Al analizar las cargas vemos por qué:
              <strong> PC1 y PC2 ya capturan casi toda la dinámica sociodemográfica</strong> (desarrollo humano + sanidad infantil).
              Las demás componentes son variaciones locales menores.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

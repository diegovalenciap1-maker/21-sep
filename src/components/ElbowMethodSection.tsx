import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import { PCAResult, ScreeItem } from '../utils/pcaEngine';
import { Info, CheckCircle2, TrendingDown, HelpCircle, ArrowDownRight, Layers } from 'lucide-react';

interface ElbowMethodSectionProps {
  pca: PCAResult;
}

export const ElbowMethodSection: React.FC<ElbowMethodSectionProps> = ({ pca }) => {
  const [selectedK, setSelectedK] = useState<number>(2);
  const [showKaiserLine, setShowKaiserLine] = useState<boolean>(true);
  const [showEightyLine, setShowEightyLine] = useState<boolean>(true);

  const screeData = pca.screeData;
  const currentItem = screeData[selectedK - 1];
  const retainedVariance = currentItem.cumulativeVariance;
  const discardedVariance = Number((100 - retainedVariance).toFixed(1));

  // Custom Tooltip for Scree Chart
  const CustomScreeTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: ScreeItem }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-stone-900 text-stone-100 p-3 rounded-lg shadow-xl border border-stone-800 text-xs space-y-1">
          <p className="font-semibold text-emerald-400 text-sm flex items-center justify-between">
            <span>{data.component}</span>
            {data.isElbow && (
              <span className="bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded text-[10px] uppercase font-mono">
                ¡Punto del Codo!
              </span>
            )}
          </p>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 pt-1 text-stone-300">
            <span>Autovalor (λ):</span>
            <span className="font-mono text-right text-white">{data.eigenvalue}</span>
            <span>Varianza individual:</span>
            <span className="font-mono text-right text-emerald-300 font-bold">{data.varianceExplained}%</span>
            <span>Varianza acumulada:</span>
            <span className="font-mono text-right text-amber-300 font-bold">{data.cumulativeVariance}%</span>
            <span>Criterio Kaiser (&ge;1):</span>
            <span className="font-mono text-right">{data.isKaiser ? 'Cumple (≥ 1)' : 'Descarta (< 1)'}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Pedagogical Lead Card */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-stone-50 border border-emerald-200/80 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-start gap-4">
          <div className="p-3 bg-emerald-600 text-white rounded-xl shadow-xs self-start">
            <TrendingDown className="w-6 h-6" />
          </div>
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-stone-900">
                ¿Qué es el Método del Codo (Elbow Method / Scree Plot)?
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                Regla de Decisión Óptima
              </span>
            </div>
            <p className="text-stone-700 text-sm leading-relaxed">
              El <strong>Método del Codo</strong> (o gráfico de sedimentación propuesto por Raymond Cattell en 1966)
              es la técnica visual por excelencia para decidir <em>cuántas componentes principales conservar</em> y
              cuántas descartar como ruido o redundancia.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs text-stone-600">
              <div className="p-2.5 bg-white/80 rounded-lg border border-emerald-100">
                <span className="font-semibold text-stone-900 block mb-1">1. La Analogía del Brazo</span>
                La curva inicia verticalmente en el hombro (PC1), desciende abruptamente hacia el <strong>codo</strong> (PC2 o PC3) y luego se aplana como el antebrazo.
              </div>
              <div className="p-2.5 bg-white/80 rounded-lg border border-emerald-100">
                <span className="font-semibold text-stone-900 block mb-1">2. Rendimiento Decreciente</span>
                El punto de inflexión (&quot;el codo&quot;) marca el umbral exacto donde agregar más componentes aporta varianza marginal insignificante.
              </div>
              <div className="p-2.5 bg-white/80 rounded-lg border border-emerald-100">
                <span className="font-semibold text-stone-900 block mb-1">3. Conclusión en Swiss</span>
                En el dataset Swiss, <strong>2 componentes</strong> capturan el <strong>72.4%</strong> de toda la información de las 6 variables originales.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Representation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Column (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-stone-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
              <div>
                <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <span>Representación Gráfica: Scree Plot &amp; Varianza Acumulada</span>
                </h3>
                <p className="text-xs text-stone-500">
                  Barras: % Varianza explicada individual (eje izq) | Línea: % Varianza acumulada (eje der)
                </p>
              </div>

              {/* Legend Toggles */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <button
                  onClick={() => setShowKaiserLine(!showKaiserLine)}
                  className={`px-2.5 py-1 rounded-md border text-xs font-medium transition-colors ${
                    showKaiserLine
                      ? 'bg-amber-50 border-amber-300 text-amber-900'
                      : 'bg-stone-100 border-stone-200 text-stone-500'
                  }`}
                  title="Criterio de Kaiser: componentes con autovalor λ >= 1"
                >
                  Línea Kaiser (λ = 1)
                </button>
                <button
                  onClick={() => setShowEightyLine(!showEightyLine)}
                  className={`px-2.5 py-1 rounded-md border text-xs font-medium transition-colors ${
                    showEightyLine
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : 'bg-stone-100 border-stone-200 text-stone-500'
                  }`}
                  title="Umbral de referencia del 80% de varianza acumulada"
                >
                  Meta 80%
                </button>
              </div>
            </div>

            {/* Recharts Scree Plot */}
            <div className="h-80 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={screeData}
                  margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
                  onClick={(e) => {
                    if (e && typeof e.activeTooltipIndex === 'number') {
                      setSelectedK(e.activeTooltipIndex + 1);
                    }
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="component"
                    tick={{ fill: '#475569', fontSize: 12, fontWeight: 500 }}
                    axisLine={{ stroke: '#cbd5e1' }}
                  />
                  {/* Left Y Axis for Individual Variance % */}
                  <YAxis
                    yAxisId="left"
                    domain={[0, 60]}
                    tick={{ fill: '#059669', fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                    axisLine={{ stroke: '#059669' }}
                    label={{
                      value: 'Varianza Individual (%)',
                      angle: -90,
                      position: 'insideLeft',
                      fill: '#059669',
                      fontSize: 11,
                      style: { textAnchor: 'middle' },
                    }}
                  />
                  {/* Right Y Axis for Cumulative Variance % */}
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    domain={[0, 100]}
                    tick={{ fill: '#b45309', fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                    axisLine={{ stroke: '#f59e0b' }}
                    label={{
                      value: 'Varianza Acumulada (%)',
                      angle: 90,
                      position: 'insideRight',
                      fill: '#b45309',
                      fontSize: 11,
                      style: { textAnchor: 'middle' },
                    }}
                  />
                  <Tooltip content={<CustomScreeTooltip />} />

                  {/* Reference line for 80% variance target */}
                  {showEightyLine && (
                    <ReferenceLine
                      yAxisId="right"
                      y={80}
                      stroke="#10b981"
                      strokeDasharray="4 4"
                      label={{
                        value: 'Umbral 80% de Varianza',
                        position: 'insideTopRight',
                        fill: '#047857',
                        fontSize: 10,
                        fontWeight: 600,
                      }}
                    />
                  )}

                  {/* Reference line for Kaiser eigenvalue threshold (λ = 1 corresponds to 1/6 = 16.67% of variance) */}
                  {showKaiserLine && (
                    <ReferenceLine
                      yAxisId="left"
                      y={16.67}
                      stroke="#d97706"
                      strokeDasharray="3 3"
                      label={{
                        value: 'Corte Kaiser: λ = 1 (16.7%)',
                        position: 'insideTopLeft',
                        fill: '#b45309',
                        fontSize: 10,
                        fontWeight: 600,
                      }}
                    />
                  )}

                  {/* Scree bars */}
                  <Bar
                    yAxisId="left"
                    dataKey="varianceExplained"
                    name="Varianza Individual"
                    radius={[6, 6, 0, 0]}
                    fill="#10b981"
                    cursor="pointer"
                  />

                  {/* Cumulative Variance Line */}
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="cumulativeVariance"
                    name="Varianza Acumulada"
                    stroke="#d97706"
                    strokeWidth={3}
                    dot={{ fill: '#d97706', r: 5, strokeWidth: 2, stroke: '#ffffff' }}
                    activeDot={{ r: 7, stroke: '#92400e', strokeWidth: 2 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Interactive Scree Selector Bar */}
          <div className="mt-4 pt-4 border-t border-stone-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <span className="text-xs font-semibold text-stone-700">
                Seleccionar número de componentes a retener (k):
              </span>
              <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                k = {selectedK} {selectedK === 2 ? '(Codo Recomendado)' : ''}
              </span>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {screeData.map((item) => {
                const isSelected = item.index === selectedK;
                const isElbow = item.isElbow;
                return (
                  <button
                    key={item.component}
                    onClick={() => setSelectedK(item.index)}
                    className={`py-2 px-1 rounded-xl text-center text-xs font-medium transition-all relative ${
                      isSelected
                        ? 'bg-stone-900 text-white shadow-md ring-2 ring-emerald-500 ring-offset-1'
                        : isElbow
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 hover:bg-emerald-200'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200'
                    }`}
                  >
                    {isElbow && (
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[9px] font-bold px-1 rounded-full">
                        CODO
                      </span>
                    )}
                    <span className="block font-bold">{item.component}</span>
                    <span className="text-[10px] opacity-80 block">{item.varianceExplained}%</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Diagnostic & Decision Panel (1 col) */}
        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>Evaluación de Decisión con k = {selectedK}</span>
              </h3>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-white text-stone-700 border border-stone-200">
                {selectedK} de 6 componentes
              </span>
            </div>

            {/* Metric Bars */}
            <div className="space-y-4 mt-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-stone-600 font-medium">Varianza Explicada (Señal):</span>
                  <strong className="text-emerald-700 font-mono text-sm">{retainedVariance}%</strong>
                </div>
                <div className="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${retainedVariance}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-stone-600 font-medium">Varianza Descartada (Pérdida/Ruido):</span>
                  <strong className="text-stone-500 font-mono text-sm">{discardedVariance}%</strong>
                </div>
                <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-stone-400 h-full rounded-full transition-all duration-300"
                    style={{ width: `${discardedVariance}%` }}
                  />
                </div>
              </div>

              {/* Eigenvalues for this selection */}
              <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-2 text-xs">
                <span className="text-stone-500 font-semibold uppercase text-[10px] tracking-wider block">
                  Autovalores Seleccionados (λ)
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {screeData.slice(0, selectedK).map((item) => (
                    <span
                      key={item.component}
                      className="px-2 py-1 rounded bg-stone-100 font-mono text-stone-800 border border-stone-200"
                    >
                      {item.component}: <strong>{item.eigenvalue}</strong>
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-stone-500 pt-1">
                  Suma total de autovalores = 6 (número de variables estandarizadas).
                </p>
              </div>
            </div>
          </div>

          {/* Diagnostic verdict for selected K */}
          <div className="p-3.5 rounded-xl border bg-white space-y-2 text-xs">
            <span className="font-bold text-stone-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Diagnóstico Pedagógico</span>
            </span>
            {selectedK === 1 && (
              <p className="text-stone-600 leading-relaxed">
                Retener sólo <strong>PC1 (53.8%)</strong> comprime los datos a una sola línea unidimensional. Aunque captura
                la mitad de la varianza, perdemos casi el 46% de información. <em>Insuficiente</em> para capturar la complejidad suiza.
              </p>
            )}
            {selectedK === 2 && (
              <p className="text-emerald-900 leading-relaxed font-medium">
                🎯 <strong>Punto Óptimo del Codo</strong>: Conserva el <strong>72.4%</strong> de varianza con sólo 2 dimensiones.
                Permite una visualización directa en un plano cartesiano 2D (Biplot) y respeta tanto el criterio del codo como el de Kaiser (ambos autovalores &gt; 1.0).
              </p>
            )}
            {selectedK === 3 && (
              <p className="text-stone-700 leading-relaxed">
                Con <strong>3 componentes</strong> alcanzamos el <strong>86.2%</strong> de varianza (&gt;80%). El autovalor
                de PC3 es 0.83 (&lt; 1, por debajo del corte de Kaiser), pero es aceptable si se desea modelar con alta fidelidad tridimensional.
              </p>
            )}
            {selectedK >= 4 && (
              <p className="text-amber-800 leading-relaxed">
                ⚠️ <strong>Sobreajuste / Rendimiento marginal mínimo</strong>: Añadir componentes 4, 5 o 6 aporta menos del 7%
                cada una. Se pierde la principal ventaja de PCA (simplificación y eliminación de ruido) sin ganar interpretabilidad.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 3 Classical Decision Criteria Compared */}
      <div className="bg-white border border-stone-200 rounded-2xl p-5 sm:p-6 shadow-xs">
        <h3 className="text-base font-bold text-stone-900 mb-4 flex items-center gap-2">
          <Info className="w-5 h-5 text-emerald-600" />
          <span>Comparativa de Criterios Científicos para Elegir Componentes</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          {/* Criterion 1: Elbow Method */}
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-950 text-sm">1. Criterio del Codo (Scree)</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white font-mono text-xs font-bold">
                k = 2
              </span>
            </div>
            <p className="text-xs text-stone-700 leading-relaxed">
              <strong>Regla visual y de aceleración:</strong> Se grafica el autovalor o % de varianza frente al índice de componente.
              Se busca el ángulo donde la caída pronunciada se convierte en una pendiente casi horizontal (el &quot;codo&quot;).
            </p>
            <div className="pt-1 text-xs font-mono text-emerald-900">
              • Caída PC1→PC2: -35.2%<br />
              • Caída PC2→PC3: -4.8% (Quiebre claro)
            </div>
          </div>

          {/* Criterion 2: Kaiser-Guttman Rule */}
          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-950 text-sm">2. Criterio de Kaiser (λ &gt; 1)</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-600 text-white font-mono text-xs font-bold">
                k = 2
              </span>
            </div>
            <p className="text-xs text-stone-700 leading-relaxed">
              <strong>Regla analítica:</strong> Como los datos fueron estandarizados, cada variable original tiene varianza = 1.
              Sólo tiene sentido conservar componentes que expliquen <em>más varianza que una variable individual aislada</em> (λ &gt; 1).
            </p>
            <div className="pt-1 text-xs font-mono text-amber-900">
              • λ(PC1) = 3.23 &gt; 1.0 (Conservar)<br />
              • λ(PC2) = 1.12 &gt; 1.0 (Conservar)<br />
              • λ(PC3) = 0.83 &lt; 1.0 (Descartar)
            </div>
          </div>

          {/* Criterion 3: Cumulative Variance Threshold */}
          <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-900 text-sm">3. Umbral de Varianza Acumulada</span>
              <span className="px-2 py-0.5 rounded-full bg-stone-800 text-white font-mono text-xs font-bold">
                k = 2 ó 3
              </span>
            </div>
            <p className="text-xs text-stone-700 leading-relaxed">
              <strong>Regla pragmática:</strong> Se fija una cota mínima aceptable antes del análisis, típicamente entre el
              <strong> 70% y el 85%</strong> del total de información del sistema.
            </p>
            <div className="pt-1 text-xs font-mono text-stone-700">
              • Meta 70%: Cumplida en k = 2 (72.4%)<br />
              • Meta 80%: Cumplida en k = 3 (86.2%)
            </div>
          </div>
        </div>
      </div>

      {/* Origin of the term Scree */}
      <div className="p-4 bg-stone-100 rounded-xl border border-stone-200 flex items-start gap-3 text-xs text-stone-600">
        <HelpCircle className="w-5 h-5 text-stone-500 shrink-0 mt-0.5" />
        <div>
          <strong className="text-stone-800 block mb-0.5">Nota Histórica &amp; Geológica: ¿Por qué &quot;Scree&quot;?</strong>
          En geología y geomorfología, <em>scree</em> (o tartera/canchal en español) se refiere a la acumulación de rocas sueltas y escombros que descansan en la base de un acantilado escarpado. Raymond Cattell comparó las primeras componentes principales con el <strong>acantilado rocoso macizo</strong> (información sólida y señal real) y las componentes posteriores con el <strong>sedimento residual</strong> (ruido y variabilidad fortuita) que se debe descartar.
        </div>
      </div>
    </div>
  );
};

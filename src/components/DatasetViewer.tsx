import React, { useState } from 'react';
import { SWISS_DATA, SwissRecord } from '../data/swissData';
import { PCAResult } from '../utils/pcaEngine';
import { Table, Search, Grid, HelpCircle } from 'lucide-react';

interface DatasetViewerProps {
  pca: PCAResult;
}

export const DatasetViewer: React.FC<DatasetViewerProps> = ({ pca }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'matrix' | 'table' | 'stats'>('matrix');

  const filteredData = SWISS_DATA.filter((d) =>
    d.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCorrBg = (val: number) => {
    if (val === 1) return 'bg-stone-200 text-stone-900 font-bold';
    if (val > 0.5) return 'bg-emerald-600 text-white font-bold';
    if (val > 0.2) return 'bg-emerald-200 text-emerald-950';
    if (val > -0.2) return 'bg-stone-50 text-stone-700';
    if (val > -0.5) return 'bg-blue-200 text-blue-950';
    return 'bg-blue-600 text-white font-bold';
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-white border border-stone-200 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-stone-900 text-white rounded-lg">
                <Table className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-stone-900">
                  Explorador del Dataset Swiss (1888) &amp; Matriz de Correlación
                </h2>
                <p className="text-xs sm:text-sm text-stone-600">
                  47 provincias suizas francófonas durante la transición demográfica del siglo XIX.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('matrix')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'matrix'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200'
              }`}
            >
              Matriz de Correlación
            </button>
            <button
              onClick={() => setActiveTab('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'table'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200'
              }`}
            >
              Tabla de Datos (47)
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'stats'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200'
              }`}
            >
              Estadísticas Descriptivas
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Correlation Matrix */}
      {activeTab === 'matrix' && (
        <div className="bg-white border border-stone-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
            <div>
              <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
                <Grid className="w-4 h-4 text-emerald-600" />
                <span>Matriz de Correlación de Pearson (R)</span>
              </h3>
              <p className="text-xs text-stone-500">
                Paso fundamental en PCA: las altas correlaciones explican por qué 2 componentes bastan para resumir el sistema.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1 text-emerald-700 font-medium">
                <span className="w-2.5 h-2.5 rounded bg-emerald-600 inline-block" /> Positiva fuerte (+0.70)
              </span>
              <span className="flex items-center gap-1 text-blue-700 font-medium">
                <span className="w-2.5 h-2.5 rounded bg-blue-600 inline-block" /> Negativa fuerte (-0.66)
              </span>
            </div>
          </div>

          {/* Heatmap Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-center border-collapse">
              <thead>
                <tr>
                  <th className="p-2.5 text-left font-bold text-stone-700 bg-stone-50 border border-stone-200">
                    Variable
                  </th>
                  {pca.variables.map((v) => (
                    <th key={v.key} className="p-2.5 font-bold text-stone-700 bg-stone-50 border border-stone-200">
                      {v.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pca.variables.map((rowVar, rIdx) => (
                  <tr key={rowVar.key}>
                    <td className="p-2.5 text-left font-bold text-stone-900 bg-stone-50 border border-stone-200 whitespace-nowrap">
                      {rowVar.name}
                    </td>
                    {pca.variables.map((colVar, cIdx) => {
                      const val = pca.correlationMatrix[rIdx][cIdx];
                      return (
                        <td
                          key={colVar.key}
                          className={`p-2.5 border border-stone-200 font-mono transition-colors ${getCorrBg(val)}`}
                        >
                          {val === 1 ? '1.00' : val.toFixed(2)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-700 space-y-1.5">
            <span className="font-bold text-stone-900 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-emerald-600" />
              <span>Conclusiones Pedagógicas de la Matriz</span>
            </span>
            <ul className="list-disc pl-4 space-y-1 text-stone-600">
              <li>
                <strong>Educación y Examen Militar (+0.70):</strong> Los cantones donde más reclutas aprueban con honores el examen del ejército suizo son precisamente los de mayor educación formal.
              </li>
              <li>
                <strong>Educación y Fertilidad (-0.66):</strong> A mayor educación de la población, menor tasa de natalidad/fertilidad, reflejando el inicio de la transición demográfica moderna.
              </li>
              <li>
                <strong>Agricultura y Educación (-0.64):</strong> Las zonas rurales agrícolas tenían significativamente menor acceso o retención en estudios superiores.
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Tab 2: Raw Data Table */}
      {activeTab === 'table' && (
        <div className="bg-white border border-stone-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
            <div>
              <h3 className="font-bold text-stone-900 text-base">Tabla de Observaciones (47 Cantones)</h3>
              <p className="text-xs text-stone-500">Datos históricos originales recopilados en 1888.</p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar cantón..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto max-h-96 overflow-y-auto border border-stone-200 rounded-xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-stone-50 text-stone-700 sticky top-0 border-b border-stone-200">
                <tr>
                  <th className="py-2.5 px-3 font-bold">Cantón / Distrito</th>
                  <th className="py-2.5 px-3 font-bold">Religión</th>
                  <th className="py-2.5 px-3 font-bold text-right">Fertilidad</th>
                  <th className="py-2.5 px-3 font-bold text-right">% Agricultura</th>
                  <th className="py-2.5 px-3 font-bold text-right">% Examen Mil.</th>
                  <th className="py-2.5 px-3 font-bold text-right">% Educación</th>
                  <th className="py-2.5 px-3 font-bold text-right">% Católicos</th>
                  <th className="py-2.5 px-3 font-bold text-right">% Mort. Infantil</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-mono">
                {filteredData.map((row) => (
                  <tr key={row.id} className="hover:bg-stone-50 transition-colors">
                    <td className="py-2 px-3 font-sans font-semibold text-stone-900">{row.district}</td>
                    <td className="py-2 px-3 font-sans">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                          row.religionMajority === 'Católica'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {row.religionMajority}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right">{row.Fertility.toFixed(1)}</td>
                    <td className="py-2 px-3 text-right">{row.Agriculture.toFixed(1)}%</td>
                    <td className="py-2 px-3 text-right">{row.Examination}%</td>
                    <td className="py-2 px-3 text-right">{row.Education}%</td>
                    <td className="py-2 px-3 text-right">{row.Catholic.toFixed(1)}%</td>
                    <td className="py-2 px-3 text-right">{row.InfantMortality.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-right text-[11px] text-stone-500">
            Mostrando {filteredData.length} de 47 distritos
          </div>
        </div>
      )}

      {/* Tab 3: Descriptive Stats */}
      {activeTab === 'stats' && (
        <div className="bg-white border border-stone-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="pb-3 border-b border-stone-100">
            <h3 className="font-bold text-stone-900 text-base">Estadísticas Descriptivas (Antes de Estandarizar)</h3>
            <p className="text-xs text-stone-500">
              Observa las diferencias de escala y dispersión que obligan al uso de estandarización en PCA.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-stone-700">
                  <th className="py-2.5 px-3 font-bold">Variable</th>
                  <th className="py-2.5 px-3 font-bold text-right">Media (μ)</th>
                  <th className="py-2.5 px-3 font-bold text-right">Desv. Estándar (σ)</th>
                  <th className="py-2.5 px-3 font-bold text-right">Mínimo</th>
                  <th className="py-2.5 px-3 font-bold text-right">Máximo</th>
                  <th className="py-2.5 px-3 font-bold text-right">Rango</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-mono">
                {pca.stats.map((s) => (
                  <tr key={s.key} className="hover:bg-stone-50">
                    <td className="py-2.5 px-3 font-sans font-semibold text-stone-900">{s.name}</td>
                    <td className="py-2.5 px-3 text-right text-emerald-800 font-bold">{s.mean.toFixed(2)}</td>
                    <td className="py-2.5 px-3 text-right text-stone-700">{s.std.toFixed(2)}</td>
                    <td className="py-2.5 px-3 text-right text-stone-600">{s.min.toFixed(1)}</td>
                    <td className="py-2.5 px-3 text-right text-stone-600">{s.max.toFixed(1)}</td>
                    <td className="py-2.5 px-3 text-right text-stone-800">{(s.max - s.min).toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

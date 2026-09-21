/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from 'react';
import { performSwissPCA } from './utils/pcaEngine';
import { Header } from './components/Header';
import { ElbowMethodSection } from './components/ElbowMethodSection';
import { BiplotSection } from './components/BiplotSection';
import { LoadingsSection } from './components/LoadingsSection';
import { ReconstructionSimulator } from './components/ReconstructionSimulator';
import { PedagogicalExplanation } from './components/PedagogicalExplanation';
import { DatasetViewer } from './components/DatasetViewer';
import { Activity, Compass, Layers, Sparkles, HelpCircle, Table, ArrowRight } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('elbow');

  // Compute PCA once with exact Jacobi eigendecomposition
  const pca = useMemo(() => performSwissPCA(), []);

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Header */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Quick Diagnostic Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div
            onClick={() => setActiveTab('elbow')}
            className="cursor-pointer bg-white p-3.5 rounded-xl border border-stone-200 shadow-xs hover:border-emerald-300 transition-all group"
          >
            <span className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold block">
              1. Criterio del Codo
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-lg font-bold text-stone-900 group-hover:text-emerald-700 transition-colors">
                k = 2 ó 3
              </span>
              <span className="text-xs font-mono font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                72.4% Var
              </span>
            </div>
          </div>

          <div
            onClick={() => setActiveTab('elbow')}
            className="cursor-pointer bg-white p-3.5 rounded-xl border border-stone-200 shadow-xs hover:border-emerald-300 transition-all group"
          >
            <span className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold block">
              2. Criterio de Kaiser (λ &gt; 1)
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-lg font-bold text-stone-900 group-hover:text-amber-700 transition-colors">
                k = 2
              </span>
              <span className="text-xs font-mono font-medium text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded">
                λ₁=3.2, λ₂=1.1
              </span>
            </div>
          </div>

          <div
            onClick={() => setActiveTab('biplot')}
            className="cursor-pointer bg-white p-3.5 rounded-xl border border-stone-200 shadow-xs hover:border-emerald-300 transition-all group"
          >
            <span className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold block">
              3. Espacio Latente Biplot
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-lg font-bold text-stone-900 group-hover:text-blue-700 transition-colors">
                PC1 + PC2
              </span>
              <span className="text-xs font-mono font-medium text-blue-800 bg-blue-50 px-1.5 py-0.5 rounded">
                47 Cantones
              </span>
            </div>
          </div>

          <div
            onClick={() => setActiveTab('reconstruction')}
            className="cursor-pointer bg-white p-3.5 rounded-xl border border-stone-200 shadow-xs hover:border-emerald-300 transition-all group"
          >
            <span className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold block">
              4. Compresión de Señal
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-lg font-bold text-stone-900 group-hover:text-purple-700 transition-colors">
                -66.7% Dim
              </span>
              <span className="text-xs font-mono font-medium text-purple-800 bg-purple-50 px-1.5 py-0.5 rounded">
                6D → 2D
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Tab View */}
        {activeTab === 'elbow' && <ElbowMethodSection pca={pca} />}
        {activeTab === 'biplot' && <BiplotSection pca={pca} />}
        {activeTab === 'loadings' && <LoadingsSection pca={pca} />}
        {activeTab === 'reconstruction' && <ReconstructionSimulator pca={pca} />}
        {activeTab === 'pedagogical' && <PedagogicalExplanation />}
        {activeTab === 'dataset' && <DatasetViewer pca={pca} />}
      </main>

      {/* Global Pedagogical Footer */}
      <footer className="border-t border-stone-200 bg-white py-6 mt-12 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <strong className="text-stone-800">Guía de Algoritmo PCA y el Método del Codo</strong>
            <span className="mx-2">·</span>
            <span>Dataset Swiss 1888 (Mosteller &amp; Tukey / R Datasets)</span>
          </div>
          <div className="flex items-center gap-4 text-stone-600">
            <button
              onClick={() => setActiveTab('pedagogical')}
              className="hover:text-emerald-700 underline underline-offset-2 transition-colors"
            >
              Revisar Formulación Matemática
            </button>
            <span>·</span>
            <button
              onClick={() => setActiveTab('elbow')}
              className="hover:text-emerald-700 underline underline-offset-2 transition-colors"
            >
              Ver Scree Plot
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

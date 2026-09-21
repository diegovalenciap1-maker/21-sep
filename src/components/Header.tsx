import React from 'react';
import { Sparkles, Compass, HelpCircle, Layers, Activity } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'elbow', label: 'Método del Codo (Scree Plot)', icon: Activity, badge: 'Crucial' },
    { id: 'biplot', label: 'Biplot (PC1 vs PC2)', icon: Compass },
    { id: 'loadings', label: 'Cargas de Variables', icon: Layers },
    { id: 'reconstruction', label: 'Simulador de Reconstrucción', icon: Sparkles },
    { id: 'pedagogical', label: 'Explicación Paso a Paso', icon: HelpCircle },
    { id: 'dataset', label: 'Dataset & Correlación', icon: Layers },
  ];

  return (
    <header className="border-b border-stone-200 bg-white/95 backdrop-blur-sm sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                Machine Learning Pedagógico
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-stone-100 text-stone-700">
                R Swiss Dataset (1888)
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight mt-1">
              Algoritmo PCA y el Método del Codo
            </h1>
            <p className="text-xs sm:text-sm text-stone-600">
              Comprensión visual de la reducción de dimensionalidad con 47 distritos suizos y 6 variables socioeconómicas.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-stone-600 bg-stone-50 border border-stone-200 px-3 py-2 rounded-lg">
            <div>
              <span className="text-stone-400">Dim. original:</span> <strong className="text-stone-800">6D</strong>
            </div>
            <span className="text-stone-300">→</span>
            <div>
              <span className="text-stone-400">Proyección:</span> <strong className="text-emerald-700">2D (PC1 + PC2)</strong>
            </div>
            <span className="text-stone-300">|</span>
            <div>
              <span className="text-stone-400">Varianza:</span> <strong className="text-emerald-700">72.4%</strong>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto pb-2 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-btn-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-stone-900 text-white shadow-sm'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-stone-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`px-1.5 py-0.2 rounded text-[10px] uppercase font-bold tracking-wider ${
                    isActive ? 'bg-emerald-500 text-stone-950' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

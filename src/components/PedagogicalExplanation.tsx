import React, { useState } from 'react';
import { BookOpen, CheckCircle, ArrowRight, Lightbulb, Calculator, HelpCircle, Activity } from 'lucide-react';

export const PedagogicalExplanation: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);

  const steps = [
    {
      step: 1,
      title: 'Centrado y Estandarización (Z-Scores)',
      subtitle: 'Nivelar el terreno de juego matemático',
      formula: 'z_{ij} = \\frac{x_{ij} - \\mu_j}{\\sigma_j}',
      why: '¿Por qué es indispensable en el dataset Swiss?',
      desc: 'En el dataset Swiss, la variable "Catolicismo" varía entre 2.15% y 100%, mientras que "Educación" se concentra entre 1% y 53%. Si no estandarizamos, la variable con mayor escala numérica dominaría artificialmente el cálculo de varianza, distorsionando el análisis. Al restar la media (μ) y dividir por la desviación estándar (σ), cada una de las 6 variables pasa a tener media = 0 y varianza = 1.',
    },
    {
      step: 2,
      title: 'Matriz de Correlación (R)',
      subtitle: 'Identificar redundancias e información compartida',
      formula: 'R = \\frac{1}{n-1} Z^T Z',
      why: '¿Qué revela en Suiza de 1888?',
      desc: 'La matriz 6×6 resultante mide cómo varían juntas las variables. Descubrimos que Educación y Examen Militar tienen una alta correlación positiva (+0.70), mientras que Educación y Fertilidad tienen una fuerte correlación negativa (-0.66). Esta redundancia (multicolinealidad) es precisamente lo que PCA aprovecha para resumir múltiples variables en una sola.',
    },
    {
      step: 3,
      title: 'Descomposición Espectral (Autovalores y Autovectores)',
      subtitle: 'Encontrar los nuevos ejes de máxima dispersión',
      formula: 'R \\cdot v_i = \\lambda_i \\cdot v_i \\quad \\Longleftrightarrow \\quad \\det(R - \\lambda I) = 0',
      why: '¿Qué significan geométricamente λ y v?',
      desc: '• Los Autovectores (v_i) son las direcciones espaciales (vectores unitarios ortogonales a 90° entre sí) a lo largo de las cuales los datos tienen la mayor dispersión.\n• Los Autovalores (λ_i) representan la magnitud de la varianza capturada a lo largo de cada autovector. En datos estandarizados, la suma total de todos los autovalores es igual al número de variables: λ₁ + λ₂ + ... + λ₆ = 6.0.',
    },
    {
      step: 4,
      title: 'El Gráfico de Sedimentación & El Método del Codo',
      subtitle: 'Decidir cuántas dimensiones conservar',
      formula: '\\%\\text{Var}_i = \\frac{\\lambda_i}{\\sum_{j=1}^p \\lambda_j} \\times 100\\%',
      why: '¿Cómo funciona la regla de decisión?',
      desc: 'Ordenamos los autovalores en orden descendente: λ₁ = 3.23 (53.8%), λ₂ = 1.12 (18.6%), λ₃ = 0.83 (13.8%), λ₄ = 0.42 (7.0%), etc. Al graficarlos se observa una pronunciada caída que se quiebra abruptamente en k=2 (el "codo"). Las componentes posteriores forman el "sedimento" (ruido), indicando que con sólo 2 dimensiones retenemos el 72.4% de toda la información.',
    },
    {
      step: 5,
      title: 'Proyección y Puntuaciones (Scores)',
      subtitle: 'Visualizar los 47 cantones en el nuevo mapa 2D',
      formula: 'S = Z \\cdot V',
      why: '¿Qué obtenemos al final?',
      desc: 'Multiplicamos la matriz estandarizada original Z (47×6) por los dos primeros autovectores V₂ (6×2). Cada cantón obtiene un nuevo par de coordenadas (PC1, PC2). Ahora podemos dibujar un plano 2D (Biplot) donde Ginebra y Lausana aparecen a un lado (alta educación) y cantones rurales como Glane y Sarine aparecen al lado opuesto, reflejando fielmente la realidad socioeconómica sin sesgos.',
    },
  ];

  const currentStep = steps[activeStep - 1];

  return (
    <div className="space-y-6">
      {/* Big Picture Analogy */}
      <div className="bg-white border border-stone-200 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <span className="p-2 bg-emerald-600 text-white rounded-lg">
            <Lightbulb className="w-5 h-5" />
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-stone-900">
            La Intuición de PCA: La Analogía de la Escultura y la Fotografía
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
            <strong className="text-stone-900 block mb-1">1. El Objeto en 6D</strong>
            Imagina los 47 distritos de Suiza suspendidos en un espacio de 6 dimensiones (un eje por cada variable: fertilidad, educación, agricultura, etc.). Como seres humanos, no podemos ver un hiperespacio de 6D.
          </div>
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
            <strong className="text-stone-900 block mb-1">2. Encontrar el Mejor Ángulo</strong>
            PCA busca el ángulo exacto de la cámara donde la &quot;fotografía&quot; en 2D capte la máxima silueta y detalle de la escultura, sin que las partes se tapen unas a otras (máxima varianza proyectada).
          </div>
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
            <strong className="text-stone-900 block mb-1">3. Ejes Incorrelacionados</strong>
            El primer eje (PC1) capta la mayor variación posible. El segundo eje (PC2) se coloca a 90° exactos del primero para captar la siguiente mayor variación sin repetir lo que ya explicó PC1.
          </div>
        </div>
      </div>

      {/* Interactive 5-Step Mathematical Walkthrough */}
      <div className="bg-white border border-stone-200 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-100">
          <div>
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-emerald-600" />
              <span>Paso a Paso del Algoritmo Matemático</span>
            </h3>
            <p className="text-xs text-stone-500">
              Haz clic en cada paso para ver la formulación matemática y su justificación en el dataset Swiss.
            </p>
          </div>
          <span className="text-xs font-mono text-stone-600 bg-stone-100 px-2.5 py-1 rounded-lg">
            Paso {activeStep} de 5
          </span>
        </div>

        {/* Step Selector Tabs */}
        <div className="grid grid-cols-5 gap-1.5 sm:gap-2 my-4">
          {steps.map((s) => {
            const isSelected = activeStep === s.step;
            return (
              <button
                key={s.step}
                onClick={() => setActiveStep(s.step)}
                className={`p-2 sm:p-3 rounded-xl text-left transition-all border ${
                  isSelected
                    ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <span className="block font-mono text-[10px] uppercase tracking-wider opacity-70">
                  Paso {s.step}
                </span>
                <span className="block font-bold text-xs truncate">{s.title.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Active Step Content Card */}
        <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                Paso {currentStep.step}: {currentStep.subtitle}
              </span>
              <h4 className="text-lg font-bold text-stone-900">{currentStep.title}</h4>
            </div>
            <div className="bg-white px-3 py-1.5 rounded-xl border border-stone-200 font-mono text-xs text-emerald-900 font-semibold self-start">
              {currentStep.formula}
            </div>
          </div>

          <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-2">
            <span className="font-bold text-stone-900 text-xs flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>{currentStep.why}</span>
            </span>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed whitespace-pre-line">
              {currentStep.desc}
            </p>
          </div>

          {/* Step Nav Controls */}
          <div className="flex items-center justify-between pt-2">
            <button
              disabled={activeStep === 1}
              onClick={() => setActiveStep((prev) => Math.max(1, prev - 1))}
              className="px-3 py-1.5 rounded-lg text-xs font-medium border border-stone-300 bg-white text-stone-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-100"
            >
              ← Anterior
            </button>
            <button
              disabled={activeStep === 5}
              onClick={() => setActiveStep((prev) => Math.min(5, prev + 1))}
              className="px-3 py-1.5 rounded-lg text-xs font-medium border border-emerald-600 bg-emerald-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-emerald-700 flex items-center gap-1"
            >
              <span>Siguiente</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Comprehensive Elbow Method Deep Dive */}
      <div className="bg-white border border-stone-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-600" />
          <h3 className="text-base sm:text-lg font-bold text-stone-900">
            El Método del Codo: Análisis Teórico y Práctico
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-stone-700">
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
            <strong className="text-stone-900 text-sm block">Definición Formal del &quot;Codo&quot;</strong>
            <p className="leading-relaxed">
              En una secuencia decreciente de autovalores $(\lambda_1, \lambda_2, \dots, \lambda_p)$, el punto del codo es
              el valor $k$ donde la <strong>segunda diferencia discreta</strong> (o curvatura) alcanza su máximo:
            </p>
            <div className="p-2 bg-white rounded border font-mono text-center text-xs text-stone-800">
              Δ² λ_k = (λ_k - λ_(k+1)) - (λ_(k+1) - λ_(k+2))
            </div>
            <p className="text-stone-600 text-xs">
              Mide el salto donde la tasa de descenso se desacelera drásticamente. En Swiss, la transición ocurre nítidamente entre PC2 y PC3.
            </p>
          </div>

          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
            <strong className="text-stone-900 text-sm block">¿Por qué no retener todas las componentes?</strong>
            <p className="leading-relaxed">
              Retener las 6 componentes mantendría el 100% de la varianza, pero anula por completo el propósito de PCA:
            </p>
            <ul className="space-y-1 list-disc pl-4 text-xs text-stone-600">
              <li>No podemos graficar 6 dimensiones en una pantalla ni en papel.</li>
              <li>Las últimas componentes a menudo representan <strong>ruido de medición</strong> o anomalías fortuitas.</li>
              <li>Con $k=2$, reducimos la dimensionalidad en un <strong>66.7%</strong> perdiendo únicamente un 27.6% de información.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Concept Glossary */}
      <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 shadow-xs">
        <h3 className="text-sm font-bold text-stone-900 mb-3 flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-emerald-600" />
          <span>Glosario Clave de Términos</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-white rounded-xl border border-stone-200">
            <span className="font-bold text-stone-900 block mb-0.5">Autovalor (Eigenvalue, λ)</span>
            Varianza total que explica una componente principal. En datos estandarizados, λ &gt; 1 significa que la componente aporta más que una variable original.
          </div>
          <div className="p-3 bg-white rounded-xl border border-stone-200">
            <span className="font-bold text-stone-900 block mb-0.5">Autovector (Eigenvector, v)</span>
            Vector que define la dirección del nuevo eje. Sus componentes son los coeficientes lineales con los que se combinan las variables originales.
          </div>
          <div className="p-3 bg-white rounded-xl border border-stone-200">
            <span className="font-bold text-stone-900 block mb-0.5">Carga (Loading)</span>
            Correlación de Pearson entre una variable original y la componente principal (varía entre -1 y +1).
          </div>
          <div className="p-3 bg-white rounded-xl border border-stone-200">
            <span className="font-bold text-stone-900 block mb-0.5">Puntuación (Score)</span>
            La coordenada o posición de un distrito concreto (ej. Lausana) sobre los nuevos ejes PC1 y PC2.
          </div>
          <div className="p-3 bg-white rounded-xl border border-stone-200">
            <span className="font-bold text-stone-900 block mb-0.5">Scree Plot</span>
            Gráfico de barras/líneas que muestra los autovalores ordenados de mayor a menor para aplicar el método del codo.
          </div>
          <div className="p-3 bg-white rounded-xl border border-stone-200">
            <span className="font-bold text-stone-900 block mb-0.5">Ortogonalidad</span>
            Las componentes están a 90° geométricos exactos, lo que garantiza que la correlación matemática entre PC1 y PC2 sea exactamente 0.
          </div>
        </div>
      </div>
    </div>
  );
};

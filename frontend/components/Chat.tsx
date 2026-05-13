'use client';

import React, { useState } from 'react';

interface ChatResponse {
  user_id: string;
  hours_worked: number;
  freelancer_name: string;
  explanation: string;
  calculation: {
    total_usd: number;
    total_local: number;
    exchange_rate: number;
    hourly_rate_usd: number;
    currency: string;
    breakdown?: {
      source?: string;
      formula?: string;
      [key: string]: any;
    };
    [key: string]: any;
  };
}

export default function Chat() {
  const [userId, setUserId] = useState('');
  const [hoursWorked, setHoursWorked] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<ChatResponse | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResponse(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      
      if (!apiUrl) {
        throw new Error('API URL not configured');
      }

      const res = await fetch(`${apiUrl}/api/chat/calculate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          hours_worked: parseFloat(hoursWorked),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || `HTTP ${res.status}`);
      }

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 flex items-center gap-3">
                💫 Asistente de Tarifas IA
              </h1>
              <p className="text-slate-600 mt-2">Análisis inteligente basado en tu perfil y experiencia</p>
            </div>
            <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg font-semibold text-sm">
              ✓ Datos cargados desde tu perfil
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-xl shadow-md p-8 border-l-4 border-purple-500 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <div>
              <label htmlFor="userId" className="block text-sm font-semibold text-slate-700 mb-2">
                ID del Freelancer
              </label>
              <input
                id="userId"
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="e.g., freelancer_ars"
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                required
              />
            </div>

            <div>
              <label htmlFor="hoursWorked" className="block text-sm font-semibold text-slate-700 mb-2">
                Horas Trabajadas
              </label>
              <input
                id="hoursWorked"
                type="number"
                value={hoursWorked}
                onChange={(e) => setHoursWorked(e.target.value)}
                placeholder="e.g., 8"
                min="0.5"
                step="0.5"
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                required
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full mt-6 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold py-3 rounded-lg hover:from-purple-700 hover:to-purple-800 disabled:from-slate-400 disabled:to-slate-500 transition-all shadow-lg"
          >
            {loading ? '⏳ Calculando...' : '📊 Calcular & Explicar'}
          </button>

          {error && (
            <div className="mt-6 p-4 bg-red-50 border-2 border-red-300 text-red-700 rounded-lg">
              <p className="font-semibold">❌ Error</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          )}
        </div>

        {/* Welcome Card - shows after calculation */}
        {response && (
          <>
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl shadow-md p-6 border-l-4 border-pink-400 mb-8">
              <div className="flex items-start gap-4">
                <div className="text-4xl">👋</div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-800 mb-2">
                    Hola, {response.freelancer_name.charAt(0).toUpperCase() + response.freelancer_name.slice(1)}
                  </h3>
                  <p className="text-slate-700 text-sm mb-1">
                    He cargado automáticamente tu información de perfil: <span className="font-bold">3 años de experiencia</span> como <span className="font-bold">Diseñador Freelance</span> en España. Con tus ingresos actuales de <span className="font-bold">€2800</span> y tarifa de <span className="font-bold">€35/hora</span>, he preparado un análisis completo para optimizar tus tarifas.
                  </p>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Analysis */}
              <div className="lg:col-span-2 space-y-6">
                {/* Analysis Card - Purple/Magenta */}
                <div className="bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 rounded-xl shadow-lg p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold">Vista previa</h2>
                    <span className="text-2xl">📊</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-6">Análisis del Asistente Virtual</h3>
                  
                  {/* Summary Boxes */}
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="bg-white bg-opacity-20 backdrop-blur rounded-lg p-4">
                      <p className="text-xs font-semibold uppercase opacity-90">Tu Tarifa Actual</p>
                      <p className="text-3xl font-bold mt-2">
                        €{response.calculation.hourly_rate_usd.toFixed(0)}
                      </p>
                      <p className="text-xs opacity-75 mt-1">/hora</p>
                    </div>
                    
                    <div className="bg-white bg-opacity-20 backdrop-blur rounded-lg p-4">
                      <p className="text-xs font-semibold uppercase opacity-90">Tarifa Sugerida</p>
                      <p className="text-3xl font-bold mt-2">
                        €{(response.calculation.hourly_rate_usd * 1.2).toFixed(0)}
                      </p>
                      <p className="text-xs opacity-75 mt-1">/hora</p>
                    </div>
                    
                    <div className="bg-white bg-opacity-20 backdrop-blur rounded-lg p-4">
                      <p className="text-xs font-semibold uppercase opacity-90">Potencial Aumento Manual</p>
                      <p className="text-3xl font-bold mt-2">+€{(response.calculation.hourly_rate_usd * 0.2).toFixed(0)}</p>
                      <p className="text-xs opacity-75 mt-1">por hora</p>
                    </div>
                  </div>

                  {/* Details Row */}
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="opacity-75 text-xs">3 años</p>
                      <p className="font-bold">Experiencia</p>
                    </div>
                    <div>
                      <p className="opacity-75 text-xs">€2,800</p>
                      <p className="font-bold">Ingresos actuales</p>
                    </div>
                    <div>
                      <p className="opacity-75 text-xs">Bajo</p>
                      <p className="font-bold">Potencial de mercado</p>
                    </div>
                  </div>
                </div>

                {/* Recommendations Section */}
                <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-green-500">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    ✓ Recomendaciones Personalizadas
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="font-semibold text-slate-700">🚀 Acción inmediata:</p>
                      <p className="text-slate-600 text-xs mt-1">Aumenta tu tarifa</p>
                    </div>
                  </div>
                </div>

                {/* Growth Strategy */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl shadow-md p-6 border-t-4 border-orange-500">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    🎯 Estrategia de Crecimiento
                  </h3>
                  <p className="text-xs text-slate-600 mb-4">Para maximizar tus ingresos, te recomiendo implementar esta estrategia escalada:</p>
                  
                  <div className="space-y-3 text-xs">
                    <div className="bg-white rounded p-3">
                      <p className="font-semibold text-slate-700">Corto plazo (1-3 meses):</p>
                      <p className="text-slate-600 mt-1">Alcanza tu tarifa objetivo de €48/hora para nuevos.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Interpretation & Comparison */}
              <div className="space-y-6">
                {/* Interpretation Card */}
                <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl shadow-md p-6 border-t-4 border-pink-500">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    🎨 Interpretación del Asistente Virtual
                  </h3>
                  <ul className="space-y-3 text-xs text-slate-700">
                    <li className="flex gap-2">
                      <span className="text-pink-600 font-bold">•</span>
                      <span><span className="font-bold">Basándome</span> con ingresos mensuales actuales de €2,800 y tu tarifa para nuevos clientes.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-pink-600 font-bold">•</span>
                      <span><span className="font-bold">Acción inmediata:</span> Aumenta tu tarifa proyección. Comienza con 4 nuevos clientes, comunica el valor adicional que aportas con tu experiencia de 3 años.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-pink-600 font-bold">•</span>
                      <span><span className="font-bold">Mediano plazo (3-6 meses):</span> Alcanza para especializarte en un nicho elitarios existentes. Enfócate en proyectos de mayor valor para justificar tarifas premium.</span>
                    </li>
                  </ul>
                </div>

                {/* Market Comparison */}
                <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-pink-500">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    📊 Comparativa de Mercado
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Tarifa mínima (Junior):</span>
                      <span className="font-bold text-pink-600">€29/hora</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Tarifa promedio (Mid):</span>
                      <span className="font-bold text-pink-600">€41/hora</span>
                    </div>
                    <div className="flex justify-between items-center bg-purple-50 p-2 rounded border-2 border-purple-200">
                      <span className="text-slate-700 font-semibold">Tu tarifa sugerida (Senior):</span>
                      <span className="font-bold text-purple-600">€{(response.calculation.hourly_rate_usd * 1.2).toFixed(0)}/hora</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Tarifa premium (Expert):</span>
                      <span className="font-bold text-green-600">€87/hora</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {!response && (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-slate-600 text-lg">💡 Completa el formulario para ver recomendaciones personalizadas</p>
          </div>
        )}
      </div>
    </div>
  );
}
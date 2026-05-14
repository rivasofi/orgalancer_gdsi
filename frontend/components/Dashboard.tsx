'use client';

import React from 'react';
import {
  LayoutDashboard,
  FolderOpen,
  Users,
  CheckSquare,
  DollarSign,
  Calculator,
  Zap,
  MessageSquare,
  Settings,
  Star,
  Award,
  ChevronRight,
} from 'lucide-react';

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard' },
  { icon: FolderOpen, label: 'Proyectos' },
  { icon: Users, label: 'Clientes' },
  { icon: CheckSquare, label: 'Tareas' },
  { icon: DollarSign, label: 'Finanzas' },
  { icon: Calculator, label: 'Calculadora IA' },
  { icon: Zap, label: 'Asistente Tarifas', active: true },
  { icon: MessageSquare, label: 'Asistente Virtual' },
  { icon: Settings, label: 'Configuración' },
];

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* ── SIDEBAR ── */}
      <aside className="w-56 flex-shrink-0 flex flex-col bg-gradient-to-b from-indigo-500 to-indigo-700 text-white shadow-xl">
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-6">
          <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
            <Star className="w-5 h-5 text-indigo-600" fill="currentColor" />
          </div>
          <div>
            <p className="font-bold text-sm leading-tight">Orgalancer</p>
            <p className="text-xs text-indigo-200">Gestión Freelance</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(({ icon: Icon, label, active }) => (
            <button
              key={label}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs transition-all ${
                active
                  ? 'bg-white/20 text-white font-semibold border border-white/25'
                  : 'text-indigo-200 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon size={16} className="flex-shrink-0" />
              {label}
            </button>
          ))}
        </nav>

        {/* Plan footer */}
        <div className="m-3 bg-white/15 rounded-2xl p-4 border border-white/20">
          <p className="text-xs text-indigo-200 mb-0.5">Plan Actual</p>
          <p className="font-bold text-sm mb-2">Profesional</p>
          <button className="flex items-center gap-1 text-xs text-indigo-200 hover:text-white transition">
            Actualizar plan <ChevronRight size={12} />
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Sticky header */}
        <header className="bg-white border-b border-gray-100 px-8 py-5 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold bg-gradient-to-r from-violet-600 to-purple-500 bg-clip-text text-transparent tracking-tight">
                ✦ Asistente de Tarifas IA
              </h1>
              <p className="text-gray-400 text-xs mt-0.5">
                Análisis inteligente basado en tu perfil y experiencia
              </p>
            </div>
            <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-xs font-medium border border-green-200">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              Datos cargados desde tu perfil
            </div>
          </div>
        </header>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Welcome banner */}
          <div className="bg-blue-50 rounded-3xl p-5 border border-blue-100 flex items-start gap-5">
            <div className="w-14 h-14 bg-gradient-to-br from-violet-400 to-purple-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md">
              <Award className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">Hola, Juan Pérez 👋</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                He cargado automáticamente tu información de perfil:{' '}
                <strong className="text-gray-900">3 años de experiencia</strong> como{' '}
                <strong className="text-gray-900">Diseñador Freelance en España</strong>. Con tus
                ingresos actuales de <strong className="text-gray-900">€2800</strong> y tarifa de{' '}
                <strong className="text-gray-900">€35/hora</strong>, he preparado un análisis
                completo para optimizar tus tarifas.
              </p>
            </div>
          </div>

          {/* 2-column grid */}
          <div className="grid grid-cols-2 gap-5">
            {/* ── LEFT COLUMN ── */}
            <div className="space-y-5">
              {/* Analysis card */}
              <div className="relative bg-gradient-to-br from-purple-500 via-violet-600 to-blue-600 rounded-3xl p-5 text-white shadow-lg overflow-hidden">
                <div className="absolute -top-6 -right-6 w-28 h-28 bg-white/10 rounded-full pointer-events-none" />
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/5 rounded-full pointer-events-none" />

                <div className="relative z-10">
                  <span className="inline-block text-xs bg-white/20 text-white/90 px-2.5 py-0.5 rounded-full border border-white/20 mb-4">
                    Vista previa
                  </span>

                  {/* Top 3 metrics */}
                  <div className="grid grid-cols-3 gap-2.5 mb-4">
                    <MetricBox label="Tu Tarifa Actual" value="€35" sub="/hora" />
                    <MetricBox label="Tarifa Sugerida" value="€48" sub="/hora" />
                    <MetricBox label="Potencial Aumento Mensual" value="+€2080" sub="por mes" />
                  </div>

                  {/* Bottom 3 metrics */}
                  <div className="grid grid-cols-3 gap-2 text-center pt-1">
                    <div>
                      <p className="text-lg font-bold">3 años</p>
                      <p className="text-xs text-purple-200 mt-0.5">Experiencia</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold">€2,800</p>
                      <p className="text-xs text-purple-200 mt-0.5">Ingresos actuales</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold">Bajo</p>
                      <p className="text-xs text-purple-200 mt-0.5">Posición de mercado</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendations card */}
              <div className="bg-green-50 rounded-3xl p-5 border border-green-200 shadow-sm">
                <span className="inline-block text-xs bg-white text-gray-400 px-2.5 py-0.5 rounded-full border border-gray-200 mb-3">
                  Vista previa
                </span>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-base">✅</span>
                  <h3 className="text-sm font-bold text-gray-900">Recomendaciones Personalizadas</h3>
                </div>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">• Acción inmediata:</span> Aumenta tu tarifa
                </p>
              </div>

              {/* Growth Strategy card */}
              <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-base">🎯</span>
                  <h3 className="text-sm font-bold text-gray-900">Estrategia de Crecimiento</h3>
                </div>
                <p className="text-xs text-gray-500 mb-4">
                  Para maximizar tus ingresos, te recomiendo implementar esta estrategia escalonada:
                </p>
                <div className="space-y-2.5">
                  <StrategyBlock phase="Corto plazo (1-3 meses):" shade="light">
                    Alcanza tu tarifa objetivo de{' '}
                    <strong className="text-amber-700">€48/hora</strong> para nuevos.
                  </StrategyBlock>
                  <StrategyBlock phase="Mediano plazo (3-6 meses):" shade="light">
                    Establece asociaciones con clientes corporativos de mayor presupuesto.
                  </StrategyBlock>
                  <StrategyBlock phase="Largo plazo (6+ meses):" shade="medium">
                    Alcanza <strong className="text-amber-700">€62+/hora</strong> especializándote
                    en servicios premium y desarrolla un portafolio de casos de éxito.
                  </StrategyBlock>
                </div>
              </div>
            </div>

            {/* ── RIGHT COLUMN ── */}
            <div className="space-y-5">
              {/* Interpretation card */}
              <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-sm">
                    ✨
                  </div>
                  <h3 className="text-sm font-bold text-gray-900">
                    Interpretación del Asistente Virtual
                  </h3>
                </div>

                <ul className="space-y-3.5">
                  <InterpBullet>
                    Basándome con ingresos mensuales actuales <strong>€2,800</strong> y tu tarifa
                    de <strong>€40/hora</strong> para nuevos clientes.
                  </InterpBullet>
                  <InterpBullet>
                    <strong>Acción inmediata:</strong>{' '}
                    <span className="text-gray-600">
                      Aumenta tu tarifa proyección. Comienza con 4 nuevos clientes, comunica el
                      valor adicional que aportas con tu experiencia de 3 años.
                    </span>
                  </InterpBullet>
                  <InterpBullet>
                    <strong>Medao plazo (3-16 meses):</strong>{' '}
                    <span className="text-gray-600">
                      Alcanza para especializate en un nicho elitorales existentes. Enfócate en
                      proyectos de mayor valor para justiguir tarifas premium.
                    </span>
                  </InterpBullet>
                </ul>
              </div>

              {/* Market Comparison card */}
              <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-5">
                  <span className="text-base">📊</span>
                  <h3 className="text-sm font-bold text-gray-900">Comparativa de Mercado</h3>
                </div>

                <div className="space-y-4">
                  <MarketBar
                    label="Tarifa mínima (Junior):"
                    value="€29/hora"
                    pct={47}
                    gradient="from-pink-400 to-rose-400"
                    valueClass="text-pink-600"
                  />
                  <MarketBar
                    label="Tarifa promedio (Mid):"
                    value="€41/hora"
                    pct={66}
                    gradient="from-pink-500 to-purple-500"
                    valueClass="text-purple-600"
                  />
                  <MarketBar
                    label="Tu tarifa sugerida (Senior):"
                    value="€48/hora"
                    pct={77}
                    gradient="from-purple-500 to-purple-600"
                    valueClass="text-purple-700"
                    bold
                  />
                  <MarketBar
                    label="Tarifa premium (Expert):"
                    value="€62/hora"
                    pct={100}
                    gradient="from-purple-600 to-indigo-600"
                    valueClass="text-indigo-600"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ── Sub-components ── */

function MetricBox({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 border border-white/20">
      <p className="text-xs text-purple-200 leading-tight mb-1.5">{label}</p>
      <p className="text-2xl font-extrabold leading-none">{value}</p>
      <p className="text-xs text-purple-300 mt-1">{sub}</p>
    </div>
  );
}

function InterpBullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3 text-sm list-none">
      <div className="mt-1.5 flex-shrink-0 w-3.5 h-3.5 rounded-full border-2 border-purple-500 flex items-center justify-center">
        <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
      </div>
      <div className="text-gray-700 leading-relaxed">{children}</div>
    </li>
  );
}

function StrategyBlock({
  phase,
  shade,
  children,
}: {
  phase: string;
  shade: 'light' | 'medium';
  children: React.ReactNode;
}) {
  const bg = shade === 'light' ? 'bg-amber-50 border-amber-200' : 'bg-amber-100 border-amber-300';
  return (
    <div className={`rounded-2xl p-3.5 border ${bg}`}>
      <p className="text-xs font-bold text-gray-800 mb-1">{phase}</p>
      <p className="text-xs text-gray-600 leading-relaxed">{children}</p>
    </div>
  );
}

function MarketBar({
  label,
  value,
  pct,
  gradient,
  valueClass,
  bold = false,
}: {
  label: string;
  value: string;
  pct: number;
  gradient: string;
  valueClass: string;
  bold?: boolean;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className={`text-xs ${bold ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>
          {label}
        </span>
        <span className={`text-xs font-bold ${valueClass}`}>{value}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${gradient} rounded-full`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

"use client";

import { AlertTriangle, Sparkles, Loader2, TrendingUp } from "lucide-react";
import { useTariffCalculator } from "../_hooks/use_tariff_calculator";
import { Input, Button } from "./financial_form";

interface Props {
  user_id: string;
  current_hourly_rate: number;
  coin_type: string;
  profession: string;
  years_of_experience: string | null;
  country: string | null;
}

const COIN_SYMBOL: Record<string, string> = {
  USD: "$", EUR: "€", GBP: "£", ARS: "$",
  MXN: "$", BRL: "R$", CLP: "$", COP: "$", JPY: "¥",
};

export default function TariffCalculator(props: Props) {
  const sym = COIN_SYMBOL[props.coin_type] ?? props.coin_type;
  const { inputs, handleChange, calc, suggestion, streaming, streamError, getSuggestion } =
    useTariffCalculator(props);

  return (
    <div className="space-y-8">
      {/* ── Inputs ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Input
          label="Sueldo pretendido mensual"
          type="number"
          min={0}
          placeholder={`ej: 3000`}
          value={inputs.desired_salary}
          onChange={(e) => handleChange("desired_salary", e.target.value)}
        />
        <Input
          label="Horas disponibles al mes"
          type="number"
          min={1}
          max={744}
          placeholder="160"
          value={inputs.monthly_hours}
          onChange={(e) => handleChange("monthly_hours", e.target.value)}
        />
        <Input
          label="Gastos fijos mensuales"
          type="number"
          min={0}
          placeholder="ej: 500"
          value={inputs.fixed_expenses}
          onChange={(e) => handleChange("fixed_expenses", e.target.value)}
        />
      </div>

      {/* ── Results ── */}
      {calc ? (
        <div className="space-y-5">
          {/* Alert */}
          {calc.below_minimum && (
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800">
                <span className="font-semibold">¡Atención!</span> Tu tarifa actual de{" "}
                <span className="font-semibold">
                  {sym}{props.current_hourly_rate}/hora
                </span>{" "}
                está{" "}
                <span className="font-semibold text-amber-700">
                  {sym}{Math.abs(calc.gap).toFixed(2)} por debajo
                </span>{" "}
                de tu tarifa mínima necesaria. No estás cubriendo todos tus costos.
              </p>
            </div>
          )}

          {/* Main metric */}
          <div className="relative bg-gradient-to-br from-purple-500 via-violet-600 to-blue-600 rounded-3xl p-6 text-white overflow-hidden">
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full pointer-events-none" />
            <p className="text-sm text-purple-200 mb-1">Tarifa mínima necesaria</p>
            <p className="text-5xl font-extrabold mb-1">
              {sym}{calc.min_rate}
              <span className="text-2xl font-medium text-purple-200">/hora</span>
            </p>
            <p className="text-purple-200 text-xs">
              Para cubrir {sym}{inputs.desired_salary} de sueldo + {sym}{inputs.fixed_expenses || "0"} de gastos
            </p>
          </div>

          {/* Breakdown */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Desglose del cálculo
            </p>
            <div className="bg-gray-50 rounded-2xl p-4 space-y-2 text-sm font-mono border border-gray-100">
              <div className="flex justify-between text-gray-600">
                <span>Sueldo pretendido</span>
                <span>{sym}{parseFloat(inputs.desired_salary).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>+ Gastos fijos</span>
                <span>{sym}{(parseFloat(inputs.fixed_expenses) || 0).toLocaleString()}</span>
              </div>
              <div className="border-t border-gray-200 my-1" />
              <div className="flex justify-between text-gray-700 font-semibold">
                <span>= Total mensual</span>
                <span>
                  {sym}
                  {(
                    parseFloat(inputs.desired_salary) + (parseFloat(inputs.fixed_expenses) || 0)
                  ).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>÷ Horas disponibles</span>
                <span>{inputs.monthly_hours} h</span>
              </div>
              <div className="border-t border-gray-200 my-1" />
              <div className="flex justify-between text-purple-700 font-bold text-base">
                <span>= Tarifa mínima/hora</span>
                <span>{sym}{calc.min_rate}</span>
              </div>
            </div>
          </div>

          {/* Time rates */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Por hora", value: `${sym}${calc.min_rate}` },
              { label: "Por día (8 h)", value: `${sym}${calc.daily_rate}` },
              { label: "Por mes", value: `${sym}${calc.monthly_estimated.toLocaleString()}` },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white border border-gray-100 rounded-2xl p-4 text-center shadow-sm">
                <p className="text-xs text-gray-400 mb-1">{label}</p>
                <p className="text-lg font-bold text-gray-800">{value}</p>
              </div>
            ))}
          </div>

          {/* Market tiers */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-purple-500" />
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Referencia de mercado (sobre tarifa mínima)
              </p>
            </div>
            <div className="space-y-2">
              {[
                { level: "Junior", multiplier: "×1.2", rate: calc.junior, color: "text-pink-600", bar: "from-pink-400 to-rose-400", pct: 60 },
                { level: "Mid",    multiplier: "×1.5", rate: calc.mid,    color: "text-purple-600", bar: "from-purple-400 to-violet-500", pct: 75 },
                { level: "Senior", multiplier: "×2.0", rate: calc.senior, color: "text-indigo-600", bar: "from-violet-500 to-indigo-600", pct: 100 },
              ].map(({ level, multiplier, rate, color, bar, pct }) => (
                <div key={level} className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-gray-500 w-14">{level}</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${bar} rounded-full`} style={{ width: `${pct}%` }} />
                  </div>
                  <span className={`text-xs font-bold ${color} w-24 text-right`}>
                    {sym}{rate}/hora
                  </span>
                  <span className="text-xs text-gray-400 w-8">{multiplier}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Suggestion */}
          <div className="border-t border-gray-100 pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-bold text-gray-800">Sugerencia del Asistente IA</p>
                <p className="text-xs text-gray-400">Análisis personalizado de tu posicionamiento</p>
              </div>
              <Button
                type="button"
                onClick={getSuggestion}
                disabled={streaming}
                className="flex items-center gap-2"
              >
                {streaming ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                {streaming ? "Analizando..." : "Obtener sugerencia"}
              </Button>
            </div>

            {streamError && (
              <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                {streamError}
              </p>
            )}

            {(suggestion || streaming) && (
              <div className="bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-100 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-xs">
                    ✨
                  </div>
                  <span className="text-xs font-semibold text-violet-700">Análisis del Asistente</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {suggestion}
                  {streaming && (
                    <span className="inline-block w-0.5 h-4 bg-violet-500 ml-0.5 animate-pulse align-middle" />
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-10 text-gray-400">
          <p className="text-sm">Ingresá tu sueldo pretendido y horas disponibles para ver el cálculo.</p>
        </div>
      )}
    </div>
  );
}

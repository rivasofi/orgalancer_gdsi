"use client";

import { useFinancialForm } from "../_hooks/use_temporal_settings_form";
import { cn } from "./financial_form";
import {
  Calculator,
  AlertCircle,
  Coins,
  Wallet,
  Clock,
  Percent,
  TrendingUp,
} from "lucide-react";

export function FinancesSettings() {
  const { formData, handleChange, suggested } = useFinancialForm();

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        <div className="w-full lg:w-7/12 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
            Datos de entrada
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 flex items-center gap-2">
                <Coins className="w-3.5 h-3.5" /> Moneda
              </label>
              <select
                value={formData.coin_type}
                onChange={(e) => handleChange("coin_type", e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all cursor-pointer"
              >
                {["USD", "EUR", "GBP", "ARS", "MXN", "CLP", "COP", "BRL"].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 flex items-center gap-2">
                <Wallet className="w-3.5 h-3.5" /> Sueldo pretendido
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.desiredSalary}
                  onChange={(e) => handleChange("desiredSalary", e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 pl-8 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="0.00"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
              </div>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-semibold text-gray-500 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" /> Disponibilidad horaria
              </label>
              <div className="flex group">
                <input
                  type="number"
                  value={formData.availableHours}
                  onChange={(e) => handleChange("availableHours", e.target.value)}
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-l-xl p-2.5 text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                />
                <select
                  value={formData.hoursMode}
                  onChange={(e) => handleChange("hoursMode", e.target.value)}
                  className="border border-l-0 border-gray-200 rounded-r-xl bg-gray-100 px-3 text-xs font-bold text-gray-600 uppercase focus:ring-2 focus:ring-purple-500 outline-none cursor-pointer hover:bg-gray-200 transition-colors"
                >
                  <option value="weekly">h / semana</option>
                  <option value="monthly">h / mes</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-semibold text-gray-500 flex items-center gap-2">
                <Percent className="w-3.5 h-3.5" /> Margen de ganancia deseado
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.profit_margin}
                  onChange={(e) => handleChange("profit_margin", e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 pr-10 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs">%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-5/12 h-full">
          {suggested ? (
            <div className={cn(
              "p-8 rounded-2xl border flex flex-col justify-between h-full min-h-[340px] transition-all duration-500",
              suggested.rateStatus === 'low' ? "bg-red-50/50 border-red-100" : 
              suggested.rateStatus === 'high' ? "bg-amber-50/50 border-amber-100" : 
              "bg-purple-50 border-purple-100"
            )}>
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-white rounded-xl shadow-sm">
                    <Calculator className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg leading-tight">Tarifa Sugerida</h3>
                    <p className="text-xs text-gray-500 font-medium">Cálculo basado en tus objetivos</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-end border-b border-black/5 pb-4">
                    <span className="text-sm text-gray-500 font-medium">Tarifa por hora</span>
                    <div className="text-right">
                      <span className="text-xs block text-gray-400 line-through">Base: {suggested.baseRate}</span>
                      <span className="text-3xl font-black text-purple-700">
                        {formData.coin_type} {suggested.suggestedRate}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-500 font-medium">Utilidad neta mensual</span>
                    <span className="font-bold text-gray-700 text-lg">{suggested.monthlyProfit}</span>
                  </div>
                </div>
              </div>

              <div className={cn(
                "mt-6 p-4 rounded-xl flex items-start gap-3",
                suggested.rateStatus === 'low' ? "bg-red-100 text-red-700" : 
                suggested.rateStatus === 'high' ? "bg-amber-100 text-amber-800" : 
                "bg-green-100 text-green-700"
              )}>
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-xs leading-relaxed font-medium">
                  {suggested.rateStatus === 'low' && "Tu tarifa actual es demasiado baja. Para alcanzar tu sueldo pretendido necesitas subir tus precios."}
                  {suggested.rateStatus === 'high' && "Estás cobrando por encima de tu objetivo. Tienes buen margen para negociar."}
                  {suggested.rateStatus === 'ok' && "Tu tarifa actual está bastante alineada con tus expectativas."}
                </p>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[340px] rounded-2xl border border-dashed border-gray-200 flex flex-col items-center justify-center text-center p-8 bg-gray-50/50">
              <TrendingUp className="w-10 h-10 text-gray-300 mb-3" />
              <p className="text-sm text-gray-400 font-medium">Ingresa tus datos para ver el cálculo de rentabilidad</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
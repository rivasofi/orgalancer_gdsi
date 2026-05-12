"use client";

import { useFinancialForm } from "../_hooks/use_temporal_settings_form";
import { cn, Input } from "./financial_form";

import {
  Calculator,
  TrendingUp,
  AlertCircle,
  Info,
} from "lucide-react";

export function FinancesSettings() {
  const {
    formData,
    handleChange,
    suggested,
  } = useFinancialForm();

  const statusStyles = {
    low: "bg-red-50 border-red-200 text-red-800",
    high: "bg-green-50 border-green-200 text-green-800",
    ok: "bg-blue-50 border-blue-200 text-blue-800",
  };

  return (
    <div className="space-y-6">
      <div>
        <form className="space-y-6">
          <div>
            <label className="text-sm font-medium">Moneda</label>
            <select
              value={formData.coin_type}
              onChange={(e) => handleChange("coin_type", e.target.value)}
              className="w-full border rounded p-2 mt-1"
            >
              {["USD", "EUR", "GBP", "ARS", "MXN", "CLP", "COP", "BRL"].map(
                (c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                )
              )}
            </select>
          </div>

          <Input
            label="Sueldo pretendido"
            type="number"
            value={formData.desiredSalary}
            onChange={(e) => handleChange("desiredSalary", e.target.value)}
          />
        <div className="flex">
            <input
              type="number"
              placeholder="0"
              value={formData.availableHours}
              onChange={(e) => handleChange("availableHours", e.target.value)}
              className="flex-1 border border-gray-300 rounded-l-xl p-2.5 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
            />
            <select
              value={formData.hoursMode}
              onChange={(e) => handleChange("hoursMode", e.target.value)}
              className="border border-l-0 border-gray-300 rounded-r-xl bg-gray-50 px-3 text-sm font-medium text-gray-600 focus:ring-2 focus:ring-orange-500 outline-none cursor-pointer"
            >
              <option value="weekly">h / semana</option>
              <option value="monthly">h / mes</option>
            </select>
          </div>

          <Input
            label="Margen de ganancia (%)"
            type="number"
            value={formData.profit_margin}
            onChange={(e) => handleChange("profit_margin", e.target.value)}
          />
        </form>
      </div>

      {suggested && (
        <div
          className={cn("border rounded-xl p-6 transition-all", statusStyles[suggested.rateStatus])}
          >
          <div className="flex items-center gap-2 mb-3">
            <Calculator className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-blue-900">
              Tarifa sugerida
            </h3>
          </div>

          {suggested.rateStatus === "low" && (
          <div className="flex items-center gap-2 text-red-600 text-sm mb-3">
            <AlertCircle className="w-4 h-4" />
            El valor sugerido es significativamente más alto que tu tarifa actual
          </div>
        )}

        {suggested.rateStatus === "high" && (
          <div className="flex items-center gap-2 text-yellow-700 text-sm mb-3">
            <AlertCircle className="w-4 h-4" />
            El valor sugerido es significativamente más bajo que tu tarifa actual
          </div>
        )}

          <p className="text-sm text-gray-600">
            Base: <strong>{suggested.baseRate}</strong> / hora
          </p>

          <p className="text-lg font-bold text-blue-700 mt-2">
            Sugerida: {suggested.suggestedRate} / hora
          </p>

          <p className="text-xs text-gray-500 mt-2">
            Ganancia mensual estimada: {suggested.monthlyProfit}
          </p>
        </div>
      )}
    </div>
  );
}
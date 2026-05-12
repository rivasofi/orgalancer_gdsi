"use client";

import * as React from "react";
import { CheckCircle2 } from "lucide-react";
import { type FinancialSettings } from "../_hooks/use_financial_form";

export function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function Input({
  label,
  className,
  value,
  ...props
}: React.ComponentProps<"input"> & { label: string }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1.5">
        {label}
      </label>

      <input
        {...props}
        value={value ?? ""}
        className={cn(
          "w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition",
          className,
        )}
      />
    </div>
  );
}

export function Button({ className, ...props }: React.ComponentProps<"button">) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

function ButtonSecondary({ className, ...props }: React.ComponentProps<"button">) {
  return (
    <button
      className={cn(
        "px-6 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition",
        className,
      )}
      {...props}
    />
  );
}

export default function FinancialForm(props: FinancialSettings) {
  return (
    <>
      {!props.editing ? (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
              <p className="text-xs font-medium text-gray-500 mb-1">Moneda</p>
              <p className="text-sm font-semibold text-gray-800">
                {props.formData.coin_type || "—"}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
              <p className="text-xs font-medium text-gray-500 mb-1">Tarifa por hora</p>
              <p className="text-sm font-semibold text-gray-800">
                {props.formData.hourly_rate ? `${props.formData.coin_type} ${props.formData.hourly_rate}` : "—"}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
              <p className="text-xs font-medium text-gray-500 mb-1">Margen de ganancia</p>
              <p className="text-sm font-semibold text-gray-800">
                {props.formData.profit_margin ? `${props.formData.profit_margin}%` : "—"}
              </p>
            </div>
          </div>

          <div className="pt-2">
            <Button onClick={() => props.setEditing(true)}>
              Editar
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={props.handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                Moneda
              </label>
              <select
                name="coin_type"
                value={props.formData.coin_type || "USD"}
                onChange={(e) =>
                  props.setFormData({ ...props.formData, coin_type: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition appearance-none"
              >
                <option value="USD">USD — Dólar estadounidense</option>
                <option value="EUR">EUR — Euro</option>
                <option value="ARS">ARS — Peso argentino</option>
                <option value="BRL">BRL — Real brasileño</option>
                <option value="CLP">CLP — Peso chileno</option>
                <option value="COP">COP — Peso colombiano</option>
                <option value="MXN">MXN — Peso mexicano</option>
              </select>
            </div>

            <Input
              label="Tarifa por hora"
              name="hourly_rate"
              type="number"
              min={0}
              value={props.formData.hourly_rate}
              onChange={(e) =>
                  props.setFormData({ ...props.formData, hourly_rate: e.target.value })
                }
              placeholder="ej: 25"
            />

            <Input
              label="Margen de ganancia (%)"
              name="profit_margin"
              type="number"
              min={0}
              max={99}
              value={props.formData.profit_margin}
              onChange={(e) =>
                  props.setFormData({ ...props.formData, profit_margin: e.target.value })
                }
              placeholder="ej: 30"
            />
          </div>

          {props.saved && (
            <div className="flex items-center gap-2 text-emerald-600 text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>Configuración guardada correctamente.</span>
            </div>
          )}

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-gray-100">
            <ButtonSecondary
              type="button"
              onClick={() => {
                props.setFormData(props.originalData);
                props.setEditing(false);
              }}
            >
              Cancelar
            </ButtonSecondary>
            <Button type="submit">
              Guardar
            </Button>
          </div>
        </form>
      )}
    </>
  );
}
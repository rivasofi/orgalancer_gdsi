"use client";

import FinancesHeader from "./_components/finances_header";
import FinancesShell from "./_components/finances_shell";
import FinancialForm from "./_components/financial_form";
import { FinancesSettings } from "./_components/temporal_settings_form";

import { useFinancialForm } from "./_hooks/use_financial_form";

export default function FinancesPage() {
  const form = useFinancialForm();

  return (
    <>
      <FinancesHeader
        title="Finanzas"
        subtitle="Configurá tus datos para calcular tarifas"
      />
      <div className="flex flex-col gap-10 px-4">
        
        <div className="max-w-2xl w-full">
          <FinancesShell title="Configuración Financiera">
            <FinancialForm {...form} />
          </FinancesShell>
        </div>

        <div className="w-full">
          <FinancesShell title="Calculadora de Tarifas">
            <FinancesSettings />
          </FinancesShell>
        </div>

      </div>
    </>
  );
}
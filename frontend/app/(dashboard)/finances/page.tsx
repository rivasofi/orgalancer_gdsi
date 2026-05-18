"use client";

import { Wallet } from "lucide-react";
import SectionHeader from "./../_components/section_header"
import FinancesShell from "./_components/finances_shell";
import FinancialForm from "./_components/financial_form";
import { FinancesSettings } from "./_components/temporal_settings_form";

import { useFinancialForm } from "./_hooks/use_financial_form";

export default function FinancesPage() {
  const form = useFinancialForm();

  return (
    <>
      <SectionHeader
        title="Finanzas"
        subtitle="Configurá tus datos para calcular tarifas"
        icon={<Wallet className="w-8 h-8 text-indigo-600"/>}
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
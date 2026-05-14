"use client";

// // Profile form UI. Renders all input fields and delegates logic to useProfileForm.

import { Mail, Briefcase, Phone, Globe, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useProfileForm } from "../_hooks/use_profile_form";

const YEARS_OPTIONS = ["0-1", "1-3", "3-5", "5-10", "10+"] as const;
const COUNTRIES = ["Argentina", "Australia", "Brasil", "Canadá", "Chile", "Colombia", "Francia", "Alemania", "Italia", "México", "Perú", "Portugal", "España", "UK", "USA", "Otro"];

export interface ProfileData {
  id: string;
  full_name: string;
  email: string;
  profession: string;
  avatar_url?: string | null;
  phone?: string | null;
  country?: string | null;
  specialty?: string | null;
  years_of_experience?: string | null;
  completion_percentage: number;
}

function inputCls(disabled = false) {
  return [
    "w-full px-4 py-2.5 border rounded-xl text-sm transition",
    disabled
      ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
      : "border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent",
  ].join(" ");
}

export default function ProfileForm({ profile, onUpdate }: { profile: ProfileData; onUpdate: (u: Partial<ProfileData>) => void }) {
  const { state, actions } = useProfileForm(profile, onUpdate);

  return (
    <div>
      {state.missingFields.length > 0 && (
        <div className="mb-8 p-5 bg-amber-50 border border-amber-200 rounded-2xl shadow-sm">
          <h3 className="text-sm font-bold text-amber-900 mb-3 flex items-center gap-2">
            <AlertCircle size={18} className="text-amber-600" />
            Sugerencias para completar tu perfil
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {state.missingFields.map(f => (
              <li key={f.label} className="bg-white/50 p-2.5 rounded-lg border border-amber-100">
                <p className="text-xs font-bold text-amber-800">{f.label}</p>
                <p className="text-[11px] text-amber-700 leading-tight">{f.tip}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Nombre/s</label>
          <input type="text" value={state.firstName} onChange={(e) => actions.setFirstName(e.target.value)} placeholder="Juan" className={inputCls()} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Apellido/s</label>
          <input type="text" value={state.lastName} onChange={(e) => actions.setLastName(e.target.value)} placeholder="López" className={inputCls()} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Mail</label>
          <div className="relative">
            <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input type="email" value={profile.email} readOnly className={`${inputCls(true)} pl-9`} />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Teléfono</label>
          <div className="relative">
            <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input type="tel" value={state.phone} onChange={(e) => actions.setPhone(e.target.value)} placeholder="+1 234 567 890" className={`${inputCls()} pl-9`} />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Profesión</label>
          <div className="relative">
            <Briefcase size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input type="text" value={state.profession} onChange={(e) => actions.setProfession(e.target.value)} className={`${inputCls()} pl-9`} />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">País</label>
          <div className="relative">
            <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <select value={state.country} onChange={(e) => actions.setCountry(e.target.value)} className={`${inputCls()} pl-9 appearance-none`}>
              <option value="">Seleccionar país</option>
              {COUNTRIES.map((c) => (<option key={c} value={c}>{c}</option>))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Especialidad</label>
          <input type="text" value={state.specialty} onChange={(e) => actions.setSpecialty(e.target.value)} placeholder="ej.: Diseñador UI/UX..." className={inputCls()} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Años de experiencia</label>
          <select value={state.yearsExp} onChange={(e) => actions.setYearsExp(e.target.value)} className={`${inputCls()} appearance-none`}>
            <option value="">Seleccionar rango</option>
            {YEARS_OPTIONS.map((y) => (<option key={y} value={y}>{y} años</option>))}
          </select>
        </div>
      </div>

      {state.error && <p className="mt-4 text-sm text-red-500">{state.error}</p>}
      {state.success && (
        <p className="mt-4 text-sm text-emerald-600 flex items-center gap-1.5">
          <CheckCircle2 size={14} />
          Los datos del perfil se actualizaron correctamente.
        </p>
      )}

      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
        <button type="button" onClick={actions.resetFields} disabled={state.saving} className="px-6 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition">
          Cancelar
        </button>
        <button type="button" onClick={actions.handleSave} disabled={state.saving} className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition disabled:opacity-50">
          {state.saving ? <><Loader2 size={14} className="animate-spin" /> Guardando…</> : "Guardar"}
        </button>
      </div>
    </div>
  );
}
import Link from "next/link";
import PasswordStrength from "./password_strength";
import type { useRegisterForm } from "../_hooks/use_register_form";

type Props = ReturnType<typeof useRegisterForm>;

export default function RegisterForm({
  fields,
  accepted,
  set_accepted,
  error,
  email_error,
  loading,
  handle_change,
  handle_email_change,
  handle_submit,
}: Props) {
  return (
    <>
      {/* Logo */}
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-md">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" fill="white" />
            <path d="M19 15L19.8 17.2L22 18L19.8 18.8L19 21L18.2 18.8L16 18L18.2 17.2L19 15Z" fill="white" opacity="0.7" />
          </svg>
        </div>
      </div>

      {/* Header */}
      <h1 className="text-2xl font-bold text-center text-violet-700 mb-1">Únete a Orgalancer</h1>
      <p className="text-sm text-center text-gray-400 mb-7">Crea tu cuenta en segundos</p>

      {/* Error global */}
      {error && (
        <div className="mb-4 text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-4 py-2 text-center">
          {error}
        </div>
      )}

      <form onSubmit={handle_submit} className="space-y-4">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </span>
            <input
              type="text"
              name="full_name"
              placeholder="Juan Pérez"
              value={fields.full_name}
              onChange={handle_change}
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-400 placeholder-gray-300"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </span>
            <input
              type="email"
              name="email"
              placeholder="tu@email.com"
              value={fields.email}
              onChange={handle_email_change}
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-400 placeholder-gray-300"
            />
            {email_error && <p className="text-xs text-red-500 mt-1">{email_error}</p>}
          </div>
        </div>

        {/* Profesión */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Profesión</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                <rect x="2" y="7" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </span>
            <input
              type="text"
              name="profession"
              placeholder="Diseñador, Desarrollador, etc."
              value={fields.profession}
              onChange={handle_change}
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-400 placeholder-gray-300"
            />
          </div>
        </div>

        {/* Contraseña */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </span>
            <input
              type="password"
              name="password"
              placeholder="Mínimo 8 caracteres"
              value={fields.password}
              onChange={handle_change}
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-400 placeholder-gray-300"
            />
          </div>
          <PasswordStrength password={fields.password} />
        </div>

        {/* Checkbox */}
        <div className="flex items-start gap-2 pt-1">
          <input
            type="checkbox"
            id="terms"
            checked={accepted}
            onChange={(e) => set_accepted(e.target.checked)}
            className="mt-0.5 accent-violet-600 w-4 h-4 cursor-pointer"
          />
          <label htmlFor="terms" className="text-sm text-gray-500 leading-snug">
            Acepto los{" "}
            <Link href="/terms" className="text-violet-600 font-medium hover:underline">términos y condiciones</Link>
            {" "}y la{" "}
            <Link href="/privacy" className="text-violet-600 font-medium hover:underline">política de privacidad</Link>
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-500 text-white font-semibold text-sm shadow hover:opacity-90 transition-opacity disabled:opacity-60 mt-2"
        >
          {loading ? "Creando cuenta..." : "Crear cuenta gratis"}
        </button>
      </form>

      <p className="text-sm text-center text-gray-400 mt-5">
        ¿Ya tenés una cuenta?{" "}
        <Link href="/login" className="text-violet-700 font-semibold hover:underline">Inicia sesión</Link>
      </p>
    </>
  );
}
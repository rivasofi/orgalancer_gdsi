import Link from "next/link";
import type { useLoginForm } from "../_hooks/use_login_form";

type Props = ReturnType<typeof useLoginForm>;

export default function LoginForm({
  fields,
  error,
  loading,
  success,
  handle_change,
  handle_submit,
}: Props) {
  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Bienvenido de nuevo!</h2>
        <p className="text-gray-500 text-center mb-6">Iniciando sesión...</p>
      </div>
    );
  }

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
      <h1 className="text-2xl font-bold text-center text-violet-700 mb-1">Bienvenido de nuevo</h1>
      <p className="text-sm text-center text-gray-400 mb-7">Inicia sesión para continuar</p>

      {/* Error global */}
      {error && (
        <div className="mb-4 text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-4 py-2 text-center">
          {error}
        </div>
      )}

      <form onSubmit={handle_submit} className="space-y-4">
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
              placeholder="Contraseña"
              value={fields.password}
              onChange={handle_change}
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-400 placeholder-gray-300"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-500 text-white font-semibold text-sm shadow hover:opacity-90 transition-opacity disabled:opacity-60 mt-6"
        >
          {loading ? "Iniciando sesión..." : "Iniciar sesión"}
        </button>
      </form>

      <p className="text-sm text-center text-gray-400 mt-5">
        ¿No tienes cuenta?{" "}
        <Link href="/register" className="text-violet-700 font-semibold hover:underline">Crear cuenta</Link>
      </p>
    </>
  );
}

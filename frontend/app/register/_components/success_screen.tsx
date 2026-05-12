import Link from "next/link";

export default function SuccessScreen() {
  return (
    <div className="py-4 text-center">
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 13l4 4L19 7"
              stroke="#16a34a"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Te registraste!</h2>
      <p className="text-gray-400 text-sm mb-6">
        Tu cuenta fue creada con éxito. Ya podés iniciar sesión.
      </p>
      <Link
        href="/login"
        className="inline-block w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-500 text-white font-semibold text-sm shadow hover:opacity-90 transition-opacity"
      >
        Ir a iniciar sesión
      </Link>
    </div>
  );
}
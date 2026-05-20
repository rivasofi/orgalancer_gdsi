"use client";

import LoginForm from "./_components/login_form";
import { useLoginForm } from "./_hooks/use_login_form";

export default function LoginPage() {
  const form = useLoginForm();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-white to-pink-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md px-8 py-10">
        <LoginForm {...form} />
      </div>
      <p className="text-sm text-gray-400 mt-6">
        Gestiona tu negocio freelance de forma profesional
      </p>
    </main>
  );
}
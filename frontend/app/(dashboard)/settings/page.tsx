"use client";

import { useEffect, useState } from "react";
import {
  User,
  Bell,
  CreditCard,
  SlidersHorizontal,
  Shield,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { getUser } from "./../../_hooks/get_user";
import AvatarUpload from "./_components/avatar_upload";
import ProfileForm, { type ProfileData } from "./_components/profile_form";

/* ── constants ── */
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const TABS = [
  { id: "profile",       label: "Perfil",       icon: User },
  { id: "notifications", label: "Notificaciones", icon: Bell },
  { id: "billing",       label: "Facturación",       icon: CreditCard },
  { id: "preferences",   label: "Preferencias",   icon: SlidersHorizontal },
  { id: "security",      label: "Seguridad",      icon: Shield },
] as const;

type TabId = (typeof TABS)[number]["id"];

/* ── page ── */
export default function SettingsPage() {
  const user = getUser();
  const [activeTab, setActiveTab] = useState<TabId>("profile");
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setFetchError(null);
        const res = await fetch(`${API_BASE}/users/me/${user.id}`);
        if (!res.ok) throw new Error(`Server responded ${res.status}`);
        const data: ProfileData = await res.json();
        if (!cancelled) setProfile(data);
      } catch {
        if (!cancelled) setFetchError("No se pudo cargar el perfil. Por favor, intenta nuevamente.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [user?.id]);

  const handleProfileUpdate = (updated: Partial<ProfileData>) =>
    setProfile((prev) => (prev ? { ...prev, ...updated } : prev));

  const handleAvatarSuccess = (url: string) =>
    handleProfileUpdate({ avatar_url: url });

  /* ── layout ── */
  return (
    <div className="min-h-full bg-white p-6 lg:p-10">

      {/* Page header */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Sparkles size={22} className="text-purple-500" />
          Configuración
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Personaliza tu experiencia en Orgalancer
        </p>
      </header>

      <div className="flex flex-col lg:flex-row gap-6 items-start">

        {/* ── Left nav ── */}
        <nav className="w-full lg:w-52 shrink-0 bg-white rounded-2xl shadow-sm p-2">
          {TABS.map(({ id, label, icon: Icon }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={[
                  "flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                  active
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md shadow-purple-200"
                    : "text-gray-600 hover:bg-purple-50 hover:text-purple-700",
                ].join(" ")}
              >
                <Icon size={16} strokeWidth={active ? 2.5 : 2} />
                {label}
              </button>
            );
          })}
        </nav>

        {/* ── Main panel ── */}
        <main className="flex-1 min-w-0">

          {/* ─ Profile tab ─ */}
          {activeTab === "profile" && (
            <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
              <h2 className="text-base font-semibold text-purple-600 mb-6">
                Información Personal
              </h2>

              {/* Loading skeleton */}
              {loading && (
                <div className="space-y-4 animate-pulse">
                  {/* avatar row */}
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-20 h-20 rounded-full bg-gray-200" />
                    <div className="space-y-2">
                      <div className="h-8 w-32 rounded-lg bg-gray-200" />
                      <div className="h-3 w-44 rounded bg-gray-100" />
                    </div>
                  </div>
                  {/* grid */}
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-10 rounded-xl bg-gray-100" />
                  ))}
                </div>
              )}

              {/* Error state */}
              {!loading && fetchError && (
                <div className="flex items-center gap-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                  <AlertCircle size={16} className="shrink-0" />
                  {fetchError}
                </div>
              )}

              {/* Profile content */}
              {!loading && profile && (
                <>
                  {/* Completion bar */}
                  <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100">
                    <div className="flex justify-between text-xs font-medium text-gray-600 mb-1.5">
                      <span>Porcentaje de finalización del perfil</span>
                      <span className="text-purple-600">{profile.completion_percentage}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-700"
                        style={{ width: `${profile.completion_percentage}%` }}
                      />
                    </div>
                  </div>

                  <AvatarUpload
                    userId={profile.id}
                    fullName={profile.full_name}
                    avatarUrl={profile.avatar_url}
                    onUploadSuccess={handleAvatarSuccess}
                  />

                  <ProfileForm profile={profile} onUpdate={handleProfileUpdate} />
                </>
              )}
            </div>
          )}

          {/* ─ Coming-soon tabs ─ */}
          {activeTab !== "profile" && (
            <div className="bg-white rounded-2xl shadow-sm p-8 flex flex-col items-center justify-center min-h-64 text-center gap-2">
              <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center mb-2">
                {(() => {
                  const tab = TABS.find((t) => t.id === activeTab);
                  const Icon = tab?.icon ?? Bell;
                  return <Icon size={22} className="text-purple-400" />;
                })()}
              </div>
              <p className="text-gray-700 font-medium capitalize">{activeTab}</p>
              <p className="text-sm text-gray-400">Sección en desarrollo.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
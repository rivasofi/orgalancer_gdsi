import StatCard from "./_components/stat_card";
import PendingTasks from "./_components/pending_tasks";
import PaymentReminders from "./_components/payment_reminders";
import SectionHeader from "./../_components/section_header";

const stats = [
  {
    icon_bg: "bg-emerald-500",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.5" />
        <path d="M12 7v1M12 16v1M9 9.5c0-1.1.9-2 2-2h2a2 2 0 0 1 0 4h-2a2 2 0 0 0 0 4h2a2 2 0 0 0 2-2" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    label: "Ingresos del Mes",
    value: "$4,250",
    badge: "+12%",
  },
  {
    icon_bg: "bg-blue-500",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
        <circle cx="9" cy="7" r="3" stroke="white" strokeWidth="1.5" />
        <path d="M2 20c0-3.3 3.1-6 7-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="17" cy="9" r="3" stroke="white" strokeWidth="1.5" />
        <path d="M22 20c0-3.3-2.2-6-5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    label: "Clientes Activos",
    value: "8",
    badge: "+2",
  },
  {
    icon_bg: "bg-violet-500",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
        <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.5" />
      </svg>
    ),
    label: "Tareas Completadas",
    value: "23",
  },
  {
    icon_bg: "bg-pink-500",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="17 6 23 6 23 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    label: "Tarifa/Hora Ideal",
    value: "$45",
  },
];

export default function DashboardPage() {
  return (
    <>
      {/* Header */}
      <SectionHeader 
        title="Dashboard" 
        subtitle="Resumen de tu negocio freelance"
      >
        <button className="bg-gradient-to-r from-violet-600 to-purple-500 text-white text-sm font-semibold px-5 py-3 rounded-xl shadow hover:opacity-90 transition-opacity">
          Generar Presupuesto
        </button>
      </SectionHeader>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Bottom grid */}
      <div className="grid grid-cols-2 gap-6">
        <PendingTasks />
        <PaymentReminders />
      </div>
    </>
  );
}
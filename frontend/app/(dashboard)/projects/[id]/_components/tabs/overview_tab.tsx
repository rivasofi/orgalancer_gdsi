import { ProjectDetail } from "../../_hooks/use_project_detail";

const CONTRACT_LABELS: Record<ProjectDetail["contract_type"], string> = {
  hourly:      "Por hora",
  fixed_price: "Precio fijo",
  retainer:    "Retainer",
};

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

interface Props {
  project: ProjectDetail;
}

export default function OverviewTab({ project }: Props) {
  return (
    <>
      {/* Description */}
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-1">
          Descripción del Proyecto
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed">
          {project.description || "Sin descripción."}
        </p>
      </div>
      <hr className="border-gray-100" />

      {/* Two-column section */}
      <div className="grid grid-cols-2 gap-8 pt-2">
        {/* Details */}
        <div>
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Detalles</h3>
          <div className="space-y-4">
            <DetailRow icon={<CalendarIcon />} label="Fecha de inicio"  value={formatDate(project.start_date)} />
            <DetailRow icon={<CalendarIcon />} label="Fecha de entrega" value={formatDate(project.deadline)} />
            {project.client_name && (
              <DetailRow icon={<ClientIcon />} label="Cliente" value={project.client_name} />
            )}
            <DetailRow icon={<ContractIcon />} label="Tipo de contrato" value={CONTRACT_LABELS[project.contract_type]} />
          </div>
        </div>

        {/* Progress */}
        <div>
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Progreso</h3>

          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-gray-500">Completado</span>
              <span className="font-semibold text-violet-600">
                {project.progress_percentage}%
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-purple-400 rounded-full transition-all duration-500"
                style={{ width: `${project.progress_percentage}%` }}
              />
            </div>
          </div>

          <div className="flex justify-between items-center py-2.5 border border-gray-100 rounded-xl px-3 bg-gray-50">
            <span className="text-sm text-gray-500">Tareas completadas</span>
            <span className="text-sm font-semibold text-violet-700 bg-violet-100 px-2.5 py-0.5 rounded-full">
              {project.completed_tasks} / {project.total_tasks}
            </span>
          </div>

          {project.days_until_deadline !== null &&
            project.days_until_deadline >= 0 && (
              <div className="flex justify-between items-center py-2.5 border border-gray-100 rounded-xl px-3 bg-gray-50 mt-2">
                <span className="text-sm text-gray-500">Días restantes</span>
                <span
                  className={`text-sm font-semibold px-2.5 py-0.5 rounded-full ${
                    project.days_until_deadline <= 3
                      ? "text-red-600 bg-red-100"
                      : project.days_until_deadline <= 7
                      ? "text-yellow-700 bg-yellow-100"
                      : "text-violet-700 bg-violet-100"
                  }`}
                >
                  {project.days_until_deadline}d
                </span>
              </div>
            )}
        </div>
      </div>
    </>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 text-violet-400 shrink-0">{icon}</span>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-medium text-gray-800">{value}</p>
      </div>
    </div>
  );
}

function CalendarIcon() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
      <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ClientIcon() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function ContractIcon() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
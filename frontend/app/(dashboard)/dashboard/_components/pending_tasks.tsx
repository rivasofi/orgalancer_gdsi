const PRIORITY_STYLES: Record<string, string> = {
  Alta:  "bg-red-500 text-white",
  Media: "bg-yellow-400 text-white",
  Baja:  "bg-green-500 text-white",
};

interface Task {
  title: string;
  due: string;
  priority: "Alta" | "Media" | "Baja";
}

const tasks: Task[] = [
  { title: "Diseño de logo para Cliente A", due: "Vence: Hoy",     priority: "Alta"  },
  { title: "Revisión de propuesta",         due: "Vence: Mañana",  priority: "Media" },
  { title: "Reunión con Cliente B",         due: "Vence: 3 días",  priority: "Baja"  },
];

export default function PendingTasks() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-violet-600 font-bold text-base mb-4">Tareas Pendientes</h2>
      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.title}
            className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-violet-100 hover:bg-violet-50/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="text-gray-300 shrink-0">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
                <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <div>
                <p className="text-gray-700 text-sm font-medium">{task.title}</p>
                <p className="text-gray-400 text-xs">{task.due}</p>
              </div>
            </div>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${PRIORITY_STYLES[task.priority]}`}>
              {task.priority}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

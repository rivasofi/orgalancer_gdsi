"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, Pencil, Plus } from "lucide-react";
import { ProjectDetail } from "../_hooks/use_project_detail";
import SectionHeader from "../../../_components/section_header";

interface Props {
  project: ProjectDetail;
  onEditClick: () => void;
  onAddTaskClick: () => void;
}

export default function DetailHeader({ project, onEditClick, onAddTaskClick }: Props) {
  const router = useRouter();

  return (
    <SectionHeader
      icon={<ChevronLeft className="w-8 h-8 text-indigo-600 cursor-pointer hover:text-violet-800 transition-colors" onClick={() => router.back()} />}
      title={project.name}
      subtitle={project.client_name ? `Cliente: ${project.client_name}` : "Sin cliente asignado"}
    >
      <div className="flex items-center gap-2">
        <button
          onClick={onEditClick}
          className="flex items-center gap-2 px-6 py-3 rounded-xl border border-violet-200 text-violet-700 hover:bg-violet-50 transition-all font-medium shadow-sm"
        >
          <Pencil className="w-5 h-5" /> Editar
        </button>
        <button
          onClick={onAddTaskClick}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all font-medium shadow-sm"
        >
          <Plus className="w-5 h-5" /> Agregar Tarea
        </button>
      </div>
    </SectionHeader>
  );
}
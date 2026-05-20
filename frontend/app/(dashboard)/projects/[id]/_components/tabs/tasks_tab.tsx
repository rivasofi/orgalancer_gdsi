import TabPlaceholder from "./tab_placeholder";

// TODO: implement TasksTab
//   Props needed : projectId: string, onTaskChange: () => void (to refresh stats in parent)
//   Hook needed  : use_project_tasks.ts -> GET /api/tasks?project_id=[id]
//   Actions      : create task (reuse TaskModal), view detail (reuse TaskDetailModal),
//                  change state, delete — call onTaskChange() after each mutation
//   API routes   : existing /api/tasks (filter by project_id query param)

interface Props {
  projectId: string;
  onTaskChange: () => void;
}

export default function TasksTab({ projectId: _, onTaskChange: __ }: Props) {
  return (
    <TabPlaceholder
      label="Tareas"
      hint="Aquí irá el listado de tareas del proyecto."
    />
  );
}
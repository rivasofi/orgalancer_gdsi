import TabPlaceholder from "./tab_placeholder";

// TODO: implement NotesTab
//   Props needed : projectId: string
//   Hook needed  : use_project_notes.ts -> GET /api/projects/[id]/notes
//   Actions      : create, edit, delete notes
//   API routes   : GET|POST /api/projects/[id]/notes
//                  PUT|DELETE /api/projects/[id]/notes/[noteId]

interface Props {
  projectId: string;
}

export default function NotesTab({ projectId: _ }: Props) {
  return (
    <TabPlaceholder
      label="Notas"
      hint="Aquí irán las notas internas del proyecto."
    />
  );
}
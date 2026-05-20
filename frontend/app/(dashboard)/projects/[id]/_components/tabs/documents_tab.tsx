import TabPlaceholder from "./tab_placeholder";

// TODO: implement DocumentsTab
//   Props needed : projectId: string
//   Hook needed  : use_project_documents.ts -> GET /api/projects/[id]/documents
//   Actions      : upload file, download, delete
//   API routes   : GET|POST /api/projects/[id]/documents
//                  DELETE   /api/projects/[id]/documents/[docId]

interface Props {
  projectId: string;
}

export default function DocumentsTab({ projectId: _ }: Props) {
  return (
    <TabPlaceholder
      label="Documentos"
      hint="Aquí irá la gestión de documentos adjuntos."
    />
  );
}
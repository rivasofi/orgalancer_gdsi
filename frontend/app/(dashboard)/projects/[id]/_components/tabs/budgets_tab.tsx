import TabPlaceholder from "./tab_placeholder";

// TODO: implement BudgetsTab
//   Props needed : projectId: string
//   Hook needed  : use_project_budgets.ts -> GET /api/projects/[id]/budgets
//   Actions      : create, edit, delete budget entries
//   API routes   : GET|POST /api/projects/[id]/budgets
//                  PUT|DELETE /api/projects/[id]/budgets/[budgetId]

interface Props {
  projectId: string;
}

export default function BudgetsTab({ projectId: _ }: Props) {
  return (
    <TabPlaceholder
      label="Presupuestos"
      hint="Aquí irán los presupuestos del proyecto."
    />
  );
}
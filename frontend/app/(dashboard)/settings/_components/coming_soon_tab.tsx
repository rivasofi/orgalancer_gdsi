// Placeholder for unimplemented tabs. Resolves icon and label from TABS by id.

import { TABS, type TabId } from "./settings_nav";
import SettingsShell from "./settings_layout";

interface Props {
  tabId: Exclude<TabId, "profile">;
}

export default function ComingSoonTab({ tabId }: Props) {
  const tab = TABS.find(t => t.id === tabId)!;
  const Icon = tab.icon;
  return (
    <SettingsShell title={tab.label}>
      <div className="flex flex-col items-center justify-center min-h-40 text-center gap-2">
        <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center mb-2">
          <Icon size={22} className="text-purple-400" />
        </div>
        <p className="text-sm text-gray-400">Sección en desarrollo.</p>
      </div>
    </SettingsShell>
  );
}
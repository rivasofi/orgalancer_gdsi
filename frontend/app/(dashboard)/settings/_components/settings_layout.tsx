// Shared card wrapper used by all settings tabs. Accepts a title and children.

interface Props {
  title: string;
  children: React.ReactNode;
}

export default function SettingsShell({ title, children }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.2),0_8px_10px_-6px_rgba(0,0,0,0.1)] p-6 sm:p-8">
      <h2 className="text-base font-semibold text-purple-600 mb-6">{title}</h2>
      {children}
    </div>
  );
}
interface Props {
  label: string;
  hint: string;
}

export default function TabPlaceholder({ label, hint }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center mb-4">
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" className="text-violet-400">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
          <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      <p className="text-base font-semibold text-gray-600 mb-1">{label}</p>
      <p className="text-sm text-gray-400">{hint}</p>
    </div>
  );
}
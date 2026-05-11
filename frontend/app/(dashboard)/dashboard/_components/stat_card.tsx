interface StatCardProps {
  icon: React.ReactNode;
  icon_bg: string;
  label: string;
  value: string;
  badge?: string;
  badge_color?: string;
}

export default function StatCard({
  icon,
  icon_bg,
  label,
  value,
  badge,
  badge_color = "bg-green-100 text-green-600",
}: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${icon_bg}`}>
          {icon}
        </div>
        {badge && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${badge_color}`}>
            {badge}
          </span>
        )}
      </div>
      <p className="text-gray-400 text-sm mb-1">{label}</p>
      <p className="text-violet-700 text-2xl font-bold">{value}</p>
    </div>
  );
}

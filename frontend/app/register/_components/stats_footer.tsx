const STATS = [
  { value: "500+", label: "Freelancers" },
  { value: "15k+", label: "Proyectos" },
  { value: "98%",  label: "Satisfacción" },
];

export default function StatsFooter() {
  return (
    <div className="flex gap-10 mt-8 text-center">
      {STATS.map((stat) => (
        <div key={stat.label}>
          <p className="font-bold text-gray-700">{stat.value}</p>
          <p className="text-xs text-gray-400">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
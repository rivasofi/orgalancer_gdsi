interface Reminder {
  client: string;
  detail: string;
  amount: string;
}

const reminders: Reminder[] = [
  { client: "Cliente A", detail: "5 días de retraso", amount: "$1,200" },
  { client: "Cliente C", detail: "2 días de retraso", amount: "$850"   },
  { client: "Cliente D", detail: "Vence hoy",         amount: "$600"   },
];

export default function PaymentReminders() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-red-500 font-bold text-base mb-4">Recordatorios de Cobro</h2>
      <div className="space-y-3">
        {reminders.map((r) => (
          <div
            key={r.client}
            className="flex items-center justify-between p-4 rounded-xl bg-orange-50 border border-orange-100"
          >
            <div className="flex items-center gap-3">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" className="text-orange-400 shrink-0">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
                <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <div>
                <p className="text-gray-700 text-sm font-medium">{r.client}</p>
                <p className="text-gray-400 text-xs">{r.detail}</p>
              </div>
            </div>
            <span className="text-red-500 font-bold text-sm">{r.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

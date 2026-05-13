'use client';

export default function Sidebar() {
  const menuItems = [
    { icon: '📊', label: 'Dashboard' },
    { icon: '📁', label: 'Proyectos' },
    { icon: '👥', label: 'Clientes' },
    { icon: '✓', label: 'Tareas' },
    { icon: '💰', label: 'Finanzas' },
    { icon: '🧮', label: 'Calculadora IA', active: true },
    { icon: '🎯', label: 'Asistente Tarifas', active: true },
    { icon: '🤖', label: 'Asistente Virtual' },
    { icon: '⚙️', label: 'Configuración' },
  ];

  return (
    <div className="w-56 bg-gradient-to-b from-purple-900 via-purple-800 to-purple-900 text-white p-6 flex flex-col">
      {/* Logo */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 bg-purple-400 rounded-lg flex items-center justify-center text-lg">
            ⭐
          </div>
          <div>
            <h1 className="font-bold text-lg">Orgalancer</h1>
            <p className="text-purple-300 text-xs">Gestión Freelance</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 space-y-1">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all ${
              item.active
                ? 'bg-purple-600 text-white font-semibold'
                : 'text-purple-200 hover:bg-purple-700 hover:text-white'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </nav>

      {/* Plan Section */}
      <div className="mt-auto pt-6 border-t border-purple-700">
        <div className="bg-purple-700 bg-opacity-50 rounded-lg p-4">
          <p className="text-xs text-purple-300">Plan Actual</p>
          <h3 className="font-bold text-white mt-1">Profesional</h3>
          <a href="#" className="text-purple-300 text-xs hover:text-white mt-2 inline-block">
            Actualizar plan →
          </a>
        </div>
      </div>
    </div>
  );
}

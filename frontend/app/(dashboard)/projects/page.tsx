"use client";

import { 
  Plus, X, Briefcase, Calendar, DollarSign, User, TrendingUp, 
  Clock, CheckCircle2, AlertCircle, ArrowLeft, Edit 
} from 'lucide-react';
import { useState } from 'react';
import { useCreateProjectForm } from "./_hooks/create_new_project";

interface Budget {
  id: number;
  name: string;
  amount: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  sentDate?: string;
  acceptedDate?: string;
}

interface ProjectTask {
  id: number;
  name: string;
  status: 'pending' | 'in-progress' | 'completed';
  assignedTo?: string;
  dueDate: string;
  hours: number;
}

interface Document {
  id: number;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  url: string;
}

interface Note {
  id: number;
  author: string;
  date: string;
  content: string;
}

interface Project {
  id: number;
  name: string;
  client: string;
  status: 'planning' | 'in-progress' | 'review' | 'completed' | 'on-hold';
  progress: number;
  budget: number;
  earned: number;
  startDate: string;
  endDate: string;
  description: string;
  tasks: number;
  completedTasks: number;
  budgets?: Budget[];
  projectTasks?: ProjectTask[];
  documents?: Document[];
  notes?: Note[];
}

const mockProjects: Project[] = [
  {
    id: 1,
    name: 'Diseño de Identidad Corporativa',
    client: 'TechStartup SL',
    status: 'in-progress',
    progress: 65,
    budget: 3500,
    earned: 2275,
    startDate: '2026-04-15',
    endDate: '2026-06-15',
    description: 'Creación de logo, paleta de colores y guía de estilo completa',
    tasks: 12,
    completedTasks: 8,
    budgets: [
      { id: 1, name: 'Presupuesto Inicial', amount: 3500, status: 'accepted', sentDate: '2026-04-10', acceptedDate: '2026-04-13' },
      { id: 2, name: 'Revisión Adicional', amount: 800, status: 'sent', sentDate: '2026-05-20' },
    ],
    projectTasks: [
      { id: 1, name: 'Investigación de marca', status: 'completed', dueDate: '2026-04-20', hours: 8 },
      { id: 2, name: 'Bocetos de logo', status: 'completed', dueDate: '2026-04-25', hours: 12 },
      { id: 3, name: 'Diseño final de logo', status: 'completed', dueDate: '2026-05-05', hours: 16 },
      { id: 4, name: 'Paleta de colores', status: 'in-progress', dueDate: '2026-05-15', hours: 6 },
      { id: 5, name: 'Guía de estilo', status: 'in-progress', dueDate: '2026-05-25', hours: 10 },
      { id: 6, name: 'Presentación al cliente', status: 'pending', dueDate: '2026-06-10', hours: 4 },
    ],
    documents: [
      { id: 1, name: 'Brief_del_cliente.pdf', type: 'PDF', size: '2.3 MB', uploadDate: '2026-04-15', url: '#' },
      { id: 2, name: 'Logo_final_v3.ai', type: 'Adobe Illustrator', size: '5.1 MB', uploadDate: '2026-05-06', url: '#' },
      { id: 3, name: 'Paleta_colores.png', type: 'PNG', size: '450 KB', uploadDate: '2026-05-12', url: '#' },
      { id: 4, name: 'Contrato_firmado.pdf', type: 'PDF', size: '1.8 MB', uploadDate: '2026-04-13', url: '#' },
    ],
    notes: [
      { id: 1, author: 'Tú', date: '2026-05-10', content: 'Cliente solicitó ajustes en el tono del azul corporativo. Prefiere algo más vibrante.' },
      { id: 2, author: 'Tú', date: '2026-04-28', content: 'Reunión exitosa. Aprobaron el concepto del logo con modificaciones menores.' },
    ],
  },
  {
    id: 2,
    name: 'Desarrollo Web Responsive',
    client: 'Marketing Pro',
    status: 'in-progress',
    progress: 40,
    budget: 5200,
    earned: 2080,
    startDate: '2026-05-01',
    endDate: '2026-07-30',
    description: 'Sitio web completo con CMS y diseño responsive',
    tasks: 20,
    completedTasks: 8,
    budgets: [
      { id: 3, name: 'Propuesta Desarrollo Web', amount: 5200, status: 'accepted', sentDate: '2026-04-25', acceptedDate: '2026-04-28' },
    ],
    projectTasks: [
      { id: 7, name: 'Análisis de requisitos', status: 'completed', dueDate: '2026-05-05', hours: 6 },
      { id: 8, name: 'Wireframes y mockups', status: 'completed', dueDate: '2026-05-12', hours: 16 },
      { id: 9, name: 'Diseño UI/UX', status: 'in-progress', dueDate: '2026-05-25', hours: 20 },
      { id: 10, name: 'Desarrollo frontend', status: 'in-progress', dueDate: '2026-06-15', hours: 40 },
      { id: 11, name: 'Integración CMS', status: 'pending', dueDate: '2026-07-01', hours: 24 },
      { id: 12, name: 'Testing y optimización', status: 'pending', dueDate: '2026-07-20', hours: 16 },
    ],
    documents: [
      { id: 5, name: 'Especificaciones_tecnicas.pdf', type: 'PDF', size: '3.2 MB', uploadDate: '2026-05-02', url: '#' },
      { id: 6, name: 'Wireframes_v2.fig', type: 'Figma', size: '8.5 MB', uploadDate: '2026-05-13', url: '#' },
      { id: 7, name: 'Contrato_proyecto.pdf', type: 'PDF', size: '2.1 MB', uploadDate: '2026-04-29', url: '#' },
    ],
    notes: [
      { id: 3, author: 'Tú', date: '2026-05-18', content: 'Cliente aprobó los diseños finales. Proceder con desarrollo frontend la próxima semana.' },
    ],
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'planning': return 'bg-gray-100 text-gray-700 border-gray-200';
    case 'in-progress': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'review': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'completed': return 'bg-green-100 text-green-700 border-green-200';
    case 'on-hold': return 'bg-orange-100 text-orange-700 border-orange-200';
    default: return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'planning': return 'Planificación';
    case 'in-progress': return 'En Progreso';
    case 'review': return 'En Revisión';
    case 'completed': return 'Completado';
    case 'on-hold': return 'En Pausa';
    default: return status;
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed': return <CheckCircle2 className="w-4 h-4" />;
    case 'in-progress': return <Clock className="w-4 h-4" />;
    case 'on-hold': return <AlertCircle className="w-4 h-4" />;
    default: return <Briefcase className="w-4 h-4" />;
  }
};

export default function Projects() {
  const [filter, setFilter] = useState<'all' | 'planning' | 'in-progress' | 'review' | 'completed' | 'on-hold'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  const [showForm, setShowForm] = useState(false);
  const { formData, setFormData, handleSubmit, error, saved, loading, clients } = useCreateProjectForm();

  async function onSubmit(e: React.FormEvent) {
    const isSuccess = await handleSubmit(e);
    if (isSuccess) {
        setTimeout(() => {
        setShowForm(false);
        }, 1500);
    }
        
    }

  const filteredProjects = filter === 'all'
    ? mockProjects
    : mockProjects.filter(project => project.status === filter);

  const totalBudget = mockProjects.reduce((sum, p) => sum + p.budget, 0);
  const totalEarned = mockProjects.reduce((sum, p) => sum + p.earned, 0);
  const activeProjects = mockProjects.filter(p => p.status === 'in-progress').length;

  if (selectedProject) {
    return <ProjectDetail project={selectedProject} onBack={() => setSelectedProject(null)} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
            <Briefcase className="w-8 h-8 text-indigo-600" />
            Proyectos
          </h1>
          <p className="text-gray-600 mt-1">Gestiona todos tus proyectos freelance</p>
        </div>
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all font-medium"
        >
          {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          <span>{showForm ? "Cancelar" : "Nuevo Proyecto"}</span>
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={onSubmit}
          className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md space-y-4 adaptive-form transition-all"
        >
          <h2 className="text-lg font-semibold text-gray-800">Nuevo Proyecto</h2>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
              {error}
            </p>
          )}

          {saved && (
            <p className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg px-4 py-2">
              ✓ Proyecto creado correctamente
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del proyecto *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Ej: Rediseño web"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email del cliente *
              </label>
            <select
                value={formData.client_mail}
                onChange={(e) => setFormData((prev) => ({ ...prev, client_mail: e.target.value }))}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Selecciona un cliente</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.email}>
                    {client.name} ({client.email})
                  </option>
                ))}
              </select>
              
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de contrato *
              </label>
              <select
                value={formData.contract_type}
                onChange={(e) => setFormData((prev) => ({ ...prev, contract_type: e.target.value as typeof formData.contract_type }))}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="fixed_price">Precio fijo</option>
                <option value="hourly">Por hora</option>
                <option value="retainer">Retainer</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Presupuesto estimado *
              </label>
              <input
                type="number"
                min={0}
                value={formData.estimated_budget ?? ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, estimated_budget: Number(e.target.value) }))}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha límite
              </label>
              <input
                type="date"
                value={formData.deadline ? formData.deadline.toISOString().split("T")[0] : ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, deadline: e.target.value ? new Date(e.target.value) : null }))}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => {setShowForm(false), formData.name = "", formData.client_mail = "", formData.contract_type = "fixed_price", formData.estimated_budget = null, formData.deadline = null}}
              className="px-5 py-2.5 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 text-sm bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Guardando..." : "Crear proyecto"}
            </button>
          </div>
        </form>
      )}

      {/* Tarjetas de Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-indigo-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-xl shadow-lg">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-gray-600 text-sm mb-1">Proyectos Activos</h3>
          <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{activeProjects}</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl shadow-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-gray-600 text-sm mb-1">Ingresos Generados</h3>
          <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">€{totalEarned.toLocaleString()}</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-xl shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-gray-600 text-sm mb-1">Presupuesto Total</h3>
          <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">€{totalBudget.toLocaleString()}</p>
        </div>
      </div>

      {/* Filtros y Modo de Vista */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex space-x-2">
          {(['all', 'planning', 'in-progress', 'review', 'completed'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-xl transition-all font-medium ${
                filter === status
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                  : 'bg-white/80 text-gray-700 border border-indigo-200 hover:bg-indigo-50'
              }`}
            >
              {status === 'all' ? 'Todos' : getStatusLabel(status)}
            </button>
          ))}
        </div>

        <div className="flex space-x-2 bg-white/80 p-1 rounded-xl border border-indigo-200">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1 rounded-lg transition-all ${
              viewMode === 'grid' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' : 'text-gray-600 hover:bg-indigo-50'
            }`}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1 rounded-lg transition-all ${
              viewMode === 'list' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' : 'text-gray-600 hover:bg-indigo-50'
            }`}
          >
            Lista
          </button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-indigo-100 hover:shadow-xl transition-all hover:scale-[1.02]"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(project.status)}
                  <span className={`px-3 py-1 text-xs rounded-full border font-semibold ${getStatusColor(project.status)}`}>
                    {getStatusLabel(project.status)}
                  </span>
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2">{project.name}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <User className="w-4 h-4 mr-2 text-indigo-500" />
                  <span>{project.client}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2 text-indigo-500" />
                  <span>{new Date(project.startDate).toLocaleDateString('es-ES')} - {new Date(project.endDate).toLocaleDateString('es-ES')}</span>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Progreso</span>
                  <span className="font-semibold text-indigo-600">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                  <span>{project.completedTasks}/{project.tasks} tareas</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-indigo-100">
                <div>
                  <p className="text-xs text-gray-500">Ganado</p>
                  <p className="text-sm font-bold text-green-600">€{project.earned.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Presupuesto</p>
                  <p className="text-sm font-bold text-gray-900">€{project.budget.toLocaleString()}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedProject(project)}
                className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-medium"
              >
                Ver Detalles
              </button>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="space-y-4">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-indigo-100 hover:shadow-xl transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{project.name}</h3>
                    <span className={`px-3 py-1 text-xs rounded-full border font-semibold ${getStatusColor(project.status)}`}>
                      {getStatusLabel(project.status)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{project.description}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="w-4 h-4 mr-2 text-indigo-500" />
                      <span>{project.client}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2 text-indigo-500" />
                      <span>{new Date(project.endDate).toLocaleDateString('es-ES')}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <DollarSign className="w-4 h-4 mr-2 text-green-500" />
                      <span className="font-semibold">€{project.earned.toLocaleString()} / €{project.budget.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <CheckCircle2 className="w-4 h-4 mr-2 text-purple-500" />
                      <span>{project.completedTasks}/{project.tasks} tareas</span>
                    </div>
                  </div>

                  <div className="mt-4 max-w-md">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Progreso del proyecto</span>
                      <span className="font-semibold text-indigo-600">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedProject(project)}
                  className="ml-4 px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-medium whitespace-nowrap"
                >
                  Ver Detalles
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredProjects.length === 0 && (
        <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-2xl border border-indigo-100">
          <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No hay proyectos en esta categoría</p>
        </div>
      )}
    </div>
  );
}

function ProjectDetail({ project, onBack }: { project: Project; onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'budgets' | 'tasks' | 'documents' | 'notes'>('overview');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={onBack} className="p-2 hover:bg-white/50 rounded-xl transition-all">
            <ArrowLeft className="w-6 h-6 text-indigo-600" />
          </button>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {project.name}
            </h1>
            <p className="text-gray-600 mt-1">Cliente: {project.client}</p>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-indigo-100 p-4">
        <div className="flex space-x-2">
          {(['overview', 'budgets', 'tasks', 'documents', 'notes'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl transition-all font-medium capitalize ${
                activeTab === tab ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' : 'text-gray-600 hover:bg-indigo-50'
              }`}
            >
              {tab === 'overview' ? 'Vista General' : tab}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
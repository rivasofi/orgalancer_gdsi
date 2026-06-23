![banner_orgalancer](resources/orgalancer_banner.png)

# Orgalancer

Plataforma de gestión para freelancers. Stack: FastAPI + SQLite + Next.js + Claude AI.

---

## Funcionalidades

- **Dashboard** — resumen general de proyectos, ingresos y tareas pendientes
- **Proyectos** — gestión de proyectos con seguimiento de estado y tareas asociadas
- **Clientes** — base de clientes con historial de proyectos
- **Tareas** — kanban de tareas con etiquetas y estados
- **Tiempo** — registro de horas por proyecto
- **Finanzas** — ingresos, gastos y transacciones
- **Presupuestos** — creación y seguimiento de presupuestos
- **Reportes** — cash flow y rentabilidad por proyecto
- **Notificaciones** — recordatorios y alertas
- **Asistente IA** — chat con Claude AI para consultas y sugerencias
- **Portal de clientes** — vista pública compartible por token para que el cliente vea el avance
- **Configuración** — perfil, avatar y preferencias

---

## Levantar en local (sin Docker)

Necesitás dos terminales abiertas.

### Terminal 1 — Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # completar con tus credenciales
alembic upgrade head
uvicorn main:app --reload
```

Corre en → `http://localhost:8000`  
Docs interactivas → `http://localhost:8000/docs`

### Terminal 2 — Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local   # verificar NEXT_PUBLIC_API_URL
npm run dev
```

Corre en → `http://localhost:3000`

> La base de datos SQLite (`orgalancer.db`) se crea automáticamente en la carpeta `backend/` al levantar el servidor por primera vez.

---

## Levantar con Docker

Asegurate de tener `API_URL=http://backend:8000` en `frontend/.env.local` antes de buildear.

```bash
# Buildear y levantar todo
docker compose up --build

# En background
docker compose up -d --build

# Ver logs
docker compose logs -f

# Detener
docker compose down
```

| Servicio  | Puerto |
|-----------|--------|
| Backend   | 8000   |
| Frontend  | 3000   |

---

## Comandos útiles

```bash
# Activar el venv del backend (cada vez que abrís terminal nueva)
source backend/venv/bin/activate

# Instalar una nueva dependencia en el backend
pip install nombre-paquete
pip freeze > requirements.txt

# Instalar una nueva dependencia en el frontend
cd frontend && npm install nombre-paquete
```

---

## Variables de entorno

### Backend (`backend/.env`)

| Variable | Descripción |
|----------|-------------|
| `DATABASE_URL` | URL de conexión a PostgreSQL (`postgresql://user:pass@host:5432/db`) |
| `SUPABASE_URL` | URL del proyecto Supabase (si aplica) |
| `SUPABASE_KEY` | API key de Supabase |
| `ANTHROPIC_API_KEY` | API key de Anthropic para el asistente IA |

### Frontend (`frontend/.env.local`)

| Variable | Descripción |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | URL del backend (`http://localhost:8000` en local) |

---

## Importante
Si ya usamos `uvicorn main:app --reload` hay que matar el proceso y volver a correr el comando desde backend (no olvidar levantar el venv)
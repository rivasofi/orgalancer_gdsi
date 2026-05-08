# Orgalancer

Plataforma de freelancers. Stack: FastAPI + SQLite + Next.js.

---

## Levantar en local (sin Docker)

Necesitás dos terminales abiertas.

### Terminal 1 — Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Corre en → `http://localhost:8000`  
Docs interactivas → `http://localhost:8000/docs`

### Terminal 2 — Frontend

```bash
cd frontend
npm install
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
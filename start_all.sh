#!/bin/bash

# Script para ejecutar el proyecto completo (backend + frontend)
# Uso: ./start_all.sh

set -e

echo "🚀 Iniciando OrgaLancer (Backend + Frontend)"
echo ""

# Verificar que estamos en el directorio raíz
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Error: No se encontró docker-compose.yml"
    echo "Por favor ejecuta este script desde la raíz del proyecto"
    exit 1
fi

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para mostrar instrucciones
print_backend_instructions() {
    echo ""
    echo -e "${BLUE}📋 BACKEND SETUP${NC}"
    echo ""
    echo "1. Abre una nueva terminal y ejecuta:"
    echo ""
    echo -e "${GREEN}cd backend${NC}"
    echo -e "${GREEN}python -m venv venv${NC}"
    echo -e "${GREEN}source venv/bin/activate  # macOS/Linux${NC}"
    echo -e "${GREEN}# o: venv\\Scripts\\activate  # Windows${NC}"
    echo ""
    echo -e "${GREEN}pip install -r requirements.txt${NC}"
    echo -e "${GREEN}cp .env.example .env${NC}"
    echo ""
    echo "2. Edita el archivo .env con tus credenciales:"
    echo "   - ANTHROPIC_API_KEY=sk-ant-xxxxx"
    echo "   - DATABASE_URL (si usas PostgreSQL local)"
    echo ""
    echo "3. Ejecuta migraciones:"
    echo -e "${GREEN}alembic upgrade head${NC}"
    echo ""
    echo "4. Inicia el servidor:"
    echo -e "${GREEN}uvicorn main:app --reload --host 0.0.0.0 --port 8000${NC}"
    echo ""
}

print_frontend_instructions() {
    echo ""
    echo -e "${BLUE}📋 FRONTEND SETUP${NC}"
    echo ""
    echo "1. Abre otra terminal y ejecuta:"
    echo ""
    echo -e "${GREEN}cd frontend${NC}"
    echo -e "${GREEN}npm install${NC}"
    echo -e "${GREEN}cp .env.local.example .env.local${NC}"
    echo ""
    echo "2. Verifica que .env.local contenga:"
    echo "   NEXT_PUBLIC_API_URL=http://localhost:8000"
    echo ""
    echo "3. Inicia el servidor de desarrollo:"
    echo -e "${GREEN}npm run dev${NC}"
    echo ""
    echo "4. Abre en tu navegador:"
    echo -e "${GREEN}http://localhost:3000${NC}"
    echo ""
}

print_docker_instructions() {
    echo ""
    echo -e "${BLUE}🐳 OPCIÓN ALTERNATIVA: DOCKER${NC}"
    echo ""
    echo "Si prefieres usar Docker (requiere Docker y Docker Compose instalados):"
    echo ""
    echo -e "${GREEN}docker-compose up --build${NC}"
    echo ""
    echo "Esto iniciará:"
    echo "  - Backend en http://localhost:8000"
    echo "  - Frontend en http://localhost:3000"
    echo ""
}

# Mostrar instrucciones
echo -e "${YELLOW}⚠️  IMPORTANTE: Antes de ejecutar, necesitas tener configurado:${NC}"
echo ""
echo "1. Python 3.10+ instalado"
echo "2. Node.js 18+ e npm/yarn instalados"
echo "3. PostgreSQL instalado (o usa Supabase)"
echo "4. API Key de Anthropic (Claude AI)"
echo ""

print_backend_instructions
print_frontend_instructions
print_docker_instructions

echo -e "${GREEN}✅ Instrucciones mostradas${NC}"
echo ""
echo -e "${YELLOW}💡 Tip: Abre múltiples terminales para ejecutar backend y frontend simultáneamente${NC}"

#!/usr/bin/env bash
set -e

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

cleanup() {
    echo ""
    echo -e "${YELLOW}Encerrando servidores...${NC}"
    if [ -n "$BACKEND_PID" ] && kill -0 "$BACKEND_PID" 2>/dev/null; then
        kill "$BACKEND_PID" 2>/dev/null
        wait "$BACKEND_PID" 2>/dev/null
    fi
    if [ -n "$FRONTEND_PID" ] && kill -0 "$FRONTEND_PID" 2>/dev/null; then
        kill "$FRONTEND_PID" 2>/dev/null
        wait "$FRONTEND_PID" 2>/dev/null
    fi
    echo -e "${GREEN}Encerrado.${NC}"
    exit 0
}

trap cleanup SIGINT SIGTERM

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}  SIVA - Sistema de Veiculos Apreendidos    ${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""

# --- Backend setup ---
echo -e "${YELLOW}[1/6] Configurando ambiente virtual do backend...${NC}"
if [ ! -d "$BACKEND_DIR/.venv" ]; then
    python3 -m venv "$BACKEND_DIR/.venv"
fi
source "$BACKEND_DIR/.venv/bin/activate"

echo -e "${YELLOW}[2/6] Instalando dependencias do backend...${NC}"
pip install -r "$BACKEND_DIR/requirements.txt" --quiet

# Criar .env se nao existir
if [ ! -f "$BACKEND_DIR/.env" ]; then
    echo -e "${YELLOW}Criando backend/.env com valores de desenvolvimento...${NC}"
    SECRET=$(python3 -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())")
    cat > "$BACKEND_DIR/.env" <<EOF
DEBUG=True
SECRET_KEY=$SECRET
DATABASE_URL=sqlite:///$BACKEND_DIR/db.sqlite3
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
EOF
    echo -e "${GREEN}.env criado com SQLite (sem necessidade de PostgreSQL)${NC}"
fi

echo -e "${YELLOW}[3/6] Aplicando migracoes...${NC}"
cd "$BACKEND_DIR"
python3 manage.py makemigrations --no-input 2>/dev/null || true
python3 manage.py migrate --no-input

# --- Frontend setup ---
echo -e "${YELLOW}[4/6] Instalando dependencias do frontend...${NC}"
if [ ! -d "$FRONTEND_DIR/node_modules" ]; then
    cd "$FRONTEND_DIR" && npm install --silent
else
    echo -e "${GREEN}node_modules ja existe, pulando npm install.${NC}"
fi

# Criar .env do frontend se nao existir
if [ ! -f "$FRONTEND_DIR/.env" ]; then
    echo "VITE_API_URL=http://localhost:8000/api" > "$FRONTEND_DIR/.env"
fi

# --- Iniciar servidores ---
echo -e "${YELLOW}[5/6] Iniciando backend (porta 8000)...${NC}"
cd "$BACKEND_DIR"
python3 manage.py runserver 0.0.0.0:8000 2>&1 &
BACKEND_PID=$!

echo -e "${YELLOW}[6/6] Iniciando frontend (porta 5173)...${NC}"
cd "$FRONTEND_DIR"
npx vite --host 2>&1 &
FRONTEND_PID=$!

sleep 2

echo ""
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}  Servidores rodando!${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""
echo -e "  Backend:  ${BLUE}http://localhost:8000${NC}"
echo -e "  API Docs: ${BLUE}http://localhost:8000/api/docs${NC}"
echo -e "  Frontend: ${BLUE}http://localhost:5173${NC}"
echo ""
echo -e "  Pressione ${RED}Ctrl+C${NC} para encerrar."
echo ""

wait

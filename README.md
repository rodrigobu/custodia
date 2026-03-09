# Custódia - Sistema de Busca e Apreensão de Veículos

Sistema completo para cadastro e gerenciamento de veículos em processo de busca e apreensão.

## Stack

- **Backend:** Django + Django Ninja + PostgreSQL
- **Frontend:** React + Vite + TypeScript
- **Deploy:** Backend no Render, Frontend na Vercel

## Setup Local

### Pré-requisitos

- Python 3.12+
- Node.js 20+
- PostgreSQL 16+ (ou Docker)

### Com Docker Compose (recomendado)

```bash
docker compose up --build
```

- Backend: http://localhost:8000
- Frontend: http://localhost:5173
- API Docs: http://localhost:8000/api/docs

### Sem Docker

#### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas configurações

# Criar banco e rodar migrações
python manage.py makemigrations
python manage.py migrate

# Rodar servidor
python manage.py runserver
```

#### Frontend

```bash
cd frontend
npm install

# Configurar variáveis de ambiente
cp .env.example .env

# Rodar dev server
npm run dev
```

## Testes

### Backend

```bash
cd backend
pytest
```

### Frontend

```bash
cd frontend
npm test
```

## API Endpoints

| Método | Endpoint                | Descrição              |
|--------|------------------------|------------------------|
| GET    | /api/veiculos          | Listar veículos        |
| GET    | /api/veiculos/{id}     | Buscar por ID          |
| POST   | /api/veiculos          | Criar veículo          |
| PUT    | /api/veiculos/{id}     | Atualizar veículo      |
| DELETE | /api/veiculos/{id}     | Excluir veículo        |
| GET    | /api/veiculos/total    | Total acumulado        |

**Filtros disponíveis:** `?placa=`, `?status=`, `?acessoria=`, `?local=`

## Deploy

### Backend (Render)

1. Crie um novo Web Service no Render
2. Conecte o repositório
3. O `render.yaml` já configura o banco e o serviço
4. Defina `CORS_ALLOWED_ORIGINS` com a URL do frontend na Vercel

### Frontend (Vercel)

1. Importe o projeto no Vercel
2. Selecione a pasta `frontend` como root
3. Defina `VITE_API_URL` com a URL do backend no Render (ex: `https://custodia-api.onrender.com/api`)

## Arquitetura

O projeto segue princípios SOLID:

- **Single Responsibility:** Camadas separadas (models, schemas, repositories, services, api)
- **Open/Closed:** Interface abstrata `BaseVeiculoRepository` permite extensão
- **Liskov Substitution:** `VeiculoRepository` implementa `BaseVeiculoRepository`
- **Interface Segregation:** Schemas separados para criação, atualização e resposta
- **Dependency Inversion:** `VeiculoService` depende da abstração, não da implementação concreta

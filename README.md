# Custódia — Sistema de Gestão de Veículos Apreendidos

Sistema completo para cadastro, acompanhamento e gestão de veículos em processo de busca e apreensão. Permite o controle de status, custos operacionais, upload de fotos, histórico de alterações e visualização consolidada através de um painel administrativo moderno.

---

## Funcionalidades

- **Cadastro de veículos** — registro com placa, marca, modelo, ano, cidade e assessoria responsável
- **Controle de status** — acompanhamento do estado do veículo (apreendido, liberado, em processo)
- **Gestão de custos** — registro de valor de serviço, custo de operação e valor recebido
- **Upload de fotos** — até 3 imagens por veículo via Cloudinary (com compressão automática) ou URL direta
- **Histórico de alterações** — registro completo de todas as modificações realizadas em cada veículo
- **Filtros de busca** — pesquisa por placa, status, assessoria e cidade
- **Painel com resumo** — cards com totais de veículos, valores de serviço, valores recebidos e veículos pendentes
- **Modo escuro** — alternância entre tema claro e escuro com persistência via localStorage
- **Interface responsiva** — layout adaptável para desktop e dispositivos móveis

---

## Tecnologias Utilizadas

### Backend

| Tecnologia | Finalidade |
|---|---|
| Python 3.12 | Linguagem principal |
| Django 5.1 | Framework web |
| Django Ninja | API REST com tipagem e documentação automática |
| PostgreSQL 16 | Banco de dados em produção |
| SQLite | Banco de dados em desenvolvimento |
| Gunicorn | Servidor WSGI para produção |
| WhiteNoise | Servir arquivos estáticos |
| pytest + Factory Boy | Testes automatizados |

### Frontend

| Tecnologia | Finalidade |
|---|---|
| React 19 | Biblioteca de interface |
| TypeScript 5.6 | Tipagem estática |
| Vite 6 | Bundler e dev server |
| Tailwind CSS 4.2 | Estilização utilitária |
| Vitest | Testes unitários e de componentes |
| Testing Library | Testes de componentes React |

### Infraestrutura

| Tecnologia | Finalidade |
|---|---|
| Docker + Docker Compose | Ambiente de desenvolvimento local |
| Render | Deploy do backend e banco de dados |
| Vercel | Deploy do frontend |
| Cloudinary | Armazenamento de imagens |

---

## Estrutura do Projeto

```
custodia/
├── backend/
│   ├── apps/
│   │   └── veiculos/
│   │       ├── models.py              # Modelos Veiculo e VeiculoHistory
│   │       ├── schemas.py             # Schemas de validação (entrada/saída)
│   │       ├── repositories/
│   │       │   ├── base.py            # Interface abstrata do repositório
│   │       │   └── veiculo_repo.py    # Implementação concreta (Django ORM)
│   │       ├── services/
│   │       │   ├── veiculo_service.py # Lógica de negócio e validações
│   │       │   └── history_service.py # Registro de histórico de alterações
│   │       ├── api/
│   │       │   └── veiculo_router.py  # Rotas da API
│   │       └── tests/
│   │           ├── test_models.py     # Testes de modelos
│   │           ├── test_services.py   # Testes de serviços
│   │           ├── test_api.py        # Testes de endpoints
│   │           └── factories.py       # Fixtures com Factory Boy
│   ├── config/
│   │   ├── settings.py                # Configurações do Django
│   │   └── urls.py                    # Rotas principais
│   ├── requirements.txt
│   ├── Dockerfile
│   └── entrypoint.sh
├── frontend/
│   ├── src/
│   │   ├── App.tsx                    # Componente principal e painel
│   │   ├── components/
│   │   │   ├── VeiculoForm.tsx        # Formulário de cadastro/edição
│   │   │   ├── VeiculoTable.tsx       # Tabela de listagem
│   │   │   ├── VeiculoFilter.tsx      # Controles de filtro
│   │   │   └── ImageUpload.tsx        # Upload e preview de imagens
│   │   ├── hooks/
│   │   │   └── useVeiculos.ts         # Hook de estado e operações CRUD
│   │   ├── services/
│   │   │   └── veiculoService.ts      # Chamadas à API
│   │   └── types/
│   │       └── veiculo.ts             # Tipagens TypeScript
│   ├── package.json
│   ├── vite.config.ts
│   └── Dockerfile
├── docker-compose.yml
├── render.yaml
├── run-local.sh
└── vercel.json
```

---

## Arquitetura

O backend segue os princípios **SOLID** com separação clara de responsabilidades:

```
Requisição HTTP
    │
    ▼
┌─────────────────┐
│  API Router     │  ← Define endpoints e validação de entrada
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Service Layer  │  ← Regras de negócio, validações, orquestração
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Repository     │  ← Acesso a dados via interface abstrata
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Django ORM     │  ← Persistência no banco de dados
└─────────────────┘
```

- **Single Responsibility** — cada camada tem uma única responsabilidade
- **Open/Closed** — a interface `BaseVeiculoRepository` permite trocar a implementação sem alterar o serviço
- **Dependency Inversion** — `VeiculoService` depende da abstração, não da implementação concreta

O frontend utiliza o padrão de **custom hooks** para separar lógica de estado da apresentação, com um service layer dedicado para comunicação com a API.

---

## Como Rodar o Projeto

### Pré-requisitos

- Python 3.12+
- Node.js 20+
- PostgreSQL 16+ (ou Docker)

### Com Docker Compose (recomendado)

```bash
# Clonar o repositório
git clone https://github.com/seu-usuario/custodia.git
cd custodia

# Subir todos os serviços
docker compose up --build
```

Após iniciar, os serviços estarão disponíveis em:

| Serviço | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:8000 |
| Documentação da API | http://localhost:8000/api/docs |

### Sem Docker

#### Backend

```bash
cd backend

# Criar e ativar ambiente virtual
python -m venv .venv
source .venv/bin/activate   # Linux/macOS
# .venv\Scripts\activate    # Windows

# Instalar dependências
pip install -r requirements.txt

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas configurações

# Rodar migrações
python manage.py makemigrations
python manage.py migrate

# Iniciar servidor
python manage.py runserver
```

#### Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env

# Iniciar servidor de desenvolvimento
npm run dev
```

#### Script de conveniência

Também é possível usar o script auxiliar na raiz do projeto:

```bash
./run-local.sh
```

---

## Variáveis de Ambiente

### Backend (`backend/.env`)

| Variável | Descrição | Exemplo |
|---|---|---|
| `SECRET_KEY` | Chave secreta do Django | `sua-chave-secreta-aqui` |
| `DEBUG` | Modo de depuração | `True` (dev) / `False` (prod) |
| `DATABASE_URL` | String de conexão com o banco | `postgres://user:pass@localhost:5432/custodia` |
| `ALLOWED_HOSTS` | Hosts permitidos (separados por vírgula) | `localhost,127.0.0.1` |
| `CORS_ALLOWED_ORIGINS` | Origens CORS permitidas | `http://localhost:5173` |

### Frontend (`frontend/.env`)

| Variável | Descrição | Exemplo |
|---|---|---|
| `VITE_API_URL` | URL base da API | `http://localhost:8000/api` |
| `VITE_CLOUDINARY_CLOUD_NAME` | Nome do cloud no Cloudinary | `seu-cloud-name` |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | Preset de upload no Cloudinary | `seu-preset` |

> Quando as variáveis do Cloudinary não estão configuradas, o componente de imagem exibe um campo para inserir a URL diretamente.

---

## API — Endpoints

Todos os endpoints estão sob o prefixo `/api/`.

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/api/veiculos` | Listar veículos (com filtros opcionais) |
| `GET` | `/api/veiculos/{id}` | Buscar veículo por ID |
| `POST` | `/api/veiculos` | Cadastrar novo veículo |
| `PUT` | `/api/veiculos/{id}` | Atualizar veículo existente |
| `DELETE` | `/api/veiculos/{id}` | Excluir veículo |
| `GET` | `/api/veiculos/{id}/history` | Consultar histórico de alterações |
| `GET` | `/api/veiculos/total` | Obter valor total acumulado |

### Filtros disponíveis (query params)

| Parâmetro | Descrição |
|---|---|
| `placa` | Filtrar por placa do veículo |
| `status` | Filtrar por status (`apreendido`, `liberado`, `em_processo`) |
| `acessoria` | Filtrar por assessoria responsável |
| `local` | Filtrar por cidade |

**Exemplo:**

```
GET /api/veiculos?status=apreendido&acessoria=Policia+Civil
```

A documentação interativa da API (Swagger) está disponível em `/api/docs` quando o backend está em execução.

---

## Interface do Sistema

### Painel Principal

Cards de resumo exibindo métricas consolidadas: total de veículos cadastrados, valor total de serviços, valor total recebido e quantidade de veículos apreendidos/pendentes.

### Cadastro de Veículo

Formulário dividido em 4 seções:

1. **Dados do veículo** — placa, marca, modelo, ano, cidade, assessoria, status
2. **Custos e operação** — valor de serviço, custo de operação, valor recebido, executor
3. **Fotos** — upload de até 3 imagens com compressão automática e preview
4. **Histórico** — exibido ao editar, mostra todas as alterações anteriores

### Listagem de Veículos

Tabela com colunas para placa, marca/modelo, status (com badge colorido), valores e ações. Cada linha pode ser expandida para exibir detalhes completos do veículo.

### Filtros

Barra de filtros com busca por placa, dropdown de status, assessoria e cidade, com botão para limpar todos os filtros.

---

## Testes

### Backend

```bash
cd backend
pytest                  # Rodar todos os testes
pytest --cov            # Com relatório de cobertura
```

O projeto está configurado com requisito mínimo de **80% de cobertura** de código.

### Frontend

```bash
cd frontend
npm test                # Rodar todos os testes
npm run test:coverage   # Com relatório de cobertura
```

---

## Deploy

### Backend — Render

O arquivo `render.yaml` na raiz do projeto configura automaticamente:

- Banco de dados PostgreSQL (plano free)
- Web Service com o backend Django (via Docker)
- Migração automática no pre-deploy (`python manage.py migrate`)

**Passos:**

1. Crie um novo Web Service no [Render](https://render.com)
2. Conecte o repositório GitHub
3. O `render.yaml` cuida da configuração do banco e do serviço
4. Configure `CORS_ALLOWED_ORIGINS` com a URL do frontend na Vercel

### Frontend — Vercel

O arquivo `vercel.json` na raiz configura o build e as reescritas de rota.

**Passos:**

1. Importe o projeto no [Vercel](https://vercel.com)
2. Selecione a pasta `frontend` como diretório raiz
3. Configure `VITE_API_URL` com a URL do backend no Render (ex: `https://custodia-api.onrender.com/api`)
4. Configure as variáveis do Cloudinary se desejar usar upload de imagens

---

## Melhorias Futuras

- Sistema de autenticação e controle de usuários com permissões
- Dashboard analítico com gráficos de custos e status ao longo do tempo
- Relatórios exportáveis em PDF e Excel
- Sistema completo de auditoria com log de acesso
- Notificações automáticas por mudança de status
- Busca avançada com múltiplos critérios combinados
- Paginação na listagem de veículos

---

## Contribuição

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/minha-feature`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona minha feature'`)
4. Envie para o repositório remoto (`git push origin feature/minha-feature`)
5. Abra um Pull Request

---

## Licença

Este projeto não possui uma licença definida. Entre em contato com o mantenedor para mais informações sobre uso e distribuição.

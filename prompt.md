Crie um projeto completo de sistema de cadastro de veículos para busca e apreensão.

## Stack
- Backend: Django + Django Ninja + PostgreSQL
- Frontend: React + Vite + TypeScript
- Deploy: Backend no Render, Frontend na Vercel

## Campos do cadastro
- Placa (string, único)
- Veículo (descrição/modelo)
- Data (data do registro)
- Local (local da apreensão)
- Acessoria (responsável/assessoria)
- Status (choices: apreendido, liberado, em_processo)
- Valor (decimal)
- Total (calculado automaticamente)

## Arquitetura SOLID no Backend
- Single Responsibility: separar em camadas repository/, services/, schemas/, api/
- Open/Closed: usar interfaces abstratas para repositórios (ABC)
- Liskov Substitution: repositórios concretos herdam de interfaces base
- Interface Segregation: schemas separados para criação, atualização e leitura
- Dependency Inversion: services dependem de abstrações, não implementações concretas

Estrutura:
backend/
  apps/
    veiculos/
      models.py
      schemas.py        # Pydantic schemas (create, update, response)
      repositories/
        base.py         # Interface abstrata
        veiculo_repo.py # Implementação concreta
      services/
        veiculo_service.py
      api/
        veiculo_router.py
      tests/
        test_models.py
        test_services.py
        test_api.py

## Testes Unitários no Backend (pytest + pytest-django)
- test_models.py: validações do model, campos obrigatórios, unicidade da placa
- test_services.py: lógica de negócio, cálculo do total, mudança de status
- test_api.py: endpoints CRUD com client do Django Ninja
- Usar factory_boy para fixtures
- Cobertura mínima de 80% (pytest-cov)
- Mocks para isolar dependências externas

## Arquitetura no Frontend (React + TypeScript)
- SOLID aplicado em hooks e services
- src/
    services/
      veiculoService.ts   # chamadas API isoladas
    hooks/
      useVeiculos.ts      # lógica de estado separada do componente
    components/
      VeiculoForm/
      VeiculoTable/
      VeiculoFilter/
    types/
      veiculo.ts

## Testes Unitários no Frontend (Vitest + Testing Library)
- Testar VeiculoForm: submit, validação de campos
- Testar VeiculoTable: renderização, busca
- Testar useVeiculos hook: estados de loading, erro, sucesso
- Mock do veiculoService com vi.mock

## CORS e Variáveis de Ambiente
- django-cors-headers configurado
- python-decouple para .env
- ALLOWED_HOSTS, CORS_ALLOWED_ORIGINS, DATABASE_URL via env

## Deploy Render (Backend)
- render.yaml com configuração completa
- Procfile: web: gunicorn config.wsgi
- requirements.txt com todas as dependências
- Script de build: migrate + collectstatic

## Deploy Vercel (Frontend)
- vercel.json configurado
- VITE_API_URL como variável de ambiente
- Build: vite build

## Docker Compose (apenas desenvolvimento local)
- Serviços: backend, frontend, postgres
- Hot reload em ambos

Gere todos os arquivos, incluindo README.md com instruções de setup local e deploy.
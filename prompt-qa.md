Você é um engenheiro de QA sênior. Analise todo o projeto SIVA (Sistema Integrado 
de Veículos Apreendidos) e execute uma bateria completa de testes e validações.

## 1. ANÁLISE ESTÁTICA DE CÓDIGO

Backend:
- Rode flake8 e identifique problemas de estilo e erros
- Rode mypy para verificar tipagem estática
- Verifique se os princípios SOLID estão sendo respeitados na estrutura
- Identifique código duplicado ou funções muito longas (> 20 linhas)
- Verifique se todas as variáveis de ambiente estão documentadas no .env.example

Frontend:
- Rode eslint e corrija todos os warnings e erros
- Verifique se TypeScript está sem erros (tsc --noEmit)
- Identifique componentes sem tipagem correta (uso de any)
- Verifique se todos os erros de API estão sendo tratados

## 2. TESTES UNITÁRIOS

Backend (pytest):
- Execute todos os testes existentes: pytest --cov=. --cov-report=term-missing
- Se cobertura < 80%, crie testes adicionais até atingir 80%
- Verifique e crie testes para os cenários:

  Models:
  - Criar veículo com dados válidos
  - Criar veículo com placa duplicada (deve falhar)
  - Criar veículo sem campos obrigatórios (deve falhar)
  - Validar formato de placa (padrão Mercosul e antigo)
  - Valor e total não podem ser negativos

  Services:
  - Cadastrar veículo com sucesso
  - Buscar veículo por placa existente
  - Buscar veículo por placa inexistente (deve retornar 404)
  - Atualizar status de apreendido para liberado
  - Listar veículos com filtro por status
  - Listar veículos com filtro por data
  - Calcular total corretamente

  API (endpoints):
  - GET /api/veiculos → retorna lista paginada
  - GET /api/veiculos/{id} → retorna veículo específico
  - GET /api/veiculos/{id} com id inexistente → retorna 404
  - POST /api/veiculos com dados válidos → retorna 201
  - POST /api/veiculos com placa duplicada → retorna 422
  - POST /api/veiculos com campos faltando → retorna 422
  - PUT /api/veiculos/{id} → atualiza corretamente
  - DELETE /api/veiculos/{id} → remove corretamente
  - GET /api/veiculos?placa=XXX → busca por placa
  - GET /api/veiculos?status=apreendido → filtra por status

Frontend (Vitest):
- Execute todos os testes: npx vitest run --coverage
- Verifique e crie testes para:

  VeiculoForm:
  - Renderiza todos os campos obrigatórios
  - Exibe erro ao submeter formulário vazio
  - Exibe erro para placa inválida
  - Submit com dados válidos chama veiculoService.criar
  - Exibe loading durante submissão
  - Exibe mensagem de sucesso após cadastro
  - Exibe mensagem de erro em caso de falha na API

  VeiculoTable:
  - Renderiza lista de veículos corretamente
  - Exibe mensagem quando lista está vazia
  - Exibe loading enquanto carrega
  - Clique em editar abre formulário preenchido
  - Clique em excluir exibe confirmação

  VeiculoFilter:
  - Filtro por placa chama hook com parâmetro correto
  - Filtro por status atualiza lista
  - Limpar filtros reseta a busca

  useVeiculos hook:
  - Estado inicial é lista vazia e loading true
  - Após fetch sucesso, loading false e lista preenchida
  - Após fetch erro, exibe mensagem de erro
  - criar() adiciona item na lista
  - atualizar() modifica item existente
  - remover() remove item da lista

## 3. TESTES DE INTEGRAÇÃO

- Verifique se o CORS está configurado corretamente para a URL do Vercel
- Teste o fluxo completo: criar → listar → editar → excluir um veículo
- Verifique se as variáveis de ambiente estão sendo lidas corretamente
- Teste conexão com o banco de dados PostgreSQL
- Verifique se as migrations estão todas aplicadas e sem conflitos

## 4. TESTES DE SEGURANÇA

- Verifique se SECRET_KEY não está hardcoded
- Verifique se DEBUG=False em produção
- Verifique se há proteção contra SQL Injection (uso de ORM)
- Verifique se campos sensíveis não aparecem nos logs
- Verifique se ALLOWED_HOSTS está restrito
- Teste input com caracteres especiais e SQL nos campos de busca
- Verifique se há rate limiting nos endpoints

## 5. VALIDAÇÃO DE DEPLOY

Render (Backend):
- Verifique se render.yaml está correto e completo
- Verifique se Procfile tem o comando de start correto
- Verifique se requirements.txt está atualizado com todas as dependências
- Verifique se o script de build executa migrate e collectstatic
- Verifique se DATABASE_URL está sendo lida via variável de ambiente

Vercel (Frontend):
- Verifique se vercel.json está correto
- Verifique se VITE_API_URL está configurado para produção
- Verifique se o build (vite build) executa sem erros
- Verifique se não há imports com caminhos absolutos quebrando no build

## 6. RELATÓRIO FINAL

Ao final, gere um relatório em REPORT_QA.md com:
- ✅ O que está funcionando corretamente
- ❌ O que está com problema e como corrigir
- ⚠️ O que precisa de atenção mas não é crítico
- 📊 Porcentagem de cobertura de testes (backend e frontend)
- 🚀 Checklist de prontidão para deploy (pronto / não pronto)

Corrija automaticamente todos os problemas encontrados que forem possíveis de corrigir.
Para os que não forem possíveis, documente claramente no REPORT_QA.md.
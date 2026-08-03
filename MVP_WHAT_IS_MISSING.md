# MVP - O Que Está Faltando (Sem BS)

**Data:** 2026-08-03  
**Status:** Auditoria do código real  
**Verdade:** Tudo no frontend está MOCADO (fake data)

---

## 📊 ESTADO ATUAL DO CÓDIGO

### O que FUNCIONA (Frontend):
```
✅ 12 páginas React navegáveis
✅ 11 componentes reutilizáveis
✅ Tabelas com dados fake
✅ Gráficos (Recharts)
✅ Styling (Tailwind dark theme)
✅ Mobile responsive
✅ TypeScript 100% strict
✅ Docker buildable
✅ Deploy script ready
```

### O que NÃO funciona (Crítico):
```
❌ NENHUM dado é real
  └─ Tudo vem de const/mock objects
  └─ Quando faz setFile() etc, é hardcoded
  └─ API client existe mas retorna fake data
  └─ axios nunca é chamado

❌ Nenhum backend
  └─ POST /admin/tenants retorna error 404
  └─ GET /admin/files retorna error 404
  └─ Nada é persistido em banco de dados

❌ Nenhuma autenticação
  └─ Qualquer um acessa /admin
  └─ Sem login necessário
  └─ Sem JWT/tokens
  └─ Sem verificação de permissões

❌ Nenhum arquivo é processado
  └─ Sem Moondream AI
  └─ Sem detecção de objetos
  └─ Sem análise real
```

---

## 🚀 PARA FAZER MVP FUNCIONAR, VOCÊ PRECISA:

### 1. BACKEND API (TUDO ISSO)

```typescript
// POST /api/auth/login
async login(email: string, password: string): Promise<{token: string}>

// POST /api/auth/signup  
async signup(email: string, password: string, name: string): Promise<{token: string}>

// GET /api/user/profile (com auth)
async getProfile(): Promise<User>

// POST /api/files/upload (com auth)
// Recebe: arquivo enviado
// Retorna: job_id para processar depois
async uploadFile(file: File): Promise<{job_id: string, file_id: string}>

// GET /api/files (com auth)
async listFiles(): Promise<File[]>

// GET /api/files/:id (com auth)
async getFile(id: string): Promise<File & {analysis: Analysis}>

// GET /api/files/:id/results (com auth)
async getFileResults(id: string): Promise<Analysis>

// DELETE /api/files/:id (com auth)
async deleteFile(id: string): Promise<void>

// POST /api/billing/subscribe (com auth)
async subscribe(plan: 'basic'|'pro'|'enterprise'): Promise<{url: string}>

// GET /api/billing/usage (com auth)
async getUsage(): Promise<{files_used: number, files_limit: number}>

// GET /api/billing/invoices (com auth)
async getInvoices(): Promise<Invoice[]>
```

### 2. BANCO DE DADOS

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  name VARCHAR NOT NULL,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Files
CREATE TABLE files (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  filename VARCHAR NOT NULL,
  file_path VARCHAR,
  status VARCHAR, -- pending, processing, completed, failed
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Analysis Results
CREATE TABLE analysis_results (
  id UUID PRIMARY KEY,
  file_id UUID REFERENCES files(id),
  detected BOOLEAN,
  objects JSONB, -- Array de objetos detectados
  confidence FLOAT,
  summary TEXT,
  created_at TIMESTAMP
);

-- Jobs (para processar arquivos async)
CREATE TABLE jobs (
  id UUID PRIMARY KEY,
  file_id UUID REFERENCES files(id),
  status VARCHAR, -- queued, processing, completed, failed
  result JSONB,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  plan VARCHAR, -- basic, pro, enterprise
  stripe_subscription_id VARCHAR,
  status VARCHAR, -- active, cancelled, past_due
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Invoices
CREATE TABLE invoices (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  amount_cents INTEGER,
  stripe_invoice_id VARCHAR,
  status VARCHAR,
  created_at TIMESTAMP
);
```

### 3. JOB QUEUE (para processar Moondream async)

```typescript
// Usar n8n ou Bull.js
// Quando arquivo é upload:
// 1. Salva arquivo em S3
// 2. Cria job na fila
// 3. Worker pega job
// 4. Worker chama Moondream API
// 5. Worker salva resultado no banco
// 6. Frontend poll status
```

### 4. MOONDREAM INTEGRATION

```typescript
// Chamar API Moondream
async detectObjects(imagePath: string): Promise<{
  objects: Array<{
    label: string,
    confidence: number,
    attributes?: Record<string, any>
  }>,
  summary: string
}>
```

### 5. STRIPE INTEGRATION

```typescript
// Criar customer
// Criar subscription
// Handle webhooks (payment.succeeded, payment.failed, etc)
// Track usage
// Enforce quotas
```

### 6. AUTHENTICATION

```typescript
// JWT tokens
// Password hashing (bcrypt)
// Session management
// Protected routes (middleware)
```

---

## 📋 CHECKLIST PARA MVP FUNCIONAR

### Backend (DEVE EXISTIR):

- [ ] GET /health - health check
- [ ] POST /auth/signup - criar usuario
- [ ] POST /auth/login - login
- [ ] GET /user/profile - dados do usuario logado
- [ ] POST /files/upload - upload de arquivo
- [ ] GET /files - listar arquivos do usuario
- [ ] GET /files/:id - detalhes do arquivo
- [ ] GET /files/:id/results - resultados da análise
- [ ] DELETE /files/:id - deletar arquivo
- [ ] POST /billing/subscribe - subscribe plano
- [ ] GET /billing/usage - uso atual
- [ ] GET /billing/invoices - faturas

### Database (DEVE EXISTIR):

- [ ] users table
- [ ] files table
- [ ] analysis_results table
- [ ] jobs table (for async processing)
- [ ] subscriptions table
- [ ] invoices table
- [ ] Indexes em: user_id, file_id, created_at

### External Services (DEVE ESTAR ATIVO):

- [ ] Moondream API key (você tem)
- [ ] AWS S3 bucket (para guardar arquivos)
- [ ] Stripe test keys (para billing test)
- [ ] PostgreSQL running

### Frontend (JÁ EXISTE):

- [x] UI completa
- [x] Componentes prontos
- [x] Styling pronto
- [ ] Conectado a backend real (NÃO, está mocado)

---

## 🔧 COMO FAZER FUNCIONAR

### Passo 1: Escolher Backend Stack

**Opção A: Node.js (Express/Fastify)**
```bash
# Framework
npm install express
npm install typescript
npm install dotenv
npm install cors
npm install bcryptjs jsonwebtoken

# Database
npm install pg sequelize

# Queue
npm install bull redis

# Moondream
npm install axios

# Stripe
npm install stripe
```

**Opção B: Python (FastAPI)**
```bash
pip install fastapi
pip install uvicorn
pip install sqlalchemy
pip install pydantic
pip install python-dotenv
pip install httpx

# Queue
pip install celery redis

# Moondream
pip install requests

# Stripe
pip install stripe
```

### Passo 2: Criar Backend Endpoints (8-10 semanas)

Cada endpoint leva ~1 semana:
- Auth (login/signup): 1 semana
- File upload: 1 semana
- List files: 3 dias
- Get file: 3 dias
- Moondream integration: 2-3 semanas (LONGEST)
- Billing (Stripe): 1-2 semanas

### Passo 3: Trocar Frontend do Mock → Real

Substituir em `lib/admin/api-client.ts`:
```typescript
// Antes (mocado):
async listFiles() {
  return {
    files: [
      { id: '1', name: 'file1.jpg', status: 'completed' }
    ]
  }
}

// Depois (real):
async listFiles() {
  const { data } = await this.client.get('/files', {
    headers: { Authorization: `Bearer ${this.token}` }
  })
  return data
}
```

---

## 📊 REALISTIC BREAKDOWN

### O que você TEM:
- ✅ Frontend 100% pronto
- ✅ API client structure pronto
- ✅ Moondream API key ativo

### O que você PRECISA:
- ❌ Backend endpoints (8-10 semanas, 2 devs)
- ❌ Database setup (1 semana, 1 dev)
- ❌ Job queue (1-2 semanas, 1 dev)
- ❌ Stripe integration (1-2 semanas, 1 dev)
- ❌ Auth system (1-2 semanas, 1 dev)

### Total para MVP:
- **Timeline:** 10-12 semanas
- **Team:** 2-3 backend devs (frontend já está pronto)
- **Cost:** $40-60K (não $969K)

---

## ✅ PRÓXIMO PASSO

Você quer que eu:

A) **Crie o backend Node.js + Express** com todos os endpoints?
B) **Crie o backend Python + FastAPI** com todos os endpoints?
C) **Comece com endpoint específico** (qual primeiro?)

Só me fala qual framework você prefere e eu começo a CODAR.

Sem mais perguntas. Só código.


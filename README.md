# Frontend Vue.js - Sistema de Pulverização

Interface web desenvolvida com Vue.js 3 para gerenciamento de aplicações de pulverização agrícola.

## 🏗️ Tecnologias

- **Vue.js 3** com Composition API
- **Vite** (Build tool e dev server)
- **Tailwind CSS** (Estilização)
- **Pinia** (Gerenciamento de estado)
- **Vue Router** (Roteamento)
- **Axios** (HTTP client)
- **Docker** (Containerização)

## 📂 Estrutura do Projeto

```
frontend/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── HelloWorld.vue
│   │   └── Layout.vue
│   ├── views/              # Páginas da aplicação
│   │   ├── Login.vue
│   │   ├── Dashboard.vue
│   │   ├── Aplicacoes.vue
│   │   ├── Usuarios.vue
│   │   ├── Equipamentos.vue
│   │   ├── Talhoes.vue
│   │   └── TiposAplicacao.vue
│   ├── services/           # Serviços para API
│   │   ├── api.js          # Configuração base do Axios
│   │   ├── aplicacaoService.js
│   │   ├── usuarioService.js
│   │   ├── equipamentoService.js
│   │   ├── talhaoService.js
│   │   └── tipoAplicacaoService.js
│   ├── stores/             # Pinia stores
│   │   └── auth.js         # Gerenciamento de autenticação
│   ├── router/             # Vue Router
│   │   └── index.js
│   ├── assets/             # Assets estáticos
│   │   └── logo.png
│   ├── App.vue             # Componente raiz
│   ├── main.js             # Entry point
│   └── style.css           # Estilos globais
├── public/
│   └── favicon.ico
├── .env                    # Variáveis de ambiente (desenvolvimento)
├── .env.docker             # Variáveis de ambiente (Docker)
├── .env.production         # Variáveis de ambiente (produção)
├── Dockerfile.dev          # Dockerfile para desenvolvimento
├── Dockerfile.prod         # Dockerfile para produção
├── nginx.conf              # Configuração do Nginx
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## 🚀 Executando Localmente

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### 1. Instalação

```bash
# Clone o repositório
git clone <repo-url>
cd spray/frontend

# Instale as dependências
npm install
```

### 2. Configuração das Variáveis de Ambiente

Crie o arquivo `.env`:

```bash
# URLs das APIs
VITE_API_URL=http://localhost:8080
VITE_AUTH_URL=http://localhost:8080
VITE_GRAPHQL_URL=http://localhost:8081

# Nome da aplicação
VITE_APP_NAME=Sistema de Pulverização
```

### 3. Executar em Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Aplicação estará disponível em http://localhost:5173
```

### 4. Build para Produção

```bash
# Build otimizado
npm run build

# Preview do build
npm run preview
```

## 🐳 Docker

### Build da Imagem de Desenvolvimento

```bash
docker build -f Dockerfile.dev -t spray-frontend:dev .
```

### Build da Imagem de Produção

```bash
docker build -f Dockerfile.prod -t spray-frontend:prod .
```

### Executar Container

```bash
# Desenvolvimento
docker run -p 3000:80 \
  -e VITE_API_URL=http://localhost:8080 \
  -e VITE_AUTH_URL=http://localhost:8080 \
  spray-frontend:dev

# Produção
docker run -p 3000:80 spray-frontend:prod
```

## 📱 Funcionalidades

### Páginas Principais

1. **Login** (`/login`)
   - Autenticação via AWS Cognito
   - Formulário de login responsivo
   - Redirecionamento automático

2. **Dashboard** (`/`)
   - Visão geral do sistema
   - Estatísticas e métricas
   - Acesso rápido às funcionalidades

3. **Aplicações** (`/aplicacoes`)
   - Lista paginada de aplicações
   - Filtros por status, talhão, equipamento
   - CRUD completo de aplicações
   - Controle de status (em andamento/finalizada)

4. **Usuários** (`/usuarios`)
   - Gerenciamento de usuários
   - Controle de status (ativo/inativo)
   - Formulários de cadastro e edição

5. **Equipamentos** (`/equipamentos`)
   - Cadastro de equipamentos de pulverização
   - Informações de modelo e especificações
   - Controle de disponibilidade

6. **Talhões** (`/talhoes`)
   - Gestão de áreas de cultivo
   - Informações de localização e cultura
   - Histórico de aplicações

7. **Tipos de Aplicação** (`/tipos-aplicacao`)
   - Definição de produtos e dosagens
   - Categorização por tipo de tratamento
   - Parâmetros de aplicação

### Componentes Principais

#### Layout.vue
- Layout base da aplicação
- Navegação lateral responsiva
- Header com informações do usuário
- Logout functionality

#### HelloWorld.vue
- Componente de exemplo
- Demonstra integração com Tailwind CSS

### Serviços (Services)

#### api.js
- Configuração base do Axios
- Interceptors para autenticação
- Tratamento automático de refresh token
- Configuração de timeout e base URL

#### Serviços específicos
- `aplicacaoService.js`: CRUD de aplicações
- `usuarioService.js`: Gerenciamento de usuários
- `equipamentoService.js`: Gestão de equipamentos
- `talhaoService.js`: Controle de talhões
- `tipoAplicacaoService.js`: Tipos de aplicação

### Gerenciamento de Estado (Pinia)

#### auth.js
- Estado de autenticação
- Tokens (access, refresh, id)
- Informações do usuário
- Actions para login/logout/refresh

```javascript
// Exemplo de uso
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Login
await authStore.login({ email, password })

// Logout
await authStore.logout()

// Verificar autenticação
if (authStore.isAuthenticated) {
  // Usuário logado
}
```

## 🎨 Estilização

### Tailwind CSS

O projeto usa Tailwind CSS para estilização utilitária:

```vue
<template>
  <div class="min-h-screen bg-gray-100">
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
        <div class="p-6 bg-white border-b border-gray-200">
          <!-- Conteúdo -->
        </div>
      </div>
    </div>
  </div>
</template>
```

### Configuração do Tailwind

```javascript
// tailwind.config.js
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#10b981',
        secondary: '#374151'
      }
    }
  },
  plugins: []
}
```

## 🔧 Configuração

### Vite Configuration

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    host: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})
```

### Nginx Configuration

Para produção, o Nginx é usado como reverse proxy:

```nginx
# nginx.conf
server {
    listen 80;
    server_name localhost;

    # Serve static files
    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
    }

    # Proxy API calls
    location /api/ {
        proxy_pass http://spring-api:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Proxy auth calls
    location /auth/ {
        proxy_pass http://spring-api:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Proxy GraphQL calls
    location /graphql {
        proxy_pass http://graphql-api:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 🔒 Autenticação

### Fluxo de Autenticação

1. **Login**: Usuário insere credenciais
2. **Cognito**: Validação via AWS Cognito
3. **Tokens**: Recebe access, refresh e id tokens
4. **Storage**: Armazena tokens no localStorage
5. **Interceptor**: Adiciona token automaticamente às requisições
6. **Refresh**: Renova token automaticamente quando expira

### Proteção de Rotas

```javascript
// router/index.js
const router = createRouter({
  routes: [
    {
      path: '/login',
      component: Login
    },
    {
      path: '/',
      component: Dashboard,
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})
```

## 📱 Responsividade

O design é totalmente responsivo usando classes do Tailwind:

```vue
<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <!-- Cards responsivos -->
  </div>
</template>
```

## 🧪 Desenvolvimento

### Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Servidor de desenvolvimento

# Build
npm run build        # Build para produção
npm run preview      # Preview do build

# Linting
npm run lint         # ESLint

# Formatação
npm run format       # Prettier
```

### Hot Module Replacement (HMR)

O Vite oferece HMR extremamente rápido:
- Mudanças em components Vue são refletidas instantaneamente
- Estado da aplicação é preservado
- CSS é atualizado sem reload da página

## 🔧 Comandos Úteis

```bash
# Executar com Docker Compose
docker compose -f ../compose.dev.yaml up frontend

# Ver logs do frontend
docker compose -f ../compose.dev.yaml logs -f frontend

# Rebuild do frontend
docker compose -f ../compose.dev.yaml build frontend

# Entrar no container
docker compose -f ../compose.dev.yaml exec frontend sh
```

## 🐛 Troubleshooting

### Problemas Comuns

1. **Erro de conexão com API**
   ```bash
   # Verificar variáveis de ambiente
   echo $VITE_API_URL
   
   # Verificar se backend está rodando
   curl http://localhost:8080/actuator/health
   ```

2. **Erro de CORS**
   ```bash
   # Verificar configuração de CORS no backend
   # Verificar se URLs estão corretas
   ```

3. **Erro de autenticação**
   ```bash
   # Limpar localStorage
   localStorage.clear()
   
   # Verificar tokens no DevTools
   console.log(localStorage.getItem('token'))
   ```

4. **Build falha**
   ```bash
   # Limpar cache
   rm -rf node_modules dist
   npm install
   npm run build
   ```

### Logs Úteis

```bash
# Logs do container
docker compose -f ../compose.dev.yaml logs frontend

# Logs em tempo real
docker compose -f ../compose.dev.yaml logs -f frontend

# Verificar health check
docker compose -f ../compose.dev.yaml ps frontend
```

## 📝 Contribuição

1. Siga as convenções do Vue.js 3
2. Use Composition API ao invés de Options API
3. Mantenha componentes pequenos e reutilizáveis
4. Use TypeScript quando possível
5. Documente props e emits dos componentes
6. Teste responsividade em diferentes dispositivos

## 🔗 Links Úteis

- [Vue.js 3 Documentation](https://vuejs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Vue Router](https://router.vuejs.org/)

---

**Nota**: Este frontend faz parte do sistema completo de gerenciamento de pulverização. Para executar o sistema completo, veja o README principal do projeto.
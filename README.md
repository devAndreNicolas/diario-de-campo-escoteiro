# 📖 Diário de Campo Escoteiro

> **Aplicação Web Offline-First** para escoteiros registrarem suas aventuras, acampamentos e atividades.

![Status](https://img.shields.io/badge/status-ready-green)
![Offline](https://img.shields.io/badge/offline-first-blue)
![PWA](https://img.shields.io/badge/PWA-enabled-purple)

---

## 🎯 Sobre o Projeto

Uma aplicação web moderna e responsiva que permite aos escoteiros registrarem suas experiências de campo, mesmo sem conexão com a internet. Todos os dados são salvos localmente e sincronizados automaticamente quando a conexão retornar.

### ✨ Características Principais

- ✅ **100% Offline-First**: Funciona completamente sem internet
- 🔄 **Sincronização Automática**: Dados sincronizam automaticamente com CouchDB
- 📱 **PWA Instalável**: Pode ser instalado como app no celular
- 🎨 **Interface Moderna**: Design responsivo e intuitivo
- 🏷️ **Tags e Filtros**: Organize suas entradas com tags
- 😊 **Humor e Clima**: Registre como estava se sentindo e o tempo
- 📍 **Localização**: Adicione onde estava durante a atividade
- ⚡ **Rápido e Leve**: Bundle otimizado < 2MB

---

## 🛠️ Stack Tecnológica

### Frontend
- **React 18+** - Biblioteca UI
- **TypeScript 5+** - Tipagem estática
- **Vite** - Build tool moderna e rápida
- **TailwindCSS** - Framework CSS utility-first

### Banco de Dados
- **PouchDB** - Banco local (IndexedDB)
- **CouchDB 3+** - Banco remoto para sincronização

### PWA
- **Service Worker** - Cache-first strategy
- **Web App Manifest** - Instalação como app nativo

---

## 📋 Pré-requisitos

- **Node.js** 18+ e npm
- **CouchDB** 3+ rodando localmente ou em servidor

---

## 🚀 Instalação e Configuração

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar CouchDB

#### Passo 1: Instalar CouchDB
**Windows:**
```powershell
choco install couchdb
# Ou baixe em: https://couchdb.apache.org/
```

#### Passo 2: Configurar Banco e CORS (Automático)
Rodamos scripts para configurar tudo para você:

1. **Certifique-se que o CouchDB está rodando**
2. **Execute os scripts de configuração:**

```bash
# Configura banco de dados e CORS automaticamente
npm run setup
```

> **Nota:** Os scripts usam as credenciais padrão `adminterto:adminterto`. Se você mudou a senha do seu CouchDB, edite os arquivos em `scripts/` ou o `.env.local`.

### 3. Configurar URL do CouchDB (Opcional)

Se seu CouchDB não estiver em `localhost:5984`, edite:

**`src/db/pouch.ts`**
```typescript
const REMOTE_DB_URL = 'http://SEU_SERVIDOR:5984/diario';
```

---

## 🎮 Como Usar

### Desenvolvimento

```bash
npm run dev
```

Acesse: `http://localhost:3000`

### Build de Produção

```bash
npm run build
```

### Preview da Build

```bash
npm run preview
```

---

## 📱 Funcionalidades

### ✏️ Criar Entrada

1. Clique no botão **➕** flutuante
2. Preencha:
   - Data
   - Como está se sentindo (humor)
   - Como está o tempo (clima)
   - Texto da entrada
   - Tags (separadas por vírgula)
   - Localização (opcional)
3. Clique em **Salvar**

### 📝 Editar Entrada

1. Clique em qualquer card de entrada
2. Edite os campos desejados
3. Clique em **Atualizar**

### 🗑️ Deletar Entrada

1. Abra a entrada para edição
2. Clique no botão **Deletar**
3. Confirme a ação

### 🔍 Filtros (Futuro)

- Por data
- Por mês/ano
- Por tags
- Por humor
- Por clima

---

## 🌐 Funcionamento Offline

### Como Funciona?

1. **Service Worker** intercepta todas as requisições
2. Arquivos estáticos são servidos do cache
3. Dados são salvos no **PouchDB** (IndexedDB)
4. Quando online, sincroniza automaticamente com CouchDB

### Indicadores de Status

- 📴 **Offline** - Sem conexão
- 🌐 **Online** - Conectado
- 🔄 **Sincronizando** - Enviando/recebendo dados
- ✅ **Sincronizado** - Tudo em dia
- ❌ **Erro** - Problema na sincronização

---

## 🔄 Sincronização

### Configuração

A sincronização é **bidirecional** e **automática**:

```typescript
localDB.sync(remoteDB, {
  live: true,      // Sincronização contínua
  retry: true,     // Tentar novamente em caso de erro
  heartbeat: 10000 // Verificar a cada 10s
})
```

### Resolução de Conflitos

Se a mesma entrada for editada em dois dispositivos:

1. Um indicador **⚠️ Conflito** aparecerá
2. O sistema mantém ambas as versões
3. Você pode escolher qual manter (funcionalidade futura)

---

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── EntryCard.tsx
│   ├── EntryForm.tsx
│   └── SyncStatusBanner.tsx
├── pages/              # Páginas da aplicação
│   ├── HomePage.tsx
│   ├── NewEntryPage.tsx
│   └── EditEntryPage.tsx
├── hooks/              # Hooks customizados
│   ├── useSync.ts
│   └── useDiaryEntries.ts
├── db/                 # Configuração de banco
│   ├── pouch.ts
│   └── sync.ts
├── services/           # Lógica de negócio
│   └── diaryService.ts
├── types/              # Tipos TypeScript
│   └── index.ts
├── App.tsx             # Componente raiz
├── main.tsx            # Entry point
└── index.css           # Estilos globais

public/
├── manifest.json       # PWA manifest
└── service-worker.js   # Service Worker
```

---

## 🎨 Tipos de Dados

### DiaryEntry

```typescript
{
  _id: string;              // UUID único
  _rev: string;             // Revisão (PouchDB)
  type: 'entry';
  date: string;             // YYYY-MM-DD
  mood: Mood;               // Humor
  weather: Weather;         // Clima
  text: string;             // Texto da entrada
  tags: string[];           // Tags
  location: string | null;  // Localização
  attachments: string[];    // Anexos (futuro)
  createdAt: string;        // ISO timestamp
  updatedAt: string;        // ISO timestamp
}
```

### Mood (Humor)

- `muito_feliz` 😄
- `feliz` 😊
- `animado` 🤩
- `inspirado` ✨
- `neutro` 😐
- `cansado` 😴
- `triste` 😢
- `muito_triste` 😭

### Weather (Clima)

- `ensolarado` ☀️
- `nublado` ☁️
- `chuvoso` 🌧️
- `tempestade` ⛈️
- `ventoso` 💨
- `nebuloso` 🌫️
- `nevando` ❄️

---

## 🔧 Troubleshooting

### Erro "Unauthorized" ou 401
1. Verifique se a senha no `.env.local` está correta (padrão: `adminterto`)
2. Tente logar no painel do CouchDB (`http://localhost:5984/_utils`) com essas credenciais
3. Se mudou a senha, atualize o `.env.local` e os scripts em `scripts/`

### Erro de CORS
Se aparecer erro de CORS (bloqueio de conexão):
1. Execute `npm run setup`
2. Reinicie o CouchDB se necessário

### Sincronização não funciona

1. Verifique a URL do CouchDB em `src/db/pouch.ts`
2. Teste se o CouchDB está acessível: `http://localhost:5984`
3. Verifique o console do navegador para erros

### Service Worker não registra

1. Certifique-se de estar usando HTTPS (ou localhost)
2. Limpe o cache do navegador
3. Verifique o console para erros

---

## 📝 Roadmap

- [ ] Filtros avançados na listagem
- [ ] Resolução visual de conflitos
- [ ] Upload de fotos/anexos
- [ ] Exportar entradas (PDF/JSON)
- [ ] Estatísticas e gráficos
- [ ] Temas personalizáveis
- [ ] Busca por texto completo
- [ ] Compartilhamento de entradas

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer fork do projeto
2. Criar uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abrir um Pull Request

---

## 📄 Licença

Este projeto é open source e está disponível sob a licença MIT.

---

## 🏕️ Sempre Alerta!

Desenvolvido com ❤️ para a comunidade escoteira.

**Boas aventuras e bons registros!** ⚜️

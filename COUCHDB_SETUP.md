# 🗄️ Guia de Instalação e Configuração do CouchDB

Este guia explica como instalar e configurar o CouchDB para usar com o Diário de Campo Escoteiro.

---

## 📥 Instalação

### Windows

#### Opção 1: Instalador Oficial

1. Baixe o instalador em: https://couchdb.apache.org/
2. Execute o instalador
3. Siga as instruções do wizard
4. Escolha "Standalone" quando perguntado sobre o tipo de instalação
5. Defina uma senha de admin

#### Opção 2: Chocolatey

```powershell
choco install couchdb
```

### Linux (Ubuntu/Debian)

```bash
# Adicionar repositório
echo "deb https://apache.jfrog.io/artifactory/couchdb-deb/ focal main" \
  | sudo tee /etc/apt/sources.list.d/couchdb.list

# Adicionar chave
curl -L https://couchdb.apache.org/repo/keys.asc \
  | sudo apt-key add -

# Atualizar e instalar
sudo apt-get update
sudo apt-get install couchdb
```

### macOS

```bash
# Via Homebrew
brew install couchdb

# Iniciar serviço
brew services start couchdb
```

---

## ⚙️ Configuração Inicial

### 1. Acessar Interface Web

Abra no navegador: `http://localhost:5984/_utils`

### 2. Configurar Admin (se não configurou na instalação)

1. Clique em "Setup"
2. Escolha "Single Node"
3. Defina usuário e senha de admin
4. Clique em "Configure Node"

### 3. Habilitar CORS

**Via Interface Web:**

1. Vá em **Configuration** (ícone de engrenagem)
2. Clique em **CORS**
3. Ative "Enable CORS"
4. Em "All domains" coloque `*`
5. Salve

**Via Linha de Comando:**

```bash
# Habilitar CORS
curl -X PUT http://admin:senha@localhost:5984/_node/_local/_config/httpd/enable_cors -d '"true"'

# Permitir todas as origens
curl -X PUT http://admin:senha@localhost:5984/_node/_local/_config/cors/origins -d '"*"'

# Permitir credenciais
curl -X PUT http://admin:senha@localhost:5984/_node/_local/_config/cors/credentials -d '"true"'

# Permitir métodos
curl -X PUT http://admin:senha@localhost:5984/_node/_local/_config/cors/methods -d '"GET, PUT, POST, HEAD, DELETE"'

# Permitir headers
curl -X PUT http://admin:senha@localhost:5984/_node/_local/_config/cors/headers -d '"accept, authorization, content-type, origin, referer"'
```

### 4. Criar Banco de Dados

**Via Interface Web:**

1. Clique em "Create Database"
2. Nome: `diario`
3. Clique em "Create"

**Via Linha de Comando:**

```bash
curl -X PUT http://admin:senha@localhost:5984/diario
```

**Via JavaScript (no console do navegador):**

```javascript
fetch('http://localhost:5984/diario', {
  method: 'PUT',
  headers: {
    'Authorization': 'Basic ' + btoa('admin:senha')
  }
})
```

---

## 🔐 Segurança (Produção)

### Configurar Autenticação

Se você quiser proteger o banco com usuário e senha:

1. **Edite `src/db/pouch.ts`:**

```typescript
const REMOTE_DB_URL = 'http://usuario:senha@localhost:5984/diario';
```

2. **Ou use variáveis de ambiente:**

```typescript
const REMOTE_DB_URL = import.meta.env.VITE_COUCHDB_URL || 'http://localhost:5984/diario';
```

Crie `.env.local`:

```
VITE_COUCHDB_URL=http://usuario:senha@localhost:5984/diario
```

### HTTPS em Produção

⚠️ **IMPORTANTE**: Em produção, sempre use HTTPS!

1. Configure um certificado SSL no CouchDB
2. Ou use um proxy reverso (Nginx, Apache)
3. Atualize a URL para `https://`

---

## 🧪 Testar Conexão

### Via Navegador

Acesse: `http://localhost:5984`

Deve retornar algo como:

```json
{
  "couchdb": "Welcome",
  "version": "3.3.3",
  "git_sha": "40afbcfc7",
  "uuid": "...",
  "features": [...],
  "vendor": {
    "name": "The Apache Software Foundation"
  }
}
```

### Via curl

```bash
curl http://localhost:5984
```

### Via JavaScript

```javascript
fetch('http://localhost:5984')
  .then(r => r.json())
  .then(console.log)
```

---

## 🔧 Comandos Úteis

### Verificar Status

```bash
# Linux/Mac
sudo systemctl status couchdb

# Windows (PowerShell como Admin)
Get-Service couchdb
```

### Iniciar/Parar Serviço

```bash
# Linux
sudo systemctl start couchdb
sudo systemctl stop couchdb
sudo systemctl restart couchdb

# Mac
brew services start couchdb
brew services stop couchdb
brew services restart couchdb

# Windows (PowerShell como Admin)
Start-Service couchdb
Stop-Service couchdb
Restart-Service couchdb
```

### Logs

```bash
# Linux
sudo journalctl -u couchdb -f

# Mac
tail -f /usr/local/var/log/couchdb/couchdb.log

# Windows
# Logs em: C:\Program Files\Apache CouchDB\var\log\couchdb.log
```

---

## 🌐 Configuração para Acesso Remoto

Se você quiser acessar o CouchDB de outro dispositivo na rede:

### 1. Editar Configuração

**Linux/Mac:** `/opt/couchdb/etc/local.ini`

**Windows:** `C:\Program Files\Apache CouchDB\etc\local.ini`

```ini
[chttpd]
bind_address = 0.0.0.0
```

### 2. Reiniciar CouchDB

```bash
sudo systemctl restart couchdb
```

### 3. Atualizar URL na Aplicação

```typescript
const REMOTE_DB_URL = 'http://IP_DO_SERVIDOR:5984/diario';
```

---

## 📊 Monitoramento

### Fauxton (Interface Web)

Acesse: `http://localhost:5984/_utils`

- Ver todos os bancos
- Ver documentos
- Executar queries
- Monitorar replicação
- Ver logs

### API de Status

```bash
# Informações do servidor
curl http://localhost:5984

# Listar bancos
curl http://localhost:5984/_all_dbs

# Info de um banco
curl http://localhost:5984/diario

# Estatísticas
curl http://localhost:5984/_stats
```

---

## 🐛 Troubleshooting

### Porta 5984 já em uso

```bash
# Linux/Mac - Ver o que está usando a porta
sudo lsof -i :5984

# Windows
netstat -ano | findstr :5984
```

### Erro de permissão

```bash
# Linux - Dar permissões corretas
sudo chown -R couchdb:couchdb /opt/couchdb
```

### CouchDB não inicia

1. Verifique os logs
2. Verifique se a porta 5984 está livre
3. Verifique permissões de arquivos
4. Reinstale se necessário

### Erro de CORS persiste

1. Limpe o cache do navegador
2. Verifique se CORS está realmente habilitado
3. Reinicie o CouchDB
4. Teste com `curl` primeiro

---

## 📚 Recursos Adicionais

- **Documentação Oficial**: https://docs.couchdb.org/
- **Guia de Instalação**: https://docs.couchdb.org/en/stable/install/
- **API Reference**: https://docs.couchdb.org/en/stable/api/
- **Comunidade**: https://couchdb.apache.org/community.html

---

## ✅ Checklist de Configuração

- [ ] CouchDB instalado
- [ ] Serviço rodando
- [ ] Interface web acessível (`http://localhost:5984/_utils`)
- [ ] Admin configurado
- [ ] CORS habilitado
- [ ] Banco `diario` criado
- [ ] Conexão testada
- [ ] URL configurada na aplicação

---

**Pronto!** Seu CouchDB está configurado e pronto para sincronizar com o Diário de Campo Escoteiro! 🎉

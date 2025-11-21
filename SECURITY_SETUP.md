# 🔐 Configuração de Segurança - CouchDB

## ✅ Você já fez:
1. ✅ Instalou o CouchDB
2. ✅ Configurou CORS
3. ✅ Criou o banco "diario"

---

## 🎯 Próximos Passos de Segurança

### **Opção 1: Desenvolvimento Local (SEM autenticação)**

Se você está apenas testando localmente, pode **pular a configuração de segurança** por enquanto.

**Vantagens:**
- ✅ Mais simples para testar
- ✅ Sem necessidade de senha
- ✅ Funciona imediatamente

**Desvantagens:**
- ⚠️ Qualquer um na rede local pode acessar
- ⚠️ Não recomendado para produção

**O que fazer:**
- Nada! Sua aplicação já deve funcionar
- O CouchDB está em `http://localhost:5984/diario`
- A aplicação já está configurada para usar essa URL

---

### **Opção 2: Com Autenticação (Recomendado para produção)**

Se você quer proteger o banco com usuário e senha:

#### **1. Criar Usuário no CouchDB**

**Via Interface Web:**
1. Acesse: `http://localhost:5984/_utils`
2. Vá em **Configuration** (engrenagem)
3. Clique em **Admin Party** (se aparecer)
4. Crie um usuário admin
5. Defina senha

**Via Linha de Comando:**
```bash
curl -X PUT http://localhost:5984/_node/_local/_config/admins/admin -d '"senha123"'
```

#### **2. Configurar Permissões do Banco**

**Via Interface Web:**
1. Acesse o banco `diario`
2. Clique em **Permissions**
3. Em **Admins**, adicione seu usuário
4. Em **Members**, deixe vazio (ou adicione usuários específicos)

**Via Linha de Comando:**
```bash
curl -X PUT http://admin:senha123@localhost:5984/diario/_security -H "Content-Type: application/json" -d '{
  "admins": {
    "names": ["admin"],
    "roles": []
  },
  "members": {
    "names": [],
    "roles": []
  }
}'
```

#### **3. Atualizar a Aplicação**

Edite o arquivo: `src/db/pouch.ts`

**Antes:**
```typescript
const REMOTE_DB_URL = 'http://localhost:5984/diario';
```

**Depois:**
```typescript
const REMOTE_DB_URL = 'http://admin:senha123@localhost:5984/diario';
```

⚠️ **IMPORTANTE:** Nunca commite senhas no Git!

**Melhor prática - Use variáveis de ambiente:**

1. Crie arquivo `.env.local`:
```
VITE_COUCHDB_URL=http://admin:senha123@localhost:5984/diario
```

2. Atualize `src/db/pouch.ts`:
```typescript
const REMOTE_DB_URL = import.meta.env.VITE_COUCHDB_URL || 'http://localhost:5984/diario';
```

3. Adicione `.env.local` ao `.gitignore` (já está!)

---

## 🧪 Testar Conexão

### **Sem Autenticação:**
```bash
curl http://localhost:5984/diario
```

### **Com Autenticação:**
```bash
curl http://admin:senha123@localhost:5984/diario
```

**Resposta esperada:**
```json
{
  "db_name": "diario",
  "doc_count": 0,
  "update_seq": "0-...",
  ...
}
```

---

## ✅ Checklist Final

- [ ] CouchDB rodando
- [ ] Banco "diario" criado
- [ ] CORS habilitado
- [ ] (Opcional) Usuário admin criado
- [ ] (Opcional) Permissões configuradas
- [ ] (Opcional) URL atualizada na aplicação
- [ ] Aplicação funcionando sem erros

---

## 🚀 Reiniciar a Aplicação

Após fazer as alterações:

1. **Pare o servidor** (Ctrl + C no terminal)
2. **Inicie novamente:**
   ```bash
   npm run dev
   ```
3. **Acesse:** `http://localhost:3000`

---

## 🐛 Problemas Comuns

### "Unauthorized" ou "401"
- Verifique usuário e senha
- Verifique se o usuário tem permissão no banco

### "CORS error"
- Verifique se CORS está habilitado
- Reinicie o CouchDB

### "Connection refused"
- Verifique se CouchDB está rodando
- Teste: `http://localhost:5984`

---

## 💡 Recomendação para Você

**Para começar a testar AGORA:**

1. **NÃO configure autenticação ainda**
2. Apenas certifique-se que:
   - ✅ CouchDB está rodando
   - ✅ Banco "diario" existe
   - ✅ CORS está habilitado
3. **Reinicie a aplicação** (ela já deve funcionar!)

**Depois que tudo estiver funcionando**, você pode adicionar autenticação se quiser.

---

## 🎯 Resumo Rápido

**Você precisa fazer AGORA:**
1. Reiniciar a aplicação (Ctrl+C e `npm run dev`)
2. Acessar `http://localhost:3000`
3. Testar criar uma entrada

**Segurança pode esperar!** 😊

---

**Dúvidas? Veja o arquivo completo:** `COUCHDB_SETUP.md`

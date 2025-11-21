import fetch from 'node-fetch';

const COUCHDB_HOST = 'http://localhost:5984';
const DB_NAME = 'diario';
const AUTH = 'Basic ' + Buffer.from('adminterto:adminterto').toString('base64');
const HEADERS = {
    'Content-Type': 'application/json',
    'Authorization': AUTH
};

async function setup() {
    console.log('🔧 Configurando Banco de Dados e CORS...');

    // 1. Verificar/Criar Banco de Dados
    try {
        const checkDb = await fetch(`${COUCHDB_HOST}/${DB_NAME}`, { headers: HEADERS });
        if (checkDb.status === 404) {
            console.log(`📦 Banco '${DB_NAME}' não existe. Criando...`);
            const createDb = await fetch(`${COUCHDB_HOST}/${DB_NAME}`, {
                method: 'PUT',
                headers: HEADERS
            });
            if (createDb.ok) {
                console.log(`✅ Banco '${DB_NAME}' criado com sucesso!`);
            } else {
                console.error(`❌ Erro ao criar banco: ${createDb.statusText}`);
            }
        } else {
            console.log(`✅ Banco '${DB_NAME}' já existe.`);
        }
    } catch (e) {
        console.error('❌ Erro ao conectar:', e.message);
    }

    // 2. Configurar CORS (tentando várias URLs)
    const configKeys = [
        { section: 'httpd', key: 'enable_cors', value: 'true' },
        { section: 'cors', key: 'origins', value: '*' },
        { section: 'cors', key: 'credentials', value: 'true' },
        { section: 'cors', key: 'methods', value: 'GET, PUT, POST, HEAD, DELETE' },
        { section: 'cors', key: 'headers', value: 'accept, authorization, content-type, origin, referer, x-csrf-token' }
    ];

    for (const { section, key, value } of configKeys) {
        // Tentar _node/_local (padrão em muitas instalações)
        let url = `${COUCHDB_HOST}/_node/_local/_config/${section}/${key}`;
        let res = await fetch(url, { method: 'PUT', body: JSON.stringify(value), headers: HEADERS });

        if (!res.ok) {
            // Tentar _node/nonode@nohost
            url = `${COUCHDB_HOST}/_node/nonode@nohost/_config/${section}/${key}`;
            res = await fetch(url, { method: 'PUT', body: JSON.stringify(value), headers: HEADERS });
        }

        if (!res.ok) {
            // Tentar raiz (CouchDB < 2.0 ou proxy)
            url = `${COUCHDB_HOST}/_config/${section}/${key}`;
            res = await fetch(url, { method: 'PUT', body: JSON.stringify(value), headers: HEADERS });
        }

        if (res.ok) {
            console.log(`✅ Configurado ${section}/${key}`);
        } else {
            console.error(`❌ Falha ao configurar ${section}/${key}`);
        }
    }
}

setup();
